import { Events } from '@beyond-js/events/events';
import { IReactiveProperties } from './interfaces/reactive-props';
import { ReactiveProps } from './interfaces/reactive-constructor-specs';

/**
 * The `ReactiveModel` class is a subclass of the `Events` class that provides a simple way to create
 * reactive properties that can trigger events when they change. It also provides methods for setting
 * and getting property values.
 *
 * @template T - The type of the properties that can be defined in the model.
 * @extends Events
 */
type Timeout = ReturnType<typeof setTimeout>;

export /*bundle*/ abstract class ReactiveModel<T> extends Events {
	protected schema: unknown;
	#isReactive: boolean = true;
	private debounceTimeout: Timeout | undefined | null;
	private batchUpdates: boolean = false;
	#ready: boolean = false;
	#initialValues: Partial<T> = {};
	protected properties: string[] = [];
	fetching!: boolean;
	fetched: boolean = false;
	processing: boolean = false;
	processed: boolean = false;
	loaded: boolean = false;

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

	constructor(specs: ReactiveProps = {}) {
		super();
		this.reactiveProps(['fetching', 'fetched', 'processing', 'processed', 'loaded'] as Array<keyof T>);

		if (specs.properties && Array.isArray(specs.properties)) {
			this.properties = specs.properties;
			this.reactiveProps(specs.properties, specs);
		}
		if (specs) this.initialValues(specs);
	}

	#setProperties(specs) {}
	initialValues(values?: Partial<ReactiveProps>): Record<string, any> {
		if (!values) return this.#initialValues;
		let data = { ...values };
		delete data.properties;

		// this.#set(data as Partial<T>, false);
		this.#initialValues = data;
		return this.initialValues;
	}

	protected reactiveProps(props: Array<keyof T>, values?: Record<keyof T, any>): void {
		for (const propKey of props) {
			const descriptor = Object.getOwnPropertyDescriptor(this, propKey as string);
			const initialValue = values?.[propKey] ? values[propKey] : descriptor ? descriptor.value : undefined;

			this.defineReactiveProp(propKey, initialValue);
		}
	}

	protected defineReactiveProp(propKey: keyof T, initialValue: T[keyof T]): void {
		const privatePropKey = `#${String(propKey)}`;

		Object.defineProperty(this, propKey as string, {
			get: (): T[keyof T] => {
				if (!Object.prototype.hasOwnProperty.call(this, privatePropKey)) {
					this[privatePropKey] = initialValue;
				}
				return this[privatePropKey];
			},
			set: (newVal: T[keyof T]): void => {
				if (newVal === this[privatePropKey]) return;
				this[privatePropKey] = newVal;
				console.log(20);
				this.triggerEvent();
			},
			enumerable: true,
			configurable: true,
		});
	}

	triggerEvent = (event: string = 'change', delay: number = 100): void => {
		if (this.debounceTimeout !== null) clearTimeout(this.debounceTimeout);
		console.log(0.1, 'me disparo');
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

	isSameObject = (a, b) => JSON.stringify(a) === JSON.stringify(b);
	#set(properties: Partial<T>, trigger = true): void {
		let updated = false;
		if (!properties) return;

		try {
			const keys = Object.keys(properties);
			keys.forEach(prop => {
				if (!this.properties || !this.properties.includes(prop)) return;
				const isObject = typeof properties[prop] === 'object';
				const isSameObject = isObject && this.isSameObject(properties[prop], this[prop]);

				if (this[prop] === properties[prop] || isSameObject) return;
				const descriptor = Object.getOwnPropertyDescriptor(this, prop);
				if (!descriptor?.set) return;

				this[prop] = properties[prop];
				updated = true;
			});
		} catch (e) {
			throw new Error(`Error setting properties: ${e.message}`);
		} finally {
			if (trigger && updated && !this.batchUpdates) this.triggerEvent();
		}
	}

	getProperties(): ReactiveProps['properties'] {
		const props: Record<string, any> = {};
		const properties = this.properties;

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
