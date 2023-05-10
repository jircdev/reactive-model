import { Events } from '@beyond-js/events/events';
import { reactiveProps } from './property';

interface ReactiveModelPublic<T> {
	ready: boolean | undefined;
	fetching: boolean | undefined;
	fetched: boolean;
	processing: boolean;
	processed: boolean;
	loaded: boolean;
	[key: string]: any;
}

interface IProps {
	fetching: boolean;
	fetched: boolean;
	processing: boolean;
	processed: boolean;
	loaded: boolean;
	ready: boolean;
}
/**
 * The `ReactiveModel` class is a subclass of the `Events` class that provides a simple way to create
 * reactive properties that can trigger events when they change. It also provides methods for setting
 * and getting property values.
 *
 * @template T - The type of the properties that can be defined in the model.
 * @extends Events
 */

export /*bundle*/ abstract class ReactiveModel<T> extends Events {
	protected schema: unknown;
	#isReactive: boolean = true;
	get isReactive() {
		return this.#isReactive;
	}

	[key: string]: any;

	fetching!: boolean;
	fetched: boolean = false;
	processing: boolean = false;
	ready: boolean = false;
	processed: boolean = false;
	protected localdb = false;
	protected properties: string[];
	loaded: boolean = false;

	constructor() {
		super();
		this.reactiveProps<IProps>(['fetching', 'fetched', 'processing', 'processed', 'loaded', 'ready']);
	}

	protected reactiveProps<T>(props: Array<keyof T>): void {
		for (const propKey of props) {
			const descriptor = Object.getOwnPropertyDescriptor(this, propKey);
			const initialValue = descriptor ? descriptor.value : undefined;

			this.defineReactiveProp(propKey, initialValue);
		}
	}

	protected defineReactiveProp<T>(propKey: keyof T, initialValue: T[keyof T]): void {
		const privatePropKey = `__${String(propKey)}`;

		Object.defineProperty(this, propKey, {
			get(): T[keyof T] {
				if (!this.hasOwnProperty(privatePropKey)) {
					this[privatePropKey] = initialValue;
				}
				return this[privatePropKey];
			},
			set(newVal: T[keyof T]): void {
				if (newVal === this[privatePropKey]) return;

				this[privatePropKey] = newVal;
				this.triggerEvent();
			},
			enumerable: true,
			configurable: true,
		});
	}

	/**
	 * The `triggerEvent` method triggers a change event on the model, which can be used to notify
	 * subscribers of changes to the model's properties.
	 *
	 * @param {string} event - The name of the event to trigger.
	 * @returns {void}
	 */
	triggerEvent = (event: string = 'change'): void => this.trigger(event);
	/**
	 * The `set` method sets one or more properties on the model.
	 *
	 * @param {keyof ReactiveModelPublic<T>} property - The name of the property to set.
	 * @param {*} value - The value to set the property to.
	 * @returns {void}
	 */
	set(properties: Partial<ReactiveModelPublic<T>>): void {
		let props: Partial<ReactiveModelPublic<T>> = Object.keys(properties);
		let updated = false;
		Object.keys(properties).forEach((prop) => {
			const sameObject =
				typeof properties[prop] === 'object' && JSON.stringify(properties[prop]) === JSON.stringify(this[prop]);
			if (this[prop] === properties[prop] || sameObject) return;

			this[prop] = properties[prop];
			updated = true;
		});
		if (updated) this.triggerEvent();
	}

	getProperties(): Record<string, any> {
		const props: Record<string, any> = {};
		const properties = this.properties || this.skeleton;

		properties.forEach((property) => {
			props[property] = this[property];
		});
		return props;
	}
}
