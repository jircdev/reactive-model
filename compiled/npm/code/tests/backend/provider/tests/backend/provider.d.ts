/************
Processor: ts
************/

// index.ts
declare namespace ns_0 {
  const ActionsBridge: any;
  export class UserProvider extends ActionsBridge {
    publish(data: any): Promise<any>;
    load({
      id
    }: {
      id: any;
    }): Promise<any>;
    list(): Promise<any>;
    bulkSave(data: any): Promise<any>;
    constructor();
  }
  export {};
}


// users.ts
declare namespace ns_1 {
  const ActionsBridge: any;
  export class UsersProvider extends ActionsBridge {
    save(data: any): Promise<any>;
    load({
      id
    }: {
      id: any;
    }): Promise<any>;
    list(): Promise<any>;
    send(): Promise<any>;
    constructor();
  }
  export {};
}


export import UserProvider = ns_0.UserProvider;
export import UsersProvider = ns_1.UsersProvider;

export declare const hmr: {on: (event: string, listener: any) => void, off: (event: string, listener: any) => void };