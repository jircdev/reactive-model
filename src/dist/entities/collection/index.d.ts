import { ItemId, Item, IItem, IEntityProvider } from '@beyond-js/reactive/entities/item';
import { ReactiveModel } from '@beyond-js/reactive/model';

/**
 * Standard response format from collection provider operations.
 */
interface ICollectionProviderResponse<T> {
    /** HTTP-like status code (200 = success) */
    status: number;
    /** The data returned by the operation */
    data?: T;
    /** Error message if operation failed */
    error?: string;
    /** Field-level validation errors */
    errors?: Array<{
        field: string;
        message: string;
    }>;
}
/**
 * Response format for list operations.
 * Can be either a simple array or an object with pagination info.
 */
interface IListResponse<T> {
    /** Array of items */
    items: T[];
    /** Total count of available items (for pagination) */
    total?: number;
    /** Cursor for next page */
    next?: unknown;
}
/**
 * Interface for Collection data providers.
 * Providers handle communication with external data sources (APIs, databases, etc.)
 */
interface ICollectionProvider {
    /**
     * Load/list items with optional filtering and pagination.
     * @deprecated Use list() instead
     */
    load?(specs?: ILoadSpecs<unknown>): Promise<unknown[] | IListResponse<unknown>>;
    /**
     * List items with optional filtering and pagination.
     * Should return either an array or { items: [], total?: number, next?: any }
     */
    list(specs?: ILoadSpecs<unknown>): Promise<unknown[] | IListResponse<unknown>>;
    /**
     * Save/create a new item in the collection.
     */
    publish?(data: unknown): Promise<ICollectionProviderResponse<unknown>>;
    /**
     * Remove items from the collection.
     */
    remove?(specs?: unknown): Promise<boolean>;
    /**
     * Delete multiple items by IDs.
     */
    deleteMany?(ids: ItemId[]): Promise<boolean>;
}
/**
 * Constructor options for Collection class.
 */
interface ICollectionOptions<T extends Item<IItem>, P extends Partial<IEntityProvider>> {
    /** Entity name for registry */
    entity: string;
    /** Default page size for load operations */
    defaultLimit?: number;
    /** Provider class constructor */
    provider?: new (parent: Collection<T, P>) => P;
    /** Item class constructor */
    item: new (specs: Record<string, unknown>) => T;
    /**
     * Name of the parameter to send as pagination cursor (default: "next").
     * Used internally by Collection to send the cursor to the provider.
     */
    nextParamName?: string;
}
/**
 * Filter operators for querying collections.
 */
interface IFilterOperators<V> {
    /** Exact match */
    equals?: V;
    /** Not equal */
    not?: V;
    /** Value is in array */
    in?: V[];
    /** Value is not in array */
    notIn?: V[];
    /** String contains (strings only) */
    contains?: string;
    /** String starts with (strings only) */
    startsWith?: string;
    /** String ends with (strings only) */
    endsWith?: string;
    /** Greater than */
    gt?: V;
    /** Greater than or equal */
    gte?: V;
    /** Less than */
    lt?: V;
    /** Less than or equal */
    lte?: V;
}
/**
 * Interface defining the specifications for data loading, filtering, sorting, and pagination.
 */
interface ILoadSpecs<T> {
    /**
     * If true, new items are appended to the collection instead of replacing them (for pagination).
     */
    update?: boolean;
    /**
     * Filters to apply when loading data.
     * Each filter can be a property of the data item with various operators.
     *
     * @example
     * ```typescript
     * await users.load({
     *   where: {
     *     name: { contains: 'John' },
     *     age: { gte: 18, lte: 65 },
     *     status: { in: ['active', 'pending'] }
     *   }
     * });
     * ```
     */
    where?: {
        [K in keyof T]?: IFilterOperators<T[K]>;
    } & {
        /** Logical AND - all conditions must match */
        AND?: Array<{
            [K in keyof T]?: IFilterOperators<T[K]>;
        }>;
        /** Logical OR - at least one condition must match */
        OR?: Array<{
            [K in keyof T]?: IFilterOperators<T[K]>;
        }>;
    };
    /**
     * Specifies the order in which results should be returned.
     *
     * @example
     * ```typescript
     * await users.load({
     *   orderBy: {
     *     name: 'asc',
     *     createdAt: 'desc'
     *   }
     * });
     * ```
     */
    orderBy?: {
        [K in keyof T]?: 'asc' | 'desc';
    };
    /**
     * Maximum number of items to load (for pagination).
     */
    limit?: number;
}

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
declare class Collection<T extends Item<any, any>, P extends IEntityProvider = IEntityProvider> extends ReactiveModel<Collection<T, P>> {
    #private;
    private total;
    private next;
    /**
     * Identifies this as a container type.
     * Required by IReactiveContainer interface.
     */
    readonly isContainer: true;
    /**
     * Static property for class-level type checking.
     * @deprecated Use isContainer instance property instead
     */
    static isContainer: boolean;
    /**
     * @deprecated Use isContainer instead
     */
    get isCollection(): boolean;
    /**
     * @deprecated Use isContainer instead
     */
    static isCollection: boolean;
    /**
     * Get the total number of items available (if provided by the provider).
     */
    getTotal(): number;
    /**
     * Get the value of next page (if provided by the provider).
     */
    getNext(): unknown | null;
    get entity(): string;
    get provider(): P;
    get Item(): ICollectionOptions<T, P>['item'];
    /**
     * @deprecated Direct map access is deprecated. Use get(id), has(id), or items instead.
     * Will be removed in v4.0
     */
    get map(): Map<ItemId, T>;
    /**
     * Returns all items as an array.
     */
    get items(): T[];
    /**
     * The number of items in the collection.
     * Required by IReactiveContainer interface.
     */
    get size(): number;
    constructor({ entity, provider, item, defaultLimit, nextParamName, }: ICollectionOptions<T, P> & {
        nextParamName?: string;
    });
    /**
     * Gets an item by its ID.
     * Required by IReactiveContainer interface.
     *
     * @param id - The item ID to look up
     * @returns The item or undefined if not found
     */
    get(id: ItemId): T | undefined;
    /**
     * Checks if an item exists in the collection.
     * Required by IReactiveContainer interface.
     *
     * @param id - The item ID to check
     */
    has(id: ItemId): boolean;
    /**
     * Returns an iterator over the item IDs.
     * Required by IReactiveContainer interface.
     */
    keys(): IterableIterator<ItemId>;
    /**
     * Returns an iterator over the items.
     * Required by IReactiveContainer interface.
     */
    values(): IterableIterator<T>;
    /**
     * Returns an iterator over [id, item] pairs.
     * Required by IReactiveContainer interface.
     */
    entries(): IterableIterator<[ItemId, T]>;
    /**
     * Executes a callback for each item.
     * Required by IReactiveContainer interface.
     */
    forEach(callback: (value: T, key: ItemId) => void): void;
    /**
     * Clears all items from the collection.
     * Required by IReactiveContainer interface.
     */
    clear(): void;
    /**
     * Deletes an item by ID.
     * This is the synchronous version required by IReactiveContainer.
     * For async deletion with provider, use deleteAsync().
     *
     * @param id - The item ID to delete
     * @returns true if the item existed and was deleted
     */
    delete(id: ItemId): boolean;
    /**
     * Sets the collection items from an array.
     * Replaces existing items.
     * @override
     */
    setValue(values: any): void;
    /**
     * Gets all items as an array.
     * @override
     */
    getValue(): any;
    /**
     * Serializes all items for JSON output.
     * Returns an array of serialized item properties.
     * @override
     */
    serialize(): any;
    /**
     * Collections don't track unpublished changes in the same way as Items.
     * Checks if any item has unpublished changes.
     */
    hasUnpublishedChanges(): boolean;
    /**
     * Lifecycle hook called before load() executes.
     * Override to modify load arguments or perform pre-load actions.
     *
     * @param args - Arguments to be passed to provider.list()
     * @returns Modified arguments or original args
     */
    protected beforeLoad(args: ILoadSpecs<T>): Promise<ILoadSpecs<T>>;
    /**
     * Lifecycle hook called after load() completes successfully.
     * Override to transform loaded items or perform post-load actions.
     *
     * @param items - Items returned from provider.list()
     * @returns Modified items array or original items
     */
    protected afterLoad(items: T[]): Promise<T[]>;
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
    load(args?: ILoadSpecs<T>): Promise<T[]>;
    /**
     * Sets multiple items at once.
     * Required by IReactiveContainer interface.
     *
     * @param data - Array of items or Map of id->item
     * @param clear - If true, clears existing items first
     */
    setItems(data: T[] | Map<ItemId, T>, clear?: boolean): void;
    /**
     * Adds items without clearing existing ones.
     *
     * @param data - Array of items to add
     */
    addItems(data: T[]): void;
    /**
     * Sets properties on the collection.
     * Overrides parent to ensure change event is triggered.
     */
    set(data: Partial<Collection<T, P>>): {
        updated: boolean;
    };
    /**
     * Gets properties of the collection.
     */
    getProperties(): {
        items: T[];
    };
    /**
     * Gets serialized properties of all items.
     * Useful for saving to backend or JSON export.
     */
    getItemProperties(): unknown[];
    /**
     * Validates a new registry against the collection's filters and, if it matches,
     * creates a new item with the registry data and adds it to the data map.
     *
     * @param {object} registry - The new registry data to be checked and potentially added.
     */
    onNewRegistry(registry: Record<string, unknown>): void;
    /**
     * Deletes multiple items by ID, calling the provider if available.
     *
     * @param ids - Single ID or array of IDs to delete
     * @returns Array of booleans indicating success for each item
     */
    deleteAsync(ids: ItemId | ItemId[]): Promise<boolean[]>;
    /**
     * Handles registry deletion events.
     */
    onRegistryDeleted(registry: Record<string, unknown>): void;
    /**
     * Validates if a registry matches the stored filters, including support for AND and OR logical operators.
     * The #filters object contains filtering criteria that are evaluated here.
     *
     * @param {object} registry - The data of the registry to be checked.
     * @returns {boolean} - Returns true if the registry matches all filter criteria; otherwise, false.
     */
    private matchesFilters;
    /**
     * Finds an item matching the predicate.
     */
    find(predicate: (item: T) => boolean): T | undefined;
    /**
     * Filters items matching the predicate.
     */
    filter(predicate: (item: T) => boolean): T[];
    /**
     * Maps items to a new array.
     */
    mapItems<R>(callback: (item: T) => R): R[];
    /**
     * Checks if some items match the predicate.
     */
    some(predicate: (item: T) => boolean): boolean;
    /**
     * Checks if all items match the predicate.
     */
    every(predicate: (item: T) => boolean): boolean;
}

export { Collection };
export type { ICollectionOptions, ICollectionProvider, ILoadSpecs };
