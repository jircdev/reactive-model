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

var _ReactiveArray_items, _ReactiveArray_emitIndexEvents, _ReactiveArray_initialItems;
/**
 * A reactive Array implementation that emits events on changes.
 * Implements IReactiveContainer for compatibility with ReactiveModel.
 *
 * @template T - Item type
 *
 * @example
 * ```typescript
 * const arr = new ReactiveArray<string>({ items: ['a', 'b', 'c'] });
 *
 * arr.on('change', () => console.log('Array changed'));
 * arr.on('add', ({ items }) => console.log('Added:', items));
 *
 * arr.push('d');
 * arr.set(0, 'A');
 * ```
 */
class ReactiveArray extends Events {
    /**
     * Creates a new ReactiveArray instance.
     */
    constructor(options = {}) {
        var _a;
        super();
        this.isReactive = true;
        this.isContainer = true;
        _ReactiveArray_items.set(this, []);
        _ReactiveArray_emitIndexEvents.set(this, void 0);
        _ReactiveArray_initialItems.set(this, []);
        __classPrivateFieldSet(this, _ReactiveArray_emitIndexEvents, (_a = options.emitIndexEvents) !== null && _a !== void 0 ? _a : false, "f");
        if (options.items) {
            __classPrivateFieldSet(this, _ReactiveArray_items, [...options.items], "f");
            __classPrivateFieldSet(this, _ReactiveArray_initialItems, [...options.items], "f");
        }
    }
    // ==========================================
    // IReactiveValue Implementation
    // ==========================================
    /**
     * Replaces all items in the array.
     */
    setValue(values) {
        this.setItems(values, true);
    }
    /**
     * Gets all items as an array.
     */
    getValue() {
        return [...__classPrivateFieldGet(this, _ReactiveArray_items, "f")];
    }
    /**
     * Serializes the array for JSON output.
     */
    serialize() {
        return this.getValue();
    }
    /**
     * Checks if the array has changes from its initial state.
     */
    hasUnpublishedChanges() {
        if (__classPrivateFieldGet(this, _ReactiveArray_items, "f").length !== __classPrivateFieldGet(this, _ReactiveArray_initialItems, "f").length)
            return true;
        return JSON.stringify(__classPrivateFieldGet(this, _ReactiveArray_items, "f")) !== JSON.stringify(__classPrivateFieldGet(this, _ReactiveArray_initialItems, "f"));
    }
    // ==========================================
    // IReactiveContainer Implementation
    // ==========================================
    /**
     * The number of items in the array.
     */
    get size() {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").length;
    }
    /**
     * Alias for size to match Array.length.
     */
    get length() {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").length;
    }
    /**
     * Gets an item by index.
     */
    get(index) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f")[index];
    }
    /**
     * Sets an item at the specified index.
     * Emits 'update' and 'change' events.
     */
    set(index, value) {
        if (index < 0 || index >= __classPrivateFieldGet(this, _ReactiveArray_items, "f").length) {
            // Extend array if needed
            while (__classPrivateFieldGet(this, _ReactiveArray_items, "f").length <= index) {
                __classPrivateFieldGet(this, _ReactiveArray_items, "f").push(undefined);
            }
        }
        const previous = __classPrivateFieldGet(this, _ReactiveArray_items, "f")[index];
        __classPrivateFieldGet(this, _ReactiveArray_items, "f")[index] = value;
        if (previous !== undefined) {
            const eventData = { index, value, previous };
            this.trigger('update', eventData);
        }
        else {
            const eventData = { items: [value], index, method: 'set' };
            this.trigger('add', eventData);
        }
        if (__classPrivateFieldGet(this, _ReactiveArray_emitIndexEvents, "f")) {
            this.trigger(`${index}.changed`, { value, previous });
        }
        this.trigger('change');
    }
    /**
     * Checks if an index exists and has a value.
     */
    has(index) {
        return index >= 0 && index < __classPrivateFieldGet(this, _ReactiveArray_items, "f").length;
    }
    /**
     * Deletes an item at the specified index.
     * Shifts remaining items down.
     */
    delete(index) {
        if (!this.has(index))
            return false;
        const [removed] = __classPrivateFieldGet(this, _ReactiveArray_items, "f").splice(index, 1);
        const eventData = { items: [removed], index, method: 'delete' };
        this.trigger('remove', eventData);
        this.trigger('change');
        return true;
    }
    /**
     * Removes all items from the array.
     */
    clear() {
        if (__classPrivateFieldGet(this, _ReactiveArray_items, "f").length === 0)
            return;
        const previousItems = [...__classPrivateFieldGet(this, _ReactiveArray_items, "f")];
        __classPrivateFieldSet(this, _ReactiveArray_items, [], "f");
        const eventData = { items: previousItems, index: 0, method: 'clear' };
        this.trigger('remove', eventData);
        this.trigger('clear');
        this.trigger('change');
    }
    // ==========================================
    // Iteration Methods
    // ==========================================
    /**
     * Returns an iterator over the indices.
     */
    keys() {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").keys();
    }
    /**
     * Returns an iterator over the values.
     */
    values() {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").values();
    }
    /**
     * Returns an iterator over [index, value] pairs.
     */
    entries() {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").entries();
    }
    /**
     * Executes a callback for each item.
     */
    forEach(callback) {
        __classPrivateFieldGet(this, _ReactiveArray_items, "f").forEach(callback);
    }
    /**
     * Makes the array iterable with for...of.
     */
    [(_ReactiveArray_items = new WeakMap(), _ReactiveArray_emitIndexEvents = new WeakMap(), _ReactiveArray_initialItems = new WeakMap(), Symbol.iterator)]() {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f")[Symbol.iterator]();
    }
    // ==========================================
    // Batch Operations
    // ==========================================
    /**
     * Sets multiple items at once.
     *
     * @param items - Array of items
     * @param clear - If true, clears existing items first
     */
    setItems(items, clear = false) {
        if (clear) {
            __classPrivateFieldSet(this, _ReactiveArray_items, [], "f");
        }
        if (items instanceof Map) {
            for (const [index, value] of items) {
                __classPrivateFieldGet(this, _ReactiveArray_items, "f")[index] = value;
            }
        }
        else if (Array.isArray(items)) {
            if (clear) {
                __classPrivateFieldSet(this, _ReactiveArray_items, [...items], "f");
            }
            else {
                __classPrivateFieldGet(this, _ReactiveArray_items, "f").push(...items);
            }
        }
        this.trigger('items.changed', { items: __classPrivateFieldGet(this, _ReactiveArray_items, "f") });
        this.trigger('change');
    }
    // ==========================================
    // Array-like Methods (Reactive)
    // ==========================================
    /**
     * Adds items to the end of the array.
     * @returns The new length of the array
     */
    push(...items) {
        const index = __classPrivateFieldGet(this, _ReactiveArray_items, "f").length;
        __classPrivateFieldGet(this, _ReactiveArray_items, "f").push(...items);
        const eventData = { items, index, method: 'push' };
        this.trigger('add', eventData);
        this.trigger('change');
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").length;
    }
    /**
     * Removes the last item from the array.
     * @returns The removed item or undefined
     */
    pop() {
        if (__classPrivateFieldGet(this, _ReactiveArray_items, "f").length === 0)
            return undefined;
        const item = __classPrivateFieldGet(this, _ReactiveArray_items, "f").pop();
        const index = __classPrivateFieldGet(this, _ReactiveArray_items, "f").length;
        const eventData = { items: [item], index, method: 'pop' };
        this.trigger('remove', eventData);
        this.trigger('change');
        return item;
    }
    /**
     * Adds items to the beginning of the array.
     * @returns The new length of the array
     */
    unshift(...items) {
        __classPrivateFieldGet(this, _ReactiveArray_items, "f").unshift(...items);
        const eventData = { items, index: 0, method: 'unshift' };
        this.trigger('add', eventData);
        this.trigger('change');
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").length;
    }
    /**
     * Removes the first item from the array.
     * @returns The removed item or undefined
     */
    shift() {
        if (__classPrivateFieldGet(this, _ReactiveArray_items, "f").length === 0)
            return undefined;
        const item = __classPrivateFieldGet(this, _ReactiveArray_items, "f").shift();
        const eventData = { items: [item], index: 0, method: 'shift' };
        this.trigger('remove', eventData);
        this.trigger('change');
        return item;
    }
    /**
     * Changes array by removing/replacing/adding elements.
     * @returns Array of removed elements
     */
    splice(start, deleteCount, ...items) {
        const removed = __classPrivateFieldGet(this, _ReactiveArray_items, "f").splice(start, deleteCount !== null && deleteCount !== void 0 ? deleteCount : 0, ...items);
        if (removed.length > 0) {
            const removeEvent = { items: removed, index: start, method: 'splice' };
            this.trigger('remove', removeEvent);
        }
        if (items.length > 0) {
            const addEvent = { items, index: start, method: 'splice' };
            this.trigger('add', addEvent);
        }
        if (removed.length > 0 || items.length > 0) {
            this.trigger('change');
        }
        return removed;
    }
    /**
     * Sorts the array in place.
     * @returns This array
     */
    sort(compareFn) {
        __classPrivateFieldGet(this, _ReactiveArray_items, "f").sort(compareFn);
        const eventData = { method: 'sort', items: __classPrivateFieldGet(this, _ReactiveArray_items, "f") };
        this.trigger('reorder', eventData);
        this.trigger('change');
        return this;
    }
    /**
     * Reverses the array in place.
     * @returns This array
     */
    reverse() {
        __classPrivateFieldGet(this, _ReactiveArray_items, "f").reverse();
        const eventData = { method: 'reverse', items: __classPrivateFieldGet(this, _ReactiveArray_items, "f") };
        this.trigger('reorder', eventData);
        this.trigger('change');
        return this;
    }
    // ==========================================
    // Non-mutating Methods (return new arrays)
    // ==========================================
    /**
     * Returns a filtered copy of the array.
     */
    filter(predicate) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").filter(predicate);
    }
    /**
     * Maps items to a new array.
     */
    map(callback) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").map(callback);
    }
    /**
     * Finds an item matching the predicate.
     */
    find(predicate) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").find(predicate);
    }
    /**
     * Finds the index of an item matching the predicate.
     */
    findIndex(predicate) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").findIndex(predicate);
    }
    /**
     * Checks if some items match the predicate.
     */
    some(predicate) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").some(predicate);
    }
    /**
     * Checks if all items match the predicate.
     */
    every(predicate) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").every(predicate);
    }
    /**
     * Reduces the array to a single value.
     */
    reduce(callback, initialValue) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").reduce(callback, initialValue);
    }
    /**
     * Returns the index of the first occurrence of a value.
     */
    indexOf(value, fromIndex) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").indexOf(value, fromIndex);
    }
    /**
     * Checks if the array includes a value.
     */
    includes(value, fromIndex) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").includes(value, fromIndex);
    }
    /**
     * Returns a slice of the array.
     */
    slice(start, end) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").slice(start, end);
    }
    /**
     * Concatenates arrays.
     */
    concat(...items) {
        return __classPrivateFieldGet(this, _ReactiveArray_items, "f").concat(...items);
    }
    // ==========================================
    // Utility Methods
    // ==========================================
    /**
     * Returns a copy of the internal array.
     */
    toArray() {
        return [...__classPrivateFieldGet(this, _ReactiveArray_items, "f")];
    }
    /**
     * Saves current state as the initial state.
     */
    saveChanges() {
        __classPrivateFieldSet(this, _ReactiveArray_initialItems, [...__classPrivateFieldGet(this, _ReactiveArray_items, "f")], "f");
    }
    /**
     * Reverts to the initial state.
     */
    revert() {
        __classPrivateFieldSet(this, _ReactiveArray_items, [...__classPrivateFieldGet(this, _ReactiveArray_initialItems, "f")], "f");
        this.trigger('revert');
        this.trigger('change');
    }
}

export { ReactiveArray };
//# sourceMappingURL=index.mjs.map
