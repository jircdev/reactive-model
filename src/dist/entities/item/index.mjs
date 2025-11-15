import { ReactiveModel } from '@beyond-js/reactive/model';
import { v4 } from 'uuid';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

var _Registry_id, _Registry_instanceId, _Registry_isDeleted, _Registry_draft, _Registry_state, _Registry_values, _Registry_entity;
class Registry extends ReactiveModel {
    get state() {
        return __classPrivateFieldGet(this, _Registry_state, "f");
    }
    get draft() {
        return __classPrivateFieldGet(this, _Registry_draft, "f");
    }
    set draft(value) {
        if (value === __classPrivateFieldGet(this, _Registry_draft, "f"))
            return;
        __classPrivateFieldSet(this, _Registry_draft, value, "f");
        this.trigger("change");
    }
    get id() {
        return __classPrivateFieldGet(this, _Registry_id, "f") || __classPrivateFieldGet(this, _Registry_values, "f").id;
    }
    get instanceId() {
        return __classPrivateFieldGet(this, _Registry_instanceId, "f");
    }
    get values() {
        return __classPrivateFieldGet(this, _Registry_values, "f");
    }
    get deleted() {
        return __classPrivateFieldGet(this, _Registry_isDeleted, "f");
    }
    set deleted(value) {
        if (value === __classPrivateFieldGet(this, _Registry_isDeleted, "f"))
            return;
        __classPrivateFieldSet(this, _Registry_isDeleted, value, "f");
        this.trigger("record.deleted", __classPrivateFieldGet(this, _Registry_values, "f"));
        this.trigger("change");
    }
    constructor(entity, { properties, parent, register, ...data } = {}) {
        super({ properties: properties || [] });
        _Registry_id.set(this, void 0);
        _Registry_instanceId.set(this, void 0);
        _Registry_isDeleted.set(this, false);
        _Registry_draft.set(this, false);
        _Registry_state.set(this, "draft");
        _Registry_values.set(this, void 0);
        _Registry_entity.set(this, void 0);
        __classPrivateFieldSet(this, _Registry_entity, entity, "f");
        const { id } = data;
        __classPrivateFieldSet(this, _Registry_instanceId, (data === null || data === void 0 ? void 0 : data.instanceId) ? data.instanceId : v4(), "f");
        __classPrivateFieldSet(this, _Registry_id, id, "f");
        __classPrivateFieldSet(this, _Registry_draft, !id, "f");
        // Loop through data and ignore reactive objects
        __classPrivateFieldSet(this, _Registry_values, Object.entries(data).reduce((acc, [key, value]) => {
            if (typeof value === "object" && (value === null || value === void 0 ? void 0 : value.isReactive)) {
                return acc;
            }
            acc[key] = value;
            return acc;
        }, { id: __classPrivateFieldGet(this, _Registry_id, "f") }), "f");
        __classPrivateFieldSet(this, _Registry_state, __classPrivateFieldGet(this, _Registry_id, "f") ? "published" : "draft", "f");
        this.setValues(__classPrivateFieldGet(this, _Registry_values, "f"));
    }
    setValues(data, publish = false) {
        if (!data || Object.keys(data).length === 0)
            return false;
        const baseState = __classPrivateFieldGet(this, _Registry_state, "f");
        let updated = false;
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const value = data[key];
                if (value === __classPrivateFieldGet(this, _Registry_values, "f")[key])
                    continue;
                __classPrivateFieldGet(this, _Registry_values, "f")[key] = value;
                updated = true;
            }
        }
        if (!updated)
            return false;
        this.trigger("change", { values: __classPrivateFieldGet(this, _Registry_values, "f") });
        this.trigger("record.updated", { ...__classPrivateFieldGet(this, _Registry_values, "f") });
        // Solo dispara record.published si está en draft y publish = true
        if (publish && baseState === "draft") {
            __classPrivateFieldSet(this, _Registry_state, "published", "f");
            this.trigger("record.published", { ...__classPrivateFieldGet(this, _Registry_values, "f") });
        }
        return true;
    }
    getValues() {
        return { ...__classPrivateFieldGet(this, _Registry_values, "f") };
    }
}
_Registry_id = new WeakMap(), _Registry_instanceId = new WeakMap(), _Registry_isDeleted = new WeakMap(), _Registry_draft = new WeakMap(), _Registry_state = new WeakMap(), _Registry_values = new WeakMap(), _Registry_entity = new WeakMap();

var _a, _RegistryFactory_instances, _RegistryFactory_name;
/**
 * Factory for managing multiple registry instances.
 */
class RegistryFactory extends ReactiveModel {
    constructor(name, properties) {
        super({ properties });
        this.items = new Map();
        _RegistryFactory_name.set(this, void 0);
        __classPrivateFieldSet(this, _RegistryFactory_name, name, "f");
        this.ready = true;
    }
    getItem(id, data) {
        if (!id || !this.items.has(id)) {
            const specs = data ? { id, ...data } : { id, properties: this.properties, ...data };
            const registry = new Registry(__classPrivateFieldGet(this, _RegistryFactory_name, "f"), specs);
            registry.on('record.published', registry => {
                this.trigger('record.published', registry);
            });
            /**
             * If the register property is true, the registry is published and the event is triggered
             * This is used to register the registry in the collection
             */
            if (data.register)
                this.trigger('record.published', registry.getValues());
            registry.on('record.updated', registry => this.trigger('update.registry', registry));
            registry.on('record.deleted', registry => this.trigger('record.deleted', registry));
            id = registry.id;
            this.items.set(id, registry);
        }
        const item = this.items.get(id);
        // if (data) {
        // 	let specs = data;
        // 	if (!data.id) {
        // 		delete specs.id;
        // 	}
        // 	item.setValues(data);
        // }
        return item;
    }
    static getInstance(entity, data) {
        if (!__classPrivateFieldGet(this, _a, "f", _RegistryFactory_instances).has(entity)) {
            __classPrivateFieldGet(this, _a, "f", _RegistryFactory_instances).set(entity, new _a(entity, data));
        }
        return __classPrivateFieldGet(this, _a, "f", _RegistryFactory_instances).get(entity);
    }
}
_a = RegistryFactory, _RegistryFactory_name = new WeakMap();
_RegistryFactory_instances = { value: new Map() };

var _Item_factory, _Item_entity, _Item_registry, _Item_fetched, _Item_found, _Item_draft;
class Item extends ReactiveModel {
    get entity() {
        return __classPrivateFieldGet(this, _Item_entity, "f");
    }
    get __registryState() {
        return __classPrivateFieldGet(this, _Item_registry, "f").state;
    }
    get fetched() {
        return __classPrivateFieldGet(this, _Item_fetched, "f");
    }
    get found() {
        return __classPrivateFieldGet(this, _Item_found, "f");
    }
    get provider() {
        return this._provider;
    }
    get registry() {
        return __classPrivateFieldGet(this, _Item_registry, "f");
    }
    get __instanceId() {
        return __classPrivateFieldGet(this, _Item_registry, "f").instanceId;
    }
    get draft() {
        return __classPrivateFieldGet(this, _Item_draft, "f");
    }
    constructor({ entity, provider, properties, ...args } = {}) {
        super({ ...args, properties });
        _Item_factory.set(this, void 0);
        _Item_entity.set(this, void 0);
        _Item_registry.set(this, void 0);
        _Item_fetched.set(this, void 0);
        _Item_found.set(this, false);
        _Item_draft.set(this, void 0);
        // if (this.constructor.name === 'Assignment')
        if (!entity)
            throw new Error('Entity is required');
        if (provider && typeof provider !== 'function') {
            throw new Error(`Provider must be a class/constructor in object ${entity}`);
        }
        this.reactiveProps(['deleted']);
        __classPrivateFieldSet(this, _Item_entity, entity, "f");
        this.onSet = this.onSet.bind(this);
        /**
         * This event is triggered when the set method is executed.
         */
        this.on('set.executed', this.onSet);
        if (provider) {
            this._provider = new provider(this);
        }
        __classPrivateFieldSet(this, _Item_factory, RegistryFactory.getInstance(entity), "f");
        this.initialize(args);
    }
    /**
     *
     * @param param0
     */
    initialize({ ...args }) {
        const registry = __classPrivateFieldGet(this, _Item_factory, "f").getItem(this.getProperty('id'), args);
        __classPrivateFieldSet(this, _Item_registry, registry, "f");
        const propertyValues = __classPrivateFieldGet(this, _Item_registry, "f").getValues();
        this.setInitialValues(propertyValues);
        // this.#registry.on('change', this.registryListener.bind(this));
        this.properties.forEach(property => {
            // TODO: capability to support object type properties.
            if (typeof property === 'string') {
                this.on(`${property}.changed`, () => {
                    __classPrivateFieldGet(this, _Item_registry, "f").setValues({ [property]: this.getProperty(property) });
                });
            }
        });
    }
    set(values) {
        const response = super.set(values);
        return response;
    }
    onSet() {
        var _a;
        (_a = __classPrivateFieldGet(this, _Item_registry, "f")) === null || _a === void 0 ? void 0 : _a.setValues(this.getProperties());
    }
    _load(args) { }
    // Define optional methods with a default implementation that gives a warning message
    async load(args) {
        if (!this.provider || typeof this.provider.load !== 'function') {
            throw new Error(`DataProvider is not defined or does not implement the load() method in object ${this.constructor.name}`);
        }
        this.fetching = true;
        try {
            const response = await this.provider.load(args);
            const data = response;
            if (!data) {
                __classPrivateFieldSet(this, _Item_found, false, "f");
                throw new Error('Provider.load() did not return an item.');
            }
            __classPrivateFieldSet(this, _Item_found, true, "f");
            __classPrivateFieldSet(this, _Item_fetched, true, "f");
            this.set(data);
            this.setInitialValues(data);
            this.trigger('load', { ...this.getProperties() });
            this.trigger('change');
            return response;
        }
        catch (e) {
            __classPrivateFieldSet(this, _Item_found, false, "f");
            __classPrivateFieldSet(this, _Item_fetched, false, "f");
            throw e;
        }
        finally {
            this.fetching = false;
        }
    }
    async publish(data) {
        data = data ? data : this.getProperties();
        this.set({ ...this.getProperties(), ...data });
        __classPrivateFieldGet(this, _Item_registry, "f").setValues(this.getProperties, true);
        super.saveChanges();
        if (this.provider && typeof this.provider.publish === 'function') {
            const updated = await this.provider.publish(data);
            if (!updated.status) {
                throw new Error('Error saving item');
            }
            this.set(updated.data);
            return updated.data;
        }
        return this.getProperties();
    }
    async delete(options) {
        try {
            const id = this.getProperty('id');
            __classPrivateFieldGet(this, _Item_registry, "f").deleted = true;
            this.trigger('change');
            if (!this.provider)
                return true;
            if (!(options === null || options === void 0 ? void 0 : options.skipProvider) && this.provider && typeof this.provider.delete === 'function') {
                this.processing = true;
                await this.provider.delete(id);
            }
            return true;
        }
        catch (e) {
            console.error(e);
            return false;
        }
        finally {
            this.processing = false;
        }
    }
}
_Item_factory = new WeakMap(), _Item_entity = new WeakMap(), _Item_registry = new WeakMap(), _Item_fetched = new WeakMap(), _Item_found = new WeakMap(), _Item_draft = new WeakMap();

export { Item, RegistryFactory };
//# sourceMappingURL=index.mjs.map
