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

var _Events_specs, _Events_listeners, _Events_destroyed;
class Events {
    get destroyed() {
        return __classPrivateFieldGet(this, _Events_destroyed, "f");
    }
    constructor(specs) {
        _Events_specs.set(this, void 0);
        _Events_listeners.set(this, new Map());
        _Events_destroyed.set(this, false);
        this.bind = (event, listener, priority) => this.on(event, listener, priority);
        this.unbind = (event, listener, force) => this.off(event, listener, force);
        specs = specs ? specs : {};
        if (specs.supported && !(specs.supported instanceof Array))
            throw new Error('Invalid parameters');
        __classPrivateFieldSet(this, _Events_specs, specs, "f");
        if (specs.bind) {
            specs.bind.bind = (event, listener, priority) => this.on(event, listener, priority);
            specs.bind.unbind = (event, listener) => this.off(event, listener);
        }
    }
    /**
     * Binds an event handler to an event name
     *
     * @param {string} event
     * @param {ListenerFunction} listener
     * @param {number} priority
     * @returns {this}
     */
    on(event, listener, priority) {
        if (__classPrivateFieldGet(this, _Events_destroyed, "f")) {
            throw new Error('Events object is destroyed');
        }
        if (__classPrivateFieldGet(this, _Events_specs, "f").supported && !__classPrivateFieldGet(this, _Events_specs, "f").supported.includes(event)) {
            throw new Error(`Event "${event}" is not defined`);
        }
        if (typeof listener !== 'function') {
            throw new Error('Listener is not a function');
        }
        this.off(event, listener); // Just in case the listener is already registered
        const l = __classPrivateFieldGet(this, _Events_listeners, "f").has(event) ? __classPrivateFieldGet(this, _Events_listeners, "f").get(event) : [];
        __classPrivateFieldGet(this, _Events_listeners, "f").set(event, l);
        l.push({ listener: listener, priority: priority ? priority : 0 });
        return this;
    }
    /**
     * Unbind an event listener
     *
     * @param {string} event
     * @param {ListenerFunction} listener
     * @param {number} force
     * @returns {this}
     */
    off(event, listener, force) {
        if (__classPrivateFieldGet(this, _Events_destroyed, "f")) {
            throw new Error('Events object is destroyed');
        }
        if (!event) {
            throw new Error(`Event name not specified`);
        }
        if (__classPrivateFieldGet(this, _Events_specs, "f").supported && !__classPrivateFieldGet(this, _Events_specs, "f").supported.includes(event)) {
            throw new Error(`Event "${event}" is not defined`);
        }
        if (!listener) {
            if (!force)
                throw new Error('Listener function not set');
            __classPrivateFieldGet(this, _Events_listeners, "f").delete(event);
            return this;
        }
        if (!__classPrivateFieldGet(this, _Events_listeners, "f").has(event)) {
            return this;
        }
        const e = __classPrivateFieldGet(this, _Events_listeners, "f").get(event);
        const filtered = e.filter(item => item.listener !== listener);
        __classPrivateFieldGet(this, _Events_listeners, "f").set(event, filtered);
        return this;
    }
    /**
     * Triggers an event
     *
     * @param {Trigger} event
     * @param {*} rest
     * @returns {Promise<*>}
     */
    trigger(event, ...rest) {
        if (__classPrivateFieldGet(this, _Events_destroyed, "f")) {
            throw new Error('Events object is destroyed');
        }
        if (typeof event === 'object')
            console.trace(event);
        const eventObj = typeof event === 'string' ? { name: event } : event;
        // console.log(0.2, event);
        if (typeof eventObj !== 'object')
            throw new Error('Invalid parameters');
        if (typeof eventObj.name !== 'string')
            throw new Error('Invalid event name');
        if (__classPrivateFieldGet(this, _Events_specs, "f").supported && !__classPrivateFieldGet(this, _Events_specs, "f").supported.includes(eventObj.name)) {
            throw new Error(`Event "${eventObj.name}" is not defined`);
        }
        let args = [...arguments];
        args.shift(); // Remove the event name from the list of arguments
        if (!__classPrivateFieldGet(this, _Events_listeners, "f").has(eventObj.name))
            return;
        let l = __classPrivateFieldGet(this, _Events_listeners, "f").get(eventObj.name);
        // Sort by priority
        l.sort((a, b) => b.priority - a.priority);
        if (eventObj.async) {
            const trigger = async function () {
                const promises = [];
                for (let listener of l) {
                    promises.push(listener.listener(...args));
                }
                await Promise.all(promises);
            };
            return trigger.call(this, ...args).catch((exc) => console.error(exc.stack));
        }
        else {
            for (let listener of l) {
                listener.listener(...args);
            }
        }
    }
    destroy() {
        __classPrivateFieldSet(this, _Events_destroyed, true, "f");
        __classPrivateFieldGet(this, _Events_listeners, "f").clear();
    }
}
_Events_specs = new WeakMap(), _Events_listeners = new WeakMap(), _Events_destroyed = new WeakMap();

export { Events };
//# sourceMappingURL=index.mjs.map
