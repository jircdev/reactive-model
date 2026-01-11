/**
 * Options for creating a ReactiveMap instance.
 */
export /*bundle*/ interface IReactiveMapOptions<K, V> {
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
export /*bundle*/ interface IMapSetEvent<K, V> {
	key: K;
	value: V;
	previous?: V;
	isNew: boolean;
}

/**
 * Event data emitted when an item is deleted.
 */
export /*bundle*/ interface IMapDeleteEvent<K, V> {
	key: K;
	value: V;
}

/**
 * Event data emitted when the map is cleared.
 */
export /*bundle*/ interface IMapClearEvent<K, V> {
	previousSize: number;
	previousEntries: [K, V][];
}
