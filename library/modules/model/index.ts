import { Events } from '@beyond-js/events/events';
import { IReactiveProperties } from './interfaces/reactive-props';
import { IReactiveConstructorSpecs } from './interfaces/reactive-constructor-specs';

/**
 * The `ReactiveModel` class is a subclass of the `Events` class that provides a simple way to create
 * reactive properties that can trigger events when they change. It also provides methods for setting
 * and getting property values.
 *
 * @template T - The type of the properties that can be defined in the model.
 * @extends Events
 */
export abstract class ReactiveModel<T> extends Events {
	protected schema: unknown;
	#isReactive: boolean = true;
	private debounceTimeout: number | null = null;
	private batchUpdates: boolean = false;
	#ready: boolean = false;
	#initialValues: Record<string, any> = {};
	protected properties: string[] = [];
	fetching!: boolean;
	fetched: boolean = false;
	processing: boolean = false;
	processed: boolean = false;
	loaded: boolean = false;

	constructor(specs: IReactiveConstructorSpecs = {}) {
		super();
		this.reactiveProps<IReactiveProperties>(['fetching', 'fetched', 'processing', 'processed', 'loaded']);

		if (specs.properties && Array.isArray(specs.properties)) {
			this.properties = specs.properties;
		}
		if (specs) this.initialValues(specs);
	}

	get isReactive(): boolean {
		return this.#isReactive;
	}

	get ready(): boolean {
		return this.#ready;
	}

	set ready(value: boolean) {
		if (value === this.#ready) return;
		this.#ready = value;
		this.triggerEvent();
	}

	get isUnpublished(): boolean {
		const properties = this.getProperties();
		return Object.keys(properties).some(prop => {
			if (prop === 'id' || typeof prop === 'object') return false;
			return properties[prop] !== this.#initialValues[prop];
		});
	}

	initialValues(values?: Partial<T>): Record<string, any> {
		if (!values) return this.#initialValues;
		let data = { ...values };
		delete data.properties;

		this.#set(data);
		this.#initialValues = data;
		return this.#initialValues;
	}

	protected reactiveProps<T>(props: Array<keyof T>): void {
		for (const propKey of props) {
			const descriptor = Object.getOwnPropertyDescriptor(this, propKey);
			const initialValue = descriptor ? descriptor.value : undefined;

			this.defineReactiveProp(propKey, initialValue);
		}
	}

	protected defineReactiveProp<K extends keyof T>(propKey: K, initialValue: T[K]): void {
		const privatePropKey = `__${String(propKey)}`;

		Object.defineProperty(this, propKey, {
			get(): T[K] {
				if (!Object.prototype.hasOwnProperty.call(this, privatePropKey)) {
					(this as any)[privatePropKey] = initialValue;
				}
				return (this as any)[privatePropKey];
			},
			set(newVal: T[K]): void {
				if (newVal === (this as any)[privatePropKey]) return;
				(this as any)[privatePropKey] = newVal;
				this.triggerEvent();
			},
			enumerable: true,
			configurable: true,
		});
	}

	triggerEvent = (event: string = 'change', delay: number = 100): void => {
		if (this.debounceTimeout !== null) clearTimeout(this.debounceTimeout);

		this.debounceTimeout = globalThis.setTimeout(() => {
			this.trigger(event);
			this.debounceTimeout = null;
		}, delay);
	};

	set(properties: Partial<T>, batch: boolean = false): void {
		if (batch) {
			this.batchUpdates = true;
		}

		this.#set(properties);

		if (batch) {
			this.batchUpdates = false;
			this.triggerEvent();
		}
	}

	#set(properties: Partial<T>): void {
		let updated = false;
		try {
			Object.keys(properties).forEach(prop => {
				if (!this.properties || !this.properties.includes(prop)) return;
				const sameObject =
					typeof properties[prop] === 'object' &&
					JSON.stringify(properties[prop]) === JSON.stringify(this[prop]);

				if (this[prop] === properties[prop] || sameObject) return;
				const descriptor = Object.getOwnPropertyDescriptor(this, prop);
				if (descriptor?.set) return;

				(this as any)[prop] = properties[prop];
				updated = true;
			});
		} catch (e) {
			throw new Error(`Error setting properties: ${e.message}`);
		} finally {
			if (updated && !this.batchUpdates) this.triggerEvent();
		}
	}

	getProperties(): Record<string, any> {
		const props: Record<string, any> = {};
		const properties = this.properties || this.skeleton;

		type IProperty = {
			name: string;
			type: string;
		};

		properties.forEach((property: string | IProperty) => {
			if (typeof property === 'object') {
				if (!Object.prototype.hasOwnProperty.call(property, 'name')) return;
				type ICollection = {
					type: string;
					name: string;
				};

				const collection = property as ICollection;
				if (collection.type === 'collection') {
					props[property.name] = this[property.name].items.map((item: any) => item.getProperties());
					return;
				}
				props[property.name] = this[property.name];
			} else {
				const name = property as string;
				props[name] = this[name];
			}
		});
		return props;
	}
}
