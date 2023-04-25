/************
Processor: ts
************/

// database.ts
declare namespace ns_0 {
  interface User {
    id: number;
    name: string;
    lastnames: string;
  }
  interface LoadAllOptions {
    filter?: string;
    limit?: number;
  }
  export class UserStore {
    private db;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    loadUser(id: number): Promise<User>;
    storeUser(user: User): Promise<void>;
    loadAll(options?: LoadAllOptions): Promise<User[]>;
    bulkSave(users: any): Promise<any[]>;
  }
  export {};
}


export import UserStore = ns_0.UserStore;

export declare const hmr: {on: (event: string, listener: any) => void, off: (event: string, listener: any) => void };