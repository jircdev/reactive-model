import { ZodError, ZodObject, ZodTypeAny } from 'zod';
import { Events } from '@beyond-js/reactive/events';

type PropertyValidationErrors<T> = Partial<Record<keyof T, ValidatedPropertyType>>;
/**
 * Computed property definition for ReactiveModel.
 * Allows defining derived properties that automatically recalculate when dependencies change.
 */
interface ComputedProperty<T> {
    /** Name of the computed property */
    name: keyof T | string;
    /** Properties that this computed property depends on */
    dependencies: (keyof T | string)[];
    /** Function to compute the value */
    compute: (model: unknown) => unknown;
}
type IReactiveModelOptions<T> = {
    properties?: EntityProperty<T>[];
    /** Computed properties that derive from other properties */
    computed?: ComputedProperty<T>[];
} & {
    [K in keyof T]?: T[K];
};
type Timeout = ReturnType<typeof setTimeout>;
interface ValidatedPropertyType {
    valid: boolean;
    error?: ZodError | null;
}
type SetPropertiesResult = {
    updated: boolean;
    errors?: PropertyValidationErrors<unknown>;
};
type EntityProperty<T> = keyof T | ReactiveObjectProperty<T>;
type DefaultProps = 'fetching' | 'fetched' | 'processing' | 'processed' | 'loaded';
/**
 * Represents a reactive property which is another ReactiveModel instance.
 */
type ReactiveObjectProperty<T> = {
    name: keyof T;
    value: new (...args: unknown[]) => unknown;
    properties?: Record<string, unknown>;
};
type ReactiveProperty<T> = keyof T | DefaultProps | ReactiveObjectProperty<T> | string;

/**
 * Core interface for all reactive values in the system.
 * Any class that holds reactive state should implement this interface.
 *
 * @template T - The type of value this reactive holds
 */
interface IReactiveValue<T = unknown> {
    /**
     * Identifies this as a reactive value.
     * Used for runtime type checking without instanceof.
     */
    readonly isReactive: true;
    /**
     * Sets the value(s) of this reactive.
     * For models, this accepts partial updates.
     * For containers, this replaces the content.
     *
     * @param value - The value to set
     */
    setValue(value: T): void;
    /**
     * Gets the current value of this reactive.
     * For models, returns all properties.
     * For containers, returns the items/entries.
     */
    getValue(): T;
    /**
     * Serializes the reactive value for JSON output or persistence.
     * Should return a plain object/array suitable for JSON.stringify.
     */
    serialize(): unknown;
    /**
     * Checks if this reactive has changes that haven't been persisted.
     * Useful for dirty checking and save prompts.
     */
    hasUnpublishedChanges(): boolean;
    /**
     * Registers an event listener.
     * @param event - Event name to listen for
     * @param handler - Callback function
     */
    on(event: string, handler: (...args: unknown[]) => void): this;
    /**
     * Removes an event listener.
     * @param event - Event name
     * @param handler - Callback function to remove
     */
    off(event: string, handler: (...args: unknown[]) => void): this;
    /**
     * Emits an event to all registered listeners.
     * @param event - Event name to trigger
     * @param data - Optional data to pass to handlers
     */
    trigger(event: string, data?: unknown): void;
}
/**
 * Type guard to check if a value implements IReactiveValue.
 */
declare function isReactiveValue(value: unknown): value is IReactiveValue;

/**
 * Interface for reactive containers that hold multiple values.
 * Extends IReactiveValue with collection-specific operations.
 *
 * @template T - The type of items in the container
 * @template K - The type of keys (defaults to string | number)
 */
interface IReactiveContainer<T, K = string | number> extends IReactiveValue<T[]> {
    /**
     * Identifies this as a container type.
     * Used for runtime type checking.
     */
    readonly isContainer: true;
    /**
     * The number of items in the container.
     */
    readonly size: number;
    /**
     * Gets an item by key.
     * @param key - The key to look up
     * @returns The item or undefined if not found
     */
    get(key: K): T | undefined;
    /**
     * Sets an item at the specified key.
     * Triggers 'set' and 'change' events.
     *
     * @param key - The key to set
     * @param value - The value to store
     */
    set(key: K, value: T): void;
    /**
     * Checks if a key exists in the container.
     * @param key - The key to check
     */
    has(key: K): boolean;
    /**
     * Deletes an item by key.
     * Triggers 'delete' and 'change' events.
     *
     * @param key - The key to delete
     * @returns true if the item was deleted, false if it didn't exist
     */
    delete(key: K): boolean;
    /**
     * Removes all items from the container.
     * Triggers 'clear' and 'change' events.
     */
    clear(): void;
    /**
     * Returns an iterator over the keys.
     */
    keys(): IterableIterator<K>;
    /**
     * Returns an iterator over the values.
     */
    values(): IterableIterator<T>;
    /**
     * Returns an iterator over [key, value] pairs.
     */
    entries(): IterableIterator<[K, T]>;
    /**
     * Executes a callback for each item in the container.
     * @param callback - Function to call for each item
     */
    forEach(callback: (value: T, key: K) => void): void;
    /**
     * Sets multiple items at once.
     * More efficient than multiple individual sets.
     *
     * @param items - Array of items or Map of key-value pairs
     * @param clear - If true, clears existing items before adding new ones
     */
    setItems(items: T[] | Map<K, T>, clear?: boolean): void;
}
/**
 * Type guard to check if a value implements IReactiveContainer.
 */
declare function isReactiveContainer<T, K = string | number>(value: unknown): value is IReactiveContainer<T, K>;

/**
 * Plugin System Types for ReactiveModel
 *
 * This module defines the interfaces for creating plugins that can intercept
 * and extend the behavior of ReactiveModel, Item, and Collection classes.
 *
 * Plugins can be used to add functionality like:
 * - Local storage persistence (IndexedDB, localStorage)
 * - Caching strategies
 * - Real-time synchronization
 * - Logging and analytics
 * - Data transformation
 */

/**
 * Base interface for reactive plugins.
 * Plugins can intercept lifecycle operations on ReactiveModel, Item, and Collection.
 *
 * @template T - The type of data the plugin handles
 *
 * @example
 * ```typescript
 * const loggingPlugin: IReactivePlugin = {
 *   name: 'logging',
 *   onBeforeLoad: async (item, args) => {
 *     console.log('Loading item:', args);
 *     return args;
 *   },
 *   onAfterLoad: async (item, data) => {
 *     console.log('Loaded data:', data);
 *     return data;
 *   }
 * };
 * ```
 */
interface IReactivePlugin<T = unknown> {
    /** Unique name identifier for the plugin */
    name: string;
    /** Priority for execution order (higher = runs first). Default: 0 */
    priority?: number;
    /**
     * Called before set() on any ReactiveModel.
     * Can modify the properties before they are applied.
     */
    onBeforeSet?(model: ReactiveModel<T>, properties: Partial<T>): Promise<Partial<T>> | Partial<T>;
    /**
     * Called after set() on any ReactiveModel.
     */
    onAfterSet?(model: ReactiveModel<T>, properties: Partial<T>, result: SetPropertiesResult): Promise<void> | void;
    /**
     * Called before Item.load() executes.
     * Can modify the load arguments.
     */
    onBeforeLoad?(item: unknown, args: unknown): Promise<unknown> | unknown;
    /**
     * Called after Item.load() completes.
     * Can transform the loaded data.
     */
    onAfterLoad?(item: unknown, data: T): Promise<T> | T;
    /**
     * Called before Item.publish() executes.
     * Can modify the data before saving.
     */
    onBeforePublish?(item: unknown, data: Partial<T>): Promise<Partial<T>> | Partial<T>;
    /**
     * Called after Item.publish() completes.
     */
    onAfterPublish?(item: unknown, data: T): Promise<void> | void;
    /**
     * Called before Item.delete() executes.
     * Return false to cancel deletion.
     */
    onBeforeDelete?(item: unknown, id: string | number): Promise<boolean> | boolean;
    /**
     * Called after Item.delete() completes.
     */
    onAfterDelete?(item: unknown, id: string | number): Promise<void> | void;
    /**
     * Called before Collection.load() executes.
     * Can modify the load specs.
     */
    onBeforeList?(collection: unknown, specs: unknown): Promise<unknown> | unknown;
    /**
     * Called after Collection.load() completes.
     * Can transform the loaded items.
     */
    onAfterList?(collection: unknown, items: T[]): Promise<T[]> | T[];
    /**
     * Called when the plugin is installed on a model.
     */
    install?(target: ReactiveModel<T>): void;
    /**
     * Called when the plugin is uninstalled from a model.
     */
    uninstall?(target: ReactiveModel<T>): void;
}
/**
 * Options for registering a plugin.
 */
interface IPluginRegistrationOptions {
    /** Apply plugin only to specific entity types */
    entities?: string[];
    /** Apply plugin globally to all models */
    global?: boolean;
}
/**
 * Configuration for a persistence plugin (IndexedDB, localStorage, etc.)
 */
interface IPersistencePluginConfig {
    /** Name of the database/store */
    database: string;
    /** Name of the object store */
    store: string;
    /** Caching strategy */
    strategy: 'cache-first' | 'network-first' | 'stale-while-revalidate' | 'cache-only' | 'network-only';
    /** Time-to-live for cached data in milliseconds */
    ttl?: number;
    /** Whether to sync with backend when online */
    syncOnReconnect?: boolean;
}
/**
 * Result of running a hook through multiple plugins.
 */
interface IHookResult<T> {
    /** The final value after all plugins processed it */
    value: T;
    /** Whether any plugin requested to cancel the operation */
    cancelled: boolean;
    /** Errors from plugins (non-fatal) */
    errors: Error[];
}

/**
 * Plugin Manager for ReactiveModel
 *
 * Manages the registration and execution of plugins across all reactive models.
 * Plugins are executed in priority order (higher priority = runs first).
 */

/**
 * Manages plugins for the ReactiveModel system.
 * Provides methods to register, unregister, and execute plugin hooks.
 *
 * @example
 * ```typescript
 * // Register a plugin globally
 * PluginManager.register({
 *   name: 'logging',
 *   priority: 100,
 *   onBeforeLoad: async (item, args) => {
 *     console.log('Loading:', args);
 *     return args;
 *   }
 * });
 *
 * // Register for specific entities
 * PluginManager.register(myPlugin, { entities: ['users', 'products'] });
 *
 * // Unregister
 * PluginManager.unregister('logging');
 * ```
 */
declare class PluginManager {
    #private;
    /**
     * Registers a plugin.
     *
     * @param plugin - The plugin to register
     * @param options - Registration options
     */
    static register(plugin: IReactivePlugin, options?: IPluginRegistrationOptions): void;
    /**
     * Unregisters a plugin by name.
     *
     * @param name - Name of the plugin to unregister
     * @param entity - Optional entity to unregister from (if not provided, unregisters globally)
     */
    static unregister(name: string, entity?: string): void;
    /**
     * Gets all plugins applicable to an entity.
     *
     * @param entity - Optional entity name to get plugins for
     * @returns Array of plugins sorted by priority (highest first)
     */
    static getPlugins(entity?: string): IReactivePlugin[];
    /**
     * Checks if a plugin is registered.
     *
     * @param name - Name of the plugin
     * @param entity - Optional entity to check
     */
    static hasPlugin(name: string, entity?: string): boolean;
    /**
     * Clears all registered plugins.
     * Useful for testing.
     */
    static clear(): void;
    /**
     * Runs a hook through all applicable plugins.
     * Plugins are executed in priority order.
     * Each plugin can transform the value, which is passed to the next plugin.
     *
     * @param hookName - Name of the hook to run
     * @param target - The model/item/collection the hook is running on
     * @param value - The initial value to pass through plugins
     * @param entity - Optional entity name to include entity-specific plugins
     * @returns The final value after all plugins have processed it
     *
     * @example
     * ```typescript
     * const modifiedArgs = await PluginManager.runHook(
     *   'onBeforeLoad',
     *   itemInstance,
     *   loadArgs,
     *   'users'
     * );
     * ```
     */
    static runHook<T>(hookName: keyof IReactivePlugin, target: unknown, value: T, entity?: string): Promise<IHookResult<T>>;
    /**
     * Runs a hook synchronously through all applicable plugins.
     * Use this only when you know all plugins implement the hook synchronously.
     *
     * @param hookName - Name of the hook to run
     * @param target - The model/item/collection the hook is running on
     * @param value - The initial value to pass through plugins
     * @param entity - Optional entity name to include entity-specific plugins
     * @returns The final value after all plugins have processed it
     */
    static runHookSync<T>(hookName: keyof IReactivePlugin, target: unknown, value: T, entity?: string): T;
    /**
     * Runs a void hook (like afterPublish) through all applicable plugins.
     * Does not expect a return value.
     *
     * @param hookName - Name of the hook to run
     * @param target - The model/item/collection the hook is running on
     * @param args - Arguments to pass to the hook
     * @param entity - Optional entity name to include entity-specific plugins
     */
    static runVoidHook(hookName: keyof IReactivePlugin, target: unknown, args: unknown[], entity?: string): Promise<void>;
}

/**
 * Base class for reactive models.
 * Implements IReactiveValue for unified reactive value handling.
 *
 * @template T - The type of the model's properties
 */
declare class ReactiveModel<T> extends Events implements IReactiveValue<Partial<T>> {
    #private;
    debounceTimeout: Timeout | null;
    processing: boolean;
    processed: boolean;
    fetching: boolean;
    loaded: boolean;
    private _reactiveProps;
    /**
     * Static method to check if a class is reactive.
     * @deprecated Use isReactiveValue() type guard instead
     */
    static isReactive(): boolean;
    /**
     * Instance property identifying this as a reactive value.
     * Required by IReactiveValue interface.
     */
    readonly isReactive: true;
    protected properties: EntityProperty<T>[];
    get isDraft(): boolean;
    get propertyNames(): Set<string | keyof T>;
    get ready(): boolean;
    set ready(value: boolean);
    protected schema: ZodObject<Record<string, ZodTypeAny>>;
    get initialValues(): Partial<T>;
    /**
     * Defines if the model has been modified since it was loaded.
     */
    get unpublished(): boolean;
    /**
     * @deprecated Use `unpublished` instead.
     */
    get isUnpublished(): boolean;
    constructor(options?: IReactiveModelOptions<T>);
    /**
     * Sets the value of this reactive model.
     * Alias for set() to satisfy IReactiveValue interface.
     *
     * @param value - Partial properties to update
     */
    setValue(value: Partial<T>): void;
    /**
     * Gets all properties of this reactive model.
     * Alias for getProperties() to satisfy IReactiveValue interface.
     */
    getValue(): Partial<T>;
    /**
     * Serializes the model to a plain object for JSON output.
     */
    serialize(): Partial<T>;
    /**
     * Checks if this model has unpublished changes.
     * Alias for unpublished getter to satisfy IReactiveValue interface.
     */
    hasUnpublishedChanges(): boolean;
    /**
     * Logs debug information to the console only when the #debug property matches the constructor name.
     * This allows for targeted debugging of specific model instances by setting the #debug property
     * to the class name you want to debug.
     *
     * @param args - Any arguments to be logged to the console
     */
    private debug;
    /**
     * Defines computed properties that automatically recalculate when their dependencies change.
     * Computed properties are read-only and their values are cached until a dependency changes.
     *
     * @param computed - Array of computed property definitions
     */
    private defineComputedProperties;
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
    transaction(callback: () => void): SetPropertiesResult;
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
    protected beforeSet(properties: Partial<T>): Promise<Partial<T>>;
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
    protected afterSet(properties: Partial<T>, result: SetPropertiesResult): Promise<void>;
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
    protected setInitialValues(specs?: Partial<T>): Partial<T>;
    getProperty<K extends keyof T>(key: K): T[K];
    property: <K extends keyof T>(key: K) => T[K];
    protected defineReactiveProp<K extends keyof T>(propKey: string, initialValue: unknown, isReactiveProperty?: boolean): void;
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
    protected defineReactiveProps(props: ReactiveProperty<T>[], values?: any): void;
    protected reactiveProps(props: ReactiveProperty<T>[]): void;
    setProperty(propKey: string, value: unknown): void;
    private validateProperty;
    private isSameObject;
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
    };
    /**
     * Sets one or more reactive properties on the model.
     * Automatically validates against the schema if defined.
     * Triggers lifecycle hooks (beforeSet/afterSet) and events (pre:set/post:set).
     *
     * @param properties - Partial object with properties to update
     * @returns Result containing updated status and any validation errors
     */
    set(properties: Partial<T>): SetPropertiesResult;
    /**
     * Async version of set that properly awaits lifecycle hooks.
     * Use this when you need to ensure hooks complete before continuing.
     *
     * @param properties - Partial object with properties to update
     * @returns Promise resolving to result with updated status and errors
     */
    setAsync(properties: Partial<T>): Promise<SetPropertiesResult>;
    /**
     * Internal synchronous set implementation.
     * @internal
     */
    private _setSync;
    /**
     * Gets all properties of the model, including nested reactive objects and collections.
     * Uses IReactiveValue.serialize() for nested reactive values.
     *
     * @returns {Partial<T>} An object containing all properties of the model
     */
    getProperties(): Partial<T>;
    /**
     * Reverts all properties of the model back to their initial values.
     * This is useful for discarding changes and restoring the model to its original state.
     */
    revert(): void;
    /**
     * Saves the current state of the model as the new initial state.
     * This marks the model as no longer being a draft and updates the initial values
     * to match the current state. Useful after successfully persisting changes.
     */
    saveChanges(): void;
    /**
     * Triggers an event after a specified delay.
     * @deprecated use trigger method instead.
     * @param {string} event - The name of the event to trigger.
     * @param {Record<string, any>} params - Additional parameters for the event, including an optional `delay` property.
     */
    triggerEvent: (event?: string, params?: Record<string, unknown>) => void;
}

export { PluginManager, ReactiveModel, isReactiveContainer, isReactiveValue };
export type { ComputedProperty, EntityProperty, IHookResult, IPersistencePluginConfig, IReactiveContainer, IReactiveModelOptions, IReactivePlugin, IReactiveValue, PropertyValidationErrors, SetPropertiesResult };
