System.register([], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["@beyond-js/kernel","0.1.9"]]);
	return globalThis.bimport(globalThis.bimport.resolve(specifier, dependencies));
};


var dependencies = new Map();
var require = dependency => dependencies.get(dependency);
return {
setters: [],
execute: function() {
// Prevent esbuild from considering the context to be amd
const define = void 0;
const module = {};

const code = (module, require) => {
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
  value: true
}), mod);

// .beyond/uimport/temp/@beyond-js/kernel/bundle.0.1.9.js
var bundle_0_1_9_exports = {};
__export(bundle_0_1_9_exports, {
  Bundle: () => Bundle,
  Events: () => Events,
  IBundleSpecs: () => IBundleSpecs,
  IExportsDescriptor: () => IExportsDescriptor,
  IMCreators: () => IMCreators,
  IMSpecs: () => IMSpecs,
  ListenerFunction: () => ListenerFunction,
  Module: () => Module,
  Package: () => Package,
  bimport: () => bimport,
  brequire: () => brequire,
  instances: () => instances
});
module.exports = __toCommonJS(bundle_0_1_9_exports);

// node_modules/@beyond-js/kernel/bundle/bundle.browser.mjs
var __pkg = {
  exports: {}
};
var ims = /* @__PURE__ */new Map();
ims.set("./base/index", {
  hash: 1936310117,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BeyondPackage = void 0;
    exports.resolve = resolve;
    function resolve(source, id) {
      if (!id.startsWith(".")) throw new Error(`Module id must be a relative resource "${id}"`);
      const split = {};
      split.source = source.split("/");
      split.source.pop();
      split.target = (id.startsWith("./") ? id.slice(2) : id).split("../");
      while (split.target[0] === "" && split.target.length > 1) {
        split.target.shift();
        split.source.pop();
      }
      return split.source.join("/") + "/" + split.target.join("/");
    }
    class BeyondPackage {
      #ims;
      #cached = /* @__PURE__ */new Map();
      #exports;
      constructor(exports2) {
        this.#exports = exports2;
      }
      initialise(ims2) {
        this.#ims = ims2;
        this.#exports.process((id, source) => this.require(id, source), {});
      }
      require(id, source) {
        id = source ? resolve(source, id) : id;
        const module2 = (() => {
          if (this.#ims.has(id)) return id;
          return id.endsWith("/") ? `${id}index` : `${id}/index`;
        })();
        if (this.#cached.has(module2)) return this.#cached.get(module2);
        if (!this.#ims.has(module2)) throw new Error(`Internal module "${id}" not found`);
        const fn = this.#ims.get(module2).creator;
        const require3 = required => this.require(required, module2);
        const exports2 = {};
        fn(require3, exports2);
        this.#cached.set(module2, exports2);
        return exports2;
      }
    }
    exports.BeyondPackage = BeyondPackage;
  }
});
ims.set("./bimport/bimport", {
  hash: 1563705995,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.bimport = bimport2;
    require2("./brequire");
    function bimport2(resource, version) {
      if (bimport2.mode === "amd") {
        return new Promise((resolve, reject) => {
          if (typeof resource !== "string") throw "Invalid module parameter";
          resource = resource.endsWith(".js") ? resource.slice(0, resource.length - 3) : resource;
          const error = new Error(`Error loading or processing module "${resource}"`);
          amd_require([resource], returned => resolve(returned), exc => {
            console.error(`Error loading resource "${resource}".`);
            console.log(exc.stack);
            reject(error);
          });
        });
      } else if (bimport2.mode === "sjs") {
        return globalThis.System.import(resource + (version ? `?version=${version}` : ""));
      } else {
        return import(resource + (version ? `?version=${version}` : ""));
      }
    }
    bimport2.mode = (() => {
      if (typeof amd_require === "function") return "amd";
      const {
        System
      } = globalThis;
      if (typeof System === "object" && typeof System.import === "function") return "sjs";
      return "esm";
    })();
    const appDependencies = (() => {
      const dependencies = globalThis.__app_package?.dependencies;
      return new Map(dependencies);
    })();
    bimport2.resolve = (specifier, dependencies) => {
      if (/^https?:\/\//.test(specifier)) return specifier;
      const split = specifier.split("/");
      const pkg = split[0].startsWith("@") ? `${split.shift()}/${split.shift()}` : split.shift();
      const version = (() => {
        if (dependencies.has(pkg)) return dependencies.get(pkg);
        if (appDependencies.has(pkg)) return appDependencies.get(pkg);
      })();
      if (!version) return specifier;
      const subpath = split.join("/");
      return `${pkg}@${version}` + (subpath ? `/${subpath}` : "");
    };
  }
});
ims.set("./bimport/brequire", {
  hash: 596501557,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.brequire = brequire2;
    var _instances = require2("../package/instances");
    function brequire2(specifier) {
      const split = specifier.split("/");
      const pkg = split[0].startsWith("@") ? `${split.shift()}/${split.shift()}` : split.shift();
      const subpath = split.join("/");
      const found = [..._instances.default].find(([vspecifier]) => {
        if (!vspecifier.startsWith(`${pkg}@`)) return;
        const split2 = vspecifier.slice(pkg.length).split("/");
        split2.shift();
        return subpath === split2.join("/");
      });
      if (!found) return;
      !found[1].initialised && found[1].initialise();
      return found[1].exports.values;
    }
  }
});
ims.set("./bimport/index", {
  hash: 478135557,
  creator: function (require2, exports) {
    "use strict";

    var _bimport = require2("./bimport");
    var _brequire = require2("./brequire");
    globalThis.bimport === void 0 && (globalThis.bimport = _bimport.bimport);
    globalThis.brequire === void 0 && (globalThis.brequire = _brequire.brequire);
  }
});
ims.set("./bimport/requirejs", {
  hash: 2243979856,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  }
});
ims.set("./bundle", {
  hash: 2786310194,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Bundle = void 0;
    var _package = require2("./package");
    var _instances = require2("./instances");
    var _module = require2("./module");
    require2("./bimport");
    class Bundle2 extends Map {
      #type;
      get type() {
        return this.#type;
      }
      #name;
      get name() {
        return this.#name;
      }
      #vspecifier;
      get vspecifier() {
        return this.#vspecifier;
      }
      #specifier;
      get specifier() {
        return this.#specifier;
      }
      #module;
      get module() {
        return this.#module;
      }
      #uri;
      get uri() {
        return this.#uri;
      }
      constructor(specs, uri) {
        super();
        if (typeof specs !== "object") throw new Error("Bundle creation specification is not defined");
        const name = this.#name = specs.name ? specs.name : specs.type;
        if (!name) throw new Error("Invalid bundle creation specification");
        this.#module = new _module.Module(specs.module);
        this.#uri = uri;
        this.#type = specs.type;
        const {
          multibundle,
          vspecifier,
          specifier
        } = this.#module;
        this.#vspecifier = multibundle ? `${vspecifier}.${name}` : vspecifier;
        this.#specifier = multibundle ? `${specifier}.${name}` : specifier;
        _instances.instances.register(this);
      }
      package(language) {
        if (language && language.length !== 2) throw new Error(`Language "${language}" is invalid`);
        language = !language ? "" : language;
        if (this.has(language)) return this.get(language);
        const pkg = new _package.Package(this, language);
        this.set(language, pkg);
        return pkg;
      }
    }
    exports.Bundle = Bundle2;
  }
});
ims.set("./events/index", {
  hash: 1779469688,
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
  }
});
ims.set("./events/types", {
  hash: 1632705009,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
  }
});
ims.set("./instances", {
  hash: 1214802090,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.instances = void 0;
    const instances2 = new class extends Map {
      register(bundle) {
        this.set(bundle.vspecifier, bundle);
      }
    }();
    exports.instances = instances2;
  }
});
ims.set("./module/index", {
  hash: 2402746124,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Module = void 0;
    class Module2 {
      #pkg;
      get pkg() {
        return this.#pkg;
      }
      #vspecifier;
      get vspecifier() {
        return this.#vspecifier;
      }
      #specifier;
      get specifier() {
        return this.#specifier;
      }
      #version;
      get version() {
        return this.#version;
      }
      #subpath;
      get subpath() {
        return this.#subpath;
      }
      #multibundle;
      get multibundle() {
        return this.#multibundle;
      }
      constructor(specs) {
        this.#vspecifier = specs.vspecifier;
        this.#multibundle = specs.multibundle;
        const split = specs.vspecifier.split("/");
        const scope = split[0].startsWith("@") ? split.shift() : void 0;
        const [name, version] = split.shift().split("@");
        this.#subpath = split.join("/");
        this.#pkg = scope ? `${scope}/${name}` : name;
        this.#version = version;
        this.#specifier = this.#pkg + (this.#subpath ? `/${this.#subpath}` : "");
      }
      async execute(action, params) {
        const {
          backends
        } = await beyond.import("@beyond-js/backend/client");
        return await backends.execute(this.#pkg, "legacy", this.#subpath, action, params);
      }
    }
    exports.Module = Module2;
  }
});
ims.set("./package/dependencies", {
  hash: 3724344928,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    class _default extends Map {
      #pkg;
      constructor(pkg) {
        super();
        this.#pkg = pkg;
      }
      update(deps) {
        this.clear();
        deps?.forEach(([specifier, dependency]) => {
          if (!dependency) {
            throw new Error(`Dependency "${specifier}" not found on package "${this.#pkg.vspecifier}"`);
          }
          const {
            __beyond_transversal: transversal
          } = dependency;
          dependency = transversal ? transversal.bundles.get(specifier) : dependency;
          this.set(specifier, dependency);
        });
      }
    }
    exports.default = _default;
  }
});
ims.set("./package/exports", {
  hash: 3682924180,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _trace = require2("./ims/require/trace");
    class _default {
      #require;
      #values = {};
      get values() {
        return this.#values;
      }
      descriptor;
      process;
      constructor(require3) {
        this.#require = require3;
        this.#values.hmr = {
          on: (event, listener) => require3.pkg.hmr.on(event, listener),
          off: (event, listener) => require3.pkg.hmr.off(event, listener)
        };
        this.#values.__beyond_pkg = this.#require.pkg;
      }
      set(key, value) {
        this.#values[key] = value;
      }
      update() {
        const require3 = id => {
          const trace = new _trace.Trace();
          trace.register("exports.update", id);
          return this.#require.solve(id, trace);
        };
        this.process?.({
          require: require3
        });
        const reserved = ["__beyond_pkg", "hmr"];
        Object.keys(this.#values).forEach(p => !reserved.includes(p) && delete this.#values[p]);
        this.descriptor?.forEach(({
          im,
          from,
          name
        }) => {
          const trace = new _trace.Trace();
          this.#values[name] = this.#require.solve(im, trace)[from];
        });
      }
    }
    exports.default = _default;
  }
});
ims.set("./package/ims/exports", {
  hash: 3697874831,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.IMExports = void 0;
    class IMExports {
      constructor(im, bexports) {
        return new Proxy(this, {
          set: (self, name, value) => {
            self[name] = value;
            const prop = bexports.descriptor?.find(({
              im: id,
              from
            }) => {
              return im.id === id && name === from;
            });
            prop && bexports.set(prop.name, value);
            prop && bexports.process?.({
              prop: prop.name,
              value
            });
            return true;
          }
        });
      }
    }
    exports.IMExports = IMExports;
  }
});
ims.set("./package/ims/im", {
  hash: 2241059934,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.InternalModule = void 0;
    var _trace = require2("./require/trace");
    var _exports = require2("./exports");
    class InternalModule {
      #pkg;
      get package() {
        return this.#pkg;
      }
      #id;
      get id() {
        return this.#id;
      }
      #hash;
      get hash() {
        return this.#hash;
      }
      #require;
      #exports;
      #creator;
      #creating = false;
      #created = false;
      get created() {
        return this.#created;
      }
      #create = trace => {
        if (this.#created) throw new Error(`Internal module "${this.#id}" already created`);
        if (this.#creating) throw new Error(`Cyclical import found on internal module "${this.#id}"`);
        this.#creating = true;
        const require3 = id => this.#require.solve(id, trace, this);
        Object.keys(this.#exports).forEach(key => delete this.#exports[key]);
        this.#creator(require3, this.#exports);
        this.#created = true;
        this.#creating = false;
      };
      require(trace, source) {
        if (!this.#created) {
          source && trace.register(source.id, this.#id);
          this.#create(trace);
          trace.pop();
        }
        return this.#exports;
      }
      initialise() {
        if (this.#created) return;
        const trace = new _trace.Trace();
        trace.register("initialisation", this.#id);
        this.#create(trace);
      }
      update(creator, hash) {
        this.#created = false;
        this.#creator = creator;
        this.#hash = hash;
      }
      constructor(pkg, id, hash, creator, require3) {
        this.#pkg = pkg;
        this.#id = id;
        this.#hash = hash;
        this.#creator = creator;
        this.#require = require3;
        this.#exports = new _exports.IMExports(this, pkg.exports);
      }
    }
    exports.InternalModule = InternalModule;
  }
});
ims.set("./package/ims/index", {
  hash: 993201032,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.InternalModules = void 0;
    var _im = require2("./im");
    class InternalModules {
      #pkg;
      #ims = /* @__PURE__ */new Map();
      #require;
      constructor(pkg) {
        this.#pkg = pkg;
      }
      set _require(value) {
        this.#require = value;
      }
      #register = (id, hash, creator) => {
        if (this.#ims.has(id)) throw new Error(`IM "${id}" already registered`);
        const im = new _im.InternalModule(this.#pkg, id, hash, creator, this.#require);
        this.#ims.set(im.id, im);
      };
      register(ims2) {
        ims2.forEach(({
          creator,
          hash
        }, id) => this.#register(id, hash, creator));
      }
      require(id, trace, source) {
        const module2 = (() => {
          if (this.#ims.has(id)) return id;
          return id.endsWith("/") ? `${id}index` : `${id}/index`;
        })();
        if (!this.#ims.has(module2)) {
          throw new Error(`Internal module "${id}" not found`);
        }
        const im = this.#ims.get(module2);
        return im.require(trace, source);
      }
      initialise() {
        this.#ims.forEach(im => im.initialise());
      }
      update(ims2) {
        ims2.forEach(({
          creator,
          hash
        }, id) => {
          if (!this.#ims.has(id)) {
            this.#register(id, hash, creator);
            return;
          }
          const im = this.#ims.get(id);
          if (im.hash === hash) return;
          im.update(creator, hash);
          this.#pkg.hmr.trigger(`${id}:change`);
        });
      }
    }
    exports.InternalModules = InternalModules;
  }
});
ims.set("./package/ims/require/index", {
  hash: 12273943,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Require = void 0;
    var _base = require2("../../../base");
    class Require {
      #pkg;
      get pkg() {
        return this.#pkg;
      }
      constructor(pkg) {
        this.#pkg = pkg;
      }
      solve(specifier, trace, im) {
        if (specifier.startsWith(".")) {
          specifier = im ? (0, _base.resolve)(im.id, specifier) : specifier;
          return this.#pkg.ims.require(specifier, trace, im);
        }
        if (specifier === "beyond_context") {
          const {
            bundle
          } = this.#pkg;
          return {
            module: bundle.module,
            bundle,
            pkg: this.#pkg
          };
        }
        if (specifier === "@beyond-js/kernel/bundle") {
          const {
            Bundle: Bundle2
          } = require2("../../../bundle");
          const {
            instances: instances2
          } = require2("../../../instances");
          return {
            Bundle: Bundle2,
            instances: instances2
          };
        }
        const {
          dependencies
        } = this.#pkg;
        if (dependencies.has(specifier)) {
          const {
            __beyond_pkg: pkg
          } = dependencies.get(specifier);
          typeof pkg === "object" && !pkg.initialised && pkg.initialise();
          return dependencies.get(specifier);
        }
        const keys = JSON.stringify([...dependencies.keys()]);
        throw new Error(`Bundle "${specifier}" is not registered as a dependency: ${keys}`);
      }
    }
    exports.Require = Require;
  }
});
ims.set("./package/ims/require/trace", {
  hash: 1932027471,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Trace = void 0;
    class Trace extends Array {
      has = id => this.find(rt => rt.id === id);
      register(source, id) {
        if (this.has(id)) {
          let traced = "";
          this.forEach(({
            id: id2,
            source: source2
          }) => {
            const s = ["initialisation", "exports.update"].includes(source2) ? "Cycle initiates with source" : `then "${source2}" requires`;
            traced += `	${s} "${id2}"
`;
          });
          traced += `	that finally requires "${id}" again.
`;
          throw new Error(`Recursive module load found.
Internal module "${source}" is requiring another internal module that was previously required: "${id}"
Trace of required modules:
${traced}`);
        }
        this.push({
          id,
          source
        });
      }
    }
    exports.Trace = Trace;
  }
});
ims.set("./package/index", {
  hash: 458850112,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Package = void 0;
    var _ims = require2("./ims");
    var _require = require2("./ims/require");
    var _exports = require2("./exports");
    var _dependencies = require2("./dependencies");
    var _instances = require2("./instances");
    var _events = require2("../events");
    class Package2 {
      #bundle;
      get bundle() {
        return this.#bundle;
      }
      #language;
      get language() {
        return this.#language;
      }
      #vspecifier;
      get vspecifier() {
        return this.#vspecifier;
      }
      #specifier;
      get specifier() {
        return this.#specifier;
      }
      #require;
      #ims;
      get ims() {
        return this.#ims;
      }
      #exports;
      get exports() {
        return this.#exports;
      }
      #dependencies = new _dependencies.default(this);
      get dependencies() {
        return this.#dependencies;
      }
      #hmr = new _events.Events();
      get hmr() {
        return this.#hmr;
      }
      constructor(bundle, language) {
        this.#bundle = bundle;
        this.#language = language ? language : "";
        this.#vspecifier = language ? `${bundle.vspecifier}.${language}` : bundle.vspecifier;
        this.#specifier = language ? `${bundle.specifier}.${language}` : bundle.specifier;
        this.#ims = new _ims.InternalModules(this);
        this.#require = new _require.Require(this);
        this.#ims._require = this.#require;
        this.#exports = new _exports.default(this.#require);
        _instances.default.register(this);
      }
      #initialised = false;
      get initialised() {
        return this.#initialised;
      }
      initialise(ims2) {
        if (this.#initialised) throw new Error("Package already initialised");
        this.#initialised = true;
        ims2 && this.#ims.register(ims2);
        this.exports.update();
        this.#ims.initialise();
      }
      update(ims2) {
        this.#ims.update(ims2);
        this.exports.update();
        this.#ims.initialise();
        this.#hmr.trigger("change");
      }
    }
    exports.Package = Package2;
  }
});
ims.set("./package/instances", {
  hash: 2745122839,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    var _default = new class extends Map {
      register(pkg) {
        this.set(pkg.vspecifier, pkg);
      }
    }();
    exports.default = _default;
  }
});
__pkg.exports.descriptor = [{
  "im": "./bimport/bimport",
  "from": "bimport",
  "name": "bimport"
}, {
  "im": "./bimport/brequire",
  "from": "brequire",
  "name": "brequire"
}, {
  "im": "./bundle",
  "from": "IBundleSpecs",
  "name": "IBundleSpecs"
}, {
  "im": "./bundle",
  "from": "Bundle",
  "name": "Bundle"
}, {
  "im": "./events/index",
  "from": "Events",
  "name": "Events"
}, {
  "im": "./events/types",
  "from": "ListenerFunction",
  "name": "ListenerFunction"
}, {
  "im": "./instances",
  "from": "instances",
  "name": "instances"
}, {
  "im": "./module/index",
  "from": "Module",
  "name": "Module"
}, {
  "im": "./package/exports",
  "from": "IExportsDescriptor",
  "name": "IExportsDescriptor"
}, {
  "im": "./package/ims/im",
  "from": "IMSpecs",
  "name": "IMSpecs"
}, {
  "im": "./package/ims/index",
  "from": "IMCreators",
  "name": "IMCreators"
}, {
  "im": "./package/index",
  "from": "Package",
  "name": "Package"
}];
var bimport, brequire, IBundleSpecs, Bundle, Events, ListenerFunction, instances, Module, IExportsDescriptor, IMSpecs, IMCreators, Package;
__pkg.exports.process = function (require2) {
  bimport = require2("./bimport/bimport").bimport;
  brequire = require2("./bimport/brequire").brequire;
  IBundleSpecs = require2("./bundle").IBundleSpecs;
  Bundle = require2("./bundle").Bundle;
  Events = require2("./events/index").Events;
  ListenerFunction = require2("./events/types").ListenerFunction;
  instances = require2("./instances").instances;
  Module = require2("./module/index").Module;
  IExportsDescriptor = require2("./package/exports").IExportsDescriptor;
  IMSpecs = require2("./package/ims/im").IMSpecs;
  IMCreators = require2("./package/ims/index").IMCreators;
  Package = require2("./package/index").Package;
};
var __bp = {};
ims.get("./base/index").creator(() => 0, __bp);
__pkg = new __bp.BeyondPackage(__pkg.exports);
__pkg.initialise(ims);
};

code(module, require);
_exports(module.exports);
}}});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL0BiZXlvbmQtanMva2VybmVsL2J1bmRsZS4wLjEuOS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9idW5kbGUvX19zb3VyY2VzL2J1bmRsZS9iYXNlL2luZGV4LnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL2J1bmRsZS9fX3NvdXJjZXMvYnVuZGxlL2JpbXBvcnQvYmltcG9ydC50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9idW5kbGUvX19zb3VyY2VzL2J1bmRsZS9iaW1wb3J0L2JyZXF1aXJlLnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL2J1bmRsZS9fX3NvdXJjZXMvYnVuZGxlL2JpbXBvcnQvaW5kZXgudHMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvYnVuZGxlL19fc291cmNlcy9idW5kbGUvYmltcG9ydC9yZXF1aXJlanMudHMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvYnVuZGxlL19fc291cmNlcy9idW5kbGUvYnVuZGxlLnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL2J1bmRsZS9fX3NvdXJjZXMvYnVuZGxlL2V2ZW50cy9pbmRleC50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9idW5kbGUvX19zb3VyY2VzL2J1bmRsZS9ldmVudHMvdHlwZXMudHMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvYnVuZGxlL19fc291cmNlcy9idW5kbGUvaW5zdGFuY2VzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL2J1bmRsZS9fX3NvdXJjZXMvYnVuZGxlL21vZHVsZS9pbmRleC50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9idW5kbGUvX19zb3VyY2VzL2J1bmRsZS9wYWNrYWdlL2RlcGVuZGVuY2llcy50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9idW5kbGUvX19zb3VyY2VzL2J1bmRsZS9wYWNrYWdlL2V4cG9ydHMudHMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvYnVuZGxlL19fc291cmNlcy9idW5kbGUvcGFja2FnZS9pbXMvZXhwb3J0cy50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9idW5kbGUvX19zb3VyY2VzL2J1bmRsZS9wYWNrYWdlL2ltcy9pbS50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9idW5kbGUvX19zb3VyY2VzL2J1bmRsZS9wYWNrYWdlL2ltcy9pbmRleC50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9idW5kbGUvX19zb3VyY2VzL2J1bmRsZS9wYWNrYWdlL2ltcy9yZXF1aXJlL2luZGV4LnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL2J1bmRsZS9fX3NvdXJjZXMvYnVuZGxlL3BhY2thZ2UvaW1zL3JlcXVpcmUvdHJhY2UudHMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvYnVuZGxlL19fc291cmNlcy9idW5kbGUvcGFja2FnZS9pbmRleC50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9idW5kbGUvX19zb3VyY2VzL2J1bmRsZS9wYWNrYWdlL2luc3RhbmNlcy50cyJdLCJuYW1lcyI6WyJidW5kbGVfMF8xXzlfZXhwb3J0cyIsIl9fZXhwb3J0IiwiQnVuZGxlIiwiRXZlbnRzIiwiSUJ1bmRsZVNwZWNzIiwiSUV4cG9ydHNEZXNjcmlwdG9yIiwiSU1DcmVhdG9ycyIsIklNU3BlY3MiLCJMaXN0ZW5lckZ1bmN0aW9uIiwiTW9kdWxlIiwiUGFja2FnZSIsImJpbXBvcnQiLCJicmVxdWlyZSIsImluc3RhbmNlcyIsIm1vZHVsZSIsImV4cG9ydHMiLCJfX3RvQ29tbW9uSlMiLCJyZXNvbHZlIiwic291cmNlIiwiaWQiLCJzdGFydHNXaXRoIiwiRXJyb3IiLCJzcGxpdCIsInBvcCIsInRhcmdldCIsInNsaWNlIiwibGVuZ3RoIiwic2hpZnQiLCJqb2luIiwiQmV5b25kUGFja2FnZSIsImltcyIsImNhY2hlZCIsIk1hcCIsImNvbnN0cnVjdG9yIiwiZXhwb3J0czIiLCJpbml0aWFsaXNlIiwiaW1zMiIsInByb2Nlc3MiLCJyZXF1aXJlIiwibW9kdWxlMiIsImhhcyIsImVuZHNXaXRoIiwiZ2V0IiwiZm4iLCJjcmVhdG9yIiwicmVxdWlyZTMiLCJyZXF1aXJlZCIsInNldCIsInJlcXVpcmUyIiwiYmltcG9ydDIiLCJyZXNvdXJjZSIsInZlcnNpb24iLCJtb2RlIiwiUHJvbWlzZSIsInJlamVjdCIsImVycm9yIiwiYW1kX3JlcXVpcmUiLCJyZXR1cm5lZCIsImV4YyIsImNvbnNvbGUiLCJsb2ciLCJzdGFjayIsImdsb2JhbFRoaXMiLCJTeXN0ZW0iLCJpbXBvcnQiLCJhcHBEZXBlbmRlbmNpZXMiLCJkZXBlbmRlbmNpZXMiLCJfX2FwcF9wYWNrYWdlIiwic3BlY2lmaWVyIiwidGVzdCIsInBrZyIsInN1YnBhdGgiLCJfaW5zdGFuY2VzIiwiYnJlcXVpcmUyIiwiZm91bmQiLCJkZWZhdWx0IiwiZmluZCIsInZzcGVjaWZpZXIiLCJzcGxpdDIiLCJpbml0aWFsaXNlZCIsInZhbHVlcyIsIl9iaW1wb3J0IiwiX2JyZXF1aXJlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIl9wYWNrYWdlIiwiX21vZHVsZSIsIkJ1bmRsZTIiLCJ0eXBlIiwibmFtZSIsInVyaSIsInNwZWNzIiwibXVsdGlidW5kbGUiLCJyZWdpc3RlciIsInBhY2thZ2UiLCJsYW5ndWFnZSIsIkV2ZW50czIiLCJsaXN0ZW5lcnMiLCJkZXN0cm95ZWQiLCJzdXBwb3J0ZWQiLCJBcnJheSIsImJpbmQiLCJldmVudCIsImxpc3RlbmVyIiwicHJpb3JpdHkiLCJvbiIsInVuYmluZCIsIm9mZiIsImluY2x1ZGVzIiwibCIsInB1c2giLCJmb3JjZSIsImRlbGV0ZSIsImUiLCJmaWx0ZXJlZCIsImZpbHRlciIsIml0ZW0iLCJ0cmlnZ2VyIiwicmVzdCIsImFyZ3MiLCJhcmd1bWVudHMiLCJzb3J0IiwiYSIsImIiLCJhc3luYyIsInByb21pc2VzIiwiYWxsIiwiY2FsbCIsImNhdGNoIiwiZGVzdHJveSIsImNsZWFyIiwiaW5zdGFuY2VzMiIsImJ1bmRsZSIsIk1vZHVsZTIiLCJzY29wZSIsImV4ZWN1dGUiLCJhY3Rpb24iLCJwYXJhbXMiLCJiYWNrZW5kcyIsImJleW9uZCIsIl9kZWZhdWx0IiwidXBkYXRlIiwiZGVwcyIsImZvckVhY2giLCJkZXBlbmRlbmN5IiwiX19iZXlvbmRfdHJhbnN2ZXJzYWwiLCJ0cmFuc3ZlcnNhbCIsImJ1bmRsZXMiLCJfdHJhY2UiLCJkZXNjcmlwdG9yIiwiaG1yIiwiX19iZXlvbmRfcGtnIiwia2V5IiwidHJhY2UiLCJUcmFjZSIsInNvbHZlIiwicmVzZXJ2ZWQiLCJrZXlzIiwicCIsImltIiwiZnJvbSIsIklNRXhwb3J0cyIsImJleHBvcnRzIiwiUHJveHkiLCJzZWxmIiwicHJvcCIsIl9leHBvcnRzIiwiSW50ZXJuYWxNb2R1bGUiLCJoYXNoIiwiY3JlYXRpbmciLCJjcmVhdGVkIiwiY3JlYXRlIiwiX2ltIiwiSW50ZXJuYWxNb2R1bGVzIiwiX3JlcXVpcmUiLCIjcmVnaXN0ZXIiLCJfYmFzZSIsIlJlcXVpcmUiLCJKU09OIiwic3RyaW5naWZ5IiwicnQiLCJ0cmFjZWQiLCJpZDIiLCJzb3VyY2UyIiwicyIsIl9pbXMiLCJfZGVwZW5kZW5jaWVzIiwiX2V2ZW50cyIsIlBhY2thZ2UyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxvQkFBQTtBQUFBQyxRQUFBLENBQUFELG9CQUFBO0VBQUFFLE1BQUEsRUFBQUEsQ0FBQSxLQUFBQSxNQUFBO0VBQUFDLE1BQUEsRUFBQUEsQ0FBQSxL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