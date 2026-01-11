'use strict';

var item = require('@beyond-js/reactive/entities/item');
var model = require('@beyond-js/reactive/model');

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

var _Collection_nextParamName, _Collection_defaultLimit, _Collection_entity, _Collection_provider, _Collection_item, _Collection_map, _Collection_filters, _Collection_registry;
/**
 * Collection class for managing groups of Items.
 * Implements IReactiveContainer for unified reactive value handling.
 *
 * @template T - Item type (must extend Item)
 * @template P - Provider type
 */
/**
 * Collection class for managing groups of Items.
 * Provides IReactiveContainer-like methods but doesn't implement the interface
 * directly due to method signature conflicts with ReactiveModel.set().
 *
 * @template T - Item type (must extend Item)
 * @template P - Provider type
 */
class Collection extends model.ReactiveModel {
    /**
     * @deprecated Use isContainer instead
     */
    get isCollection() {
        return true;
    }
    /**
     * Get the total number of items available (if provided by the provider).
     */
    getTotal() {
        return this.total;
    }
    /**
     * Get the value of next page (if provided by the provider).
     */
    getNext() {
        return this.next;
    }
    get entity() {
        return __classPrivateFieldGet(this, _Collection_entity, "f");
    }
    get provider() {
        return __classPrivateFieldGet(this, _Collection_provider, "f");
    }
    get Item() {
        return __classPrivateFieldGet(this, _Collection_item, "f");
    }
    /**
     * @deprecated Direct map access is deprecated. Use get(id), has(id), or items instead.
     * Will be removed in v4.0
     */
    get map() {
        console.warn('Collection.map is deprecated. Use collection.get(id), collection.has(id), or collection.items instead.');
        return __classPrivateFieldGet(this, _Collection_map, "f");
    }
    /**
     * Returns all items as an array.
     */
    get items() {
        return [...__classPrivateFieldGet(this, _Collection_map, "f").values()];
    }
    /**
     * The number of items in the collection.
     * Required by IReactiveContainer interface.
     */
    get size() {
        return __classPrivateFieldGet(this, _Collection_map, "f").size;
    }
    constructor({ entity, provider, item: item$1, defaultLimit = 15, nextParamName = 'next', }) {
        super();
        this.total = 0;
        this.next = null;
        /**
         * Identifies this as a container type.
         * Required by IReactiveContainer interface.
         */
        this.isContainer = true;
        /**
         * Name of the parameter used for pagination cursor (default: "next").
         * Can be configured via the constructor using `nextParamName`.
         */
        _Collection_nextParamName.set(this, 'next');
        _Collection_defaultLimit.set(this, void 0);
        _Collection_entity.set(this, void 0);
        _Collection_provider.set(this, void 0);
        _Collection_item.set(this, void 0);
        // Internal storage - using Map directly for now, can be swapped to ReactiveMap later
        _Collection_map.set(this, new Map());
        _Collection_filters.set(this, void 0);
        _Collection_registry.set(this, void 0);
        __classPrivateFieldSet(this, _Collection_entity, entity, "f");
        if (provider && typeof provider !== 'function') {
            throw new Error('Provider must be a class/constructor');
        }
        if (provider) {
            __classPrivateFieldSet(this, _Collection_provider, new provider(this), "f");
        }
        __classPrivateFieldSet(this, _Collection_registry, item.RegistryFactory.getInstance(entity), "f");
        __classPrivateFieldGet(this, _Collection_registry, "f").on('record.published', this.onNewRegistry.bind(this));
        __classPrivateFieldGet(this, _Collection_registry, "f").on('record.deleted', this.onRegistryDeleted.bind(this));
        __classPrivateFieldSet(this, _Collection_item, item$1, "f");
        __classPrivateFieldSet(this, _Collection_defaultLimit, defaultLimit, "f");
        if (nextParamName)
            __classPrivateFieldSet(this, _Collection_nextParamName, nextParamName, "f");
    }
    // ==========================================
    // IReactiveContainer Implementation
    // ==========================================
    /**
     * Gets an item by its ID.
     * Required by IReactiveContainer interface.
     *
     * @param id - The item ID to look up
     * @returns The item or undefined if not found
     */
    get(id) {
        return __classPrivateFieldGet(this, _Collection_map, "f").get(id);
    }
    /**
     * Checks if an item exists in the collection.
     * Required by IReactiveContainer interface.
     *
     * @param id - The item ID to check
     */
    has(id) {
        return __classPrivateFieldGet(this, _Collection_map, "f").has(id);
    }
    /**
     * Returns an iterator over the item IDs.
     * Required by IReactiveContainer interface.
     */
    keys() {
        return __classPrivateFieldGet(this, _Collection_map, "f").keys();
    }
    /**
     * Returns an iterator over the items.
     * Required by IReactiveContainer interface.
     */
    values() {
        return __classPrivateFieldGet(this, _Collection_map, "f").values();
    }
    /**
     * Returns an iterator over [id, item] pairs.
     * Required by IReactiveContainer interface.
     */
    entries() {
        return __classPrivateFieldGet(this, _Collection_map, "f").entries();
    }
    /**
     * Executes a callback for each item.
     * Required by IReactiveContainer interface.
     */
    forEach(callback) {
        __classPrivateFieldGet(this, _Collection_map, "f").forEach((value, key) => callback(value, key));
    }
    /**
     * Clears all items from the collection.
     * Required by IReactiveContainer interface.
     */
    clear() {
        if (__classPrivateFieldGet(this, _Collection_map, "f").size === 0)
            return;
        __classPrivateFieldGet(this, _Collection_map, "f").clear();
        this.trigger('clear');
        this.trigger('items.changed');
        this.trigger('change');
    }
    /**
     * Deletes an item by ID.
     * This is the synchronous version required by IReactiveContainer.
     * For async deletion with provider, use deleteAsync().
     *
     * @param id - The item ID to delete
     * @returns true if the item existed and was deleted
     */
    delete(id) {
        if (!__classPrivateFieldGet(this, _Collection_map, "f").has(id))
            return false;
        __classPrivateFieldGet(this, _Collection_map, "f").delete(id);
        this.trigger('items.changed');
        this.trigger('change');
        return true;
    }
    // ==========================================
    // IReactiveValue Implementation (inherited + overrides)
    // ==========================================
    /**
     * Sets the collection items from an array.
     * Replaces existing items.
     * @override
     */
    setValue(values) {
        if (Array.isArray(values)) {
            this.setItems(values, true);
        }
    }
    /**
     * Gets all items as an array.
     * @override
     */
    getValue() {
        return this.items;
    }
    /**
     * Serializes all items for JSON output.
     * Returns an array of serialized item properties.
     * @override
     */
    serialize() {
        return this.getItemProperties();
    }
    /**
     * Collections don't track unpublished changes in the same way as Items.
     * Checks if any item has unpublished changes.
     */
    hasUnpublishedChanges() {
        for (const item of __classPrivateFieldGet(this, _Collection_map, "f").values()) {
            if (item.hasUnpublishedChanges())
                return true;
        }
        return false;
    }
    // ==========================================
    // LIFECYCLE HOOKS - Override in subclasses
    // ==========================================
    /**
     * Lifecycle hook called before load() executes.
     * Override to modify load arguments or perform pre-load actions.
     *
     * @param args - Arguments to be passed to provider.list()
     * @returns Modified arguments or original args
     */
    async beforeLoad(args) {
        return args;
    }
    /**
     * Lifecycle hook called after load() completes successfully.
     * Override to transform loaded items or perform post-load actions.
     *
     * @param items - Items returned from provider.list()
     * @returns Modified items array or original items
     */
    async afterLoad(items) {
        return items;
    }
    /**
     * Load items from the configured provider.
     * If {@link ILoadSpecs.limit} is omitted, the collection's `defaultLimit`
     * (configured in the constructor) is used.
     *
     * Pagination is handled internally: if the collection has a pagination cursor ("next"),
     * it will be added to the request using the parameter name defined by `nextParamName`.
     * You do not need to pass the `next` parameter manually.
     *
     * Executes lifecycle hooks: beforeLoad -> load -> afterLoad
     * Runs plugins: onBeforeList -> onAfterList
     * Emits events: pre:load -> load -> post:load
     */
    async load(args = {}) {
        var _a;
        // Ensure pagination defaults
        if (typeof args.limit !== 'number')
            args.limit = __classPrivateFieldGet(this, _Collection_defaultLimit, "f");
        if (this.next)
            args[__classPrivateFieldGet(this, _Collection_nextParamName, "f")] = this.next;
        __classPrivateFieldSet(this, _Collection_filters, (_a = args.where) !== null && _a !== void 0 ? _a : {}, "f");
        this.fetching = true;
        if (!__classPrivateFieldGet(this, _Collection_provider, "f") || typeof __classPrivateFieldGet(this, _Collection_provider, "f").list !== 'function') {
            throw new Error('DataProvider is not defined or does not implement the list() method.');
        }
        try {
            // 1. Execute beforeLoad hook (class method)
            let loadArgs = await this.beforeLoad(args);
            // 2. Execute plugins beforeList
            const pluginResult = await model.PluginManager.runHook('onBeforeList', this, loadArgs, __classPrivateFieldGet(this, _Collection_entity, "f"));
            loadArgs = pluginResult.value;
            // 3. Emit pre:load event
            this.trigger('pre:load', loadArgs);
            // 4. Execute provider list
            const data = await __classPrivateFieldGet(this, _Collection_provider, "f").list(loadArgs);
            let entries;
            const shouldUpdate = !!loadArgs.update;
            if (Array.isArray(data)) {
                entries = data;
                this.total = 0;
                this.next = null;
            }
            else if (data && Array.isArray(data.items)) {
                entries = data.items;
                if (typeof data.total === 'number')
                    this.total = data.total;
                if ('next' in data)
                    this.next = data.next;
            }
            else {
                throw new Error('DataProvider.list() must return an array or an object with an "items" array.');
            }
            // 5. Execute afterLoad hook (class method)
            entries = await this.afterLoad(entries);
            // 6. Execute plugins afterList
            const afterPluginResult = await model.PluginManager.runHook('onAfterList', this, entries, __classPrivateFieldGet(this, _Collection_entity, "f"));
            entries = afterPluginResult.value;
            // 7. Set items
            this.setItems(entries, !shouldUpdate);
            // 8. Emit load and post:load events
            this.trigger('load', {
                items: entries,
                total: this.total,
                next: this.next,
            });
            this.trigger('post:load', {
                items: entries,
                total: this.total,
                next: this.next,
            });
            return entries;
        }
        catch (error) {
            throw error;
        }
        finally {
            this.fetching = false;
        }
    }
    /**
     * Sets multiple items at once.
     * Required by IReactiveContainer interface.
     *
     * @param data - Array of items or Map of id->item
     * @param clear - If true, clears existing items first
     */
    setItems(data, clear = false) {
        if (clear)
            __classPrivateFieldGet(this, _Collection_map, "f").clear();
        if (!data)
            return;
        if (data instanceof Map) {
            for (const [id, item] of data) {
                __classPrivateFieldGet(this, _Collection_map, "f").set(id, item);
            }
        }
        else if (Array.isArray(data)) {
            data.forEach(item => {
                const itemData = item;
                const id = itemData.id;
                if (__classPrivateFieldGet(this, _Collection_map, "f").has(id)) {
                    // Update existing item
                    const existingItem = __classPrivateFieldGet(this, _Collection_map, "f").get(id);
                    existingItem.setValue(itemData);
                    return;
                }
                // Create new item instance
                const instance = new (__classPrivateFieldGet(this, _Collection_item, "f"))({ parent: this, ...itemData });
                __classPrivateFieldGet(this, _Collection_map, "f").set(id, instance);
            });
        }
        else {
            console.warn('Collection.setItems: Data must be an array or Map');
            return;
        }
        this.trigger('items.changed', { items: this.items });
        this.trigger('change');
    }
    /**
     * Adds items without clearing existing ones.
     *
     * @param data - Array of items to add
     */
    addItems(data) {
        this.setItems(data, false);
    }
    /**
     * Sets properties on the collection.
     * Overrides parent to ensure change event is triggered.
     */
    set(data) {
        const result = super.set(data);
        this.trigger('change');
        return result;
    }
    /**
     * Gets properties of the collection.
     */
    getProperties() {
        return { items: this.items };
    }
    /**
     * Gets serialized properties of all items.
     * Useful for saving to backend or JSON export.
     */
    getItemProperties() {
        const items = [];
        for (const item of this.items) {
            items.push(item.serialize());
        }
        return items;
    }
    /**
     * Validates a new registry against the collection's filters and, if it matches,
     * creates a new item with the registry data and adds it to the data map.
     *
     * @param {object} registry - The new registry data to be checked and potentially added.
     */
    onNewRegistry(registry) {
        // Check if the registry matches the filters
        if (this.matchesFilters(registry)) {
            // Create a new item instance with the registry data
            const newItem = new (__classPrivateFieldGet(this, _Collection_item, "f"))(registry);
            // Add the new item to the map, using its id as the key
            __classPrivateFieldGet(this, _Collection_map, "f").set(registry.id, newItem);
            // Optionally trigger an event to notify that a new item was added
            this.trigger('items.changed', { item: newItem });
            this.trigger('change');
        }
    }
    /**
     * Deletes multiple items by ID, calling the provider if available.
     *
     * @param ids - Single ID or array of IDs to delete
     * @returns Array of booleans indicating success for each item
     */
    async deleteAsync(ids) {
        const toDelete = Array.isArray(ids) ? ids : [ids];
        const existingItems = toDelete.map(id => __classPrivateFieldGet(this, _Collection_map, "f").get(id)).filter(Boolean);
        if (__classPrivateFieldGet(this, _Collection_provider, "f") && typeof __classPrivateFieldGet(this, _Collection_provider, "f").deleteMany === 'function') {
            await __classPrivateFieldGet(this, _Collection_provider, "f").deleteMany(toDelete);
        }
        return await Promise.all(existingItems.map(item => item.delete({ skipProvider: true })));
    }
    /**
     * Handles registry deletion events.
     */
    onRegistryDeleted(registry) {
        if (!__classPrivateFieldGet(this, _Collection_map, "f").has(registry.id))
            return;
        __classPrivateFieldGet(this, _Collection_map, "f").delete(registry.id);
        this.trigger('change');
        this.trigger('items.changed');
    }
    /**
     * Validates if a registry matches the stored filters, including support for AND and OR logical operators.
     * The #filters object contains filtering criteria that are evaluated here.
     *
     * @param {object} registry - The data of the registry to be checked.
     * @returns {boolean} - Returns true if the registry matches all filter criteria; otherwise, false.
     */
    matchesFilters(registry) {
        const filters = __classPrivateFieldGet(this, _Collection_filters, "f");
        if (!filters)
            return true; // If no filters are set, assume it matches
        // Helper function to evaluate a single condition
        const evaluateCondition = (property, criteria) => {
            const registryValue = registry[property];
            return Object.entries(criteria).every(([operator, value]) => {
                switch (operator) {
                    case 'equals':
                        return registryValue === value;
                    case 'not':
                        return registryValue !== value;
                    case 'in':
                        return Array.isArray(value) && value.includes(registryValue);
                    case 'notIn':
                        return !Array.isArray(value) || !value.includes(registryValue);
                    case 'contains':
                        return typeof registryValue === 'string' && registryValue.includes(value);
                    case 'startsWith':
                        return typeof registryValue === 'string' && registryValue.startsWith(value);
                    case 'endsWith':
                        return typeof registryValue === 'string' && registryValue.endsWith(value);
                    case 'gt':
                        return registryValue > value;
                    case 'gte':
                        return registryValue >= value;
                    case 'lt':
                        return registryValue < value;
                    case 'lte':
                        return registryValue <= value;
                    default:
                        console.warn(`Unknown filter operator: ${operator}`);
                        return false;
                }
            });
        };
        // General function to evaluate conditions with logical operators
        const evaluateConditions = (conditions, logic) => conditions[logic](condition => Object.entries(condition).every(([property, criteria]) => evaluateCondition(property, criteria)));
        // Evaluate AND conditions
        if (filters.AND && !evaluateConditions(filters.AND, 'every'))
            return false;
        // Evaluate OR conditions
        if (filters.OR && !evaluateConditions(filters.OR, 'some'))
            return false;
        // Evaluate direct conditions (outside of AND/OR)
        return Object.entries(filters)
            .filter(([key]) => key !== 'AND' && key !== 'OR')
            .every(([property, criteria]) => evaluateCondition(property, criteria));
    }
    // ==========================================
    // Utility Methods
    // ==========================================
    /**
     * Finds an item matching the predicate.
     */
    find(predicate) {
        for (const item of __classPrivateFieldGet(this, _Collection_map, "f").values()) {
            if (predicate(item))
                return item;
        }
        return undefined;
    }
    /**
     * Filters items matching the predicate.
     */
    filter(predicate) {
        return this.items.filter(predicate);
    }
    /**
     * Maps items to a new array.
     */
    mapItems(callback) {
        return this.items.map(callback);
    }
    /**
     * Checks if some items match the predicate.
     */
    some(predicate) {
        return this.items.some(predicate);
    }
    /**
     * Checks if all items match the predicate.
     */
    every(predicate) {
        return this.items.every(predicate);
    }
}
_Collection_nextParamName = new WeakMap(), _Collection_defaultLimit = new WeakMap(), _Collection_entity = new WeakMap(), _Collection_provider = new WeakMap(), _Collection_item = new WeakMap(), _Collection_map = new WeakMap(), _Collection_filters = new WeakMap(), _Collection_registry = new WeakMap();
/**
 * Static property for class-level type checking.
 * @deprecated Use isContainer instance property instead
 */
Collection.isContainer = true;
/**
 * @deprecated Use isContainer instead
 */
Collection.isCollection = true;

exports.Collection = Collection;
//# sourceMappingURL=index.cjs.map
