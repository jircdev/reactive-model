import type { IReactiveValue } from './reactive-value';

/**
 * Interface for reactive containers that hold multiple values.
 * Extends IReactiveValue with collection-specific operations.
 *
 * @template T - The type of items in the container
 * @template K - The type of keys (defaults to string | number)
 */
export /*bundle*/ interface IReactiveContainer<T, K = string | number> extends IReactiveValue<T[]> {
	/**
	 * Identifies this as a container type.
	 * Used for runtime type checking.
	 */
	readonly isContainer: true;

	/**
	 * The number of items in the container.
	 */
	readonly size: number;

	// ==========================================
	// CRUD Operations
	// ==========================================

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

	// ==========================================
	// Iteration
	// ==========================================

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

	// ==========================================
	// Batch Operations
	// ==========================================

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
export /*bundle*/ function isReactiveContainer<T, K = string | number>(
	value: unknown
): value is IReactiveContainer<T, K> {
	return (
		value !== null &&
		typeof value === 'object' &&
		'isContainer' in value &&
		(value as IReactiveContainer<T, K>).isContainer === true
	);
}
