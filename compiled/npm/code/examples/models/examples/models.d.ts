/************
Processor: ts
************/

import * as __beyond_dep_ns_0 from '@beyond-js/reactive/model';
// index.ts
declare namespace ns_0 {
  import ReactiveModel = __beyond_dep_ns_0.ReactiveModel;
  interface IUser {
    name?: string;
    password: string;
    lastname: string;
  }
  export class User extends ReactiveModel<IUser> {
    protected properties: string[];
    example(): void;
  }
  export {};
}


export import User = ns_0.User;

export declare const hmr: {on: (event: string, listener: any) => void, off: (event: string, listener: any) => void };