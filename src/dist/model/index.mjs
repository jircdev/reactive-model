import { ZodError } from 'zod';
import { Events } from '@beyond-js/reactive/events';

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

var _ReactiveModel_ready, _ReactiveModel_debug, _ReactiveModel_isDraft, _ReactiveModel_propertyNames, _ReactiveModel_initialValues;
class ReactiveModel extends Events {
    static isReactive() {
        return true;
    }
    get isReactive() {
        return true;
    }
    get isDraft() {
        return __classPrivateFieldGet(this, _ReactiveModel_isDraft, "f");
    }
    get propertyNames() {
        return __classPrivateFieldGet(this, _ReactiveModel_propertyNames, "f");
    }
    get ready() {
        return __classPrivateFieldGet(this, _ReactiveModel_ready, "f");
    }
    set ready(value) {
        __classPrivateFieldSet(this, _ReactiveModel_ready, value, "f");
        this.trigger('ready');
        this.trigger('change');
    }
    get initialValues() {
        return __classPrivateFieldGet(this, _ReactiveModel_initialValues, "f");
    }
    /**
     * Defines if the model has been modified since it was loaded.
     */
    get unpublished() {
        var _a;
        const properties = (_a = this.getProperties()) !== null && _a !== void 0 ? _a : {};
        return Object.keys(properties).some(prop => {
            var _a;
            if (prop === 'id')
                return false;
            if (Array.isArray(properties[prop])) {
                if (properties[prop].length !== ((_a = __classPrivateFieldGet(this, _ReactiveModel_initialValues, "f")[prop]) === null || _a === void 0 ? void 0 : _a.length))
                    return true;
                return JSON.stringify(properties[prop]) !== JSON.stringify(__classPrivateFieldGet(this, _ReactiveModel_initialValues, "f")[prop]);
            }
            if (typeof properties[prop] === 'object') {
                if (this[prop] instanceof ReactiveModel) {
                    return this[prop].unpublished;
                }
                return JSON.stringify(properties[prop]) !== JSON.stringify(__classPrivateFieldGet(this, _ReactiveModel_initialValues, "f")[prop]);
            }
            return properties[prop] !== __classPrivateFieldGet(this, _ReactiveModel_initialValues, "f")[prop];
        });
    }
    /**
     * @deprecated Use `unpublished` instead.
     */
    get isUnpublished() {
        return this.unpublished;
    }
    constructor({ properties, ...props } = {
        properties: [],
    }) {
        super();
        this.processing = false;
        this.processed = false;
        this.loaded = false;
        _ReactiveModel_ready.set(this, false);
        _ReactiveModel_debug.set(this, void 0);
        this._reactiveProps = {};
        //TODO: Validate how to handle the properties
        this.properties = [];
        // properties of the object
        _ReactiveModel_isDraft.set(this, false);
        _ReactiveModel_propertyNames.set(this, new Set());
        _ReactiveModel_initialValues.set(this, {});
        this.property = this.getProperty;
        this.isSameObject = (a, b) => JSON.stringify(a) === JSON.stringify(b);
        /**
         * Triggers an event after a specified delay.
         * @deprecated use trigger method instead.
         * @param {string} event - The name of the event to trigger.
         * @param {Record<string, any>} params - Additional parameters for the event, including an optional `delay` property.
         */
        this.triggerEvent = (event = 'change', params = {}) => {
            this.trigger(event);
        };
        //	this.#debug = 'Courier';
        const defaultProps = ['fetching', 'fetched', 'processing', 'processed', 'loaded'];
        if (properties) {
            this.properties = properties;
            this.defineReactiveProps(properties, props);
            if (Object.keys(props).length > 0) {
                this.setInitialValues(props);
            }
        }
        this.debug('props', props, properties);
        this.defineReactiveProps(defaultProps, this.initialValues);
    }
    /**
     * Logs debug information to the console only when the #debug property matches the constructor name.
     * This allows for targeted debugging of specific model instances by setting the #debug property
     * to the class name you want to debug.
     *
     * @param args - Any arguments to be logged to the console
     */
    debug(...args) {
        if (__classPrivateFieldGet(this, _ReactiveModel_debug, "f") === this.constructor.name) {
            console.log(...args);
        }
    }
    /**
     * Sets the initial values for the model based on the provided specifications.
     * This method processes the model's properties and extracts their values from the specs object.
     * If no specs are provided, it returns the existing initial values.
     *
     * The method also determines if the model is a draft by checking if the specs object is empty.
     *
     * @param specs - Optional partial object containing property values to set as initial values
     * @returns The initial values object that was set
     */
    setInitialValues(specs) {
        if (!specs)
            return __classPrivateFieldGet(this, _ReactiveModel_initialValues, "f");
        const values = {};
        this.properties.forEach(property => {
            if (typeof property !== 'string') {
                property = property;
                values[property.name] = specs[property.name];
                return;
            }
            values[property] = specs[property];
        });
        __classPrivateFieldSet(this, _ReactiveModel_isDraft, Object.keys(specs).length === 0, "f");
        __classPrivateFieldSet(this, _ReactiveModel_initialValues, values, "f");
        return __classPrivateFieldGet(this, _ReactiveModel_initialValues, "f");
    }
    getProperty(key) {
        return this._reactiveProps[key]; // Type-safe access.
    }
    isReactiveModel(instance) {
        if (!instance || typeof instance !== 'object')
            return false;
        return !!instance.isReactive;
    }
    isCollectionModel(instance) {
        if (!instance || typeof instance !== 'object')
            return false;
        const candidate = instance;
        return !!candidate.isCollection && typeof candidate.setItems === 'function';
    }
    defineReactiveProp(propKey, initialValue, model = false) {
        this._reactiveProps[propKey] = initialValue;
        Object.defineProperty(this, propKey, {
            get: () => {
                return this._reactiveProps[propKey];
            },
            set: (newVal) => {
                if (model) {
                    const instance = this._reactiveProps[propKey];
                    this.trigger(`${propKey}.changed`, {
                        value: newVal,
                        previous: instance.getProperties(),
                    });
                    this.trigger('change');
                    this._reactiveProps[propKey].set(newVal);
                    return;
                }
                if (newVal !== undefined && newVal === this._reactiveProps[propKey])
                    return;
                const previous = this._reactiveProps[propKey];
                this._reactiveProps[propKey] = newVal;
                this.trigger(`${propKey}.changed`, { value: newVal, previous });
                this.trigger('change');
            },
            enumerable: true,
            configurable: true,
        });
    }
    /**
     *  Defines the reactive properties of the object.
     * The properties are defined as an array of strings or objects.
     * The objects must have a `name` property with the name of the property and a `value` property with the class of the object.
     * The `value` property can be a class or an object.
     * If the `value` property is a class, the class must extend the `ReactiveModel` class.
     *
     * @param props
     * @param values
     */
    defineReactiveProps(props, values) {
        var _a, _b, _c;
        for (let propKey of props) {
            const descriptor = Object.getOwnPropertyDescriptor(this, propKey);
            if (propKey === undefined)
                continue;
            if (typeof propKey !== 'object') {
                __classPrivateFieldGet(this, _ReactiveModel_propertyNames, "f").add(propKey);
                let initialValue = (_a = values === null || values === void 0 ? void 0 : values[propKey]) !== null && _a !== void 0 ? _a : descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;
                this.defineReactiveProp(propKey, initialValue);
                continue;
            }
            const data = propKey;
            const name = data.name;
            let initialValue = (_b = values === null || values === void 0 ? void 0 : values[name]) !== null && _b !== void 0 ? _b : descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;
            const specs = (_c = data.properties) !== null && _c !== void 0 ? _c : {};
            if (typeof data.value !== 'function' && typeof data.value !== 'object') {
                console.warn(`Invalid value type for  ${name}`);
                continue;
            }
            const parameters = data.value.isCollection ? { parent: this } : { parent: this, ...initialValue, ...specs };
            const instance = new data.value(parameters);
            if (data.value.isCollection) {
                instance.setItems(initialValue);
            }
            __classPrivateFieldGet(this, _ReactiveModel_propertyNames, "f").add(name);
            this.defineReactiveProp(name, instance, true);
            continue;
        }
    }
    reactiveProps(props) {
        this.defineReactiveProps(props);
    }
    setProperty(propKey, value) {
        this._reactiveProps[propKey] = value;
    }
    validateProperty(propKey, value) {
        if (!this.schema) {
            return { valid: true, error: null };
        }
        if (!this.schema.shape[propKey]) {
            return {
                valid: false,
                error: new ZodError([
                    {
                        path: [propKey],
                        message: `Property ${propKey} is not defined in the schema`,
                        code: 'custom',
                    },
                ]),
            };
        }
        const propSchema = this.schema.shape[propKey];
        const result = propSchema.safeParse(value);
        if (!result.success) {
            return { valid: false, error: result.error };
        }
        return { valid: true, error: null };
    }
    /**
     * Validates the provided properties against the model's Zod schema.
     * Only validates properties that are defined in the model's properties array.
     *
     * @param {Partial<T>} properties - The properties to validate
     * @returns {{ valid: boolean; errors: PropertyValidationErrors<T> }} An object containing:
     *   - `valid`: boolean indicating if all properties are valid
     *   - `errors`: object containing validation errors for each invalid property
     */
    validate(properties) {
        const keys = Object.keys(properties);
        const errors = {};
        const onValidate = prop => {
            if (!this.properties || !this.properties.includes(prop)) {
                console.trace(`is not a property`, prop);
                return;
            }
            const validated = this.validateProperty(prop, properties[prop]);
            if (!validated.valid) {
                errors[prop] = validated.error;
            }
        };
        keys.forEach(onValidate);
        return { valid: Object.keys(errors).length === 0, errors };
    }
    set(properties) {
        if (!properties) {
            console.warn('you are trying to set an empty object', this.constructor.name, properties);
            return {
                updated: false,
            };
        }
        const keys = Object.keys(properties);
        let updated = false;
        const errors = {};
        const onSet = prop => {
            if (!__classPrivateFieldGet(this, _ReactiveModel_propertyNames, "f").has(prop)) {
                // console.trace(`is not a property`, prop, this.constructor.name);
                return;
            }
            const validated = this.validateProperty(prop, properties[prop]);
            this.debug(prop, properties[prop], validated);
            // console.log('validated', validated, prop, properties[prop]);
            if (!validated.valid) {
                errors[prop] = validated;
                // return;
            }
            const propertyValue = this.getProperty(prop);
            if (this.isReactiveModel(propertyValue)) {
                const instance = propertyValue;
                // check if it is a collection
                if (this.isCollectionModel(instance)) {
                    instance.setItems(properties[prop], true);
                }
                else {
                    instance.set(properties[prop]);
                }
                if (instance.unpublished)
                    updated = true;
                return;
            }
            const isObject = typeof properties[prop] === 'object';
            const isSameObject = isObject && this.isSameObject([prop], this[prop]);
            if (this[prop] === properties[prop] || isSameObject) {
                return;
            }
            this.trigger(`${prop}.changed`, { value: properties[prop], previous: this[prop] });
            this[prop] = properties[prop];
            updated = true;
        };
        keys.forEach(onSet);
        if (updated) {
            this.trigger('change');
            this.trigger('set.executed');
        }
        return { updated, errors };
    }
    /**
     * Gets all properties of the model, including nested reactive objects and collections.
     * For collections, it returns the item properties instead of the collection instance.
     *
     * @returns {Partial<T>} An object containing all properties of the model
     */
    getProperties() {
        const props = {};
        const loop = property => {
            var _a;
            let name = property;
            if (typeof property === 'object' && property.value.isReactive) {
                name = property.name;
                /**
                 * If the property is a collection, we return the items.
                 */
                props[String(name)] = property.value.isCollection
                    ? this[name].getItemProperties()
                    : (_a = this[name]) === null || _a === void 0 ? void 0 : _a.getProperties();
                return;
            }
            props[String(name)] = this[name];
        };
        this.properties.forEach(loop);
        return props;
    }
    /**
     * Reverts all properties of the model back to their initial values.
     * This is useful for discarding changes and restoring the model to its original state.
     */
    revert() {
        this.set(this.initialValues);
    }
    /**
     * Saves the current state of the model as the new initial state.
     * This marks the model as no longer being a draft and updates the initial values
     * to match the current state. Useful after successfully persisting changes.
     */
    saveChanges() {
        __classPrivateFieldSet(this, _ReactiveModel_initialValues, this.getProperties(), "f");
        __classPrivateFieldSet(this, _ReactiveModel_isDraft, false, "f");
    }
}
_ReactiveModel_ready = new WeakMap(), _ReactiveModel_debug = new WeakMap(), _ReactiveModel_isDraft = new WeakMap(), _ReactiveModel_propertyNames = new WeakMap(), _ReactiveModel_initialValues = new WeakMap();

export { ReactiveModel };
//# sourceMappingURL=index.mjs.map
