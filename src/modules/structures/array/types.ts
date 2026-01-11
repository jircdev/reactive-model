/**
 * Options for creating a ReactiveArray instance.
 */
export /*bundle*/ interface IReactiveArrayOptions<T> {
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
export /*bundle*/ interface IArrayAddEvent<T> {
	items: T[];
	index: number;
	method: 'push' | 'unshift' | 'splice' | 'set';
}

/**
 * Event data emitted when items are removed.
 */
export /*bundle*/ interface IArrayRemoveEvent<T> {
	items: T[];
	index: number;
	method: 'pop' | 'shift' | 'splice' | 'delete' | 'clear';
}

/**
 * Event data emitted when an item is updated.
 */
export /*bundle*/ interface IArrayUpdateEvent<T> {
	index: number;
	value: T;
	previous: T;
}

/**
 * Event data emitted when the array is reordered.
 */
export /*bundle*/ interface IArrayReorderEvent<T> {
	method: 'sort' | 'reverse';
	items: T[];
}
