import { ReactiveModel, SetPropertiesResult } from '@beyond-js/reactive/model';

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

interface IItem {
    id: string | number;
}
type ItemId = string | number;
interface IItemProps<T, P extends IEntityProvider> {
    id?: ItemId;
    provider: new (parent: any) => P;
    entity: string;
    properties: any;
    register?: boolean;
}
interface IEntityProvider {
    load?(specs?: any): Promise<any>;
    list?(specs?: any): Promise<any>;
    publish?(data: any): Promise<any>;
    remove?(specs: any): Promise<any>;
    delete?(specs?: any): Promise<any>;
    deleteMany?(specs?: any): Promise<any>;
}

declare class Item<T extends IItem, P extends IEntityProvider = IEntityProvider> extends ReactiveModel<T> {
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
    constructor({ entity, provider, properties, ...args }?: Partial<IItemProps<T, P>>);
    /**
     *
     * @param param0
     */
    protected initialize({ ...args }: {
        [x: string]: any;
    }): void;
    set(values: any): SetPropertiesResult;
    onSet(): void;
    protected _load(args: any): void;
    load(args?: any): Promise<any>;
    publish(data?: any): Promise<any>;
    delete(options?: {
        skipProvider?: boolean;
    }): Promise<boolean>;
}

export { Item, RegistryFactory };
export type { IEntityProvider, IItem, IItemProps, ItemId };
