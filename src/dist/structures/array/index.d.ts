import { Events } from '@beyond-js/reactive/events';
import { IReactiveContainer } from '@beyond-js/reactive/model';

/**
 * Options for creating a ReactiveArray instance.
 */
interface IReactiveArrayOptions<T> {
    /**
     * Initial items to populate the array with.
     */
    items?: T[];
    /**
     * If true, emits individual '{index}.changed' events.
     * Default: false (can be noisy for large arrays)
     */
    emitIndexEvents?: boolean;
}
/**
 * Event data emitted when items are added.
 */
interface IArrayAddEvent<T> {
    items: T[];
    index: number;
    method: 'push' | 'unshift' | 'splice' | 'set';
}
/**
 * Event data emitted when items are removed.
 */
interface IArrayRemoveEvent<T> {
    items: T[];
    index: number;
    method: 'pop' | 'shift' | 'splice' | 'delete' | 'clear';
}
/**
 * Event data emitted when an item is updated.
 */
interface IArrayUpdateEvent<T> {
    index: number;
    value: T;
    previous: T;
}
/**
 * Event data emitted when the array is reordered.
 */
interface IArrayReorderEvent<T> {
    method: 'sort' | 'reverse';
    items: T[];
}

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
declare class ReactiveArray<T = unknown> extends Events implements IReactiveContainer<T, number> {
    #private;
    readonly isReactive: true;
    readonly isContainer: true;
    /**
     * Creates a new ReactiveArray instance.
     */
    constructor(options?: IReactiveArrayOptions<T>);
    /**
     * Replaces all items in the array.
     */
    setValue(values: T[]): void;
    /**
     * Gets all items as an array.
     */
    getValue(): T[];
    /**
     * Serializes the array for JSON output.
     */
    serialize(): T[];
    /**
     * Checks if the array has changes from its initial state.
     */
    hasUnpublishedChanges(): boolean;
    /**
     * The number of items in the array.
     */
    get size(): number;
    /**
     * Alias for size to match Array.length.
     */
    get length(): number;
    /**
     * Gets an item by index.
     */
    get(index: number): T | undefined;
    /**
     * Sets an item at the specified index.
     * Emits 'update' and 'change' events.
     */
    set(index: number, value: T): void;
    /**
     * Checks if an index exists and has a value.
     */
    has(index: number): boolean;
    /**
     * Deletes an item at the specified index.
     * Shifts remaining items down.
     */
    delete(index: number): boolean;
    /**
     * Removes all items from the array.
     */
    clear(): void;
    /**
     * Returns an iterator over the indices.
     */
    keys(): IterableIterator<number>;
    /**
     * Returns an iterator over the values.
     */
    values(): IterableIterator<T>;
    /**
     * Returns an iterator over [index, value] pairs.
     */
    entries(): IterableIterator<[number, T]>;
    /**
     * Executes a callback for each item.
     */
    forEach(callback: (value: T, index: number) => void): void;
    /**
     * Makes the array iterable with for...of.
     */
    [Symbol.iterator](): IterableIterator<T>;
    /**
     * Sets multiple items at once.
     *
     * @param items - Array of items
     * @param clear - If true, clears existing items first
     */
    setItems(items: T[] | Map<number, T>, clear?: boolean): void;
    /**
     * Adds items to the end of the array.
     * @returns The new length of the array
     */
    push(...items: T[]): number;
    /**
     * Removes the last item from the array.
     * @returns The removed item or undefined
     */
    pop(): T | undefined;
    /**
     * Adds items to the beginning of the array.
     * @returns The new length of the array
     */
    unshift(...items: T[]): number;
    /**
     * Removes the first item from the array.
     * @returns The removed item or undefined
     */
    shift(): T | undefined;
    /**
     * Changes array by removing/replacing/adding elements.
     * @returns Array of removed elements
     */
    splice(start: number, deleteCount?: number, ...items: T[]): T[];
    /**
     * Sorts the array in place.
     * @returns This array
     */
    sort(compareFn?: (a: T, b: T) => number): this;
    /**
     * Reverses the array in place.
     * @returns This array
     */
    reverse(): this;
    /**
     * Returns a filtered copy of the array.
     */
    filter(predicate: (value: T, index: number) => boolean): T[];
    /**
     * Maps items to a new array.
     */
    map<R>(callback: (value: T, index: number) => R): R[];
    /**
     * Finds an item matching the predicate.
     */
    find(predicate: (value: T, index: number) => boolean): T | undefined;
    /**
     * Finds the index of an item matching the predicate.
     */
    findIndex(predicate: (value: T, index: number) => boolean): number;
    /**
     * Checks if some items match the predicate.
     */
    some(predicate: (value: T, index: number) => boolean): boolean;
    /**
     * Checks if all items match the predicate.
     */
    every(predicate: (value: T, index: number) => boolean): boolean;
    /**
     * Reduces the array to a single value.
     */
    reduce<R>(callback: (acc: R, value: T, index: number) => R, initialValue: R): R;
    /**
     * Returns the index of the first occurrence of a value.
     */
    indexOf(value: T, fromIndex?: number): number;
    /**
     * Checks if the array includes a value.
     */
    includes(value: T, fromIndex?: number): boolean;
    /**
     * Returns a slice of the array.
     */
    slice(start?: number, end?: number): T[];
    /**
     * Concatenates arrays.
     */
    concat(...items: (T | T[])[]): T[];
    /**
     * Returns a copy of the internal array.
     */
    toArray(): T[];
    /**
     * Saves current state as the initial state.
     */
    saveChanges(): void;
    /**
     * Reverts to the initial state.
     */
    revert(): void;
}

export { ReactiveArray };
export type { IArrayAddEvent, IArrayRemoveEvent, IArrayReorderEvent, IArrayUpdateEvent, IReactiveArrayOptions };
