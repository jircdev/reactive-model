import { ReactiveModel, EntityProperty, IReactiveValue, SetPropertiesResult } from '@beyond-js/reactive/model';

interface IRegistrySpecs {
    id?: any;
    properties?: any[];
    instanceId?: any;
    parent?: any;
    register?: boolean;
    [key: string]: any;
}
declare class Registry extends ReactiveModel<Registry> {
    #private;
    get state(): "draft" | "published" | "deleted";
    get draft(): boolean;
    set draft(value: boolean);
    get id(): any;
    get instanceId(): any;
    get values(): any;
    get deleted(): boolean;
    set deleted(value: boolean);
    constructor(entity: string, { properties, parent, register, ...data }?: IRegistrySpecs);
    setValues(data: Record<string, any>, publish?: boolean): boolean;
    getValues(): any;
}

type RegistryId = string | number;

/**
 * Factory for managing multiple registry instances.
 */
declare class RegistryFactory<T> extends ReactiveModel<RegistryFactory<T>> {
    #private;
    items: Map<RegistryId, Registry>;
    constructor(name: string, properties: any);
    getItem(id: RegistryId, data: any): Registry;
    static getInstance<T>(entity: string, data?: any): RegistryFactory<T>;
}

/**
 * Base interface for Item entities.
 * All Items must have an id property.
 */
interface IItem {
    id: string | number;
}
/**
 * Type for Item identifiers.
 */
type ItemId = string | number;
/**
 * Constructor options for Item class.
 */
interface IItemProps<T, P extends IEntityProvider> {
    /** Optional initial ID */
    id?: ItemId;
    /** Provider class constructor */
    provider?: new (parent: Item<T & IItem, P>) => P;
    /** Entity name for registry */
    entity: string;
    /** Array of reactive property names or definitions */
    properties?: EntityProperty<T>[];
    /** Whether to register in the factory immediately */
    register?: boolean;
}
/**
 * Standard response format from provider operations.
 */
interface IItemProviderResponse<T> {
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
 * Interface for Item data providers.
 * Providers handle communication with external data sources (APIs, databases, etc.)
 *
 * All methods are optional - implement only what you need.
 */
interface IEntityProvider {
    /**
     * Load a single item by ID or specs.
     * Should return the item data directly (not wrapped in response object).
     */
    load?(specs?: unknown): Promise<unknown>;
    /**
     * List multiple items with optional filtering.
     * Used by Collection, not typically used directly on Item.
     */
    list?(specs?: unknown): Promise<unknown>;
    /**
     * Save/update an item.
     * Should return { status: number, data: T }
     */
    publish?(data: unknown): Promise<IItemProviderResponse<unknown>>;
    /**
     * Remove an item (alternative to delete).
     */
    remove?(specs: unknown): Promise<boolean>;
    /**
     * Delete an item by ID.
     */
    delete?(id?: ItemId): Promise<boolean>;
    /**
     * Delete multiple items by IDs.
     * Used by Collection for bulk operations.
     */
    deleteMany?(ids?: ItemId[]): Promise<boolean>;
}

/**
 * Item class for managing individual domain entities.
 * Implements IReactiveValue for unified reactive value handling.
 *
 * @template T - The entity type (must extend IItem)
 * @template P - The provider type
 */
declare class Item<T extends IItem, P extends IEntityProvider = IEntityProvider> extends ReactiveModel<T> implements IReactiveValue<Partial<T>> {
    #private;
    get entity(): string;
    get __registryState(): "draft" | "published" | "deleted";
    get fetched(): boolean;
    get found(): boolean;
    protected _provider: P;
    get provider(): P;
    get registry(): Registry;
    get __instanceId(): any;
    get draft(): boolean;
    deleted: boolean;
    /**
     * Returns the list of properties that have been modified since the last publish.
     */
    get changedProperties(): (keyof T)[];
    /**
     * Returns only the properties that have changed since the last publish.
     * Useful for partial updates to avoid sending unchanged data.
     */
    getChangedValues(): Partial<T>;
    /**
     * Clears the tracked changed properties.
     * Called automatically after successful publish.
     */
    clearChangedProperties(): void;
    constructor({ entity, provider, properties, ...args }?: Partial<IItemProps<T, P>>);
    /**
     *
     * @param param0
     */
    protected initialize({ ...args }: {
        [x: string]: any;
    }): void;
    set(values: Partial<T>): SetPropertiesResult;
    /**
     * Serializes the item to a plain object for JSON output.
     * Returns the item's properties without the Item instance wrapper.
     */
    serialize(): Partial<T>;
    onSet(): void;
    /**
     * Lifecycle hook called before load() executes.
     * Override to modify load arguments or perform pre-load actions.
     *
     * @param args - Arguments to be passed to provider.load()
     * @returns Modified arguments or original args
     */
    protected beforeLoad(args: unknown): Promise<unknown>;
    /**
     * Lifecycle hook called after load() completes successfully.
     * Override to transform loaded data or perform post-load actions.
     *
     * @param data - Data returned from provider.load()
     * @returns Modified data or original data
     */
    protected afterLoad(data: T): Promise<T>;
    /**
     * Lifecycle hook called before publish() executes.
     * Override to modify data before saving or perform validation.
     *
     * @param data - Data to be published
     * @returns Modified data or original data
     */
    protected beforePublish(data: Partial<T>): Promise<Partial<T>>;
    /**
     * Lifecycle hook called after publish() completes successfully.
     * Override to perform post-save actions.
     *
     * @param data - Data that was saved
     */
    protected afterPublish(data: T): Promise<void>;
    /**
     * Lifecycle hook called before delete() executes.
     * Override to perform validation or cleanup before deletion.
     * Return false to cancel the deletion.
     *
     * @param id - ID of the item being deleted
     * @returns true to proceed with deletion, false to cancel
     */
    protected beforeDelete(id: ItemId): Promise<boolean>;
    /**
     * Lifecycle hook called after delete() completes successfully.
     * Override to perform post-deletion cleanup.
     *
     * @param id - ID of the deleted item
     */
    protected afterDelete(id: ItemId): Promise<void>;
    protected _load(args: unknown): void;
    /**
     * Loads the item from the provider.
     * Executes lifecycle hooks: beforeLoad -> load -> afterLoad
     * Runs plugins: onBeforeLoad -> onAfterLoad
     * Emits events: pre:load -> load -> post:load
     */
    load(args?: unknown): Promise<T>;
    /**
     * Publishes (saves) the item via the provider.
     * Executes lifecycle hooks: beforePublish -> publish -> afterPublish
     * Runs plugins: onBeforePublish -> onAfterPublish
     * Emits events: pre:publish -> publish -> post:publish
     *
     * @param data - Optional data to publish. If not provided, uses current properties.
     * @param options - Options for publish behavior
     * @param options.partial - If true, only sends changed properties
     */
    publish(data?: Partial<T>, options?: {
        partial?: boolean;
    }): Promise<Partial<T>>;
    /**
     * Deletes the item via the provider.
     * Executes lifecycle hooks: beforeDelete -> delete -> afterDelete
     * Runs plugins: onBeforeDelete -> onAfterDelete
     * Emits events: pre:delete -> delete -> post:delete
     */
    delete(options?: {
        skipProvider?: boolean;
    }): Promise<boolean>;
}

export { Item, RegistryFactory };
export type { IEntityProvider, IItem, IItemProps, ItemId };
