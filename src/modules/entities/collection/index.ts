import { Item, ItemId, IEntityProvider, RegistryFactory, IItem } from 'reactive/entities/item';
import { ReactiveModel, PluginManager } from 'reactive/model';
import { ICollectionOptions, ICollectionProvider, ILoadSpecs } from './types';

// Re-export types for external use
export type { ICollectionProvider, ICollectionOptions, ILoadSpecs };

/**
 * Collection class for managing groups of Items.
 * Implements IReactiveContainer for unified reactive value handling.
 *
 * @template T - Item type (must extend Item)
 * @template P - Provider type
 */
/**
 * Collection class for managing groups of Items.
 * Provides IReactiveContainer-like methods but doesn't implement the interface
 * directly due to method signature conflicts with ReactiveModel.set().
 *
 * @template T - Item type (must extend Item)
 * @template P - Provider type
 */
export /*bundle*/ class Collection<T extends Item<any, any>, P extends IEntityProvider = IEntityProvider>
	extends ReactiveModel<Collection<T, P>>
{
	private total: number = 0;
	private next: unknown | null = null;

	/**
	 * Identifies this as a container type.
	 * Required by IReactiveContainer interface.
	 */
	readonly isContainer: true = true;

	/**
	 * Static property for class-level type checking.
	 * @deprecated Use isContainer instance property instead
	 */
	static isContainer = true;

	/**
	 * @deprecated Use isContainer instead
	 */
	get isCollection() {
		return true;
	}

	/**
	 * @deprecated Use isContainer instead
	 */
	static isCollection = true;

	/**
	 * Name of the parameter used for pagination cursor (default: "next").
	 * Can be configured via the constructor using `nextParamName`.
	 */
	#nextParamName = 'next';
	#defaultLimit: number;

	/**
	 * Get the total number of items available (if provided by the provider).
	 */
	public getTotal(): number {
		return this.total;
	}

	/**
	 * Get the value of next page (if provided by the provider).
	 */
	public getNext(): unknown | null {
		return this.next;
	}

	#entity: string;
	get entity(): string {
		return this.#entity;
	}

	#provider: P;
	get provider(): P {
		return this.#provider;
	}

	#item: ICollectionOptions<T, P>['item'];
	get Item(): ICollectionOptions<T, P>['item'] {
		return this.#item;
	}

	// Internal storage - using Map directly for now, can be swapped to ReactiveMap later
	#map: Map<ItemId, T> = new Map();

	/**
	 * @deprecated Direct map access is deprecated. Use get(id), has(id), or items instead.
	 * Will be removed in v4.0
	 */
	get map(): Map<ItemId, T> {
		console.warn(
			'Collection.map is deprecated. Use collection.get(id), collection.has(id), or collection.items instead.'
		);
		return this.#map;
	}

	/**
	 * Returns all items as an array.
	 */
	get items(): T[] {
		return [...this.#map.values()];
	}

	/**
	 * The number of items in the collection.
	 * Required by IReactiveContainer interface.
	 */
	get size(): number {
		return this.#map.size;
	}

	#filters: ILoadSpecs<T>['where'];
	#registry: RegistryFactory<T>;

	constructor({
		entity,
		provider,
		item,
		defaultLimit = 15,
		nextParamName = 'next',
	}: ICollectionOptions<T, P> & { nextParamName?: string }) {
		super();

		this.#entity = entity;
		if (provider && typeof provider !== 'function') {
			throw new Error('Provider must be a class/constructor');
		}
		if (provider) {
			this.#provider = new provider(this);
		}
		this.#registry = RegistryFactory.getInstance<T>(entity);

		this.#registry.on('record.published', this.onNewRegistry.bind(this));
		this.#registry.on('record.deleted', this.onRegistryDeleted.bind(this));
		this.#item = item;

		this.#defaultLimit = defaultLimit;
		if (nextParamName) this.#nextParamName = nextParamName;
	}

	// ==========================================
	// IReactiveContainer Implementation
	// ==========================================

	/**
	 * Gets an item by its ID.
	 * Required by IReactiveContainer interface.
	 *
	 * @param id - The item ID to look up
	 * @returns The item or undefined if not found
	 */
	get(id: ItemId): T | undefined {
		return this.#map.get(id);
	}

	/**
	 * Checks if an item exists in the collection.
	 * Required by IReactiveContainer interface.
	 *
	 * @param id - The item ID to check
	 */
	has(id: ItemId): boolean {
		return this.#map.has(id);
	}

	/**
	 * Returns an iterator over the item IDs.
	 * Required by IReactiveContainer interface.
	 */
	keys(): IterableIterator<ItemId> {
		return this.#map.keys();
	}

	/**
	 * Returns an iterator over the items.
	 * Required by IReactiveContainer interface.
	 */
	values(): IterableIterator<T> {
		return this.#map.values();
	}

	/**
	 * Returns an iterator over [id, item] pairs.
	 * Required by IReactiveContainer interface.
	 */
	entries(): IterableIterator<[ItemId, T]> {
		return this.#map.entries();
	}

	/**
	 * Executes a callback for each item.
	 * Required by IReactiveContainer interface.
	 */
	forEach(callback: (value: T, key: ItemId) => void): void {
		this.#map.forEach((value, key) => callback(value, key));
	}

	/**
	 * Clears all items from the collection.
	 * Required by IReactiveContainer interface.
	 */
	clear(): void {
		if (this.#map.size === 0) return;

		this.#map.clear();
		this.trigger('clear');
		this.trigger('items.changed');
		this.trigger('change');
	}

	/**
	 * Deletes an item by ID.
	 * This is the synchronous version required by IReactiveContainer.
	 * For async deletion with provider, use deleteAsync().
	 *
	 * @param id - The item ID to delete
	 * @returns true if the item existed and was deleted
	 */
	delete(id: ItemId): boolean {
		if (!this.#map.has(id)) return false;

		this.#map.delete(id);
		this.trigger('items.changed');
		this.trigger('change');

		return true;
	}

	// ==========================================
	// IReactiveValue Implementation (inherited + overrides)
	// ==========================================

	/**
	 * Sets the collection items from an array.
	 * Replaces existing items.
	 * @override
	 */
	setValue(values: any): void {
		if (Array.isArray(values)) {
			this.setItems(values, true);
		}
	}

	/**
	 * Gets all items as an array.
	 * @override
	 */
	getValue(): any {
		return this.items;
	}

	/**
	 * Serializes all items for JSON output.
	 * Returns an array of serialized item properties.
	 * @override
	 */
	serialize(): any {
		return this.getItemProperties();
	}

	/**
	 * Collections don't track unpublished changes in the same way as Items.
	 * Checks if any item has unpublished changes.
	 */
	hasUnpublishedChanges(): boolean {
		for (const item of this.#map.values()) {
			if (item.hasUnpublishedChanges()) return true;
		}
		return false;
	}

	// ==========================================
	// LIFECYCLE HOOKS - Override in subclasses
	// ==========================================

	/**
	 * Lifecycle hook called before load() executes.
	 * Override to modify load arguments or perform pre-load actions.
	 *
	 * @param args - Arguments to be passed to provider.list()
	 * @returns Modified arguments or original args
	 */
	protected async beforeLoad(args: ILoadSpecs<T>): Promise<ILoadSpecs<T>> {
		return args;
	}

	/**
	 * Lifecycle hook called after load() completes successfully.
	 * Override to transform loaded items or perform post-load actions.
	 *
	 * @param items - Items returned from provider.list()
	 * @returns Modified items array or original items
	 */
	protected async afterLoad(items: T[]): Promise<T[]> {
		return items;
	}

	/**
	 * Load items from the configured provider.
	 * If {@link ILoadSpecs.limit} is omitted, the collection's `defaultLimit`
	 * (configured in the constructor) is used.
	 *
	 * Pagination is handled internally: if the collection has a pagination cursor ("next"),
	 * it will be added to the request using the parameter name defined by `nextParamName`.
	 * You do not need to pass the `next` parameter manually.
	 *
	 * Executes lifecycle hooks: beforeLoad -> load -> afterLoad
	 * Runs plugins: onBeforeList -> onAfterList
	 * Emits events: pre:load -> load -> post:load
	 */
	async load(args: ILoadSpecs<T> = {}): Promise<T[]> {
		// Ensure pagination defaults
		if (typeof args.limit !== 'number') args.limit = this.#defaultLimit;
		if (this.next) (args as Record<string, unknown>)[this.#nextParamName] = this.next;
		this.#filters = args.where ?? {};
		this.fetching = true;

		if (!this.#provider || typeof (this.#provider as ICollectionProvider).list !== 'function') {
			throw new Error('DataProvider is not defined or does not implement the list() method.');
		}

		try {
			// 1. Execute beforeLoad hook (class method)
			let loadArgs = await this.beforeLoad(args);

			// 2. Execute plugins beforeList
			const pluginResult = await PluginManager.runHook('onBeforeList', this, loadArgs, this.#entity);
			loadArgs = pluginResult.value as ILoadSpecs<T>;

			// 3. Emit pre:load event
			this.trigger('pre:load', loadArgs);

			// 4. Execute provider list
			const data = await (this.#provider as ICollectionProvider).list(loadArgs);
			let entries: T[];
			const shouldUpdate = !!loadArgs.update;

			if (Array.isArray(data)) {
				entries = data as T[];
				this.total = 0;
				this.next = null;
			} else if (data && Array.isArray(data.items)) {
				entries = data.items as T[];
				if (typeof data.total === 'number') this.total = data.total;
				if ('next' in data) this.next = data.next;
			} else {
				throw new Error('DataProvider.list() must return an array or an object with an "items" array.');
			}

			// 5. Execute afterLoad hook (class method)
			entries = await this.afterLoad(entries);

			// 6. Execute plugins afterList
			const afterPluginResult = await PluginManager.runHook('onAfterList', this, entries, this.#entity);
			entries = afterPluginResult.value as T[];

			// 7. Set items
			this.setItems(entries, !shouldUpdate);

			// 8. Emit load and post:load events
			this.trigger('load', {
				items: entries,
				total: this.total,
				next: this.next,
			});
			this.trigger('post:load', {
				items: entries,
				total: this.total,
				next: this.next,
			});

			return entries;
		} catch (error) {
			throw error;
		} finally {
			this.fetching = false;
		}
	}

	/**
	 * Sets multiple items at once.
	 * Required by IReactiveContainer interface.
	 *
	 * @param data - Array of items or Map of id->item
	 * @param clear - If true, clears existing items first
	 */
	setItems(data: T[] | Map<ItemId, T>, clear = false): void {
		if (clear) this.#map.clear();
		if (!data) return;

		if (data instanceof Map) {
			for (const [id, item] of data) {
				this.#map.set(id, item);
			}
		} else if (Array.isArray(data)) {
			data.forEach(item => {
				const itemData = item as unknown as Record<string, unknown>;
				const id = itemData.id as ItemId;

				if (this.#map.has(id)) {
					// Update existing item
					const existingItem = this.#map.get(id)!;
					existingItem.setValue(itemData);
					return;
				}

				// Create new item instance
				const instance = new this.#item({ parent: this, ...itemData });
				this.#map.set(id, instance);
			});
		} else {
			console.warn('Collection.setItems: Data must be an array or Map');
			return;
		}

		this.trigger('items.changed', { items: this.items });
		this.trigger('change');
	}

	/**
	 * Adds items without clearing existing ones.
	 *
	 * @param data - Array of items to add
	 */
	addItems(data: T[]): void {
		this.setItems(data, false);
	}

	/**
	 * Sets properties on the collection.
	 * Overrides parent to ensure change event is triggered.
	 */
	set(data: Partial<Collection<T, P>>): { updated: boolean } {
		const result = super.set(data);
		this.trigger('change');
		return result;
	}

	/**
	 * Gets properties of the collection.
	 */
	getProperties(): { items: T[] } {
		return { items: this.items };
	}

	/**
	 * Gets serialized properties of all items.
	 * Useful for saving to backend or JSON export.
	 */
	getItemProperties(): unknown[] {
		const items: unknown[] = [];
		for (const item of this.items) {
			items.push(item.serialize());
		}
		return items;
	}

	/**
	 * Validates a new registry against the collection's filters and, if it matches,
	 * creates a new item with the registry data and adds it to the data map.
	 *
	 * @param {object} registry - The new registry data to be checked and potentially added.
	 */
	onNewRegistry(registry: Record<string, unknown>): void {
		// Check if the registry matches the filters
		if (this.matchesFilters(registry)) {
			// Create a new item instance with the registry data
			const newItem = new this.#item(registry);

			// Add the new item to the map, using its id as the key
			this.#map.set(registry.id as ItemId, newItem);

			// Optionally trigger an event to notify that a new item was added
			this.trigger('items.changed', { item: newItem });
			this.trigger('change');
		}
	}

	/**
	 * Deletes multiple items by ID, calling the provider if available.
	 *
	 * @param ids - Single ID or array of IDs to delete
	 * @returns Array of booleans indicating success for each item
	 */
	async deleteAsync(ids: ItemId | ItemId[]): Promise<boolean[]> {
		const toDelete = Array.isArray(ids) ? ids : [ids];
		const existingItems = toDelete.map(id => this.#map.get(id)).filter(Boolean) as T[];

		if (this.#provider && typeof this.#provider.deleteMany === 'function') {
			await this.#provider.deleteMany(toDelete);
		}

		return await Promise.all(existingItems.map(item => item.delete({ skipProvider: true })));
	}

	/**
	 * Handles registry deletion events.
	 */
	onRegistryDeleted(registry: Record<string, unknown>): void {
		if (!this.#map.has(registry.id as ItemId)) return;
		this.#map.delete(registry.id as ItemId);

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
	private matchesFilters(registry: Record<string, unknown>): boolean {
		const filters = this.#filters;
		if (!filters) return true; // If no filters are set, assume it matches

		// Helper function to evaluate a single condition
		const evaluateCondition = (property: string, criteria: Record<string, unknown>): boolean => {
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
						return typeof registryValue === 'string' && registryValue.includes(value as string);
					case 'startsWith':
						return typeof registryValue === 'string' && registryValue.startsWith(value as string);
					case 'endsWith':
						return typeof registryValue === 'string' && registryValue.endsWith(value as string);
					case 'gt':
						return (registryValue as number) > (value as number);
					case 'gte':
						return (registryValue as number) >= (value as number);
					case 'lt':
						return (registryValue as number) < (value as number);
					case 'lte':
						return (registryValue as number) <= (value as number);
					default:
						console.warn(`Unknown filter operator: ${operator}`);
						return false;
				}
			});
		};

		// General function to evaluate conditions with logical operators
		const evaluateConditions = (
			conditions: Record<string, Record<string, unknown>>[],
			logic: 'every' | 'some'
		): boolean =>
			conditions[logic](condition =>
				Object.entries(condition).every(([property, criteria]) =>
					evaluateCondition(property, criteria as Record<string, unknown>)
				)
			);

		// Evaluate AND conditions
		if (filters.AND && !evaluateConditions(filters.AND as unknown as Record<string, Record<string, unknown>>[], 'every')) return false;

		// Evaluate OR conditions
		if (filters.OR && !evaluateConditions(filters.OR as unknown as Record<string, Record<string, unknown>>[], 'some')) return false;

		// Evaluate direct conditions (outside of AND/OR)
		return Object.entries(filters)
			.filter(([key]) => key !== 'AND' && key !== 'OR')
			.every(([property, criteria]) => evaluateCondition(property, criteria as Record<string, unknown>));
	}

	// ==========================================
	// Utility Methods
	// ==========================================

	/**
	 * Finds an item matching the predicate.
	 */
	find(predicate: (item: T) => boolean): T | undefined {
		for (const item of this.#map.values()) {
			if (predicate(item)) return item;
		}
		return undefined;
	}

	/**
	 * Filters items matching the predicate.
	 */
	filter(predicate: (item: T) => boolean): T[] {
		return this.items.filter(predicate);
	}

	/**
	 * Maps items to a new array.
	 */
	mapItems<R>(callback: (item: T) => R): R[] {
		return this.items.map(callback);
	}

	/**
	 * Checks if some items match the predicate.
	 */
	some(predicate: (item: T) => boolean): boolean {
		return this.items.some(predicate);
	}

	/**
	 * Checks if all items match the predicate.
	 */
	every(predicate: (item: T) => boolean): boolean {
		return this.items.every(predicate);
	}
}
