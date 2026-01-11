'use strict';

var zod = require('zod');
var events = require('@beyond-js/reactive/events');

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Type guard to check if a value implements IReactiveValue.
 */
function isReactiveValue(value) {
    return (value !== null &&
        typeof value === 'object' &&
        'isReactive' in value &&
        value.isReactive === true);
}

/**
 * Type guard to check if a value implements IReactiveContainer.
 */
function isReactiveContainer(value) {
    return (value !== null &&
        typeof value === 'object' &&
        'isContainer' in value &&
        value.isContainer === true);
}

/**
 * Plugin Manager for ReactiveModel
 *
 * Manages the registration and execution of plugins across all reactive models.
 * Plugins are executed in priority order (higher priority = runs first).
 */
var _a, _PluginManager_globalPlugins, _PluginManager_entityPlugins;
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
class PluginManager {
    /**
     * Registers a plugin.
     *
     * @param plugin - The plugin to register
     * @param options - Registration options
     */
    static register(plugin, options = { global: true }) {
        if (!plugin.name) {
            throw new Error('Plugin must have a name');
        }
        if (options.entities && options.entities.length > 0) {
            // Register for specific entities
            for (const entity of options.entities) {
                if (!__classPrivateFieldGet(this, _a, "f", _PluginManager_entityPlugins).has(entity)) {
                    __classPrivateFieldGet(this, _a, "f", _PluginManager_entityPlugins).set(entity, new Map());
                }
                __classPrivateFieldGet(this, _a, "f", _PluginManager_entityPlugins).get(entity).set(plugin.name, plugin);
            }
        }
        else {
            // Register globally
            __classPrivateFieldGet(this, _a, "f", _PluginManager_globalPlugins).set(plugin.name, plugin);
        }
    }
    /**
     * Unregisters a plugin by name.
     *
     * @param name - Name of the plugin to unregister
     * @param entity - Optional entity to unregister from (if not provided, unregisters globally)
     */
    static unregister(name, entity) {
        var _b;
        if (entity) {
            (_b = __classPrivateFieldGet(this, _a, "f", _PluginManager_entityPlugins).get(entity)) === null || _b === void 0 ? void 0 : _b.delete(name);
        }
        else {
            __classPrivateFieldGet(this, _a, "f", _PluginManager_globalPlugins).delete(name);
            // Also remove from all entities
            for (const entityPlugins of __classPrivateFieldGet(this, _a, "f", _PluginManager_entityPlugins).values()) {
                entityPlugins.delete(name);
            }
        }
    }
    /**
     * Gets all plugins applicable to an entity.
     *
     * @param entity - Optional entity name to get plugins for
     * @returns Array of plugins sorted by priority (highest first)
     */
    static getPlugins(entity) {
        const plugins = [...__classPrivateFieldGet(this, _a, "f", _PluginManager_globalPlugins).values()];
        if (entity && __classPrivateFieldGet(this, _a, "f", _PluginManager_entityPlugins).has(entity)) {
            plugins.push(...__classPrivateFieldGet(this, _a, "f", _PluginManager_entityPlugins).get(entity).values());
        }
        // Sort by priority (higher first)
        return plugins.sort((a, b) => { var _b, _c; return ((_b = b.priority) !== null && _b !== void 0 ? _b : 0) - ((_c = a.priority) !== null && _c !== void 0 ? _c : 0); });
    }
    /**
     * Checks if a plugin is registered.
     *
     * @param name - Name of the plugin
     * @param entity - Optional entity to check
     */
    static hasPlugin(name, entity) {
        var _b;
        if (__classPrivateFieldGet(this, _a, "f", _PluginManager_globalPlugins).has(name))
            return true;
        if (entity && ((_b = __classPrivateFieldGet(this, _a, "f", _PluginManager_entityPlugins).get(entity)) === null || _b === void 0 ? void 0 : _b.has(name)))
            return true;
        return false;
    }
    /**
     * Clears all registered plugins.
     * Useful for testing.
     */
    static clear() {
        __classPrivateFieldGet(this, _a, "f", _PluginManager_globalPlugins).clear();
        __classPrivateFieldGet(this, _a, "f", _PluginManager_entityPlugins).clear();
    }
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
    static async runHook(hookName, target, value, entity) {
        const plugins = this.getPlugins(entity);
        const errors = [];
        let currentValue = value;
        let cancelled = false;
        for (const plugin of plugins) {
            const hook = plugin[hookName];
            if (typeof hook !== 'function')
                continue;
            try {
                const result = await hook(target, currentValue);
                // Handle cancellation for delete hooks
                if (hookName === 'onBeforeDelete' && result === false) {
                    cancelled = true;
                    break;
                }
                // Update value if result is provided
                if (result !== undefined && result !== null) {
                    currentValue = result;
                }
            }
            catch (error) {
                errors.push(error);
                console.error(`Plugin "${plugin.name}" error in ${String(hookName)}:`, error);
            }
        }
        return { value: currentValue, cancelled, errors };
    }
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
    static runHookSync(hookName, target, value, entity) {
        const plugins = this.getPlugins(entity);
        let currentValue = value;
        for (const plugin of plugins) {
            const hook = plugin[hookName];
            if (typeof hook !== 'function')
                continue;
            try {
                const result = hook(target, currentValue);
                if (result !== undefined && result !== null) {
                    currentValue = result;
                }
            }
            catch (error) {
                console.error(`Plugin "${plugin.name}" error in ${String(hookName)}:`, error);
            }
        }
        return currentValue;
    }
    /**
     * Runs a void hook (like afterPublish) through all applicable plugins.
     * Does not expect a return value.
     *
     * @param hookName - Name of the hook to run
     * @param target - The model/item/collection the hook is running on
     * @param args - Arguments to pass to the hook
     * @param entity - Optional entity name to include entity-specific plugins
     */
    static async runVoidHook(hookName, target, args, entity) {
        const plugins = this.getPlugins(entity);
        for (const plugin of plugins) {
            const hook = plugin[hookName];
            if (typeof hook !== 'function')
                continue;
            try {
                await hook(target, ...args);
            }
            catch (error) {
                console.error(`Plugin "${plugin.name}" error in ${String(hookName)}:`, error);
            }
        }
    }
}
_a = PluginManager;
/** Global plugins applied to all models */
_PluginManager_globalPlugins = { value: new Map() };
/** Entity-specific plugins */
_PluginManager_entityPlugins = { value: new Map() };

var _ReactiveModel_ready, _ReactiveModel_debug, _ReactiveModel_isDraft, _ReactiveModel_propertyNames, _ReactiveModel_initialValues, _ReactiveModel_inTransaction, _ReactiveModel_pendingChanges, _ReactiveModel_computedProperties, _ReactiveModel_computedCache;
/**
 * Base class for reactive models.
 * Implements IReactiveValue for unified reactive value handling.
 *
 * @template T - The type of the model's properties
 */
class ReactiveModel extends events.Events {
    /**
     * Static method to check if a class is reactive.
     * @deprecated Use isReactiveValue() type guard instead
     */
    static isReactive() {
        return true;
    }
    get isDraft() {
        return __classPrivateFieldGet(this, _ReactiveModel_isDraft, "f");
    }
    get propertyNames() {
        return __classPrivateFieldGet(this, _ReactiveModel_propertyNames, "f");
    }
    get ready() {
        return __classPrivateFieldGet(this, _ReactiveModel_ready, "f");
    }
    set ready(value) {
        __classPrivateFieldSet(this, _ReactiveModel_ready, value, "f");
        this.trigger('ready');
        this.trigger('change');
    }
    get initialValues() {
        return __classPrivateFieldGet(this, _ReactiveModel_initialValues, "f");
    }
    /**
     * Defines if the model has been modified since it was loaded.
     */
    get unpublished() {
        var _a;
        const properties = (_a = this.getProperties()) !== null && _a !== void 0 ? _a : {};
        return Object.keys(properties).some(prop => {
            var _a;
            if (prop === 'id')
                return false;
            if (Array.isArray(properties[prop])) {
                if (properties[prop].length !== ((_a = __classPrivateFieldGet(this, _ReactiveModel_initialValues, "f")[prop]) === null || _a === void 0 ? void 0 : _a.length))
                    return true;
                return JSON.stringify(properties[prop]) !== JSON.stringify(__classPrivateFieldGet(this, _ReactiveModel_initialValues, "f")[prop]);
            }
            if (typeof properties[prop] === 'object') {
                const propValue = this[prop];
                // Use interface check instead of instanceof
                if (isReactiveValue(propValue)) {
                    return propValue.hasUnpublishedChanges();
                }
                return JSON.stringify(properties[prop]) !== JSON.stringify(__classPrivateFieldGet(this, _ReactiveModel_initialValues, "f")[prop]);
            }
            return properties[prop] !== __classPrivateFieldGet(this, _ReactiveModel_initialValues, "f")[prop];
        });
    }
    /**
     * @deprecated Use `unpublished` instead.
     */
    get isUnpublished() {
        return this.unpublished;
    }
    constructor(options = {}) {
        super();
        this.processing = false;
        this.processed = false;
        this.loaded = false;
        _ReactiveModel_ready.set(this, false);
        _ReactiveModel_debug.set(this, void 0);
        this._reactiveProps = {};
        /**
         * Instance property identifying this as a reactive value.
         * Required by IReactiveValue interface.
         */
        this.isReactive = true;
        //TODO: Validate how to handle the properties
        this.properties = [];
        // properties of the object
        _ReactiveModel_isDraft.set(this, false);
        _ReactiveModel_propertyNames.set(this, new Set());
        _ReactiveModel_initialValues.set(this, {});
        // Transaction support
        _ReactiveModel_inTransaction.set(this, false);
        _ReactiveModel_pendingChanges.set(this, {});
        // Computed properties support
        _ReactiveModel_computedProperties.set(this, []);
        _ReactiveModel_computedCache.set(this, new Map());
        this.property = this.getProperty;
        this.isSameObject = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        /**
         * Triggers an event after a specified delay.
         * @deprecated use trigger method instead.
         * @param {string} event - The name of the event to trigger.
         * @param {Record<string, any>} params - Additional parameters for the event, including an optional `delay` property.
         */
        this.triggerEvent = (event = 'change', params = {}) => {
            this.trigger(event);
        };
        //	this.#debug = 'Courier';
        const { properties, computed, ...props } = options;
        const defaultProps = ['fetching', 'fetched', 'processing', 'processed', 'loaded'];
        if (properties) {
            this.properties = properties;
            this.defineReactiveProps(properties, props);
            if (Object.keys(props).length > 0) {
                this.setInitialValues(props);
            }
        }
        // Initialize computed properties
        if (computed && computed.length > 0) {
            __classPrivateFieldSet(this, _ReactiveModel_computedProperties, computed, "f");
            this.defineComputedProperties(computed);
        }
        this.debug('props', props, properties);
        this.defineReactiveProps(defaultProps, this.initialValues);
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
    setValue(value) {
        this.set(value);
    }
    /**
     * Gets all properties of this reactive model.
     * Alias for getProperties() to satisfy IReactiveValue interface.
     */
    getValue() {
        return this.getProperties();
    }
    /**
     * Serializes the model to a plain object for JSON output.
     */
    serialize() {
        return this.getProperties();
    }
    /**
     * Checks if this model has unpublished changes.
     * Alias for unpublished getter to satisfy IReactiveValue interface.
     */
    hasUnpublishedChanges() {
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
    debug(...args) {
        if (__classPrivateFieldGet(this, _ReactiveModel_debug, "f") === this.constructor.name) {
            console.log(...args);
        }
    }
    /**
     * Defines computed properties that automatically recalculate when their dependencies change.
     * Computed properties are read-only and their values are cached until a dependency changes.
     *
     * @param computed - Array of computed property definitions
     */
    defineComputedProperties(computed) {
        for (const prop of computed) {
            const name = prop.name;
            // Define getter for computed property
            Object.defineProperty(this, name, {
                get: () => {
                    // Check cache first
                    if (__classPrivateFieldGet(this, _ReactiveModel_computedCache, "f").has(name)) {
                        return __classPrivateFieldGet(this, _ReactiveModel_computedCache, "f").get(name);
                    }
                    // Compute and cache value
                    const value = prop.compute(this);
                    __classPrivateFieldGet(this, _ReactiveModel_computedCache, "f").set(name, value);
                    return value;
                },
                enumerable: true,
                configurable: true,
            });
            // Listen to dependency changes to invalidate cache
            for (const dep of prop.dependencies) {
                this.on(`${String(dep)}.changed`, () => {
                    const oldValue = __classPrivateFieldGet(this, _ReactiveModel_computedCache, "f").get(name);
                    __classPrivateFieldGet(this, _ReactiveModel_computedCache, "f").delete(name);
                    const newValue = this[name];
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
    transaction(callback) {
        __classPrivateFieldSet(this, _ReactiveModel_inTransaction, true, "f");
        __classPrivateFieldSet(this, _ReactiveModel_pendingChanges, {}, "f");
        try {
            callback();
            // Apply all pending changes at once
            const result = this.set(__classPrivateFieldGet(this, _ReactiveModel_pendingChanges, "f"));
            return result;
        }
        finally {
            __classPrivateFieldSet(this, _ReactiveModel_inTransaction, false, "f");
            __classPrivateFieldSet(this, _ReactiveModel_pendingChanges, {}, "f");
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
    async beforeSet(properties) {
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
    async afterSet(properties, result) {
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
    setInitialValues(specs) {
        if (!specs)
            return __classPrivateFieldGet(this, _ReactiveModel_initialValues, "f");
        const values = {};
        this.properties.forEach(property => {
            if (typeof property !== 'string') {
                const objProp = property;
                values[objProp.name] = specs[objProp.name];
                return;
            }
            values[property] = specs[property];
        });
        __classPrivateFieldSet(this, _ReactiveModel_isDraft, Object.keys(specs).length === 0, "f");
        __classPrivateFieldSet(this, _ReactiveModel_initialValues, values, "f");
        return __classPrivateFieldGet(this, _ReactiveModel_initialValues, "f");
    }
    getProperty(key) {
        return this._reactiveProps[key]; // Type-safe access.
    }
    defineReactiveProp(propKey, initialValue, isReactiveProperty = false) {
        this._reactiveProps[propKey] = initialValue;
        Object.defineProperty(this, propKey, {
            get: () => {
                return this._reactiveProps[propKey];
            },
            set: (newVal) => {
                if (isReactiveProperty) {
                    const instance = this._reactiveProps[propKey];
                    this.trigger(`${propKey}.changed`, {
                        value: newVal,
                        previous: instance.getValue(),
                    });
                    this.trigger('change');
                    instance.setValue(newVal);
                    return;
                }
                if (newVal !== undefined && newVal === this._reactiveProps[propKey])
                    return;
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
    defineReactiveProps(props, values) {
        var _a, _b, _c;
        for (let propKey of props) {
            const descriptor = Object.getOwnPropertyDescriptor(this, propKey);
            if (propKey === undefined)
                continue;
            if (typeof propKey !== 'object') {
                __classPrivateFieldGet(this, _ReactiveModel_propertyNames, "f").add(propKey);
                let initialValue = (_a = values === null || values === void 0 ? void 0 : values[propKey]) !== null && _a !== void 0 ? _a : descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;
                this.defineReactiveProp(propKey, initialValue);
                continue;
            }
            const data = propKey;
            const name = data.name;
            let initialValue = (_b = values === null || values === void 0 ? void 0 : values[name]) !== null && _b !== void 0 ? _b : descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;
            const specs = (_c = data.properties) !== null && _c !== void 0 ? _c : {};
            if (typeof data.value !== 'function' && typeof data.value !== 'object') {
                console.warn(`Invalid value type for ${name}`);
                continue;
            }
            // Check if the class implements IReactiveContainer (has isContainer)
            const isContainer = !!data.value.isContainer;
            // Create instance with appropriate parameters
            const parameters = isContainer ? { parent: this } : { parent: this, ...initialValue, ...specs };
            const instance = new data.value(parameters);
            // If it's a container, use setItems to initialize
            if (isReactiveContainer(instance)) {
                instance.setItems(initialValue, true);
            }
            __classPrivateFieldGet(this, _ReactiveModel_propertyNames, "f").add(name);
            this.defineReactiveProp(name, instance, true);
            continue;
        }
    }
    reactiveProps(props) {
        this.defineReactiveProps(props);
    }
    setProperty(propKey, value) {
        this._reactiveProps[propKey] = value;
    }
    validateProperty(propKey, value) {
        if (!this.schema) {
            return { valid: true, error: null };
        }
        if (!this.schema.shape[propKey]) {
            return {
                valid: false,
                error: new zod.ZodError([
                    {
                        path: [propKey],
                        message: `Property ${propKey} is not defined in the schema`,
                        code: 'custom',
                    },
                ]),
            };
        }
        const propSchema = this.schema.shape[propKey];
        const result = propSchema.safeParse(value);
        if (!result.success) {
            return { valid: false, error: result.error };
        }
        return { valid: true, error: null };
    }
    /**
     * Validates the provided properties against the model's Zod schema.
     * Only validates properties that are defined in the model's properties array.
     *
     * @param {Partial<T>} properties - The properties to validate
     * @returns {{ valid: boolean; errors: PropertyValidationErrors<T> }} An object containing:
     *   - `valid`: boolean indicating if all properties are valid
     *   - `errors`: object containing validation errors for each invalid property
     */
    validate(properties) {
        const keys = Object.keys(properties);
        const errors = {};
        const onValidate = (prop) => {
            if (!this.properties || !this.properties.includes(prop)) {
                console.trace(`is not a property`, prop);
                return;
            }
            const validated = this.validateProperty(prop, properties[prop]);
            if (!validated.valid) {
                errors[prop] = validated;
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
    set(properties) {
        if (!properties) {
            console.warn('you are trying to set an empty object', this.constructor.name, properties);
            return {
                updated: false,
            };
        }
        // If in transaction, accumulate changes instead of applying immediately
        if (__classPrivateFieldGet(this, _ReactiveModel_inTransaction, "f")) {
            __classPrivateFieldSet(this, _ReactiveModel_pendingChanges, { ...__classPrivateFieldGet(this, _ReactiveModel_pendingChanges, "f"), ...properties }, "f");
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
    async setAsync(properties) {
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
    _setSync(properties) {
        const keys = Object.keys(properties);
        let updated = false;
        const errors = {};
        const onSet = (prop) => {
            if (!__classPrivateFieldGet(this, _ReactiveModel_propertyNames, "f").has(prop)) {
                return;
            }
            const validated = this.validateProperty(prop, properties[prop]);
            this.debug(prop, properties[prop], validated);
            if (!validated.valid) {
                errors[prop] = validated;
            }
            const propertyValue = this.getProperty(prop);
            // Use unified interface check instead of hardcoded type checks
            if (isReactiveValue(propertyValue)) {
                // Use setValue from the interface
                propertyValue.setValue(properties[prop]);
                if (propertyValue.hasUnpublishedChanges())
                    updated = true;
                return;
            }
            const propValue = properties[prop];
            const isObject = typeof propValue === 'object';
            const currentValue = this[prop];
            const isSameObject = isObject && this.isSameObject(propValue, currentValue);
            if (currentValue === propValue || isSameObject) {
                return;
            }
            this.trigger(`${prop}.changed`, { value: propValue, previous: currentValue });
            this[prop] = propValue;
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
    getProperties() {
        const props = {};
        const loop = (property) => {
            let name = property;
            if (typeof property === 'object') {
                const objProp = property;
                name = objProp.name;
                const value = this[name];
                // Use interface check and serialize method
                if (isReactiveValue(value)) {
                    props[name] = value.serialize();
                    return;
                }
            }
            props[name] = this[name];
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
        __classPrivateFieldSet(this, _ReactiveModel_initialValues, this.getProperties(), "f");
        __classPrivateFieldSet(this, _ReactiveModel_isDraft, false, "f");
    }
}
_ReactiveModel_ready = new WeakMap(), _ReactiveModel_debug = new WeakMap(), _ReactiveModel_isDraft = new WeakMap(), _ReactiveModel_propertyNames = new WeakMap(), _ReactiveModel_initialValues = new WeakMap(), _ReactiveModel_inTransaction = new WeakMap(), _ReactiveModel_pendingChanges = new WeakMap(), _ReactiveModel_computedProperties = new WeakMap(), _ReactiveModel_computedCache = new WeakMap();

exports.PluginManager = PluginManager;
exports.ReactiveModel = ReactiveModel;
exports.isReactiveContainer = isReactiveContainer;
exports.isReactiveValue = isReactiveValue;
//# sourceMappingURL=index.cjs.map
