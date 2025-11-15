import { IEntityProvider, Item, ItemId } from '@beyond-js/reactive/entities/item';
import { ReactiveModel } from '@beyond-js/reactive/model';

interface ICollectionProvider {
    load(specs?: any): Promise<any>;
    list(specs?: any): Promise<any>;
    publish?(data: any): Promise<any>;
    remove?(specs?: any): Promise<any>;
}
interface ICollectionOptions<T, P extends Partial<IEntityProvider>> {
    entity: string;
    defaultLimit?: number;
    provider?: new (parent: any) => any;
    item: new (...args: any) => T;
    /**
     * Optional. Name of the parameter to send as pagination cursor (default: "next").
     * Used internally by Collection to send the cursor to the provider.
     */
    nextParamName?: string;
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
     */
    where?: {
        [K in keyof T]?: {
            equals?: T[K];
            not?: T[K];
            in?: T[K][];
            notIn?: T[K][];
            contains?: string;
            startsWith?: string;
            endsWith?: string;
            gt?: T[K];
            gte?: T[K];
            lt?: T[K];
            lte?: T[K];
        };
    };
    /**
     * Specifies the order in which results should be returned.
     * Example: { property: "asc" | "desc" }
     */
    orderBy?: {
        [K in keyof T]?: "asc" | "desc";
    };
    /**
     * Maximum number of items to load after applying the offset (for pagination).
     */
    limit?: number;
}

declare class Collection<T extends Item<any>, P extends IEntityProvider = IEntityProvider> extends ReactiveModel<Collection<T, P>> {
    #private;
    private total;
    private next;
    get isCollection(): boolean;
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
    static isCollection: boolean;
    get Item(): ICollectionOptions<T, P>['item'];
    get map(): Map<ItemId, T>;
    get items(): T[];
    constructor({ entity, provider, item, defaultLimit, nextParamName, }: ICollectionOptions<T, P> & {
        nextParamName?: string;
    });
    /**
     * Loads and processes data from an external source via the `DataProvider`.
     * This method uses the configured `provider` to fetch data and apply the specified filters.
     * Filtering parameters are defined in the `args` argument, and the specific filtering logic
     * is implemented by the `DataProvider`.
     *
     * ### Parameters:
     * - `args.where` (optional): Object defining search filters with the following structure:
     *   - `{ property: { operator: value } }`
     *   - Supported operators include:
     *     - `equals`: Exact match with the property value.
     *     - `not`: Value different from the specified value.
     *     - `in`: The property value matches one of the values in the array.
     *     - `notIn`: The property value does not match any of the values in the array.
     *     - `contains`: The property value contains the specified substring.
     *     - `startsWith`: The property value starts with the specified substring.
     *     - `endsWith`: The property value ends with the specified substring.
     *     - `gt` (greater than): The property value is greater than the specified value.
     *     - `gte` (greater than or equal): The property value is greater than or equal to the specified value.
     *     - `lt` (less than): The property value is less than the specified value.
     *     - `lte` (less than or equal): The property value is less than or equal to the specified value.
     *
     * - `args.orderBy` (optional): Object to define the sorting of results. Example:
     *   - `{ property: "asc" | "desc" }` where `"asc"` is ascending order and `"desc"` is descending order.
     *
     * - `args.skip` and `args.take` (optional): Parameters for in-memory pagination.
     *   - `skip`: Number of items to skip from the beginning.
     *   - `take`: Number of items to load after skipping the defined number in `skip`.
     *
     * ### Exceptions:
     * - Throws an error if the `DataProvider` is not defined or does not implement the `load` method.
     * - Throws an error if `DataProvider.load()` does not return an array.
     *
     * @param {Object} args - Object containing filtering and configuration parameters.
     * @returns {Promise<void>} - A promise that resolves when data loading and processing are complete.
     * @throws {Error} - If data cannot be loaded or processed.
     */
    /**
     * Load items from the configured provider.
     * If {@link ILoadSpecs.limit} is omitted, the collection's `defaultLimit`
     * (configured in the constructor) is used.
     *
     * Pagination is handled internally: if the collection has a pagination cursor ("next"),
     * it will be added to the request using the parameter name defined by `nextParamName`.
     * You do not need to pass the `next` parameter manually.
     */
    load(args?: ILoadSpecs<T>): Promise<T[]>;
    protected setItems(data: any, clear?: boolean): void;
    addItems(data: T[]): void;
    set(data: any): any;
    getProperties(): {
        items: T[];
    };
    getItemProperties(): any[];
    /**
     * Validates a new registry against the collection's filters and, if it matches,
     * creates a new item with the registry data and adds it to the data map.
     *
     * @param {object} registry - The new registry data to be checked and potentially added.
     */
    onNewRegistry(registry: Record<string, any>): void;
    delete(ids: ItemId | ItemId[]): Promise<boolean[]>;
    onRegistryDeleted(registry: Record<string, any>): void;
    /**
     * Validates if a registry matches the stored filters, including support for AND and OR logical operators.
     * The #filters object contains filtering criteria that are evaluated here.
     *
     * @param {object} registry - The data of the registry to be checked.
     * @returns {boolean} - Returns true if the registry matches all filter criteria; otherwise, false.
     */
    private matchesFilters;
}

export { Collection };
export type { ICollectionOptions, ICollectionProvider, ILoadSpecs };
