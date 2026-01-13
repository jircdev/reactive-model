import { Events } from 'reactive/events';

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

var _ReactiveMap_map, _ReactiveMap_keyExtractor, _ReactiveMap_emitKeyEvents, _ReactiveMap_initialEntries;
/**
 * A reactive Map implementation that emits events on changes.
 * Implements IReactiveContainer for compatibility with ReactiveModel.
 *
 * @template K - Key type
 * @template V - Value type
 *
 * @example
 * ```typescript
 * const map = new ReactiveMap<string, User>();
 *
 * map.on('change', () => console.log('Map changed'));
 * map.on('set', ({ key, value }) => console.log(`Set ${key}:`, value));
 *
 * map.set('user1', { id: 'user1', name: 'John' });
 * ```
 */
class ReactiveMap extends Events {
    /**
     * Creates a new ReactiveMap instance.
     */
    constructor(options = {}) {
        var _a;
        super();
        this.isReactive = true;
        this.isContainer = true;
        _ReactiveMap_map.set(this, new Map());
        _ReactiveMap_keyExtractor.set(this, void 0);
        _ReactiveMap_emitKeyEvents.set(this, void 0);
        _ReactiveMap_initialEntries.set(this, new Map());
        __classPrivateFieldSet(this, _ReactiveMap_keyExtractor, options.keyExtractor, "f");
        __classPrivateFieldSet(this, _ReactiveMap_emitKeyEvents, (_a = options.emitKeyEvents) !== null && _a !== void 0 ? _a : true, "f");
        if (options.entries) {
            for (const [key, value] of options.entries) {
                __classPrivateFieldGet(this, _ReactiveMap_map, "f").set(key, value);
                __classPrivateFieldGet(this, _ReactiveMap_initialEntries, "f").set(key, value);
            }
        }
    }
    // ==========================================
    // IReactiveValue Implementation
    // ==========================================
    /**
     * Sets the entire map content.
     * @param values - Array of values (requires keyExtractor) or will be ignored
     */
    setValue(values) {
        if (!Array.isArray(values))
            return;
        this.setItems(values, true);
    }
    /**
     * Gets all values as an array.
     */
    getValue() {
        return [...__classPrivateFieldGet(this, _ReactiveMap_map, "f").values()];
    }
    /**
     * Serializes the map to an array of values.
     */
    serialize() {
        return this.getValue();
    }
    /**
     * Checks if the map has changes from its initial state.
     */
    hasUnpublishedChanges() {
        if (__classPrivateFieldGet(this, _ReactiveMap_map, "f").size !== __classPrivateFieldGet(this, _ReactiveMap_initialEntries, "f").size)
            return true;
        for (const [key, value] of __classPrivateFieldGet(this, _ReactiveMap_map, "f")) {
            if (!__classPrivateFieldGet(this, _ReactiveMap_initialEntries, "f").has(key))
                return true;
            const initial = __classPrivateFieldGet(this, _ReactiveMap_initialEntries, "f").get(key);
            if (JSON.stringify(value) !== JSON.stringify(initial))
                return true;
        }
        return false;
    }
    // ==========================================
    // IReactiveContainer Implementation
    // ==========================================
    /**
     * The number of items in the map.
     */
    get size() {
        return __classPrivateFieldGet(this, _ReactiveMap_map, "f").size;
    }
    /**
     * Gets a value by key.
     */
    get(key) {
        return __classPrivateFieldGet(this, _ReactiveMap_map, "f").get(key);
    }
    /**
     * Sets a value at the specified key.
     * Emits 'set' and 'change' events.
     */
    set(key, value) {
        const previous = __classPrivateFieldGet(this, _ReactiveMap_map, "f").get(key);
        const isNew = !__classPrivateFieldGet(this, _ReactiveMap_map, "f").has(key);
        __classPrivateFieldGet(this, _ReactiveMap_map, "f").set(key, value);
        const eventData = { key, value, previous, isNew };
        this.trigger('set', eventData);
        if (__classPrivateFieldGet(this, _ReactiveMap_emitKeyEvents, "f")) {
            this.trigger(`${String(key)}.changed`, { value, previous });
        }
        this.trigger('change');
    }
    /**
     * Checks if a key exists.
     */
    has(key) {
        return __classPrivateFieldGet(this, _ReactiveMap_map, "f").has(key);
    }
    /**
     * Deletes a value by key.
     * @returns true if the item existed and was deleted
     */
    delete(key) {
        if (!__classPrivateFieldGet(this, _ReactiveMap_map, "f").has(key))
            return false;
        const value = __classPrivateFieldGet(this, _ReactiveMap_map, "f").get(key);
        __classPrivateFieldGet(this, _ReactiveMap_map, "f").delete(key);
        const eventData = { key, value };
        this.trigger('delete', eventData);
        if (__classPrivateFieldGet(this, _ReactiveMap_emitKeyEvents, "f")) {
            this.trigger(`${String(key)}.deleted`);
        }
        this.trigger('change');
        return true;
    }
    /**
     * Removes all items from the map.
     */
    clear() {
        if (__classPrivateFieldGet(this, _ReactiveMap_map, "f").size === 0)
            return;
        const previousSize = __classPrivateFieldGet(this, _ReactiveMap_map, "f").size;
        const previousEntries = [...__classPrivateFieldGet(this, _ReactiveMap_map, "f").entries()];
        __classPrivateFieldGet(this, _ReactiveMap_map, "f").clear();
        const eventData = { previousSize, previousEntries };
        this.trigger('clear', eventData);
        this.trigger('change');
    }
    // ==========================================
    // Iteration Methods
    // ==========================================
    /**
     * Returns an iterator over the keys.
     */
    keys() {
        return __classPrivateFieldGet(this, _ReactiveMap_map, "f").keys();
    }
    /**
     * Returns an iterator over the values.
     */
    values() {
        return __classPrivateFieldGet(this, _ReactiveMap_map, "f").values();
    }
    /**
     * Returns an iterator over [key, value] pairs.
     */
    entries() {
        return __classPrivateFieldGet(this, _ReactiveMap_map, "f").entries();
    }
    /**
     * Executes a callback for each item.
     */
    forEach(callback) {
        __classPrivateFieldGet(this, _ReactiveMap_map, "f").forEach((value, key) => callback(value, key));
    }
    /**
     * Makes the map iterable with for...of.
     */
    [(_ReactiveMap_map = new WeakMap(), _ReactiveMap_keyExtractor = new WeakMap(), _ReactiveMap_emitKeyEvents = new WeakMap(), _ReactiveMap_initialEntries = new WeakMap(), Symbol.iterator)]() {
        return __classPrivateFieldGet(this, _ReactiveMap_map, "f")[Symbol.iterator]();
    }
    // ==========================================
    // Batch Operations
    // ==========================================
    /**
     * Sets multiple items at once.
     * More efficient than individual sets as it emits only one 'change' event.
     *
     * @param items - Array of values (requires keyExtractor) or Map
     * @param clear - If true, clears existing items first
     */
    setItems(items, clear = false) {
        if (clear) {
            __classPrivateFieldGet(this, _ReactiveMap_map, "f").clear();
        }
        if (items instanceof Map) {
            for (const [key, value] of items) {
                __classPrivateFieldGet(this, _ReactiveMap_map, "f").set(key, value);
            }
        }
        else if (Array.isArray(items)) {
            if (!__classPrivateFieldGet(this, _ReactiveMap_keyExtractor, "f")) {
                console.warn('ReactiveMap: keyExtractor required when setting items from array');
                return;
            }
            for (const value of items) {
                const key = __classPrivateFieldGet(this, _ReactiveMap_keyExtractor, "f").call(this, value);
                __classPrivateFieldGet(this, _ReactiveMap_map, "f").set(key, value);
            }
        }
        this.trigger('items.changed', { items: this.getValue() });
        this.trigger('change');
    }
    // ==========================================
    // Utility Methods
    // ==========================================
    /**
     * Returns all values as an array.
     * Alias for getValue() for convenience.
     */
    toArray() {
        return this.getValue();
    }
    /**
     * Returns the underlying Map.
     * Use with caution - direct modifications won't trigger events.
     */
    toMap() {
        return new Map(__classPrivateFieldGet(this, _ReactiveMap_map, "f"));
    }
    /**
     * Finds a value matching the predicate.
     */
    find(predicate) {
        for (const [key, value] of __classPrivateFieldGet(this, _ReactiveMap_map, "f")) {
            if (predicate(value, key))
                return value;
        }
        return undefined;
    }
    /**
     * Filters values matching the predicate.
     */
    filter(predicate) {
        const results = [];
        for (const [key, value] of __classPrivateFieldGet(this, _ReactiveMap_map, "f")) {
            if (predicate(value, key))
                results.push(value);
        }
        return results;
    }
    /**
     * Maps values to a new array.
     */
    map(callback) {
        const results = [];
        for (const [key, value] of __classPrivateFieldGet(this, _ReactiveMap_map, "f")) {
            results.push(callback(value, key));
        }
        return results;
    }
    /**
     * Saves current state as the initial state.
     * After calling this, hasUnpublishedChanges() will return false.
     */
    saveChanges() {
        __classPrivateFieldSet(this, _ReactiveMap_initialEntries, new Map(__classPrivateFieldGet(this, _ReactiveMap_map, "f")), "f");
    }
    /**
     * Reverts to the initial state.
     */
    revert() {
        __classPrivateFieldSet(this, _ReactiveMap_map, new Map(__classPrivateFieldGet(this, _ReactiveMap_initialEntries, "f")), "f");
        this.trigger('revert');
        this.trigger('change');
    }
}

export { ReactiveMap };
//# sourceMappingURL=index.mjs.map
