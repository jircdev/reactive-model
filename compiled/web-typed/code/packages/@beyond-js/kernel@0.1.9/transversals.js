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

// .beyond/uimport/temp/@beyond-js/kernel/transversals.0.1.9.js
var transversals_0_1_9_exports = {};
__export(transversals_0_1_9_exports, {
  Transversal: () => Transversal,
  __beyond_pkg: () => __beyond_pkg,
  hmr: () => hmr
});
module.exports = __toCommonJS(transversals_0_1_9_exports);

// node_modules/@beyond-js/kernel/transversals/transversals.browser.mjs
var dependency_0 = __toESM(require("@beyond-js/kernel@0.1.9/bundle"), 0);
var import_meta = {};
var {
  Bundle: __Bundle
} = dependency_0;
var __pkg = new __Bundle({
  "module": {
    "vspecifier": "@beyond-js/kernel@0.1.9/transversals"
  },
  "type": "ts"
}, _context.meta.url).package();
;
__pkg.dependencies.update([]);
var ims = /* @__PURE__ */new Map();
ims.set("./dependencies", {
  hash: 916907578,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    class _default extends Map {
      update(deps) {
        this.clear();
        deps?.forEach(([specifier, dependency]) => this.set(specifier, dependency));
      }
    }
    exports.default = _default;
  }
});
ims.set("./transversal", {
  hash: 2292377186,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Transversal = void 0;
    var _bundle = require2("@beyond-js/kernel/bundle");
    var _dependencies = require2("./dependencies");
    class Transversal2 {
      #name;
      get name() {
        return this.#name;
      }
      #language;
      get language() {
        return this.#language;
      }
      #bundles = /* @__PURE__ */new Map();
      get bundles() {
        return this.#bundles;
      }
      #dependencies = new _dependencies.default();
      get dependencies() {
        return this.#dependencies;
      }
      constructor(name, language) {
        this.#name = name;
        this.#language = language;
      }
      #initialised = false;
      initialise(bundles) {
        if (this.#initialised) throw new Error(`Transversal "${this.#name}" already initialised`);
        this.#initialised = true;
        const packages = /* @__PURE__ */new Map();
        bundles.forEach(([specs, creator]) => {
          const pkg = new _bundle.Bundle(specs).package(this.#language);
          const ims2 = /* @__PURE__ */new Map();
          const exports2 = {};
          const response = creator(ims2, exports2);
          const {
            dependencies
          } = response ? response : {
            dependencies: void 0
          };
          pkg.exports.descriptor = exports2.descriptor;
          packages.set(pkg.specifier, {
            pkg,
            dependencies,
            ims: ims2
          });
        });
        packages.forEach(({
          pkg,
          dependencies,
          ims: ims2
        }) => {
          const register = (() => {
            const register2 = [];
            dependencies?.forEach(specifier => {
              if (this.#dependencies.has(specifier)) {
                register2.push([specifier, this.#dependencies.get(specifier)]);
                return;
              }
              if (!packages.has(specifier)) {
                const data = `
	Dependencies: ${JSON.stringify([...this.#dependencies.keys()])}. 
	Bundles: ${JSON.stringify([...packages.keys()])}`;
                throw new Error(`Dependency "${specifier}" not found on "${this.#name}" transversal. ${data}`);
              }
              const {
                pkg: pkg2
              } = packages.get(specifier);
              register2.push([specifier, pkg2.exports.values]);
            });
            return register2;
          })();
          packages.forEach(({
            pkg: pkg2
          }) => this.#bundles.set(pkg2.specifier, pkg2.exports.values));
          register && pkg.dependencies.update(register);
          pkg.ims.register(ims2);
        });
        packages.forEach(({
          pkg
        }) => !pkg.initialised && pkg.initialise());
      }
    }
    exports.Transversal = Transversal2;
  }
});
__pkg.exports.descriptor = [{
  "im": "./transversal",
  "from": "Transversal",
  "name": "Transversal"
}];
var Transversal;
__pkg.exports.process = function ({
  require: require2,
  prop,
  value
}) {
  (require2 || prop === "Transversal") && (Transversal = require2 ? require2("./transversal").Transversal : value);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL0BiZXlvbmQtanMva2VybmVsL3RyYW5zdmVyc2Fscy4wLjEuOS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC90cmFuc3ZlcnNhbHMvX19zb3VyY2VzL3RyYW5zdmVyc2Fscy9kZXBlbmRlbmNpZXMudHMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvdHJhbnN2ZXJzYWxzL19fc291cmNlcy90cmFuc3ZlcnNhbHMvdHJhbnN2ZXJzYWwudHMiXSwibmFtZXMiOlsidHJhbnN2ZXJzYWxzXzBfMV85X2V4cG9ydHMiLCJfX2V4cG9ydCIsIlRyYW5zdmVyc2FsIiwiX19iZXlvbmRfcGtnIiwiaG1yIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9fdG9Db21tb25KUyIsIl9kZWZhdWx0IiwiTWFwIiwidXBkYXRlIiwiZGVwcyIsImNsZWFyIiwiZm9yRWFjaCIsInNwZWNpZmllciIsImRlcGVuZGVuY3kiLCJzZXQiLCJkZWZhdWx0IiwiX2J1bmRsZSIsInJlcXVpcmUyIiwiX2RlcGVuZGVuY2llcyIsIlRyYW5zdmVyc2FsMiIsIm5hbWUiLCJsYW5ndWFnZSIsImJ1bmRsZXMiLCJkZXBlbmRlbmNpZXMiLCJjb25zdHJ1Y3RvciIsImluaXRpYWxpc2VkIiwiaW5pdGlhbGlzZSIsIkVycm9yIiwicGFja2FnZXMiLCJzcGVjcyIsImNyZWF0b3IiLCJwa2ciLCJCdW5kbGUiLCJwYWNrYWdlIiwiaW1zMiIsImV4cG9ydHMyIiwicmVzcG9uc2UiLCJkZXNjcmlwdG9yIiwiaW1zIiwicmVnaXN0ZXIiLCJyZWdpc3RlcjIiLCJoYXMiLCJwdXNoIiwiZ2V0IiwiZGF0YSIsIkpTT04iLCJzdHJpbmdpZnkiLCJrZXlzIiwicGtnMiIsInZhbHVlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsMEJBQUE7QUFBQUMsUUFB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Y0FDeEMsSUFBSSxLQUFLLENBQUFXLFlBQUEsQ0FBY2tCLEdBQUEsQ0FBSTdCLFNBQVMsR0FBRztnQkFDbkM0QixTQUFBLENBQVNFLElBQUEsQ0FBSyxDQUFDOUIsU0FBQSxFQUFXLEtBQUssQ0FBQVcsWUFBQSxDQUFjb0IsR0FBQSxDQUFJL0IsU0FBUyxDQUFDLENBQUM7Z0JBQzVEOztjQUlKLElBQUksQ0FBQ2dCLFFBQUEsQ0FBU2EsR0FBQSxDQUFJN0IsU0FBUyxHQUFHO2dCQUMxQixNQUFNZ0MsSUFBQSxHQUFPO2lCQUFxQkMsSUFBQSxDQUFLQyxTQUFBLENBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQXZCLFlBQUEsQ0FBY3dCLElBQUEsRUFBTSxDQUFDO1lBQzNERixJQUFBLENBQUtDLFNBQUEsQ0FBVSxDQUFDLEdBQUdsQixRQUFBLENBQVNtQixJQUFBLEVBQU0sQ0FBQztnQkFDdkQsTUFBTSxJQUFJcEIsS0FBQSxDQUFNLGVBQWVmLFNBQUEsbUJBQTRCLEtBQUssQ0FBQVEsSUFBQSxrQkFBdUJ3QixJQUFBLEVBQU07O2NBR2pHLE1BQU07Z0JBQUNiLEdBQUEsRUFBQWlCO2NBQUcsSUFBSXBCLFFBQUEsQ0FBU2UsR0FBQSxDQUFJL0IsU0FBUztjQUNwQzRCLFNBQUEsQ0FBU0UsSUFBQSxDQUFLLENBQUM5QixTQUFBLEVBQVdvQyxJQUFBLENBQUk1QyxPQUFBLENBQVE2QyxNQUFNLENBQUM7WUFDakQsQ0FBQztZQUNELE9BQU9ULFNBQUE7VUFDWCxJQUFDO1VBRURaLFFBQUEsQ0FBU2pCLE9BQUEsQ0FBUSxDQUFDO1lBQUNvQixHQUFBLEVBQUFpQjtVQUFHLE1BQU0sS0FBSyxDQUFBMUIsT0FBQSxDQUFTUixHQUFBLENBQUlrQyxJQUFBLENBQUlwQyxTQUFBLEVBQVdvQyxJQUFBLENBQUk1QyxPQUFBLENBQVE2QyxNQUFNLENBQUM7VUFFaEZWLFFBQUEsSUFBWVIsR0FBQSxDQUFJUixZQUFBLENBQWFmLE1BQUEsQ0FBTytCLFFBQVE7VUFJNUNSLEdBQUEsQ0FBSU8sR0FBQSxDQUFJQyxRQUFBLENBQVNMLElBQUc7UUFDeEIsQ0FBQztRQUVETixRQUFBLENBQVNqQixPQUFBLENBQVEsQ0FBQztVQUFDb0I7UUFBRyxNQUFNLENBQUNBLEdBQUEsQ0FBSU4sV0FBQSxJQUFlTSxHQUFBLENBQUlMLFVBQUEsRUFBWTtNQUNwRTs7SUFDSHRCLE9BQUEsQ0FBQUosV0FBQSxHQUFBbUIsWUFBQSIsImZpbGUiOiIiLCJzb3VyY2VSb290IjoiL3JlYWN0aXZlLW1vZGVsL291dCJ9