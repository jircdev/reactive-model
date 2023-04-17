System.register(["@beyond-js/kernel@0.1.9/bundle"], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["@beyond-js/kernel","0.1.9"]]);
	return globalThis.bimport(globalThis.bimport.resolve(specifier, dependencies));
};


var dependencies = new Map();
var require = dependency => dependencies.get(dependency);
return {
setters: [dep => dependencies.set('@beyond-js/kernel@0.1.9/bundle', dep)],
execute: function() {
// Prevent esbuild from considering the context to be amd
const define = void 0;
const module = {};

const code = (module, require) => {
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, {
    get: all[name],
    enumerable: true
  });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
  value: mod,
  enumerable: true
}) : target, mod));
var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
  value: true
}), mod);

// .beyond/uimport/temp/@beyond-js/kernel/core.0.1.9.js
var core_0_1_9_exports = {};
__export(core_0_1_9_exports, {
  CancellationToken: () => CancellationToken,
  Events: () => Events,
  Languages: () => Languages,
  ListenerFunction: () => ListenerFunction,
  PendingPromise: () => PendingPromise,
  SingleCall: () => SingleCall,
  __beyond_pkg: () => __beyond_pkg,
  beyond: () => beyond,
  hmr: () => hmr,
  languages: () => languages
});
module.exports = __toCommonJS(core_0_1_9_exports);

// node_modules/@beyond-js/kernel/core/core.browser.mjs
var dependency_0 = __toESM(require("@beyond-js/kernel@0.1.9/bundle"), 0);
var import_meta = {};
var {
  Bundle: __Bundle
} = dependency_0;
var __pkg = new __Bundle({
  "module": {
    "vspecifier": "@beyond-js/kernel@0.1.9/core"
  },
  "type": "ts"
}, _context.meta.url).package();
;
__pkg.dependencies.update([]);
var ims = /* @__PURE__ */new Map();
ims.set("./beyond", {
  hash: 959081709,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.beyond = exports.Beyond = void 0;
    var _languages = require2("./languages");
    class Beyond {
      get languages() {
        return _languages.languages;
      }
      async import(resource, version) {
        return await bimport(resource, version);
      }
    }
    exports.Beyond = Beyond;
    const beyond2 = new Beyond();
    exports.beyond = beyond2;
    globalThis.beyond = beyond2;
  }
});
ims.set("./languages/index", {
  hash: 2966511149,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.languages = exports.Languages = void 0;
    var _events = require2("../utils/events/events");
    class Languages2 extends _events.Events {
      #project;
      #specs;
      #storage = typeof localStorage === "object" ? localStorage : void 0;
      #supported;
      get supported() {
        return this.#supported;
      }
      get default() {
        return this.#specs?.default;
      }
      #current;
      get current() {
        return this.#current;
      }
      #resolve;
      #ready = new Promise(resolve => this.#resolve = resolve);
      get ready() {
        return this.#ready;
      }
      #fetched = false;
      get fetched() {
        return this.#fetched;
      }
      constructor(project) {
        super();
        this.#project = project;
        bimport(`${project}/config`).then(({
          default: config
        }) => {
          this.#setup(config.languages);
          this.#fetched = true;
          this.#resolve();
        });
      }
      #configure(value) {
        if (this.#current === value) return true;
        if (typeof value !== "string" || value.length !== 2) {
          console.warn(`Configured language "${value}" is invalid`);
          return false;
        }
        if (value && !this.#supported.has(value)) {
          console.log(`Language "${value}" is not supported`);
          return false;
        }
        const previous = this.#current;
        this.#current = value;
        previous && this.trigger("change");
        return true;
      }
      set current(value) {
        if (!this.#configure(value)) return;
        this.#storage?.setItem("__beyond_language", value);
      }
      #setup(specs) {
        if (specs.default && typeof specs.default !== "string" || specs.default.length !== 2) {
          console.log(`Default language "${specs.default}" is invalid`);
          specs.default = void 0;
        }
        const def = specs.default ? specs.default : "en";
        specs.supported = specs.supported instanceof Array ? specs.supported : [def];
        !specs.supported.length && specs.supported.push(def);
        this.#supported = new Set(specs.supported);
        specs.default = specs.default ? specs.default : [...this.#supported][0];
        if (!this.#supported.has(specs.default)) {
          console.warn(`Default language "${specs.default}" is not supported by current application`);
          specs.default = [...this.#supported][0];
        }
        this.#specs = specs;
        const configured = this.#storage?.getItem("__beyond_language");
        if (configured && this.#configure(configured)) return;
        const device = typeof location === "object" ? navigator.language.split("-")[0] : void 0;
        if (device && this.#configure(device)) return;
        this.#configure(specs.default);
      }
    }
    exports.Languages = Languages2;
    const languages2 = new Languages2(globalThis.__app_package.specifier);
    exports.languages = languages2;
  }
});
ims.set("./utils/events/events", {
  hash: 3993267980,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Events = void 0;
    class Events2 {
      #specs;
      #listeners = /* @__PURE__ */new Map();
      #destroyed = false;
      get destroyed() {
        return this.#destroyed;
      }
      constructor(specs) {
        specs = specs ? specs : {};
        if (specs.supported && !(specs.supported instanceof Array)) throw new Error("Invalid parameters");
        this.#specs = specs;
        if (specs.bind) {
          specs.bind.bind = (event, listener, priority) => this.on(event, listener, priority);
          specs.bind.unbind = (event, listener) => this.off(event, listener);
        }
      }
      on(event, listener, priority) {
        if (this.#destroyed) {
          throw new Error("Events object is destroyed");
        }
        if (this.#specs.supported && !this.#specs.supported.includes(event)) {
          throw new Error(`Event "${event}" is not defined`);
        }
        if (typeof listener !== "function") {
          throw new Error("Listener is not a function");
        }
        this.off(event, listener);
        const l = this.#listeners.has(event) ? this.#listeners.get(event) : [];
        this.#listeners.set(event, l);
        l.push({
          listener,
          priority: priority ? priority : 0
        });
        return this;
      }
      bind = (event, listener, priority) => this.on(event, listener, priority);
      off(event, listener, force) {
        if (this.#destroyed) {
          throw new Error("Events object is destroyed");
        }
        if (!event) {
          throw new Error(`Event name not specified`);
        }
        if (this.#specs.supported && !this.#specs.supported.includes(event)) {
          throw new Error(`Event "${event}" is not defined`);
        }
        if (!listener) {
          if (!force) throw new Error("Listener function not set");
          this.#listeners.delete(event);
          return this;
        }
        if (!this.#listeners.has(event)) {
          return this;
        }
        const e = this.#listeners.get(event);
        const filtered = e.filter(item => item.listener !== listener);
        this.#listeners.set(event, filtered);
        return this;
      }
      unbind = (event, listener, force) => this.off(event, listener, force);
      trigger(event, ...rest) {
        if (this.#destroyed) {
          throw new Error("Events object is destroyed");
        }
        event = typeof event === "string" ? {
          "name": event
        } : event;
        if (typeof event !== "object") throw new Error("Invalid parameters");
        if (typeof event.name !== "string") throw new Error("Invalid event name");
        if (this.#specs.supported && !this.#specs.supported.includes(event.name)) {
          throw new Error(`Event "${event.name}" is not defined`);
        }
        let args = [...arguments];
        args.shift();
        if (!this.#listeners.has(event.name)) return;
        let l = this.#listeners.get(event.name);
        l.sort((a, b) => b.priority - a.priority);
        if (event.async) {
          const trigger = async function () {
            const promises = [];
            for (let listener of l) {
              promises.push(listener.listener(...args));
            }
            await Promise.all(promises);
          };
          return trigger.call(this, ...args).catch(exc => console.error(exc.stack));
        } else {
          for (let listener of l) {
            listener.listener(...args);
          }
        }
      }
      destroy() {
        this.#destroyed = true;
        this.#listeners.clear();
      }
    }
    exports.Events = Events2;
    globalThis.Events = Events2;
  }
});
ims.set("./utils/events/types", {
  hash: 1632705009,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  }
});
ims.set("./utils/execution-control/cancellation-token/cancellation-token", {
  hash: 4200323006,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.CancellationToken = void 0;
    class CancellationToken2 {
      #id = 0;
      get current() {
        return this.#id;
      }
      reset = () => ++this.#id;
      check = id => id === this.#id;
    }
    exports.CancellationToken = CancellationToken2;
  }
});
ims.set("./utils/execution-control/single-call/single-call", {
  hash: 783668127,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SingleCall = SingleCall2;
    function SingleCall2(target, propertyKey, descriptor) {
      const originalMethod = descriptor.value;
      let promises = /* @__PURE__ */new WeakMap();
      descriptor.value = function (...args) {
        if (promises.has(this)) return promises.get(this);
        const promise = originalMethod.apply(this, args);
        promises.set(this, promise);
        const clean = () => promises.delete(this);
        promise.then(clean).catch(clean);
        return promise;
      };
      return descriptor;
    }
  }
});
ims.set("./utils/pending-promise/pending-promise", {
  hash: 3255928960,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.PendingPromise = void 0;
    class PendingPromise2 extends Promise {
      resolve;
      reject;
      constructor(executor) {
        if (executor instanceof Function) {
          super(executor);
          return;
        }
        let resolve = void 0;
        let reject = void 0;
        super((a, b) => {
          resolve = a;
          reject = b;
        });
        this.resolve = resolve;
        this.reject = reject;
      }
    }
    exports.PendingPromise = PendingPromise2;
    typeof globalThis.process !== "object" && (window.PendingPromise = PendingPromise2);
  }
});
__pkg.exports.descriptor = [{
  "im": "./beyond",
  "from": "beyond",
  "name": "beyond"
}, {
  "im": "./languages/index",
  "from": "Languages",
  "name": "Languages"
}, {
  "im": "./languages/index",
  "from": "languages",
  "name": "languages"
}, {
  "im": "./utils/events/events",
  "from": "Events",
  "name": "Events"
}, {
  "im": "./utils/events/types",
  "from": "ListenerFunction",
  "name": "ListenerFunction"
}, {
  "im": "./utils/execution-control/cancellation-token/cancellation-token",
  "from": "CancellationToken",
  "name": "CancellationToken"
}, {
  "im": "./utils/execution-control/single-call/single-call",
  "from": "SingleCall",
  "name": "SingleCall"
}, {
  "im": "./utils/pending-promise/pending-promise",
  "from": "PendingPromise",
  "name": "PendingPromise"
}];
var beyond, Languages, languages, Events, ListenerFunction, CancellationToken, SingleCall, PendingPromise;
__pkg.exports.process = function ({
  require: require2,
  prop,
  value
}) {
  (require2 || prop === "beyond") && (beyond = require2 ? require2("./beyond").beyond : value);
  (require2 || prop === "Languages") && (Languages = require2 ? require2("./languages/index").Languages : value);
  (require2 || prop === "languages") && (languages = require2 ? require2("./languages/index").languages : value);
  (require2 || prop === "Events") && (Events = require2 ? require2("./utils/events/events").Events : value);
  (require2 || prop === "ListenerFunction") && (ListenerFunction = require2 ? require2("./utils/events/types").ListenerFunction : value);
  (require2 || prop === "CancellationToken") && (CancellationToken = require2 ? require2("./utils/execution-control/cancellation-token/cancellation-token").CancellationToken : value);
  (require2 || prop === "SingleCall") && (SingleCall = require2 ? require2("./utils/execution-control/single-call/single-call").SingleCall : value);
  (require2 || prop === "PendingPromise") && (PendingPromise = require2 ? require2("./utils/pending-promise/pending-promise").PendingPromise : value);
};
var __beyond_pkg = __pkg;
var hmr = new function () {
  this.on = (event, listener) => void 0;
  this.off = (event, listener) => void 0;
}();
__pkg.initialise(ims);
};

code(module, require);
_exports(module.exports);
}}});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL0BiZXlvbmQtanMva2VybmVsL2NvcmUuMC4xLjkuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvY29yZS9fX3NvdXJjZXMvY29yZS9iZXlvbmQudHMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvY29yZS9fX3NvdXJjZXMvY29yZS9sYW5ndWFnZXMvaW5kZXgudHMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvY29yZS9fX3NvdXJjZXMvY29yZS91dGlscy9ldmVudHMvZXZlbnRzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL2NvcmUvX19zb3VyY2VzL2NvcmUvdXRpbHMvZXZlbnRzL3R5cGVzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL2NvcmUvX19zb3VyY2VzL2NvcmUvdXRpbHMvZXhlY3V0aW9uLWNvbnRyb2wvY2FuY2VsbGF0aW9uLXRva2VuL2NhbmNlbGxhdGlvbi10b2tlbi50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9jb3JlL19fc291cmNlcy9jb3JlL3V0aWxzL2V4ZWN1dGlvbi1jb250cm9sL3NpbmdsZS1jYWxsL3NpbmdsZS1jYWxsLnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL2NvcmUvX19zb3VyY2VzL2NvcmUvdXRpbHMvcGVuZGluZy1wcm9taXNlL3BlbmRpbmctcHJvbWlzZS50cyJdLCJuYW1lcyI6WyJjb3JlXzBfMV85X2V4cG9ydHMiLCJfX2V4cG9ydCIsIkNhbmNlbGxhdGlvblRva2VuIiwiRXZlbnRzIiwiTGFuZ3VhZ2VzIiwiTGlzdGVuZXJGdW5jdGlvbiIsIlBlbmRpbmdQcm9taXNlIiwiU2luZ2xlQ2FsbCIsIl9fYmV5b25kX3BrZyIsImJleW9uZCIsImhtciIsImxhbmd1YWdlcyIsIm1vZHVsZSIsImV4cG9ydHMiLCJfX3RvQ29tbW9uSlMiLCJfbGFuZ3VhZ2VzIiwicmVxdWlyZTIiLCJCZXlvbmQiLCJpbXBvcnQiLCJyZXNvdXJjZSIsInZlcnNpb24iLCJiaW1wb3J0IiwiYmV5b25kMiIsImdsb2JhbFRoaXMiLCJfZXZlbnRzIiwiTGFuZ3VhZ2VzMiIsInByb2plY3QiLCJzcGVjcyIsInN0b3JhZ2UiLCJsb2NhbFN0b3JhZ2UiLCJzdXBwb3J0ZWQiLCJkZWZhdWx0IiwiY3VycmVudCIsInJlc29sdmUiLCJyZWFkeSIsIlByb21pc2UiLCJmZXRjaGVkIiwiY29uc3RydWN0b3IiLCJ0aGVuIiwiY29uZmlnIiwic2V0dXAiLCJjb25maWd1cmUiLCIjY29uZmlndXJlIiwidmFsdWUiLCJsZW5ndGgiLCJjb25zb2xlIiwid2FybiIsImhhcyIsImxvZyIsInByZXZpb3VzIiwidHJpZ2dlciIsInNldEl0ZW0iLCIjc2V0dXAiLCJkZWYiLCJBcnJheSIsInB1c2giLCJTZXQiLCJjb25maWd1cmVkIiwiZ2V0SXRlbSIsImRldmljZSIsImxvY2F0aW9uIiwibmF2aWdhdG9yIiwibGFuZ3VhZ2UiLCJzcGxpdCIsImxhbmd1YWdlczIiLCJfX2FwcF9wYWNrYWdlIiwic3BlY2lmaWVyIiwiRXZlbnRzMiIsImxpc3RlbmVycyIsIk1hcCIsImRlc3Ryb3llZCIsIkVycm9yIiwiYmluZCIsImV2ZW50IiwibGlzdGVuZXIiLCJwcmlvcml0eSIsIm9uIiwidW5iaW5kIiwib2ZmIiwiaW5jbHVkZXMiLCJsIiwiZ2V0Iiwic2V0IiwiZm9yY2UiLCJkZWxldGUiLCJlIiwiZmlsdGVyZWQiLCJmaWx0ZXIiLCJpdGVtIiwicmVzdCIsIm5hbWUiLCJhcmdzIiwiYXJndW1lbnRzIiwic2hpZnQiLCJzb3J0IiwiYSIsImIiLCJhc3luYyIsInByb21pc2VzIiwiYWxsIiwiY2FsbCIsImNhdGNoIiwiZXhjIiwiZXJyb3IiLCJzdGFjayIsImRlc3Ryb3kiLCJjbGVhciIsIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiQ2FuY2VsbGF0aW9uVG9rZW4yIiwiaWQiLCJyZXNldCIsImNoZWNrIiwiU2luZ2xlQ2FsbDIiLCJ0YXJnZXQiLCJwcm9wZXJ0eUtleSIsImRlc2NyaXB0b3IiLCJvcmlnaW5hbE1ldGhvZCIsIldlYWtNYXAiLCJwcm9taXNlIiwiYXBwbHkiLCJjbGVhbiIsIlBlbmRpbmdQcm9taXNlMiIsInJlamVjdCIsImV4ZWN1dG9yIiwiRnVuY3Rpb24iLCJwcm9jZXNzIiwid2luZG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxrQkFBQTtBQUFBQyxRQUFBLENBQUFELGtCQUFBO0VBQUFFLGlCQUFBLEVBQUFBLENBQUEsS0FBQUEsaUJBQUE7RUFBQUMsTUFBQSxFQUFBQSxDQUFBLEtBQUFBLE1BQUE7RUFBQUMsU0FBQSxFQUFBQSxDQUFBLEtBQUFBLFNBQUE7RUFBQUMsZ0JBQUEsRUFBQUEsQ0FBQSxLQUFBQSxnQkFBQTtFQUFBQyxjQUFBLEVBQUFBLENBQUEsS0FBQUEsY0FBQTtFQUFBQyxVQUFBLEVBQUFBLENBQUEsS0FBQUEsVUFBQTtFQUFBQyxZQUFBLEVBQUFBLENBQUEsS0FBQUEsWUFBQTtFQUFBQyxNQUFBLEVBQUFBLENBQUEsS0FBQUEsTUFBQTtFQUFBQyxHQUFBLEVBQUFBLENBQUEsS0FBQUEsR0FBQTtFQUFBQyxTQUFBLEVBQUFBLENBQUEsS0FBQUE7QUFBQTtBQUFBQyxNQUFBLENBQUFDLE9BQUEsR0FBQUMsWUFBQSxDQUFBZCxrQkFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNBQSxJQUFBZSxVQUFBLEdBQUFDLFFBQUE7SUFJTSxNQUFPQyxNQUFBLENBQU07TUFLZixJQUFJTixVQUFBLEVBQVM7UUFDVCxPQUFPSSxVQUFBLENBQUFKLFNBQUE7TUFDWDtNQVVBLE1BQU1PLE9BQU9DLFFBQUEsRUFBa0JDLE9BQUEsRUFBZTtRQUMxQyxPQUFPLE1BQU1DLE9BQUEsQ0FBUUYsUUFBQSxFQUFVQyxPQUFPO01BQzFDOztJQUNIUCxPQUFBLENB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