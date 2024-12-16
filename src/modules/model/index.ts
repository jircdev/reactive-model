import { ZodError, ZodTypeAny, ZodObject } from 'zod';
import {
	ValidatedPropertyType,
	ModelProperties,
	ReactiveProps,
	PropertyValidationErrors,
	SetPropertiesResult,
	Timeout
} from './types';
import { ProxyBase } from './proxy';

type ReactiveProperty<T> = keyof T | { name: keyof T };

export /*bundle */ class ReactiveModel<T> extends ProxyBase<T> {
	_reactiveProps: Record<string, any> = {}; // any reactive prop.

	//TODO: Validate how to handle the properties
	protected properties: Array<ReactiveProperty<T>> = [];
	// properties of the object
	debounceTimeout: Timeout | null;
	processing: boolean = false;
	processed: boolean = false;
	declare fetching: boolean;
	loaded: boolean = false;
	#ready: boolean = false;

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

	#isDraft: boolean = false;
	get isDraft() {
		return this.#isDraft;
	}

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
				return JSON.stringify(properties[prop]) === JSON.stringify(this.#initialValues[prop]);
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

	constructor({ properties, ...props }: ReactiveProps<T> = { properties: [] }) {
		super();
		this.defineReactiveProps(['fetching', 'fetched', 'processing', 'processed', 'loaded'], false);

		if (properties) {
			this.properties = properties;
			this.setInitialValues(props as Partial<T>);
			this.defineReactiveProps(properties as string[], { ...props });
		}
	}

	protected setInitialValues(specs?: Partial<T>): Partial<T> {
		if (!specs) return this.#initialValues;

		const values = {} as ModelProperties<T>;

		this.properties.forEach(property => {
			if (typeof property !== 'string') {
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

		this.set(specs);
		this.#initialValues = values;
		return this.#initialValues;
	}

	protected defineReactiveProp(propKey: string, initialValue: any, model: boolean = false): void {
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

	protected defineReactiveProps(props: string[], values?): void {
		for (let propKey of props) {
			/**
			 * Possibility to define a property as an object
			 */
			if (typeof propKey === 'object') {
				const data = propKey as { name: string; value: any };
				propKey = data.name;
				const descriptor = Object.getOwnPropertyDescriptor(this, propKey as string);
				let initialValue = values?.[propKey] ?? descriptor?.value;

				if (typeof data.value !== 'function' && typeof data.value !== 'object') {
					console.warn(`Invalid value type for  ${propKey}`);
					continue;
				}

				const instance = new data.value(initialValue);
				this.#propertyNames.add(propKey);
				this.defineReactiveProp(propKey, instance, true);
				continue;
			}
			this.#propertyNames.add(propKey);
			const descriptor = Object.getOwnPropertyDescriptor(this, propKey as string);
			let initialValue = values?.[propKey] ?? descriptor?.value;
			this.defineReactiveProp(propKey, initialValue);
		}
	}

	protected reactiveProps(props: string[]) {
		this.defineReactiveProps(props);
	}

	getProperty(propKey: string) {
		return this._reactiveProps[propKey];
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
			const isObject = typeof properties[prop] === 'object';
			const isSameObject = isObject && this.isSameObject(properties[prop], this[prop]);

			if (this[prop] === properties[prop] || isSameObject) return;
			const descriptor = Object.getOwnPropertyDescriptor(this, prop as string);
			if (!descriptor?.set) return;

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
		const properties = this.properties;
		const loop = property => {
			let name = property;
			if (typeof property === 'object') {
				name = property.name;
				props[String(name)] = this[name]?.getProperties();
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
