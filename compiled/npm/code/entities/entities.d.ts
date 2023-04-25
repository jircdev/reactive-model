/************
Processor: ts
************/

import * as __beyond_dep_ns_0 from '@beyond-js/reactive/model';
import * as __beyond_dep_ns_1 from 'dexie';
import __beyond_dep_def_1 from 'dexie';
// collection\index.ts
declare namespace ns_0 {
  import ReactiveModel = __beyond_dep_ns_0.ReactiveModel;
  import Item = ns_5.Item;
  import IITem = ns_5.IITem;
  import CollectionLocalProvider = ns_2.CollectionLocalProvider;
  interface IColleciton {
    items: object[];
    item: Item<IITem>;
  }
  interface ISpecs {}
  export abstract class Collection extends ReactiveModel<IColleciton> {
    #private;
    items: any[];
    get total(): number;
    provider: any;
    next: number | undefined;
    get localProvider(): CollectionLocalProvider;
    protected init(specs?: ISpecs): Promise<void>;
  }
  export {};
}


// collection\load.ts
declare namespace ns_1 {
  import Collection = ns_0.Collection;
  export class CollectionLoadManager {
    #private;
    get parent(): Collection;
    constructor(parent: any, bridge: any);
    init: () => Promise<void>;
    /**
     * metodo general para las consultas de tipo lista para las colecciones
     * @param params Object filters and configuration
     * parameters:
     *  - next
     *  - limit
     *  - update // siguiente pagina de misma consulta
     * - status // 1, 0, -1
     *  {user: [10,30]}
     *
     * {and: [{user:10}, {user:30}]]}
     *
     *  {user: 10}
     *  {user: [10,30,40,50]}
     * {or: [{user:10}, {user:30}]]}
     * {and: [{user:10}, {user:30}]]}
     *  el provider debe devolver:
     * 	- next
     * 	- entries
     *  - total
     * load({status:1})
     */
    load: (params?: any) => Promise<any[] | {
      status: boolean;
      error: {
        message: any;
      };
    }>;
    processEntries: (entries: any) => any[];
    remoteLoad: (params: any) => Promise<any>;
  }
}


// collection\local-provider.ts
declare namespace ns_2 {
  import ReactiveModel = __beyond_dep_ns_0.ReactiveModel;
  import IProvider = ns_4.IProvider;
  import Dexie = __beyond_dep_def_1;
  export class CollectionLocalProvider extends ReactiveModel<IProvider> {
    #private;
    get store(): Dexie.Table<any, any>;
    get originalData(): {};
    get isOnline(): boolean;
    constructor(parent: any, bridge: any);
    setOffline(value: any): void;
    init: () => Promise<void>;
    private handleConnection;
    load(params: any): Promise<void>;
    save(data: any): PromiseExtended;
  }
}


// collection\publish.ts
declare namespace ns_3 {
  export class CollectionSaveManager {
    #private;
    constructor(parent: any, bridge: any);
    init(): void;
    save: (data?: any[]) => Promise<any>;
    publish: (data?: any[]) => Promise<any>;
    sync: () => void;
  }
}


// interfaces\provider.ts
declare namespace ns_4 {
  export interface IResponse {
    status: boolean;
    data: object;
  }
  export interface IProvider {
    publish(properties: Record<string, any>): Promise<IResponse>;
    load: (data: object) => Promise<any>;
    list: (params: any) => Promise<any>;
  }
}


// item\index.ts
declare namespace ns_5 {
  import Dexie = __beyond_dep_def_1;
  import ReactiveModel = __beyond_dep_ns_0.ReactiveModel;
  import IProvider = ns_4.IProvider;
  import LocalProvider = ns_7.LocalProvider;
  export interface IITem {
    provider: any;
    skeleton: Array<string>;
    isUnpublished: boolean;
    save: Function;
    load: Function;
    publish: Function;
    sync: Function;
  }
  export abstract class Item<T> extends ReactiveModel<IITem> {
    #private;
    protected localdb: boolean;
    protected provider: IProvider;
    protected storeName: string;
    protected db: string;
    protected localProvider: LocalProvider;
    get isUnpublished(): boolean;
    get skeleton(): string[];
    private __get;
    get store(): Dexie.Table<any, any>;
    constructor(id: any);
    setOffline: (value: any) => void;
    checkUnpublished: () => void;
    protected init({
      id
    }: {
      id: any;
    }): Promise<void>;
    addLocalProvider(db: string, table: string): void;
    set(data: any, init?: boolean): void;
    getValues(): {};
  }
}


// item\load.ts
declare namespace ns_6 {
  export class ItemLoadManager {
    #private;
    constructor(parent: any, getProperty: any);
    init: () => Promise<void>;
    /**
     *
     * @param id
     * @returns
     */
    load: (id: any) => Promise<void>;
    remoteLoad: (params: any) => Promise<any>;
  }
}


// item\local-provider.ts
declare namespace ns_7 {
  import ReactiveModel = __beyond_dep_ns_0.ReactiveModel;
  import IProvider = ns_4.IProvider;
  import Dexie = __beyond_dep_def_1;
  export class LocalProvider extends ReactiveModel<IProvider> {
    #private;
    get store(): Dexie.Table<any, any>;
    get originalData(): {};
    get isOnline(): boolean;
    constructor(parent: any, getProperty: any);
    setOffline(value: any): void;
    init: (id: string | number) => Promise<any>;
    private handleConnection;
    isUnpublished(data: any): boolean;
    load({
      id
    }?: {
      id?: any;
    }): Promise<any>;
    save(data: any): Promise<void>;
  }
}


// item\save.ts
declare namespace ns_8 {
  export class ItemSaveManager {
    #private;
    constructor(parent: any, getProperty: any);
    init(): void;
    save: (data?: any) => Promise<void>;
    sync: () => void;
  }
}


export import Collection = ns_0.Collection;
export import CollectionLocalProvider = ns_2.CollectionLocalProvider;
export import IProvider = ns_4.IProvider;
export import Item = ns_5.Item;
export import LocalProvider = ns_7.LocalProvider;

export declare const hmr: {on: (event: string, listener: any) => void, off: (event: string, listener: any) => void };