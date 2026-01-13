import { Events } from 'reactive/events';
import type { IReactiveContainer } from 'reactive/model';
import type { IReactiveMapOptions, IMapSetEvent, IMapDeleteEvent, IMapClearEvent } from './types';

// Re-export types
export type { IReactiveMapOptions, IMapSetEvent, IMapDeleteEvent, IMapClearEvent };

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
export /*bundle*/ class ReactiveMap<K = string, V = unknown> extends Events implements IReactiveContainer<V, K> {
	readonly isReactive: true = true;
	readonly isContainer: true = true;

	#map: Map<K, V> = new Map();
	#keyExtractor?: (value: V) => K;
	#emitKeyEvents: boolean;
	#initialEntries: Map<K, V> = new Map();

	/**
	 * Creates a new ReactiveMap instance.
	 */
	constructor(options: IReactiveMapOptions<K, V> = {}) {
		super();

		this.#keyExtractor = options.keyExtractor;
		this.#emitKeyEvents = options.emitKeyEvents ?? true;

		if (options.entries) {
			for (const [key, value] of options.entries) {
				this.#map.set(key, value);
				this.#initialEntries.set(key, value);
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
	setValue(values: V[]): void {
		if (!Array.isArray(values)) return;
		this.setItems(values, true);
	}

	/**
	 * Gets all values as an array.
	 */
	getValue(): V[] {
		return [...this.#map.values()];
	}

	/**
	 * Serializes the map to an array of values.
	 */
	serialize(): V[] {
		return this.getValue();
	}

	/**
	 * Checks if the map has changes from its initial state.
	 */
	hasUnpublishedChanges(): boolean {
		if (this.#map.size !== this.#initialEntries.size) return true;

		for (const [key, value] of this.#map) {
			if (!this.#initialEntries.has(key)) return true;
			const initial = this.#initialEntries.get(key);
			if (JSON.stringify(value) !== JSON.stringify(initial)) return true;
		}

		return false;
	}

	// ==========================================
	// IReactiveContainer Implementation
	// ==========================================

	/**
	 * The number of items in the map.
	 */
	get size(): number {
		return this.#map.size;
	}

	/**
	 * Gets a value by key.
	 */
	get(key: K): V | undefined {
		return this.#map.get(key);
	}

	/**
	 * Sets a value at the specified key.
	 * Emits 'set' and 'change' events.
	 */
	set(key: K, value: V): void {
		const previous = this.#map.get(key);
		const isNew = !this.#map.has(key);

		this.#map.set(key, value);

		const eventData: IMapSetEvent<K, V> = { key, value, previous, isNew };
		this.trigger('set', eventData);

		if (this.#emitKeyEvents) {
			this.trigger(`${String(key)}.changed`, { value, previous });
		}

		this.trigger('change');
	}

	/**
	 * Checks if a key exists.
	 */
	has(key: K): boolean {
		return this.#map.has(key);
	}

	/**
	 * Deletes a value by key.
	 * @returns true if the item existed and was deleted
	 */
	delete(key: K): boolean {
		if (!this.#map.has(key)) return false;

		const value = this.#map.get(key)!;
		this.#map.delete(key);

		const eventData: IMapDeleteEvent<K, V> = { key, value };
		this.trigger('delete', eventData);

		if (this.#emitKeyEvents) {
			this.trigger(`${String(key)}.deleted`);
		}

		this.trigger('change');
		return true;
	}

	/**
	 * Removes all items from the map.
	 */
	clear(): void {
		if (this.#map.size === 0) return;

		const previousSize = this.#map.size;
		const previousEntries = [...this.#map.entries()];

		this.#map.clear();

		const eventData: IMapClearEvent<K, V> = { previousSize, previousEntries };
		this.trigger('clear', eventData);
		this.trigger('change');
	}

	// ==========================================
	// Iteration Methods
	// ==========================================

	/**
	 * Returns an iterator over the keys.
	 */
	keys(): IterableIterator<K> {
		return this.#map.keys();
	}

	/**
	 * Returns an iterator over the values.
	 */
	values(): IterableIterator<V> {
		return this.#map.values();
	}

	/**
	 * Returns an iterator over [key, value] pairs.
	 */
	entries(): IterableIterator<[K, V]> {
		return this.#map.entries();
	}

	/**
	 * Executes a callback for each item.
	 */
	forEach(callback: (value: V, key: K) => void): void {
		this.#map.forEach((value, key) => callback(value, key));
	}

	/**
	 * Makes the map iterable with for...of.
	 */
	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.#map[Symbol.iterator]();
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
	setItems(items: V[] | Map<K, V>, clear: boolean = false): void {
		if (clear) {
			this.#map.clear();
		}

		if (items instanceof Map) {
			for (const [key, value] of items) {
				this.#map.set(key, value);
			}
		} else if (Array.isArray(items)) {
			if (!this.#keyExtractor) {
				console.warn('ReactiveMap: keyExtractor required when setting items from array');
				return;
			}
			for (const value of items) {
				const key = this.#keyExtractor(value);
				this.#map.set(key, value);
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
	toArray(): V[] {
		return this.getValue();
	}

	/**
	 * Returns the underlying Map.
	 * Use with caution - direct modifications won't trigger events.
	 */
	toMap(): Map<K, V> {
		return new Map(this.#map);
	}

	/**
	 * Finds a value matching the predicate.
	 */
	find(predicate: (value: V, key: K) => boolean): V | undefined {
		for (const [key, value] of this.#map) {
			if (predicate(value, key)) return value;
		}
		return undefined;
	}

	/**
	 * Filters values matching the predicate.
	 */
	filter(predicate: (value: V, key: K) => boolean): V[] {
		const results: V[] = [];
		for (const [key, value] of this.#map) {
			if (predicate(value, key)) results.push(value);
		}
		return results;
	}

	/**
	 * Maps values to a new array.
	 */
	map<R>(callback: (value: V, key: K) => R): R[] {
		const results: R[] = [];
		for (const [key, value] of this.#map) {
			results.push(callback(value, key));
		}
		return results;
	}

	/**
	 * Saves current state as the initial state.
	 * After calling this, hasUnpublishedChanges() will return false.
	 */
	saveChanges(): void {
		this.#initialEntries = new Map(this.#map);
	}

	/**
	 * Reverts to the initial state.
	 */
	revert(): void {
		this.#map = new Map(this.#initialEntries);
		this.trigger('revert');
		this.trigger('change');
	}
}
