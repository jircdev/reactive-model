/************
Processor: ts
************/

import __beyond_dep_def_0 from 'dexie';
import * as __beyond_dep_ns_1 from '@beyond-js/events/events';
// database.ts
declare namespace ns_0 {
  import Dexie = __beyond_dep_def_0;
  import Events = __beyond_dep_ns_1.Events;
  export class Database extends Events {
    #private;
    get db(): Dexie;
    get ready(): boolean;
    constructor(name: any, version: any);
    create(): Promise<void>;
    register: (data: any) => Promise<Dexie>;
  }
}


// index.ts
declare namespace ns_1 {
  import Dexie = __beyond_dep_def_0;
  import Events = __beyond_dep_ns_1.Events;
  export class DatabaseManager extends Events {
    #private;
    get ready(): any;
    get db(): Dexie;
    constructor();
    load(): any;
    open(identifier: any): Promise<any>;
    get: (name: any) => Promise<any>;
    config(name: any, stores: any): Promise<any>;
  }
  export const DBManager: DatabaseManager;
}


export import DatabaseManager = ns_1.DatabaseManager;
export import DBManager = ns_1.DBManager;

export declare const hmr: {on: (event: string, listener: any) => void, off: (event: string, listener: any) => void };