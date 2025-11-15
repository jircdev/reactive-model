import { RegistryFactory } from '@beyond-js/reactive/entities/item';
import { ReactiveModel } from '@beyond-js/reactive/model';

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
class Collection extends ReactiveModel {
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
    get map() {
        return __classPrivateFieldGet(this, _Collection_map, "f");
    }
    get items() {
        return [...__classPrivateFieldGet(this, _Collection_map, "f").values()];
    }
    constructor({ entity, provider, item, defaultLimit = 15, nextParamName = 'next', }) {
        super();
        this.total = 0;
        this.next = null;
        /**
         * Name of the parameter used for pagination cursor (default: "next").
         * Can be configured via the constructor using `nextParamName`.
         */
        _Collection_nextParamName.set(this, 'next');
        _Collection_defaultLimit.set(this, void 0);
        _Collection_entity.set(this, void 0);
        _Collection_provider.set(this, void 0);
        _Collection_item.set(this, void 0);
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
        __classPrivateFieldSet(this, _Collection_registry, RegistryFactory.getInstance(entity), "f");
        __classPrivateFieldGet(this, _Collection_registry, "f").on('record.published', this.onNewRegistry.bind(this));
        __classPrivateFieldGet(this, _Collection_registry, "f").on('record.deleted', this.onRegistryDeleted.bind(this));
        __classPrivateFieldSet(this, _Collection_item, item, "f");
        __classPrivateFieldSet(this, _Collection_defaultLimit, defaultLimit, "f");
        if (nextParamName)
            __classPrivateFieldSet(this, _Collection_nextParamName, nextParamName, "f");
    }
    /**
     * Loads and processes data from an external source via the `DataProvider`.
     * This method uses the configured `provider` to fetch data and apply the specified filters.
     * Filtering parameters are defined in the `args` argument, and the specific filtering logic
     * is implemented by the `DataProvider`.
     *
     * ### Parameters:
     * - `args.where` (optional): Object defining search filters with the following structure:
     *   - `{ property: { operator: value } }`
     *   - Supported operators include:
     *     - `equals`: Exact match with the property value.
     *     - `not`: Value different from the specified value.
     *     - `in`: The property value matches one of the values in the array.
     *     - `notIn`: The property value does not match any of the values in the array.
     *     - `contains`: The property value contains the specified substring.
     *     - `startsWith`: The property value starts with the specified substring.
     *     - `endsWith`: The property value ends with the specified substring.
     *     - `gt` (greater than): The property value is greater than the specified value.
     *     - `gte` (greater than or equal): The property value is greater than or equal to the specified value.
     *     - `lt` (less than): The property value is less than the specified value.
     *     - `lte` (less than or equal): The property value is less than or equal to the specified value.
     *
     * - `args.orderBy` (optional): Object to define the sorting of results. Example:
     *   - `{ property: "asc" | "desc" }` where `"asc"` is ascending order and `"desc"` is descending order.
     *
     * - `args.skip` and `args.take` (optional): Parameters for in-memory pagination.
     *   - `skip`: Number of items to skip from the beginning.
     *   - `take`: Number of items to load after skipping the defined number in `skip`.
     *
     * ### Exceptions:
     * - Throws an error if the `DataProvider` is not defined or does not implement the `load` method.
     * - Throws an error if `DataProvider.load()` does not return an array.
     *
     * @param {Object} args - Object containing filtering and configuration parameters.
     * @returns {Promise<void>} - A promise that resolves when data loading and processing are complete.
     * @throws {Error} - If data cannot be loaded or processed.
     */
    /**
     * Load items from the configured provider.
     * If {@link ILoadSpecs.limit} is omitted, the collection's `defaultLimit`
     * (configured in the constructor) is used.
     *
     * Pagination is handled internally: if the collection has a pagination cursor ("next"),
     * it will be added to the request using the parameter name defined by `nextParamName`.
     * You do not need to pass the `next` parameter manually.
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
            const data = await __classPrivateFieldGet(this, _Collection_provider, "f").list(args);
            let entries;
            const shouldUpdate = !!args.update;
            if (Array.isArray(data)) {
                entries = data;
                this.total = 0;
                this.next = null;
                this.setItems(entries, true);
            }
            else if (data && Array.isArray(data.items)) {
                entries = data.items;
                if (typeof data.total === 'number')
                    this.total = data.total;
                if ('next' in data)
                    this.next = data.next;
                this.setItems(entries, !shouldUpdate);
            }
            else {
                throw new Error('DataProvider.list() must return an array or an object with an "entries" array.');
            }
            this.trigger('load', {
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
    setItems(data, clear = false) {
        if (clear)
            __classPrivateFieldGet(this, _Collection_map, "f").clear();
        if (!data)
            return;
        if (!Array.isArray(data)) {
            // console.trace(data);
            console.warn('Data must be an array');
            return;
        }
        data.forEach(item => {
            if (this.map.has(item.id)) {
                this.map.get(item.id).set(item);
                return;
            }
            const instance = new (__classPrivateFieldGet(this, _Collection_item, "f"))({ parent: this, ...item });
            __classPrivateFieldGet(this, _Collection_map, "f").set(item.id, instance);
        });
    }
    addItems(data) {
        this.setItems(data);
        this.trigger('items.changed', { items: __classPrivateFieldGet(this, _Collection_map, "f") });
        this.trigger('change');
    }
    set(data) {
        super.set(data);
        this.trigger('change');
        return data;
    }
    getProperties() {
        //@ts-ignore;
        return { items: this.items };
    }
    getItemProperties() {
        const items = [];
        for (let item of this.items) {
            items.push(item.getProperties());
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
    async delete(ids) {
        const toDelete = Array.isArray(ids) ? ids : [ids];
        const existingItems = toDelete.map(id => __classPrivateFieldGet(this, _Collection_map, "f").get(id)).filter(Boolean);
        if (__classPrivateFieldGet(this, _Collection_provider, "f") && typeof __classPrivateFieldGet(this, _Collection_provider, "f").deleteMany === 'function') {
            await __classPrivateFieldGet(this, _Collection_provider, "f").deleteMany(toDelete);
        }
        return await Promise.all(existingItems.map(item => item.delete({ skipProvider: true })));
    }
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
        var _a;
        const filters = (_a = __classPrivateFieldGet(this, _Collection_filters, "f")) === null || _a === void 0 ? void 0 : _a.where;
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
}
_Collection_nextParamName = new WeakMap(), _Collection_defaultLimit = new WeakMap(), _Collection_entity = new WeakMap(), _Collection_provider = new WeakMap(), _Collection_item = new WeakMap(), _Collection_map = new WeakMap(), _Collection_filters = new WeakMap(), _Collection_registry = new WeakMap();
Collection.isCollection = true;

export { Collection };
//# sourceMappingURL=index.mjs.map
