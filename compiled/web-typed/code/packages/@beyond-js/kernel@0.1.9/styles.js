System.register(["@beyond-js/kernel@0.1.9/bundle","@beyond-js/kernel@0.1.9/core"], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["@beyond-js/kernel","0.1.9"]]);
	return globalThis.bimport(globalThis.bimport.resolve(specifier, dependencies));
};


var dependencies = new Map();
var require = dependency => dependencies.get(dependency);
return {
setters: [dep => dependencies.set('@beyond-js/kernel@0.1.9/bundle', dep), dep => dependencies.set('@beyond-js/kernel@0.1.9/core', dep)],
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

// .beyond/uimport/temp/@beyond-js/kernel/styles.0.1.9.js
var styles_0_1_9_exports = {};
__export(styles_0_1_9_exports, {
  DependenciesStyles: () => DependenciesStyles,
  V1Styles: () => V1Styles,
  __beyond_pkg: () => __beyond_pkg,
  hmr: () => hmr,
  styles: () => styles
});
module.exports = __toCommonJS(styles_0_1_9_exports);

// node_modules/@beyond-js/kernel/styles/styles.browser.mjs
var dependency_0 = __toESM(require("@beyond-js/kernel@0.1.9/bundle"), 0);
var dependency_1 = __toESM(require("@beyond-js/kernel@0.1.9/core"), 0);
var import_meta = {};
var {
  Bundle: __Bundle
} = dependency_0;
var __pkg = new __Bundle({
  "module": {
    "vspecifier": "@beyond-js/kernel@0.1.9/styles"
  },
  "type": "ts"
}, _context.meta.url).package();
;
__pkg.dependencies.update([["@beyond-js/kernel/core", dependency_1]]);
var ims = /* @__PURE__ */new Map();
ims.set("./dependencies-styles", {
  hash: 282408023,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.DependenciesStyles = void 0;
    var _bundle = require2("@beyond-js/kernel/bundle");
    var _core = require2("@beyond-js/kernel/core");
    var _registry = require2("./registry");
    class DependenciesStyles2 extends _core.Events {
      #vspecifier;
      #elements;
      get elements() {
        return this.#elements;
      }
      constructor(vspecifier) {
        super();
        this.#vspecifier = vspecifier;
        const change = () => this.trigger("change");
        this.#elements = /* @__PURE__ */new Set();
        const recursive = vspecifier2 => {
          if (!vspecifier2) {
            console.trace("Bundle vspecifier not defined");
            return;
          }
          if (!_bundle.instances.has(vspecifier2)) {
            console.error(`Bundle id "${vspecifier2}" not found. Try refreshing the page.
If the problem still persist, delete the BeyondJS cache and try again.`);
            return;
          }
          const bundle = _bundle.instances.get(vspecifier2);
          if (vspecifier2 !== this.#vspecifier && bundle.type === "widget") return;
          const styles2 = _registry.styles.get(vspecifier2);
          if (styles2 && styles2.engine !== "legacy") {
            this.#elements.add(styles2);
            styles2.on("change", change);
          }
          const {
            dependencies
          } = bundle.package();
          dependencies.forEach(dependency => {
            const pkg = dependency.__beyond_pkg;
            if (!pkg) return;
            recursive(pkg.vspecifier);
          });
        };
        recursive(this.#vspecifier);
      }
    }
    exports.DependenciesStyles = DependenciesStyles2;
  }
});
ims.set("./legacy", {
  hash: 859564821,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = void 0;
    class _default {
      get engine() {
        return "legacy";
      }
      #bundle;
      #value;
      get value() {
        return this.#value;
      }
      #appended = false;
      get appended() {
        return this.#appended;
      }
      constructor(bundle, value) {
        this.#bundle = bundle;
        const module2 = (() => {
          const module3 = bundle.split("/");
          module3.pop();
          return module3.join("/");
        })();
        const regexp = /#host\.([\w\d]*)#([^.]*\.[\w\d]*)/g;
        this.#value = value.replace(regexp, (match, host, resource) => {
          if (host === "module" || host === "library") {
            return `${module2}/${resource}`;
          } else if (host === "application") {
            return resource;
          }
          console.warn(`Invalid css host specification on bundle "${bundle}"`, match);
        });
      }
      appendToDOM(is) {
        if (this.#appended) {
          const previous = document.querySelectorAll(`:scope > [bundle="${this.#bundle}"]`)[0];
          previous && document.removeChild(previous);
        }
        const css = document.createElement("style");
        css.appendChild(document.createTextNode(this.#value));
        is && css.setAttribute("is", is);
        document.getElementsByTagName("head")[0].appendChild(css);
        this.#appended = true;
      }
    }
    exports.default = _default;
  }
});
ims.set("./registry", {
  hash: 2402124624,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.styles = void 0;
    var _legacy = require2("./legacy");
    var _v = require2("./v1");
    class Registry {
      #registry = /* @__PURE__ */new Map();
      register(vspecifier, value) {
        if (this.#registry.has(vspecifier)) return;
        const styles3 = value ? new _legacy.default(vspecifier, value) : new _v.V1Styles(vspecifier);
        this.#registry.set(vspecifier, styles3);
        return styles3;
      }
      has(vspecifier) {
        return this.#registry.has(vspecifier);
      }
      get(vspecifier) {
        return this.#registry.get(vspecifier);
      }
    }
    const styles2 = new Registry();
    exports.styles = styles2;
    globalThis.beyondLegacyStyles = styles2;
  }
});
ims.set("./v1", {
  hash: 1891964101,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.V1Styles = void 0;
    var _core = require2("@beyond-js/kernel/core");
    var _bundle = require2("@beyond-js/kernel/bundle");
    class V1Styles2 extends _core.Events {
      get engine() {
        return "v1";
      }
      #bundle;
      get bundle() {
        return this.#bundle;
      }
      #version = 0;
      get version() {
        return this.#version;
      }
      #resource;
      get resource() {
        return this.#resource;
      }
      get href() {
        const version = this.#version ? `?version=${this.#version}` : "";
        return `${this.#resource}${version}`;
      }
      constructor(resource) {
        super();
        this.#bundle = _bundle.instances.get(resource);
        this.#resource = (() => {
          if (typeof process === "object") {
            const split = resource.split("/");
            const pkg = split[0].startsWith("@") ? `${split.shift()}/${split.shift()}` : split.shift();
            const subpath = split.join("/");
            return `##_!${pkg}!_##${subpath}.css`;
          }
          let {
            uri
          } = this.#bundle;
          const regexp = new RegExp("^https?://cdn.beyondjs.com", "i");
          if (regexp.test(uri)) {
            const {
              origin,
              pathname,
              searchParams
            } = new URL(uri);
            const version = searchParams.has("version") ? `&version=${searchParams.get("version")}` : "";
            return origin + pathname + "?css" + version;
          }
          uri = uri.slice(0, uri.length - 3);
          return `${uri}.css`;
        })();
      }
      change() {
        this.#version++;
        this.trigger("change");
      }
    }
    exports.V1Styles = V1Styles2;
  }
});
__pkg.exports.descriptor = [{
  "im": "./dependencies-styles",
  "from": "DependenciesStyles",
  "name": "DependenciesStyles"
}, {
  "im": "./registry",
  "from": "styles",
  "name": "styles"
}, {
  "im": "./v1",
  "from": "V1Styles",
  "name": "V1Styles"
}];
var DependenciesStyles, styles, V1Styles;
__pkg.exports.process = function ({
  require: require2,
  prop,
  value
}) {
  (require2 || prop === "DependenciesStyles") && (DependenciesStyles = require2 ? require2("./dependencies-styles").DependenciesStyles : value);
  (require2 || prop === "styles") && (styles = require2 ? require2("./registry").styles : value);
  (require2 || prop === "V1Styles") && (V1Styles = require2 ? require2("./v1").V1Styles : value);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL0BiZXlvbmQtanMva2VybmVsL3N0eWxlcy4wLjEuOS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9zdHlsZXMvX19zb3VyY2VzL3N0eWxlcy9kZXBlbmRlbmNpZXMtc3R5bGVzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL3N0eWxlcy9fX3NvdXJjZXMvc3R5bGVzL2xlZ2FjeS50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9zdHlsZXMvX19zb3VyY2VzL3N0eWxlcy9yZWdpc3RyeS50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9zdHlsZXMvX19zb3VyY2VzL3N0eWxlcy92MS50cyJdLCJuYW1lcyI6WyJzdHlsZXNfMF8xXzlfZXhwb3J0cyIsIl9fZXhwb3J0IiwiRGVwZW5kZW5jaWVzU3R5bGVzIiwiVjFTdHlsZXMiLCJfX2JleW9uZF9wa2ciLCJobXIiLCJzdHlsZXMiLCJtb2R1bGUiLCJleHBvcnRzIiwiX190b0NvbW1vbkpTIiwiX2J1bmRsZSIsInJlcXVpcmUyIiwiX2NvcmUiLCJfcmVnaXN0cnkiLCJEZXBlbmRlbmNpZXNTdHlsZXMyIiwiRXZlbnRzIiwidnNwZWNpZmllciIsImVsZW1lbnRzIiwiY29uc3RydWN0b3IiLCJjaGFuZ2UiLCJ0cmlnZ2VyIiwiU2V0IiwicmVjdXJzaXZlIiwidnNwZWNpZmllcjIiLCJjb25zb2xlIiwidHJhY2UiLCJpbnN0YW5jZXMiLCJoYXMiLCJlcnJvciIsImJ1bmRsZSIsImdldCIsInR5cGUiLCJzdHlsZXMyIiwiZW5naW5lIiwiYWRkIiwib24iLCJkZXBlbmRlbmNpZXMiLCJwYWNrYWdlIiwiZm9yRWFjaCIsImRlcGVuZGVuY3kiLCJwa2ciLCJfZGVmYXVsdCIsInZhbHVlIiwiYXBwZW5kZWQiLCJtb2R1bGUyIiwibW9kdWxlMyIsInNwbGl0IiwicG9wIiwiam9pbiIsInJlZ2V4cCIsInJlcGxhY2UiLCJtYXRjaCIsImhvc3QiLCJyZXNvdXJjZSIsIndhcm4iLCJhcHBlbmRUb0RPTSIsImlzIiwicHJldmlvdXMiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJyZW1vdmVDaGlsZCIsImNzcyIsImNyZWF0ZUVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImNyZWF0ZVRleHROb2RlIiwic2V0QXR0cmlidXRlIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJkZWZhdWx0IiwiX2xlZ2FjeSIsIl92IiwiUmVnaXN0cnkiLCJyZWdpc3RyeSIsIk1hcCIsInJlZ2lzdGVyIiwic3R5bGVzMyIsInNldCIsImdsb2JhbFRoaXMiLCJiZXlvbmRMZWdhY3lTdHlsZXMiLCJWMVN0eWxlczIiLCJ2ZXJzaW9uIiwiaHJlZiIsInByb2Nlc3MiLCJzdGFydHNXaXRoIiwic2hpZnQiLCJzdWJwYXRoIiwidXJpIiwiUmVnRXhwIiwidGVzdCIsIm9yaWdpbiIsInBhdGhuYW1lIiwic2VhcmNoUGFyYW1zIiwiVVJMIiwic2xpY2UiLCJsZW5ndGgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLG9CQUFBO0FBQUFDLFFBQUEsQ0FBQUQsb0JBQUE7RUFBQUUsa0JBQUEsRUFBQUEsQ0FBQSxLQUFBQSxrQkFBQTtFQUFBQyxRQUFBLEVBQUFBLENBQUEsS0FBQUEsUUFBQTtFQUFBQyxZQUFBLEVBQUFBLENBQUEsS0FBQUEsWUFBQTtFQUFBQyxHQUFBLEVBQUFBLENBQUEsS0FBQUEsR0FBQTtFQUFBQyxNQUFBLEVBQUFBLENBQUEsS0FBQUE7QUFBQTtBQUFBQyxNQUFBLENBQUFDLE9BQUEsR0FBQUMsWUFBQSxDQUFBVCxvQkFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQUEsSUFBQVUsT0FBQSxHQUFBQyxRQUFBO0lBQ0EsSUFBQUMsS0FBQSxHQUFBRCxRQUFBO0lBQ0EsSUFBQUUsU0FBQSxHQUFBRixRQUFBO0lB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