/**
 * File: example.ts
 */
import { ReactiveModel } from './';

interface IExample {
	name: string;
	id: string;
}

export class Example extends ReactiveModel<IExample> {
	declare name: string;
	declare id: string;
	declare pepito: string;

	constructor({ ...args }: Partial<IExample> = {}) {
		super({ ...args, properties: ['name', 'id'] });
		this.reactiveProps(['pepito']);
	}

	print() {
		return this.getProperty('name');
	}
}

// const instance = new Example();
// instance.on('name.changed', () => console.log('cambio el nombre a ', instance.name));
// instance.on('pepito.changed', () => console.log('cambio el pepito a ', instance.pepito));
// instance.name = 'nuevo nombre';
// instance.pepito = 'nuevo pepito';
// setTimeout(() => {
// 	instance.name = 'otro nombre';
// 	instance.pepito = 'otro pepito';
// 	console.log(12, instance.name);
// }, 1000);

// console.log(instance.id, instance.name);

/**
 * File: index.ts
 */
import { ZodError, ZodTypeAny, ZodObject } from 'zod';
import {
	ValidatedPropertyType,
	ModelProperties,
	PropertyValidationErrors,
	SetPropertiesResult,
	Timeout,
	ReactiveObjectProperty,
	DefaultProps,
	IReactiveModelOptions,
	ReactiveProperty,
	EntityProperty
} from './types';

import { Events } from '@beyond-js/events/events';

export /*bundle */ class ReactiveModel<T> extends Events {
	debounceTimeout: Timeout | null;
	processing: boolean = false;
	processed: boolean = false;
	declare fetching: boolean;
	loaded: boolean = false;
	#ready: boolean = false;

	private _reactiveProps: Record<keyof T, any> = {} as Record<keyof T, any>;
	static isReactive() {
		return true;
	}
	//TODO: Validate how to handle the properties
	protected properties: EntityProperty<T>[] = [];
	// properties of the object
	#isDraft: boolean = false;
	get isDraft() {
		return this.#isDraft;
	}
	#propertyNames = new Set();
	get ready() {
		return this.#ready;
	}
	set ready(value: boolean) {
		this.#ready = value;
		this.triggerEvent('ready');
		this.triggerEvent('change');
	}

	protected schema: ZodObject<Record<string, ZodTypeAny>>;
	#initialValues: Partial<T> = {} as Partial<T>;

	get initialValues() {
		return this.#initialValues;
	}

	/**
	 * Defines if the model has been modified since it was loaded.
	 */
	get unpublished(): boolean {
		const properties = this.getProperties() ?? {};
		return Object.keys(properties).some(prop => {
			if (prop === 'id') return false;
			if (Array.isArray(properties[prop])) {
				if (properties[prop].length !== this.#initialValues[prop]?.length) return true;
				return JSON.stringify(properties[prop]) !== JSON.stringify(this.#initialValues[prop]);
			}
			if (typeof properties[prop] === 'object') {
				if (this[prop] instanceof ReactiveModel) {
					return this[prop].unpublished;
				}

				return JSON.stringify(properties[prop]) !== JSON.stringify(this.#initialValues[prop]);
			}

			return properties[prop] !== this.#initialValues[prop];
		});
	}
	/**
	 * @deprecated Use `unpublished` instead.
	 */
	get isUnpublished() {
		return this.unpublished;
	}

	constructor(
		{ properties, ...props }: IReactiveModelOptions<T> = { properties: [] } as Partial<IReactiveModelOptions<T>>
	) {
		super();
		const defaultProps: DefaultProps[] = ['fetching', 'fetched', 'processing', 'processed', 'loaded'];

		if (properties) {
			this.properties = properties as EntityProperty<T>[];
			this.defineReactiveProps(properties, props);
			if (Object.keys(props).length > 0) {
				this.setInitialValues(props as Partial<T>);
			}
		}
		// if (['LearningModule', 'LearningModuleAudience'].includes(this.constructor.name))
		// 	console.log('instanciamos', this.constructor.name, props, this.initialValues);
		this.defineReactiveProps(defaultProps as ReactiveProperty<T>[], this.initialValues);
	}

	protected setInitialValues(specs?: Partial<T>): Partial<T> {
		if (!specs) return this.#initialValues;

		const values = {} as ModelProperties<T>;

		this.properties.forEach(property => {
			if (typeof property !== 'string') {
				property = property as ReactiveObjectProperty<T>;

				values[property.name] = specs[property.name];
				return;
			}
			// Explicitly check if the value exists in the specs object
			if (specs.hasOwnProperty(property)) {
				values[property] = specs[property] as T[keyof T];
			} else {
				values[property] = undefined as unknown as T[keyof T]; // Ensure compatibility with the expected type
			}
		});
		this.#isDraft = Object.keys(specs).length === 0;

		this.#initialValues = values;

		return this.#initialValues;
	}

	getProperty<K extends keyof T>(key: K): T[K] {
		return this._reactiveProps[key]; // Type-safe access.
	}

	property = this.getProperty;

	protected defineReactiveProp<K extends keyof T>(propKey: string, initialValue: any, model: boolean = false): void {
		this._reactiveProps[propKey] = initialValue;

		Object.defineProperty(this, propKey as string, {
			get: () => {
				return this._reactiveProps[propKey];
			},
			set: (newVal): void => {
				if (model) {
					const instance = this._reactiveProps[propKey];
					this.trigger(`${propKey}.changed`, { value: newVal, previous: instance.getProperties() });
					this.trigger('change');
					this._reactiveProps[propKey].set(newVal);
					return;
				}

				if (newVal !== undefined && newVal === this._reactiveProps[propKey]) return;

				const previous = this._reactiveProps[propKey];
				this._reactiveProps[propKey] = newVal;

				this.trigger(`${propKey}.changed`, { value: newVal, previous });
				this.trigger('change');
			},
			enumerable: true,
			configurable: true
		});
	}

	/**
	 *  Defines the reactive properties of the object.
	 * The properties are defined as an array of strings or objects.
	 * The objects must have a `name` property with the name of the property and a `value` property with the class of the object.
	 * The `value` property can be a class or an object.
	 * If the `value` property is a class, the class must extend the `ReactiveModel` class.
	 *
	 * @param props
	 * @param values
	 */
	protected defineReactiveProps(props: ReactiveProperty<T>[], values?): void {
		for (let propKey of props) {
			const descriptor = Object.getOwnPropertyDescriptor(this, propKey as string);

			if (propKey === undefined) continue;

			if (typeof propKey !== 'object') {
				this.#propertyNames.add(propKey);
				let initialValue = values?.[propKey] ?? descriptor?.value;
				this.defineReactiveProp(propKey as string, initialValue);
				continue;
			}

			const data = propKey as ReactiveObjectProperty<T>;

			const name = data.name as string;

			let initialValue = values?.[name] ?? descriptor?.value;
			const specs = data.properties ?? {};

			if (typeof data.value !== 'function' && typeof data.value !== 'object') {
				console.warn(`Invalid value type for  ${name as string}`);
				continue;
			}

			const parameters = data.value.isCollection ? { parent: this } : { parent: this, ...initialValue, ...specs };
			const instance = new data.value(parameters);

			if (data.value.isCollection) {
				instance.setItems(initialValue);
			}

			this.#propertyNames.add(name);
			this.defineReactiveProp(name, instance, true);

			continue;
		}
	}

	protected reactiveProps(props: ReactiveProperty<T>[]) {
		this.defineReactiveProps(props);
	}

	setProperty(propKey: string, value: any) {
		this._reactiveProps[propKey] = value;
	}

	private validateProperty(propKey: string, value: any): ValidatedPropertyType {
		if (!this.schema) {
			return { valid: true, error: null };
		}

		if (!this.schema.shape[propKey]) {
			return {
				valid: false,
				error: new ZodError([
					{ path: [propKey], message: `Property ${propKey} is not defined in the schema`, code: 'custom' }
				])
			};
		}

		const propSchema = this.schema.shape[propKey] as ZodTypeAny;
		const result = propSchema.safeParse(value);

		if (!result.success) {
			return { valid: false, error: result.error };
		}

		return { valid: true, error: null };
	}
	private isSameObject = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);

	validate(properties): { valid: boolean; errors: PropertyValidationErrors<T> } {
		const keys = Object.keys(properties);
		const errors: PropertyValidationErrors<T> = {};
		const onValidate = prop => {
			if (!this.properties || !this.properties.includes(prop)) {
				console.trace(`is not a property`, prop);
				return;
			}
			const validated = this.validateProperty(prop, properties[prop]);

			if (!validated.valid) {
				errors[prop] = validated.error;
			}
		};
		keys.forEach(onValidate);

		return { valid: !!Object.keys(errors).length, errors };
	}

	set(properties: Partial<T>): SetPropertiesResult {
		if (!properties) {
			console.warn('you are trying to set an empty object', this.constructor.name, properties);
			return {
				updated: false
			};
		}

		const keys = Object.keys(properties);
		let updated = false;
		const errors: PropertyValidationErrors<T> = {};

		const onSet = prop => {
			if (!this.#propertyNames.has(prop)) {
				// console.trace(`is not a property`, prop, this.constructor.name);
				return;
			}

			const validated = this.validateProperty(prop, properties[prop]);
			if (!validated.valid) {
				errors[prop] = validated;
				return;
			}

			//@ts-ignore
			if (this.getProperty(prop)?.isReactive) {
				const instance = this.getProperty(prop) as unknown as ReactiveModel<T>;

				instance.set(properties[prop]);
				if (instance.unpublished) updated = true;

				return;
			}

			const isObject = typeof properties[prop] === 'object';
			const isSameObject = isObject && this.isSameObject([prop], this[prop]);

			if (this[prop] === properties[prop] || isSameObject) return;

			this[prop] = properties[prop]!;
			updated = true;
		};

		keys.forEach(onSet);
		if (updated) {
			this.triggerEvent('change');
			this.trigger('set.executed');
		}

		return { updated, errors };
	}

	getProperties(): Partial<T> {
		const props = {} as Partial<T>;

		const loop = property => {
			let name = property;
			// console.log(1, name, property);

			if (typeof property === 'object' && property.value.isReactive) {
				name = property.name;
				/**
				 * If the property is a collection, we return the items.
				 */
				props[String(name)] = property.value.isCollection
					? this[name].getItemProperties()
					: this[name]?.getProperties();
				return;
			}

			props[String(name)] = this[name];
		};
		this.properties.forEach(loop);
		return props;
	}

	/**
	 * Triggers an event after a specified delay.
	 *
	 * @param {string} event - The name of the event to trigger.
	 * @param {Record<string, any>} params - Additional parameters for the event, including an optional `delay` property.
	 */
	triggerEvent = (event: string = 'change', params: Record<string, any> = {}): void => {
		this.trigger(event);
	};

	revert() {
		this.set(this.initialValues);
	}

	saveChanges() {
		this.#initialValues = this.getProperties();
		this.#isDraft = false;
	}
}

/**
 * File: list.ts
 */
import { Events } from '@beyond-js/events/events';
export class ReactiveList<T> extends Events {
    
}

/**
 * File: proxy.ts
 */
import { Events } from '@beyond-js/events/events';

export class ProxyBase<T> extends Events {
	constructor() {
		super();

		const proxy = new Proxy(this, {
			get: (target, prop, receiver) => {
				if (prop in target) {
					const value = target[prop];
					return typeof value === 'function' ? value.bind(target) : value;
				}

				if (prop in target) {
					return Reflect.get(target, prop, receiver);
				} else {
					throw new Error(`Property ${String(prop)} does not exist`);
				}
			},
			set: (target, prop, value) => {
				target[prop] = value;
				return true;
			}
		});

		return Object.assign(this, proxy); // Ensures proxy functionality
	}
}

/**
 * File: types\index.ts
 */
import { ZodError } from 'zod';
export /*bundle*/ type ModelProperties<T> = any;
export type PropertyValidationErrors<T> = Partial<Record<keyof T, ValidatedPropertyType>>;

export /*bundle*/ type IReactiveModelOptions<T> = {
	properties?: EntityProperty<T>[];
} & {
	[K in keyof T]?: any;
};

export type Timeout = ReturnType<typeof setTimeout>;

export interface ValidatedPropertyType {
	valid: boolean;
	error?: ZodError | null;
}
export interface TriggerEventParams {
	event: string;
	delay?: number;
	specs?: any;
}

export type TriggerEventInput = string | TriggerEventParams;

export /*bundle*/ type SetPropertiesResult = {
	updated: boolean;
	errors?: PropertyValidationErrors<any>;
};

export type EntityProperty<T> = keyof T | ReactiveObjectProperty<T>;

export type DefaultProps = 'fetching' | 'fetched' | 'processing' | 'processed' | 'loaded';
/**
 * Represents a reactive property which is another ReactiveModel instance.
 */
export type ReactiveObjectProperty<T> = { name: keyof T; value: any; properties: any };
export type ReactiveProperty<T> = keyof T | DefaultProps | ReactiveObjectProperty<T> | string;

