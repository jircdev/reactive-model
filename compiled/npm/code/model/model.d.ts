/************
Processor: ts
************/

import * as __beyond_dep_ns_0 from '@beyond-js/events/events';
// index.ts
declare namespace ns_0 {
  import Events = __beyond_dep_ns_0.Events;
  interface ReactiveModelPublic<T> {
    ready: boolean | undefined;
    fetching: boolean | undefined;
    fetched: boolean;
    processing: boolean;
    processed: boolean;
    loaded: boolean;
    [key: string]: any;
  }
  /**
   * The `ReactiveModel` class is a subclass of the `Events` class that provides a simple way to create
   * reactive properties that can trigger events when they change. It also provides methods for setting
   * and getting property values.
   *
   * @template T - The type of the properties that can be defined in the model.
   * @extends Events
   */
  export class ReactiveModel<T> extends Events {
    protected schema: unknown;
    [key: string]: any;
    fetching: boolean;
    fetched: boolean;
    processing: boolean;
    ready: boolean;
    processed: boolean;
    protected properties: string[];
    loaded: boolean;
    /**
     * The `triggerEvent` method triggers a change event on the model, which can be used to notify
     * subscribers of changes to the model's properties.
     *
     * @param {string} event - The name of the event to trigger.
     * @returns {void}
     */
    triggerEvent: (event?: string) => void;
    /**
     * The `set` method sets one or more properties on the model.
     *
     * @param {keyof ReactiveModelPublic<T>} property - The name of the property to set.
     * @param {*} value - The value to set the property to.
     * @returns {void}
     */
    set(property: keyof ReactiveModelPublic<T>, value: any): void;
    /**
     * The `set` method sets one or more properties on the model.
     *
     * @param {keyof ReactiveModelPublic<T>} property - The name of the property to set.
     * @param {*} value - The value to set the property to.
     * @returns {void}
     */
    getProperties(): Record<string, any>;
  }
  export {};
}


// property.ts
declare namespace ns_1 {
  import ReactiveModel = ns_0.ReactiveModel;
  export function reactiveProp<T>(target: ReactiveModel<T>, propKey: string): void;
  export function reactiveProps<T>(props: Array<keyof T>): (target: ReactiveModel<T>, propKey: string) => void;
}


export import ReactiveModel = ns_0.ReactiveModel;
export import reactiveProp = ns_1.reactiveProp;
export import reactiveProps = ns_1.reactiveProps;

export declare const hmr: {on: (event: string, listener: any) => void, off: (event: string, listener: any) => void };