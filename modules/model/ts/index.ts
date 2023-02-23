import { Events } from "@beyond-js/events/events";
import { routing } from "@beyond-js/kernel/routing";
import Ajv from "ajv";
import { JSONSchemaType, JSONType } from "ajv";

type KeyedObject<K extends string | number | symbol, V> = {
    [key in K]?: V;
};

export /*bundle*/
class ReactiveModel<T> extends Events {
    #ready: boolean | undefined;
    protected schema: unknown;
    #ajv: Ajv;

    #properties: Record<keyof T, any> = {} as Record<keyof T, any>;

    get ready() {
        return this.#ready;
    }

    #fetching: boolean | undefined;
    get fetching() {
        return this.#fetching;
    }

    set fetching(value: boolean | undefined) {
        if (value === this.#fetching) return;
        this.#fetching = value;
        this.triggerEvent();
    }

    #fetched: boolean = false;
    get fetched(): boolean {
        return this.#fetched;
    }
    set fetched(value: boolean) {
        if (value === this.#fetched) return;
        this.#fetched = value;
        this.#fetched;
    }

    #processing: boolean = false;
    get processing(): boolean {
        return this.#processing;
    }

    #processed: boolean = false;
    get processed(): boolean {
        return this.#processed;
    }

    #loaded: boolean = false;
    get loaded(): boolean {
        return this.#loaded;
    }

    #compiled: any;
    #currentSchema: any;
    constructor() {
        super();
        console.log(100, this.schema);
        this.#ajv = new Ajv();
    }

    triggerEvent = (event: string = "change"): void => {
        this.trigger(event);
    };

    set<K extends keyof T>(key: K, value: T[K]) {
        if (!this.#compiled) {
        }
        this.#properties[key] = value;
    }

    get<K extends keyof T>(key: K): T[K] {
        return this.#properties[key];
    }
}
