import { Events } from '@beyond-js/events/events';
import { IReactiveProperties } from './interfaces/reactive-props';
import { ReactiveModelPublic } from './interfaces/reactive-public-props';
import { ReactiveProperties } from './interfaces/types';
import { ModelProperties } from './properties';
import { IReactiveModelSpecs } from './interfaces/model-specs';

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
	loaded: boolean = false;
	/**
	 * An array of property names or objects defining properties to be treated as reactive.
	 * String values represent the names of the properties. Object values follow the IPropertyObject
	 * interface, allowing for more detailed property definitions.
	 *
	 * @type {(string | IPropertyObject)[]}
	 */
	protected properties: ReactiveProperties = [];
	/**
	 * Initializes the model with given values. This method sets the initial state of the model's properties.
	 * If no values are provided, it returns the current initial values.
	 *
	 * @param {Partial<ReactiveModelPublic<T>> | null} values - An object containing initial values for the model's properties.
	 * @returns {Record<string, any>} The initial values of the model's properties.
	 */
	#initialValues: Record<string, any> = {};

	/**
	 * Checks if there are any changes to the reactive properties of the model that haven't been published yet.
	 * It compares the current property values with their initial values. If any property value has changed
	 * (except for properties named 'id' or properties of type 'object'), this getter returns true, indicating
	 * that there are unpublished changes.
	 *
	 * @returns {boolean} True if there are unpublished changes, otherwise false.
	 */
	get isUnpublished() {
		const properties = this.getProperties();

		return Object.keys(properties).some(prop => {
			if (prop === 'id' || typeof prop === 'object') return false;
			return properties[prop] !== this.#initialValues[prop];
		});
	}
	#properties: ModelProperties;
	constructor(specs?: IReactiveModelSpecs) {
		super();

		this.#properties = new ModelProperties(this);
		if (specs?.properties) {
			this.properties = specs.properties;
			this.initialise();
		}
		this.initialValues(specs);
	}
	/**
	 * Initializes reactive properties for the model. This method should be called in child classes
	 * of the ReactiveModel after defining their specific `properties`. The `initialise` method
	 * sets up the reactive behavior for each property listed in the `properties` array. It ensures
	 * that any changes to these properties will correctly trigger events as defined in the reactive
	 * model structure.
	 *
	 * This method is essential for the proper functioning of the reactive model in child classes, as
	 * it dynamically assigns reactive characteristics to the properties defined by them. It should be
	 * called once during the initialization phase of the child class instance.
	 *
	 * Usage in a child class:
	 * ```
	 * class MyModel extends ReactiveModel<MyType> {
	 *     constructor() {
	 *         super();
	 *         this.properties = ['prop1', 'prop2', ...];
	 *         this.initialise(); // Initializes reactive properties
	 *     }
	 * }
	 * ```
	 */

	protected initialise() {
		this.reactiveProps(this.properties);
		this.reactiveProps(['fetching', 'fetched', 'processing', 'processed', 'loaded', 'ready']);
	}

	initialValues(values?) {
		if (!values) return this.#initialValues;
		this.set(values);
		this.#initialValues = values;
	}

	protected reactiveProps(props: ReactiveProperties): void {
		this.#properties.reactiveProps(props);
	}

	/**
	 * The `set` method sets one or more properties on the model.
	 *
	 * @param {keyof ReactiveModelPublic<T>} property - The name of the property to set.
	 * @param {*} value - The value to set the property to.
	 * @returns {void}
	 */
	set(properties: Partial<ReactiveModelPublic<T>>): void {
		try {
			Object.keys(properties).forEach(prop => {
				this.#properties.multipleSet = true;
				if (!this.#properties.items.includes(prop)) {
					return;
				}
				this[prop] = properties[prop];
			});
		} catch (e) {
			throw new Error(`Error setting properties: ${e}`);
		} finally {
			if (this.#properties.hasChanges) {
				console.log('hubo cambios');
				this.triggerEvent();
			}
			this.#properties.multipleSet = false;
			this.#properties.hasChanges = false;
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
				if (!property.hasOwnProperty('name')) return;
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
			}
			let name = property as string;
			props[name] = this[name];
		});
		return props;
	}

	/**
	 * The `triggerEvent` method triggers a change event on the model, which can be used to notify
	 * subscribers of changes to the model's properties.
	 *
	 * @param {string} event - The name of the event to trigger.
	 * @returns {void}
	 */
	triggerEvent = (event: string = 'change'): void => {
		globalThis.setTimeout(() => {
			this.trigger(event);
		}, 0);
	};
}
