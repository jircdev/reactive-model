import { ZodError, ZodObject, ZodTypeAny } from 'zod';
import {
	ComputedProperty,
	DefaultProps,
	EntityProperty,
	IReactiveModelOptions,
	ModelProperties,
	PropertyValidationErrors,
	ReactiveObjectProperty,
	ReactiveProperty,
	SetPropertiesResult,
	Timeout,
	ValidatedPropertyType,
} from './types';

import { Events } from 'reactive/events';
import type { IReactiveValue } from './interfaces/reactive-value';
import { isReactiveValue } from './interfaces/reactive-value';
import { isReactiveContainer } from './interfaces/reactive-container';

// Re-export types for external use
export type { SetPropertiesResult, PropertyValidationErrors, IReactiveModelOptions, ComputedProperty, EntityProperty };

// Re-export interfaces
export { IReactiveValue, isReactiveValue } from './interfaces/reactive-value';
export { IReactiveContainer, isReactiveContainer } from './interfaces/reactive-container';

// Re-export plugin system
export { PluginManager } from './plugins';
export type { IReactivePlugin, IPersistencePluginConfig, IHookResult } from './plugins';

/**
 * Base class for reactive models.
 * Implements IReactiveValue for unified reactive value handling.
 *
 * @template T - The type of the model's properties
 */
export /*bundle */ class ReactiveModel<T> extends Events implements IReactiveValue<Partial<T>> {
	debounceTimeout: Timeout | null;
	processing: boolean = false;
	processed: boolean = false;
	declare fetching: boolean;
	loaded: boolean = false;
	#ready: boolean = false;
	#debug: string;

	private _reactiveProps: Record<keyof T, unknown> = {} as Record<keyof T, unknown>;

	/**
	 * Static method to check if a class is reactive.
	 * @deprecated Use isReactiveValue() type guard instead
	 */
	static isReactive() {
		return true;
	}

	/**
	 * Instance property identifying this as a reactive value.
	 * Required by IReactiveValue interface.
	 */
	readonly isReactive: true = true;

	//TODO: Validate how to handle the properties
	protected properties: EntityProperty<T>[] = [];
	// properties of the object
	#isDraft: boolean = false;
	get isDraft() {
		return this.#isDraft;
	}
	#propertyNames = new Set<string | keyof T>();
	get propertyNames() {
		return this.#propertyNames;
	}
	get ready() {
		return this.#ready;
	}
	set ready(value: boolean) {
		this.#ready = value;
		this.trigger('ready');
		this.trigger('change');
	}

	protected schema: ZodObject<Record<string, ZodTypeAny>>;
	#initialValues: Partial<T> = {} as Partial<T>;

	get initialValues() {
		return this.#initialValues;
	}

	// Transaction support
	#inTransaction: boolean = false;
	#pendingChanges: Partial<T> = {};

	// Computed properties support
	#computedProperties: ComputedProperty<T>[] = [];
	#computedCache: Map<string, unknown> = new Map();

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
				const propValue = this[prop];
				// Use interface check instead of instanceof
				if (isReactiveValue(propValue)) {
					return propValue.hasUnpublishedChanges();
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

	constructor(options: IReactiveModelOptions<T> = {} as IReactiveModelOptions<T>) {
		super();
		//	this.#debug = 'Courier';
		const { properties, computed, ...props } = options;
		const defaultProps: DefaultProps[] = ['fetching', 'fetched', 'processing', 'processed', 'loaded'];

		if (properties) {
			this.properties = properties as EntityProperty<T>[];
			this.defineReactiveProps(properties, props as Record<string, unknown>);
			if (Object.keys(props).length > 0) {
				this.setInitialValues(props as Partial<T>);
			}
		}

		// Initialize computed properties
		if (computed && computed.length > 0) {
			this.#computedProperties = computed;
			this.defineComputedProperties(computed);
		}

		this.debug('props', props, properties);
		this.defineReactiveProps(defaultProps as ReactiveProperty<T>[], this.initialValues);
	}

	// ==========================================
	// IReactiveValue Implementation
	// ==========================================

	/**
	 * Sets the value of this reactive model.
	 * Alias for set() to satisfy IReactiveValue interface.
	 *
	 * @param value - Partial properties to update
	 */
	setValue(value: Partial<T>): void {
		this.set(value);
	}

	/**
	 * Gets all properties of this reactive model.
	 * Alias for getProperties() to satisfy IReactiveValue interface.
	 */
	getValue(): Partial<T> {
		return this.getProperties();
	}

	/**
	 * Serializes the model to a plain object for JSON output.
	 */
	serialize(): Partial<T> {
		return this.getProperties();
	}

	/**
	 * Checks if this model has unpublished changes.
	 * Alias for unpublished getter to satisfy IReactiveValue interface.
	 */
	hasUnpublishedChanges(): boolean {
		return this.unpublished;
	}

	// ==========================================
	// Private Methods
	// ==========================================

	/**
	 * Logs debug information to the console only when the #debug property matches the constructor name.
	 * This allows for targeted debugging of specific model instances by setting the #debug property
	 * to the class name you want to debug.
	 *
	 * @param args - Any arguments to be logged to the console
	 */
	private debug(...args: unknown[]): void {
		if (this.#debug === this.constructor.name) {
			console.log(...args);
		}
	}

	/**
	 * Defines computed properties that automatically recalculate when their dependencies change.
	 * Computed properties are read-only and their values are cached until a dependency changes.
	 *
	 * @param computed - Array of computed property definitions
	 */
	private defineComputedProperties(computed: ComputedProperty<T>[]): void {
		for (const prop of computed) {
			const name = prop.name as string;

			// Define getter for computed property
			Object.defineProperty(this, name, {
				get: () => {
					// Check cache first
					if (this.#computedCache.has(name)) {
						return this.#computedCache.get(name);
					}
					// Compute and cache value
					const value = prop.compute(this);
					this.#computedCache.set(name, value);
					return value;
				},
				enumerable: true,
				configurable: true,
			});

			// Listen to dependency changes to invalidate cache
			for (const dep of prop.dependencies) {
				this.on(`${String(dep)}.changed`, () => {
					const oldValue = this.#computedCache.get(name);
					this.#computedCache.delete(name);
					const newValue = (this as Record<string, unknown>)[name];
					this.trigger(`${name}.changed`, { value: newValue, previous: oldValue });
				});
			}
		}
	}

	/**
	 * Executes multiple property changes within a transaction.
	 * All changes are batched and only one 'change' event is emitted at the end.
	 * This is useful for making multiple related changes without triggering
	 * intermediate events.
	 *
	 * @param callback - Function containing the changes to make
	 * @returns The result of applying all pending changes
	 *
	 * @example
	 * ```typescript
	 * model.transaction(() => {
	 *   model.name = 'John';
	 *   model.email = 'john@example.com';
	 *   model.age = 30;
	 * });
	 * // Only one 'change' event is emitted
	 * ```
	 */
	transaction(callback: () => void): SetPropertiesResult {
		this.#inTransaction = true;
		this.#pendingChanges = {};

		try {
			callback();
			// Apply all pending changes at once
			const result = this.set(this.#pendingChanges);
			return result;
		} finally {
			this.#inTransaction = false;
			this.#pendingChanges = {};
		}
	}

	/**
	 * Lifecycle hook called before set() applies changes.
	 * Override this method to intercept and modify properties before they are set.
	 *
	 * @param properties - The properties about to be set
	 * @returns The properties to actually set (can be modified)
	 *
	 * @example
	 * ```typescript
	 * protected async beforeSet(properties: Partial<T>): Promise<Partial<T>> {
	 *   // Add timestamp to every update
	 *   return { ...properties, updatedAt: new Date() };
	 * }
	 * ```
	 */
	protected async beforeSet(properties: Partial<T>): Promise<Partial<T>> {
		return properties;
	}

	/**
	 * Lifecycle hook called after set() completes.
	 * Override this method to perform actions after properties have been set.
	 *
	 * @param properties - The properties that were set
	 * @param result - The result of the set operation
	 *
	 * @example
	 * ```typescript
	 * protected async afterSet(properties: Partial<T>, result: SetPropertiesResult): Promise<void> {
	 *   if (result.updated) {
	 *     console.log('Model was updated:', properties);
	 *   }
	 * }
	 * ```
	 */
	protected async afterSet(properties: Partial<T>, result: SetPropertiesResult): Promise<void> {
		// Default implementation does nothing
	}

	/**
	 * Sets the initial values for the model based on the provided specifications.
	 * This method processes the model's properties and extracts their values from the specs object.
	 * If no specs are provided, it returns the existing initial values.
	 *
	 * The method also determines if the model is a draft by checking if the specs object is empty.
	 *
	 * @param specs - Optional partial object containing property values to set as initial values
	 * @returns The initial values object that was set
	 */
	protected setInitialValues(specs?: Partial<T>): Partial<T> {
		if (!specs) return this.#initialValues;

		const values = {} as ModelProperties<T>;

		this.properties.forEach(property => {
			if (typeof property !== 'string') {
				const objProp = property as ReactiveObjectProperty<T>;
				(values as Record<string, unknown>)[objProp.name as string] = specs[objProp.name];
				return;
			}

			(values as Record<string, unknown>)[property as string] = specs[property as keyof T];
		});
		this.#isDraft = Object.keys(specs).length === 0;
		this.#initialValues = values;

		return this.#initialValues;
	}

	getProperty<K extends keyof T>(key: K): T[K] {
		return this._reactiveProps[key as string] as T[K]; // Type-safe access.
	}

	property = this.getProperty;

	protected defineReactiveProp<K extends keyof T>(
		propKey: string,
		initialValue: unknown,
		isReactiveProperty: boolean = false,
	): void {
		this._reactiveProps[propKey] = initialValue;

		Object.defineProperty(this, propKey as string, {
			get: () => {
				return this._reactiveProps[propKey];
			},
			set: (newVal): void => {
				if (isReactiveProperty) {
					const instance = this._reactiveProps[propKey] as IReactiveValue;
					this.trigger(`${propKey}.changed`, {
						value: newVal,
						previous: instance.getValue(),
					});
					this.trigger('change');
					instance.setValue(newVal);
					return;
				}

				if (newVal !== undefined && newVal === this._reactiveProps[propKey]) return;

				const previous = this._reactiveProps[propKey];
				this._reactiveProps[propKey] = newVal;

				this.trigger(`${propKey}.changed`, { value: newVal, previous });
				this.trigger('change');
			},
			enumerable: true,
			configurable: true,
		});
	}

	/**
	 * Defines the reactive properties of the object.
	 * The properties are defined as an array of strings or objects.
	 * The objects must have a `name` property with the name of the property and a `value` property with the class of the object.
	 * The `value` property can be a class or an object.
	 * If the `value` property is a class, the class must implement IReactiveValue.
	 *
	 * @param props - Array of property definitions
	 * @param values - Initial values for properties
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
				console.warn(`Invalid value type for ${name as string}`);
				continue;
			}

			// Check if the class implements IReactiveContainer (has isContainer)
			const isContainer = !!(data.value as unknown as { isContainer?: boolean }).isContainer;

			// Create instance with appropriate parameters
			const parameters = isContainer ? { parent: this } : { parent: this, ...initialValue, ...specs };
			const instance = new data.value(parameters);

			// If it's a container, use setItems to initialize
			if (isReactiveContainer(instance)) {
				instance.setItems(initialValue, true);
			}

			this.#propertyNames.add(name);
			this.defineReactiveProp(name, instance, true);

			continue;
		}
	}

	protected reactiveProps(props: ReactiveProperty<T>[]) {
		this.defineReactiveProps(props);
	}

	setProperty(propKey: string, value: unknown) {
		this._reactiveProps[propKey] = value;
	}

	private validateProperty(propKey: string, value: unknown): ValidatedPropertyType {
		if (!this.schema) {
			return { valid: true, error: null };
		}

		if (!this.schema.shape[propKey]) {
			return {
				valid: false,
				error: new ZodError([
					{
						path: [propKey],
						message: `Property ${propKey} is not defined in the schema`,
						code: 'custom',
					},
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

	private isSameObject = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

	/**
	 * Validates the provided properties against the model's Zod schema.
	 * Only validates properties that are defined in the model's properties array.
	 *
	 * @param {Partial<T>} properties - The properties to validate
	 * @returns {{ valid: boolean; errors: PropertyValidationErrors<T> }} An object containing:
	 *   - `valid`: boolean indicating if all properties are valid
	 *   - `errors`: object containing validation errors for each invalid property
	 */
	validate(properties: Partial<T>): {
		valid: boolean;
		errors: PropertyValidationErrors<T>;
	} {
		const keys = Object.keys(properties);
		const errors: PropertyValidationErrors<T> = {};
		const onValidate = (prop: string) => {
			if (!this.properties || !this.properties.includes(prop as keyof T)) {
				console.trace(`is not a property`, prop);
				return;
			}
			const validated = this.validateProperty(prop, properties[prop as keyof T]);

			if (!validated.valid) {
				errors[prop as keyof T] = validated;
			}
		};
		keys.forEach(onValidate);

		return { valid: Object.keys(errors).length === 0, errors };
	}

	/**
	 * Sets one or more reactive properties on the model.
	 * Automatically validates against the schema if defined.
	 * Triggers lifecycle hooks (beforeSet/afterSet) and events (pre:set/post:set).
	 *
	 * @param properties - Partial object with properties to update
	 * @returns Result containing updated status and any validation errors
	 */
	set(properties: Partial<T>): SetPropertiesResult {
		if (!properties) {
			console.warn('you are trying to set an empty object', this.constructor.name, properties);
			return {
				updated: false,
			};
		}

		// If in transaction, accumulate changes instead of applying immediately
		if (this.#inTransaction) {
			this.#pendingChanges = { ...this.#pendingChanges, ...properties };
			return { updated: false };
		}

		// Use synchronous version internally, async hooks are called separately
		return this._setSync(properties);
	}

	/**
	 * Async version of set that properly awaits lifecycle hooks.
	 * Use this when you need to ensure hooks complete before continuing.
	 *
	 * @param properties - Partial object with properties to update
	 * @returns Promise resolving to result with updated status and errors
	 */
	async setAsync(properties: Partial<T>): Promise<SetPropertiesResult> {
		if (!properties) {
			console.warn('you are trying to set an empty object', this.constructor.name, properties);
			return { updated: false };
		}

		// Call beforeSet hook
		const modifiedProps = await this.beforeSet(properties);

		// Emit pre:set event
		this.trigger('pre:set', modifiedProps);

		// Apply changes
		const result = this._setSync(modifiedProps);

		// Call afterSet hook
		await this.afterSet(modifiedProps, result);

		// Emit post:set event
		this.trigger('post:set', { properties: modifiedProps, result });

		return result;
	}

	/**
	 * Internal synchronous set implementation.
	 * @internal
	 */
	private _setSync(properties: Partial<T>): SetPropertiesResult {
		const keys = Object.keys(properties);
		let updated = false;
		const errors: PropertyValidationErrors<T> = {};

		const onSet = (prop: string) => {
			if (!this.#propertyNames.has(prop)) {
				return;
			}

			const validated = this.validateProperty(prop, properties[prop as keyof T]);
			this.debug(prop, properties[prop as keyof T], validated);
			if (!validated.valid) {
				errors[prop as keyof T] = validated;
			}

			const propertyValue = this.getProperty(prop as keyof T);

			// Use unified interface check instead of hardcoded type checks
			if (isReactiveValue(propertyValue)) {
				// Use setValue from the interface
				propertyValue.setValue(properties[prop as keyof T]);

				if (propertyValue.hasUnpublishedChanges()) updated = true;

				return;
			}

			const propValue = properties[prop as keyof T];
			const isObject = typeof propValue === 'object';
			const currentValue = (this as Record<string, unknown>)[prop];
			const isSameObject = isObject && this.isSameObject(propValue, currentValue);

			if (currentValue === propValue || isSameObject) {
				return;
			}

			this.trigger(`${prop}.changed`, { value: propValue, previous: currentValue });
			(this as Record<string, unknown>)[prop] = propValue;
			updated = true;
		};

		keys.forEach(onSet);
		if (updated) {
			this.trigger('change');
			this.trigger('set.executed');
		}

		return { updated, errors };
	}

	/**
	 * Gets all properties of the model, including nested reactive objects and collections.
	 * Uses IReactiveValue.serialize() for nested reactive values.
	 *
	 * @returns {Partial<T>} An object containing all properties of the model
	 */
	getProperties(): Partial<T> {
		const props = {} as Partial<T>;

		const loop = (property: EntityProperty<T>) => {
			let name: string | keyof T = property as string;

			if (typeof property === 'object') {
				const objProp = property as ReactiveObjectProperty<T>;
				name = objProp.name as string;

				const value = this[name as keyof this];
				// Use interface check and serialize method
				if (isReactiveValue(value)) {
					props[name as keyof T] = value.serialize() as T[keyof T];
					return;
				}
			}

			props[name as keyof T] = (this as unknown as Record<string, T[keyof T]>)[name as string];
		};
		this.properties.forEach(loop);
		return props;
	}

	/**
	 * Reverts all properties of the model back to their initial values.
	 * This is useful for discarding changes and restoring the model to its original state.
	 */
	revert() {
		this.set(this.initialValues);
	}

	/**
	 * Saves the current state of the model as the new initial state.
	 * This marks the model as no longer being a draft and updates the initial values
	 * to match the current state. Useful after successfully persisting changes.
	 */
	saveChanges() {
		this.#initialValues = this.getProperties();
		this.#isDraft = false;
	}

	/**
	 * Triggers an event after a specified delay.
	 * @deprecated use trigger method instead.
	 * @param {string} event - The name of the event to trigger.
	 * @param {Record<string, any>} params - Additional parameters for the event, including an optional `delay` property.
	 */
	triggerEvent = (event: string = 'change', params: Record<string, unknown> = {}): void => {
		this.trigger(event);
	};
}
