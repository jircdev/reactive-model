import { Events } from '@beyond-js/reactive/events';
import type { IReactiveContainer } from '@beyond-js/reactive/model';
import type {
	IReactiveArrayOptions,
	IArrayAddEvent,
	IArrayRemoveEvent,
	IArrayUpdateEvent,
	IArrayReorderEvent,
} from './types';

// Re-export types
export type {
	IReactiveArrayOptions,
	IArrayAddEvent,
	IArrayRemoveEvent,
	IArrayUpdateEvent,
	IArrayReorderEvent,
};

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
export /*bundle*/ class ReactiveArray<T = unknown>
	extends Events
	implements IReactiveContainer<T, number>
{
	readonly isReactive: true = true;
	readonly isContainer: true = true;

	#items: T[] = [];
	#emitIndexEvents: boolean;
	#initialItems: T[] = [];

	/**
	 * Creates a new ReactiveArray instance.
	 */
	constructor(options: IReactiveArrayOptions<T> = {}) {
		super();

		this.#emitIndexEvents = options.emitIndexEvents ?? false;

		if (options.items) {
			this.#items = [...options.items];
			this.#initialItems = [...options.items];
		}
	}

	// ==========================================
	// IReactiveValue Implementation
	// ==========================================

	/**
	 * Replaces all items in the array.
	 */
	setValue(values: T[]): void {
		this.setItems(values, true);
	}

	/**
	 * Gets all items as an array.
	 */
	getValue(): T[] {
		return [...this.#items];
	}

	/**
	 * Serializes the array for JSON output.
	 */
	serialize(): T[] {
		return this.getValue();
	}

	/**
	 * Checks if the array has changes from its initial state.
	 */
	hasUnpublishedChanges(): boolean {
		if (this.#items.length !== this.#initialItems.length) return true;
		return JSON.stringify(this.#items) !== JSON.stringify(this.#initialItems);
	}

	// ==========================================
	// IReactiveContainer Implementation
	// ==========================================

	/**
	 * The number of items in the array.
	 */
	get size(): number {
		return this.#items.length;
	}

	/**
	 * Alias for size to match Array.length.
	 */
	get length(): number {
		return this.#items.length;
	}

	/**
	 * Gets an item by index.
	 */
	get(index: number): T | undefined {
		return this.#items[index];
	}

	/**
	 * Sets an item at the specified index.
	 * Emits 'update' and 'change' events.
	 */
	set(index: number, value: T): void {
		if (index < 0 || index >= this.#items.length) {
			// Extend array if needed
			while (this.#items.length <= index) {
				this.#items.push(undefined as T);
			}
		}

		const previous = this.#items[index];
		this.#items[index] = value;

		if (previous !== undefined) {
			const eventData: IArrayUpdateEvent<T> = { index, value, previous };
			this.trigger('update', eventData);
		} else {
			const eventData: IArrayAddEvent<T> = { items: [value], index, method: 'set' };
			this.trigger('add', eventData);
		}

		if (this.#emitIndexEvents) {
			this.trigger(`${index}.changed`, { value, previous });
		}

		this.trigger('change');
	}

	/**
	 * Checks if an index exists and has a value.
	 */
	has(index: number): boolean {
		return index >= 0 && index < this.#items.length;
	}

	/**
	 * Deletes an item at the specified index.
	 * Shifts remaining items down.
	 */
	delete(index: number): boolean {
		if (!this.has(index)) return false;

		const [removed] = this.#items.splice(index, 1);

		const eventData: IArrayRemoveEvent<T> = { items: [removed], index, method: 'delete' };
		this.trigger('remove', eventData);
		this.trigger('change');

		return true;
	}

	/**
	 * Removes all items from the array.
	 */
	clear(): void {
		if (this.#items.length === 0) return;

		const previousItems = [...this.#items];
		this.#items = [];

		const eventData: IArrayRemoveEvent<T> = { items: previousItems, index: 0, method: 'clear' };
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
	keys(): IterableIterator<number> {
		return this.#items.keys();
	}

	/**
	 * Returns an iterator over the values.
	 */
	values(): IterableIterator<T> {
		return this.#items.values();
	}

	/**
	 * Returns an iterator over [index, value] pairs.
	 */
	entries(): IterableIterator<[number, T]> {
		return this.#items.entries();
	}

	/**
	 * Executes a callback for each item.
	 */
	forEach(callback: (value: T, index: number) => void): void {
		this.#items.forEach(callback);
	}

	/**
	 * Makes the array iterable with for...of.
	 */
	[Symbol.iterator](): IterableIterator<T> {
		return this.#items[Symbol.iterator]();
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
	setItems(items: T[] | Map<number, T>, clear: boolean = false): void {
		if (clear) {
			this.#items = [];
		}

		if (items instanceof Map) {
			for (const [index, value] of items) {
				this.#items[index] = value;
			}
		} else if (Array.isArray(items)) {
			if (clear) {
				this.#items = [...items];
			} else {
				this.#items.push(...items);
			}
		}

		this.trigger('items.changed', { items: this.#items });
		this.trigger('change');
	}

	// ==========================================
	// Array-like Methods (Reactive)
	// ==========================================

	/**
	 * Adds items to the end of the array.
	 * @returns The new length of the array
	 */
	push(...items: T[]): number {
		const index = this.#items.length;
		this.#items.push(...items);

		const eventData: IArrayAddEvent<T> = { items, index, method: 'push' };
		this.trigger('add', eventData);
		this.trigger('change');

		return this.#items.length;
	}

	/**
	 * Removes the last item from the array.
	 * @returns The removed item or undefined
	 */
	pop(): T | undefined {
		if (this.#items.length === 0) return undefined;

		const item = this.#items.pop()!;
		const index = this.#items.length;

		const eventData: IArrayRemoveEvent<T> = { items: [item], index, method: 'pop' };
		this.trigger('remove', eventData);
		this.trigger('change');

		return item;
	}

	/**
	 * Adds items to the beginning of the array.
	 * @returns The new length of the array
	 */
	unshift(...items: T[]): number {
		this.#items.unshift(...items);

		const eventData: IArrayAddEvent<T> = { items, index: 0, method: 'unshift' };
		this.trigger('add', eventData);
		this.trigger('change');

		return this.#items.length;
	}

	/**
	 * Removes the first item from the array.
	 * @returns The removed item or undefined
	 */
	shift(): T | undefined {
		if (this.#items.length === 0) return undefined;

		const item = this.#items.shift()!;

		const eventData: IArrayRemoveEvent<T> = { items: [item], index: 0, method: 'shift' };
		this.trigger('remove', eventData);
		this.trigger('change');

		return item;
	}

	/**
	 * Changes array by removing/replacing/adding elements.
	 * @returns Array of removed elements
	 */
	splice(start: number, deleteCount?: number, ...items: T[]): T[] {
		const removed = this.#items.splice(start, deleteCount ?? 0, ...items);

		if (removed.length > 0) {
			const removeEvent: IArrayRemoveEvent<T> = { items: removed, index: start, method: 'splice' };
			this.trigger('remove', removeEvent);
		}

		if (items.length > 0) {
			const addEvent: IArrayAddEvent<T> = { items, index: start, method: 'splice' };
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
	sort(compareFn?: (a: T, b: T) => number): this {
		this.#items.sort(compareFn);

		const eventData: IArrayReorderEvent<T> = { method: 'sort', items: this.#items };
		this.trigger('reorder', eventData);
		this.trigger('change');

		return this;
	}

	/**
	 * Reverses the array in place.
	 * @returns This array
	 */
	reverse(): this {
		this.#items.reverse();

		const eventData: IArrayReorderEvent<T> = { method: 'reverse', items: this.#items };
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
	filter(predicate: (value: T, index: number) => boolean): T[] {
		return this.#items.filter(predicate);
	}

	/**
	 * Maps items to a new array.
	 */
	map<R>(callback: (value: T, index: number) => R): R[] {
		return this.#items.map(callback);
	}

	/**
	 * Finds an item matching the predicate.
	 */
	find(predicate: (value: T, index: number) => boolean): T | undefined {
		return this.#items.find(predicate);
	}

	/**
	 * Finds the index of an item matching the predicate.
	 */
	findIndex(predicate: (value: T, index: number) => boolean): number {
		return this.#items.findIndex(predicate);
	}

	/**
	 * Checks if some items match the predicate.
	 */
	some(predicate: (value: T, index: number) => boolean): boolean {
		return this.#items.some(predicate);
	}

	/**
	 * Checks if all items match the predicate.
	 */
	every(predicate: (value: T, index: number) => boolean): boolean {
		return this.#items.every(predicate);
	}

	/**
	 * Reduces the array to a single value.
	 */
	reduce<R>(callback: (acc: R, value: T, index: number) => R, initialValue: R): R {
		return this.#items.reduce(callback, initialValue);
	}

	/**
	 * Returns the index of the first occurrence of a value.
	 */
	indexOf(value: T, fromIndex?: number): number {
		return this.#items.indexOf(value, fromIndex);
	}

	/**
	 * Checks if the array includes a value.
	 */
	includes(value: T, fromIndex?: number): boolean {
		return this.#items.includes(value, fromIndex);
	}

	/**
	 * Returns a slice of the array.
	 */
	slice(start?: number, end?: number): T[] {
		return this.#items.slice(start, end);
	}

	/**
	 * Concatenates arrays.
	 */
	concat(...items: (T | T[])[]): T[] {
		return this.#items.concat(...items);
	}

	// ==========================================
	// Utility Methods
	// ==========================================

	/**
	 * Returns a copy of the internal array.
	 */
	toArray(): T[] {
		return [...this.#items];
	}

	/**
	 * Saves current state as the initial state.
	 */
	saveChanges(): void {
		this.#initialItems = [...this.#items];
	}

	/**
	 * Reverts to the initial state.
	 */
	revert(): void {
		this.#items = [...this.#initialItems];
		this.trigger('revert');
		this.trigger('change');
	}
}
