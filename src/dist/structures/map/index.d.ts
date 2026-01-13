import { Events } from 'reactive/events';
import { IReactiveContainer } from 'reactive/model';

/**
 * Options for creating a ReactiveMap instance.
 */
interface IReactiveMapOptions<K, V> {
    /**
     * Initial entries to populate the map with.
     */
    entries?: Iterable<[K, V]>;
    /**
     * Optional function to extract a key from a value.
     * Useful when working with objects that have an 'id' field.
     */
    keyExtractor?: (value: V) => K;
    /**
     * If true, emits individual '{key}.changed' events.
     * Default: true
     */
    emitKeyEvents?: boolean;
}
/**
 * Event data emitted when an item is set.
 */
interface IMapSetEvent<K, V> {
    key: K;
    value: V;
    previous?: V;
    isNew: boolean;
}
/**
 * Event data emitted when an item is deleted.
 */
interface IMapDeleteEvent<K, V> {
    key: K;
    value: V;
}
/**
 * Event data emitted when the map is cleared.
 */
interface IMapClearEvent<K, V> {
    previousSize: number;
    previousEntries: [K, V][];
}

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
declare class ReactiveMap<K = string, V = unknown> extends Events implements IReactiveContainer<V, K> {
    #private;
    readonly isReactive: true;
    readonly isContainer: true;
    /**
     * Creates a new ReactiveMap instance.
     */
    constructor(options?: IReactiveMapOptions<K, V>);
    /**
     * Sets the entire map content.
     * @param values - Array of values (requires keyExtractor) or will be ignored
     */
    setValue(values: V[]): void;
    /**
     * Gets all values as an array.
     */
    getValue(): V[];
    /**
     * Serializes the map to an array of values.
     */
    serialize(): V[];
    /**
     * Checks if the map has changes from its initial state.
     */
    hasUnpublishedChanges(): boolean;
    /**
     * The number of items in the map.
     */
    get size(): number;
    /**
     * Gets a value by key.
     */
    get(key: K): V | undefined;
    /**
     * Sets a value at the specified key.
     * Emits 'set' and 'change' events.
     */
    set(key: K, value: V): void;
    /**
     * Checks if a key exists.
     */
    has(key: K): boolean;
    /**
     * Deletes a value by key.
     * @returns true if the item existed and was deleted
     */
    delete(key: K): boolean;
    /**
     * Removes all items from the map.
     */
    clear(): void;
    /**
     * Returns an iterator over the keys.
     */
    keys(): IterableIterator<K>;
    /**
     * Returns an iterator over the values.
     */
    values(): IterableIterator<V>;
    /**
     * Returns an iterator over [key, value] pairs.
     */
    entries(): IterableIterator<[K, V]>;
    /**
     * Executes a callback for each item.
     */
    forEach(callback: (value: V, key: K) => void): void;
    /**
     * Makes the map iterable with for...of.
     */
    [Symbol.iterator](): IterableIterator<[K, V]>;
    /**
     * Sets multiple items at once.
     * More efficient than individual sets as it emits only one 'change' event.
     *
     * @param items - Array of values (requires keyExtractor) or Map
     * @param clear - If true, clears existing items first
     */
    setItems(items: V[] | Map<K, V>, clear?: boolean): void;
    /**
     * Returns all values as an array.
     * Alias for getValue() for convenience.
     */
    toArray(): V[];
    /**
     * Returns the underlying Map.
     * Use with caution - direct modifications won't trigger events.
     */
    toMap(): Map<K, V>;
    /**
     * Finds a value matching the predicate.
     */
    find(predicate: (value: V, key: K) => boolean): V | undefined;
    /**
     * Filters values matching the predicate.
     */
    filter(predicate: (value: V, key: K) => boolean): V[];
    /**
     * Maps values to a new array.
     */
    map<R>(callback: (value: V, key: K) => R): R[];
    /**
     * Saves current state as the initial state.
     * After calling this, hasUnpublishedChanges() will return false.
     */
    saveChanges(): void;
    /**
     * Reverts to the initial state.
     */
    revert(): void;
}

export { ReactiveMap };
export type { IMapClearEvent, IMapDeleteEvent, IMapSetEvent, IReactiveMapOptions };
