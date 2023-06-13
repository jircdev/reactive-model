import { PendingPromise } from '@beyond-js/kernel/core';
import { ReactiveModel } from '@beyond-js/reactive/model';
import { v4 as uuidv4 } from 'uuid';
interface IRegistry {
    values?: object;
    id?: string | number;
}
export class Registry extends ReactiveModel<IRegistry> {
    #values: any = {};
    get values() {
        return this.#values;
    }
    #id;
    local = false;
    #store;
    #isNew;
    #instanceId;
    #keyId;

    #landed;
    get landed() {
        return this.#landed;
    }

    get instanceId() {
        return this.#instanceId;
    }
    constructor(store, data: IRegistry = { id: undefined }) {
        super();

        const { id } = data;
        this.#store = store;

        //this.#id = id === 'new' ? this.#instanceId : id;
        this.#isNew = id === undefined;
        this.#id = id;

        this.#instanceId = id ?? uuidv4();
        if (!id) this.#id = this.#instanceId;
        this.#keyId = this.isNew ? '#instanceId' : '#id';

        if (this.#id) this.#values.id = this.#id;
    }

    #promise: PendingPromise<this>;
    async get() {
        if (this.#promise) {
            return this.#promise;
        }

        this.#promise = new PendingPromise();

        if (this.#isNew) {
            this.#promise.resolve(this);
        } else {
            this.#store.get(this.#id).then(item => {
                if (!item) {
                    this.#promise.resolve(false);
                    this.#landed = false;

                    this.setValues({ id: this.#id });
                    this.#promise = undefined;
                    return;
                }

                this.#landed = true;
                this.setValues(item);
                this.#promise.resolve(this);
            });
        }

        return this.#promise;
    }

    setValues = (data, backend = false) => {
        const props = Object.keys(data);

        let updated = false;
        // specify if the item was generated locally
        if (backend) {
            this.#isNew = false;
            this.#instanceId = undefined;
            delete this.#values.instanceId;
        }
        if (!data.id) {
            data.id = this.#id;
        }
        this.local = this.local;
        if (this.#isNew) {
            this.#values.instanceId = this.#instanceId;
        }

        const newValues = { ...this.#values };
        props.forEach(property => {
            if (data[property] === newValues[property]) return;
            newValues[property] = data[property];
            updated = true;
        });

        this.#values = newValues;
        this.triggerEvent();
        return updated;
    };

    getValues() {
        const values = { ...this.#values };
        if (this.#instanceId) values.instanceId = this.#instanceId;
        //		if (this.offline) values.offline = this.offline; // this line may be removed, the offline value must be set by the localProvider
        return values;
    }

    update = async (data: any, backend) => {
        const updated = this.setValues(data, backend);
        if (updated) {
            await this.#store.put(this.#values);
            this.triggerEvent('change');
        }
    };
}
