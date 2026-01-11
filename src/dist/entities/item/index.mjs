import { ReactiveModel, PluginManager } from '@beyond-js/reactive/model';
import { v7 } from 'uuid';

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
        __classPrivateFieldSet(this, _Registry_instanceId, (data === null || data === void 0 ? void 0 : data.instanceId) ? data.instanceId : v7(), "f");
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

var _Item_factory, _Item_entity, _Item_registry, _Item_fetched, _Item_found, _Item_draft, _Item_changedProperties;
/**
 * Item class for managing individual domain entities.
 * Implements IReactiveValue for unified reactive value handling.
 *
 * @template T - The entity type (must extend IItem)
 * @template P - The provider type
 */
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
    /**
     * Returns the list of properties that have been modified since the last publish.
     */
    get changedProperties() {
        return [...__classPrivateFieldGet(this, _Item_changedProperties, "f")];
    }
    /**
     * Returns only the properties that have changed since the last publish.
     * Useful for partial updates to avoid sending unchanged data.
     */
    getChangedValues() {
        const changed = {};
        for (const prop of __classPrivateFieldGet(this, _Item_changedProperties, "f")) {
            changed[prop] = this.getProperty(prop);
        }
        // Always include id for identification
        if (this.getProperty('id')) {
            changed['id'] = this.getProperty('id');
        }
        return changed;
    }
    /**
     * Clears the tracked changed properties.
     * Called automatically after successful publish.
     */
    clearChangedProperties() {
        __classPrivateFieldGet(this, _Item_changedProperties, "f").clear();
    }
    constructor({ entity, provider, properties, ...args } = {}) {
        super({ properties, ...args });
        _Item_factory.set(this, void 0);
        _Item_entity.set(this, void 0);
        _Item_registry.set(this, void 0);
        _Item_fetched.set(this, false);
        _Item_found.set(this, false);
        _Item_draft.set(this, void 0);
        // Tracking changed properties for partial updates
        _Item_changedProperties.set(this, new Set());
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
        // Track which properties are being changed
        if (values) {
            for (const key of Object.keys(values)) {
                __classPrivateFieldGet(this, _Item_changedProperties, "f").add(key);
            }
        }
        const response = super.set(values);
        return response;
    }
    // ==========================================
    // IReactiveValue Implementation (explicit overrides)
    // ==========================================
    /**
     * Serializes the item to a plain object for JSON output.
     * Returns the item's properties without the Item instance wrapper.
     */
    serialize() {
        return this.getProperties();
    }
    onSet() {
        var _a;
        (_a = __classPrivateFieldGet(this, _Item_registry, "f")) === null || _a === void 0 ? void 0 : _a.setValues(this.getProperties());
    }
    // ==========================================
    // LIFECYCLE HOOKS - Override in subclasses
    // ==========================================
    /**
     * Lifecycle hook called before load() executes.
     * Override to modify load arguments or perform pre-load actions.
     *
     * @param args - Arguments to be passed to provider.load()
     * @returns Modified arguments or original args
     */
    async beforeLoad(args) {
        return args;
    }
    /**
     * Lifecycle hook called after load() completes successfully.
     * Override to transform loaded data or perform post-load actions.
     *
     * @param data - Data returned from provider.load()
     * @returns Modified data or original data
     */
    async afterLoad(data) {
        return data;
    }
    /**
     * Lifecycle hook called before publish() executes.
     * Override to modify data before saving or perform validation.
     *
     * @param data - Data to be published
     * @returns Modified data or original data
     */
    async beforePublish(data) {
        return data;
    }
    /**
     * Lifecycle hook called after publish() completes successfully.
     * Override to perform post-save actions.
     *
     * @param data - Data that was saved
     */
    async afterPublish(data) {
        // Default implementation does nothing
    }
    /**
     * Lifecycle hook called before delete() executes.
     * Override to perform validation or cleanup before deletion.
     * Return false to cancel the deletion.
     *
     * @param id - ID of the item being deleted
     * @returns true to proceed with deletion, false to cancel
     */
    async beforeDelete(id) {
        return true;
    }
    /**
     * Lifecycle hook called after delete() completes successfully.
     * Override to perform post-deletion cleanup.
     *
     * @param id - ID of the deleted item
     */
    async afterDelete(id) {
        // Default implementation does nothing
    }
    // ==========================================
    // CRUD OPERATIONS WITH LIFECYCLE HOOKS
    // ==========================================
    _load(args) { }
    /**
     * Loads the item from the provider.
     * Executes lifecycle hooks: beforeLoad -> load -> afterLoad
     * Runs plugins: onBeforeLoad -> onAfterLoad
     * Emits events: pre:load -> load -> post:load
     */
    async load(args) {
        if (!this.provider || typeof this.provider.load !== 'function') {
            throw new Error(`DataProvider is not defined or does not implement the load() method in object ${this.constructor.name}`);
        }
        this.fetching = true;
        try {
            // 1. Execute beforeLoad hook (class method)
            let loadArgs = await this.beforeLoad(args);
            // 2. Execute plugins beforeLoad
            const pluginResult = await PluginManager.runHook('onBeforeLoad', this, loadArgs, __classPrivateFieldGet(this, _Item_entity, "f"));
            loadArgs = pluginResult.value;
            // 3. Emit pre:load event
            this.trigger('pre:load', loadArgs);
            // 4. Execute provider load
            const response = await this.provider.load(loadArgs);
            if (!response) {
                __classPrivateFieldSet(this, _Item_found, false, "f");
                throw new Error('Provider.load() did not return an item.');
            }
            // 5. Execute afterLoad hook (class method)
            let data = await this.afterLoad(response);
            // 6. Execute plugins afterLoad
            const afterPluginResult = await PluginManager.runHook('onAfterLoad', this, data, __classPrivateFieldGet(this, _Item_entity, "f"));
            data = afterPluginResult.value;
            __classPrivateFieldSet(this, _Item_found, true, "f");
            __classPrivateFieldSet(this, _Item_fetched, true, "f");
            this.set(data);
            this.setInitialValues(data);
            // Clear changed properties since we just loaded fresh data
            this.clearChangedProperties();
            // 7. Emit load and post:load events
            this.trigger('load', { ...this.getProperties() });
            this.trigger('post:load', data);
            this.trigger('change');
            return data;
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
    /**
     * Publishes (saves) the item via the provider.
     * Executes lifecycle hooks: beforePublish -> publish -> afterPublish
     * Runs plugins: onBeforePublish -> onAfterPublish
     * Emits events: pre:publish -> publish -> post:publish
     *
     * @param data - Optional data to publish. If not provided, uses current properties.
     * @param options - Options for publish behavior
     * @param options.partial - If true, only sends changed properties
     */
    async publish(data, options = {}) {
        // Determine what data to publish
        let publishData;
        if (data) {
            publishData = data;
        }
        else if (options.partial) {
            publishData = this.getChangedValues();
        }
        else {
            publishData = this.getProperties();
        }
        this.processing = true;
        try {
            // 1. Execute beforePublish hook (class method)
            publishData = await this.beforePublish(publishData);
            // 2. Execute plugins beforePublish
            const pluginResult = await PluginManager.runHook('onBeforePublish', this, publishData, __classPrivateFieldGet(this, _Item_entity, "f"));
            publishData = pluginResult.value;
            // 3. Emit pre:publish event
            this.trigger('pre:publish', publishData);
            // 4. Apply changes locally
            this.set({ ...this.getProperties(), ...publishData });
            __classPrivateFieldGet(this, _Item_registry, "f").setValues(this.getProperties(), true);
            super.saveChanges();
            let result = this.getProperties();
            // 5. Execute provider publish if available
            if (this.provider && typeof this.provider.publish === 'function') {
                const updated = await this.provider.publish(publishData);
                if (!updated.status) {
                    throw new Error('Error saving item');
                }
                this.set(updated.data);
                result = updated.data;
            }
            // 6. Execute afterPublish hook (class method)
            await this.afterPublish(result);
            // 7. Execute plugins afterPublish
            await PluginManager.runVoidHook('onAfterPublish', this, [result], __classPrivateFieldGet(this, _Item_entity, "f"));
            // 8. Clear changed properties after successful publish
            this.clearChangedProperties();
            // 9. Emit publish and post:publish events
            this.trigger('publish', result);
            this.trigger('post:publish', result);
            return result;
        }
        finally {
            this.processing = false;
        }
    }
    /**
     * Deletes the item via the provider.
     * Executes lifecycle hooks: beforeDelete -> delete -> afterDelete
     * Runs plugins: onBeforeDelete -> onAfterDelete
     * Emits events: pre:delete -> delete -> post:delete
     */
    async delete(options) {
        const id = this.getProperty('id');
        try {
            // 1. Execute beforeDelete hook (class method)
            const shouldDelete = await this.beforeDelete(id);
            if (!shouldDelete) {
                return false;
            }
            // 2. Execute plugins beforeDelete
            const pluginResult = await PluginManager.runHook('onBeforeDelete', this, id, __classPrivateFieldGet(this, _Item_entity, "f"));
            if (pluginResult.cancelled) {
                return false;
            }
            // 3. Emit pre:delete event
            this.trigger('pre:delete', { id });
            this.processing = true;
            // 4. Execute provider delete if applicable
            if (!(options === null || options === void 0 ? void 0 : options.skipProvider) && this.provider && typeof this.provider.delete === 'function') {
                await this.provider.delete(id);
            }
            // 5. Mark as deleted in registry
            __classPrivateFieldGet(this, _Item_registry, "f").deleted = true;
            // 6. Execute afterDelete hook (class method)
            await this.afterDelete(id);
            // 7. Execute plugins afterDelete
            await PluginManager.runVoidHook('onAfterDelete', this, [id], __classPrivateFieldGet(this, _Item_entity, "f"));
            // 8. Emit delete and post:delete events
            this.trigger('delete', { id });
            this.trigger('post:delete', { id });
            this.trigger('change');
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
_Item_factory = new WeakMap(), _Item_entity = new WeakMap(), _Item_registry = new WeakMap(), _Item_fetched = new WeakMap(), _Item_found = new WeakMap(), _Item_draft = new WeakMap(), _Item_changedProperties = new WeakMap();

export { Item, RegistryFactory };
//# sourceMappingURL=index.mjs.map
