interface Inherited {
    bind: (event: string, listener: ListenerFunction, priority: number) => void;
    unbind: (event: string, Listener: ListenerFunction) => void;
}
interface EventsSpecs {
    supported?: [string];
    bind?: Inherited;
}
type ListenerFunction = (...args: any) => void;
interface ListenerSpecs {
    listener: ListenerFunction;
    priority: number;
}
interface TriggerSpecs {
    name: string;
    async?: boolean;
}
type Trigger = string | TriggerSpecs;

declare class Events {
    #private;
    get destroyed(): boolean;
    constructor(specs?: EventsSpecs);
    /**
     * Binds an event handler to an event name
     *
     * @param {string} event
     * @param {ListenerFunction} listener
     * @param {number} priority
     * @returns {this}
     */
    on(event: string, listener: ListenerFunction, priority?: number): this;
    bind: (event: string, listener: ListenerFunction, priority?: number) => this;
    /**
     * Unbind an event listener
     *
     * @param {string} event
     * @param {ListenerFunction} listener
     * @param {number} force
     * @returns {this}
     */
    off(event: string, listener: ListenerFunction, force?: number): this;
    unbind: (event: string, listener: ListenerFunction, force?: number) => this;
    /**
     * Triggers an event
     *
     * @param {Trigger} event
     * @param {*} rest
     * @returns {Promise<*>}
     */
    trigger(event: Trigger, ...rest: any): any;
    destroy(): void;
}

export { Events };
export type { EventsSpecs, Inherited, ListenerFunction, ListenerSpecs, Trigger, TriggerSpecs };
