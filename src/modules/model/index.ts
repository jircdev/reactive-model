import { ZodError, ZodTypeAny, ZodObject } from 'zod';
import {
	ValidatedPropertyType,
	ModelProperties,
	ReactiveProps,
	PropertyValidationErrors,
	SetPropertiesResult,
	Timeout,
} from './types';
import { Events } from '@beyond-js/events/events';

export /*bundle */ class ReactiveModel<T> extends Events {
	#reactiveProps: Record<string, any> = {}; // any reactive prop.
	get reactiveProps() {
		return this.#reactiveProps;
	}

	protected properties: (keyof T)[] = [];
	// properties of the object
	debounceTimeout: Timeout | null;
	fetching: boolean = false;
	fetched: boolean = false;
	processing: boolean = false;
	processed: boolean = false;
	loaded: boolean = false;
	ready: boolean = false;
	protected schema: ZodObject<{ [key in keyof T]: ZodTypeAny }>;
	#initialValues: ModelProperties<T> = {} as ModelProperties<T>;
	get initialValues() {
		return this.#initialValues;
	}

	/**
	 * Defines if the model has been modified since it was loaded.
	 */
	get unpublished(): boolean {
		const properties = this.getProperties() ?? {};
		return Object.keys(properties).some(prop => {
			if (prop === 'id' || typeof properties[prop] === 'object') return false;
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
			this.defineReactiveProps(properties as string[], { ...props });
		}
	}

	protected setInitialValues(specs?: Partial<T>): Partial<T> {
		if (!specs) return this.#initialValues;

		const values = {} as ModelProperties<T>;

		this.properties.forEach(property => {
			// Explicitly check if the value exists in the specs object
			if (specs.hasOwnProperty(property)) {
				values[property] = specs[property] as T[keyof T];
			} else {
				values[property] = undefined as unknown as T[keyof T]; // Ensure compatibility with the expected type
			}
		});

		this.#initialValues = values;
		return this.#initialValues;
	}

	protected defineReactiveProp(propKey: string, initialValue: any): void {
		this.#reactiveProps[propKey] = initialValue;
		Object.defineProperty(this, propKey as string, {
			get: () => {
				return this.#reactiveProps[propKey];
			},
			set: (newVal): void => {
				if (newVal !== undefined && newVal === this.#reactiveProps[propKey]) return;

				const previous = this.#reactiveProps[propKey];
				this.#reactiveProps[propKey] = newVal;
				this.trigger(`${propKey}.changed`, { value: newVal, previous });
			},
			enumerable: true,
			configurable: true,
		});
	}

	protected defineReactiveProps(props: string[], values?): void {
		for (const propKey of props) {
			const descriptor = Object.getOwnPropertyDescriptor(this, propKey as string);
			const initialValue = values?.[propKey] ?? descriptor?.value;
			this.defineReactiveProp(propKey, initialValue);
		}
	}

	private validateProperty(propKey: string, value: any): ValidatedPropertyType {
		if (!this.schema) {
			return { valid: true, error: null };
		}
		if (!this.schema.shape[propKey]) {
			return {
				valid: false,
				error: new ZodError([
					{ path: [propKey], message: `Property ${propKey} is not defined in the schema`, code: 'custom' },
				]),
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
				console.log(0.2, prop, this.properties);
				console.log(`is not a property`, prop);
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

	set(properties): SetPropertiesResult {
		const keys = Object.keys(properties);
		let updated = false;
		const errors: PropertyValidationErrors<T> = {};
		const onSet = prop => {
			if (!this.properties || !this.properties.includes(prop)) {
				console.log(4, this.properties, this.constructor.name);
				console.log(`is not a property`, prop, this.constructor.name);
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
		if (updated) this.triggerEvent();
		return { updated, errors };
	}

	getProperties() {
		const props: Record<string, any> = {};
		const properties = this.properties;
		const loop = property => {
			const name = property;
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
		let { delay, ...specs } = params;
		delay = delay ?? 100;
		if (this.debounceTimeout !== null) clearTimeout(this.debounceTimeout);
		this.debounceTimeout = globalThis.setTimeout(() => {
			this.trigger(event, specs);
			this.debounceTimeout = null;
		}, delay);
	};
}
