import { Events } from '@beyond-js/events/events';
import { reactiveProps } from './property';
import { IReactiveProperties } from './interfaces/reactive-props';
import { ReactiveModelPublic } from './interfaces/reactive-public-props';
import { IReactiveConstructorSpecs } from './interfaces/reactive-constructor-specs';
import { IInitialValues } from './interfaces/initial-values';

/**
 * The ReactiveModel class extends Events to provide reactive properties and event triggering
 * when properties change. It includes methods to set and get properties while ensuring type safety.
 *
 * @template T The type of properties defined in the model.
 * @extends Events
 */
export abstract class ReactiveModel<T> extends Events {
	#isReactive: boolean = true;

	/**
	 * Indicates if the model is reactive.
	 */
	get isReactive(): boolean {
		return this.#isReactive;
	}

	protected properties: (keyof T)[];
	#initialValues: IInitialValues<T> = {};

	/**
	 * Determines if the model has unpublished changes.
	 */
	get isUnpublished(): boolean {
		const properties = this.getProperties();
		return properties.some(prop => {
			if (prop === 'id' || typeof prop === 'object') return false;
			return properties[prop] !== this.#initialValues[prop];
		});
	}

	/**
	 * Constructs a new ReactiveModel instance.
	 *
	 * @param specs The specifications including initial properties.
	 */
	constructor(specs: IInitialValues<T> = {}) {
		super();
		this.properties = Object.keys(specs) as (keyof T)[];
		this.initialValues(specs);
	}

	/**
	 * Sets or retrieves initial property values.
	 *
	 * @param values The initial property values to set.
	 * @returns The current initial values if no arguments are provided.
	 */
	initialValues(values?: IInitialValues<T>): void | IInitialValues<T> {
		if (!values) return this.#initialValues;
		let data = { ...values };
		this.#set(data);
		this.#initialValues = data;
	}

	/**
	 * Defines reactive properties for the model.
	 *
	 * @param props An array of property names to make reactive.
	 */
	protected reactiveProps(props: (keyof T)[]): void {
		props.forEach(prop => {
			this.defineReactiveProp(prop, this.#initialValues[prop]);
		});
	}

	/**
	 * Defines a single reactive property.
	 *
	 * @param propKey The name of the property to make reactive.
	 * @param initialValue The initial value of the property.
	 */
	protected defineReactiveProp(propKey: keyof T, initialValue: T[keyof T]): void {
		Object.defineProperty(this, propKey, {
			get: () => this.#initialValues[propKey],
			set: (newVal: T[keyof T]) => {
				if (newVal === this.#initialValues[propKey]) return;
				this.#initialValues[propKey] = newVal;
				this.triggerEvent('change');
			},
			enumerable: true,
			configurable: true,
		});
	}

	/**
	 * Triggers an event to notify of property changes.
	 *
	 * @param event The name of the event to trigger.
	 */
	protected triggerEvent(event: string = 'change'): void {
		setTimeout(() => this.trigger(event), 0);
	}

	/**
	 * Sets one or more properties on the model.
	 *
	 * @param properties An object with properties to set.
	 */
	set(properties: Partial<T>): void {
		let updated = false;
		Object.keys(properties).forEach(prop => {
			const propKey = prop as keyof T;
			const newVal = properties[propKey];
			if (newVal !== undefined && newVal !== this[propKey]) {
				this[propKey] = newVal;
				updated = true;
			}
		});
		if (updated) this.triggerEvent();
	}

	/**
	 * Retrieves the current property values of the model.
	 *
	 * @returns An object with the current values of the model's properties.
	 */
	getProperties(): IInitialValues<T> {
		const props: IInitialValues<T> = {} as IInitialValues<T>;
		this.properties.forEach(prop => {
			props[prop] = this[prop];
		});
		return props;
	}
}
