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

// .beyond/uimport/temp/@beyond-js/kernel/routing.0.1.9.js
var routing_0_1_9_exports = {};
__export(routing_0_1_9_exports, {
  URI: () => URI,
  routing: () => routing
});
module.exports = __toCommonJS(routing_0_1_9_exports);

// node_modules/@beyond-js/kernel/routing/routing.browser.mjs
var dependency_0 = __toESM(require("@beyond-js/kernel@0.1.9/bundle"), 0);
var dependency_1 = __toESM(require("@beyond-js/kernel@0.1.9/core"), 0);
var import_meta = {};
var {
  Bundle: __Bundle
} = dependency_0;
var __pkg = new __Bundle({
  "module": {
    "vspecifier": "@beyond-js/kernel@0.1.9/routing"
  },
  "type": "ts"
}, _context.meta.url).package();
;
__pkg.dependencies.update([["@beyond-js/kernel/core", dependency_1]]);
var ims = /* @__PURE__ */new Map();
ims.set("./history/history", {
  hash: 1835933971,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.BeyondHistory = void 0;
    var _position = require2("./position");
    var _records = require2("./records");
    class BeyondHistory {
      #position;
      get position() {
        return this.#position;
      }
      #records;
      get records() {
        return this.#records;
      }
      get valid() {
        return this.#records.valid;
      }
      get current() {
        return this.valid ? this.#records.current.uri : void 0;
      }
      #initial = history.length;
      get initial() {
        return this.#initial;
      }
      #processBrowserURI(uri) {
        if (uri === void 0) return;
        const {
          routing: routing2
        } = require2("../routing");
        const RoutingModeEnum = require2("../routing").RoutingMode;
        return routing2.mode === RoutingModeEnum.Hash ? `#${uri.substr(1)}` : uri;
      }
      #push(uri) {
        this.#records.reset();
        this.#records.push(uri);
        this.#position.save(this.#records.length);
      }
      replaceState(state, title, uri) {
        state = state ? state : {};
        if (typeof state !== "object") throw new Error("Invalid state parameter");
        this.#records.updateCurrentURI(uri);
        const position = this.#position.value;
        history.replaceState(state, title, this.#processBrowserURI(uri));
        this.#position.save(position);
      }
      pushState(uri, state) {
        if (uri === `${location.pathname}${location.search}${location.hash}`) return;
        state = state ? state : {};
        if (typeof state !== "object") throw new Error("Invalid state parameter");
        history.pushState(state, null, this.#processBrowserURI(uri));
        this.#push(uri);
      }
      back() {
        const previous = this.#records.previous?.position;
        const current = this.#records.current?.position;
        if (!previous) return;
        history.go(previous - current);
      }
      forward() {
        const following = this.#records.following?.position;
        const current = this.#records.current?.position;
        if (!following) return;
        history.go(following - current);
      }
      constructor(routing2, Mode) {
        this.#position = new _position.HistoryPosition();
        this.#records = new _records.HistoryRecords(this.#position);
        if (this.#position.value === void 0) {
          let uri = routing2.mode === Mode.Hash ? location.hash.slice(1) : `${location.pathname}${location.search}${location.hash}`;
          this.#push(uri);
        }
      }
    }
    exports.BeyondHistory = BeyondHistory;
  }
});
ims.set("./history/position", {
  hash: 3613484025,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HistoryPosition = void 0;
    class HistoryPosition {
      check() {
        if (this.value) return true;
        console.error("History state is not defined. This happen when state is changed outside the beyond defined navigation flows.");
        return false;
      }
      get value() {
        return history.state?.__beyond_navigation_position;
      }
      save(position) {
        const state = history.state ? history.state : {};
        state.__beyond_navigation_position = position;
        history.replaceState(state, null);
      }
    }
    exports.HistoryPosition = HistoryPosition;
  }
});
ims.set("./history/records", {
  hash: 3466552890,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.HistoryRecords = void 0;
    class HistoryRecords {
      #position;
      #valid = true;
      get valid() {
        return this.#valid;
      }
      #entries = [];
      get entries() {
        return this.#entries.slice();
      }
      get length() {
        return this.#entries.length;
      }
      get current() {
        return this.#entries[this.#position.value - 1];
      }
      get previous() {
        const previous = this.#position.value - 2;
        if (previous < 0) return;
        return this.#entries[previous];
      }
      get following() {
        const following = this.#position.value;
        if (following >= this.#entries.length) return;
        return this.#entries[following];
      }
      constructor(position) {
        this.#position = position;
        let parsed;
        try {
          const stored = sessionStorage.getItem("__beyond_navigation_records");
          if (!stored && position.value !== void 0) {
            this.#valid = false;
            return;
          }
          parsed = stored ? JSON.parse(stored) : [];
        } catch (exc) {
          this.#valid = false;
          console.error("Error loading beyond navigation state", exc instanceof Error ? exc.stack : exc);
          this.#entries = [];
        }
        if (!(parsed instanceof Array)) {
          const warning = "The beyond navigation data, stored in session store is invalid.";
          console.warn(warning, parsed);
        }
        this.#entries = parsed;
      }
      #sanitizeURI(uri) {
        if (uri === void 0) return;
        return uri.startsWith("/") ? uri : `/${uri}`;
      }
      get(index) {
        return this.#entries[index];
      }
      push(uri) {
        uri = this.#sanitizeURI(uri);
        this.#entries.push({
          uri,
          position: history.length
        });
        this.save();
      }
      reset() {
        const position = this.#position.value;
        if (position) return;
        this.#entries = this.#entries.filter(entry => entry.position < history.length);
      }
      updateCurrentURI(uri) {
        if (!this.#valid) return;
        const position = this.#position.value;
        uri = this.#sanitizeURI(uri);
        this.#entries[position - 1] = {
          uri,
          position: history.length
        };
        this.save();
      }
      save() {
        if (!this.#valid) return;
        sessionStorage.setItem("__beyond_navigation_records", JSON.stringify(this.#entries));
      }
    }
    exports.HistoryRecords = HistoryRecords;
  }
});
ims.set("./routing", {
  hash: 2780317025,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.routing = exports.RoutingMode = exports.Routing = void 0;
    var _uri2 = require2("./uri/uri");
    var _core = require2("@beyond-js/kernel/core");
    var _history = require2("./history/history");
    var RoutingMode;
    exports.RoutingMode = RoutingMode;
    (function (RoutingMode2) {
      RoutingMode2[RoutingMode2["Hash"] = 0] = "Hash";
      RoutingMode2[RoutingMode2["Pathname"] = 1] = "Pathname";
    })(RoutingMode || (exports.RoutingMode = RoutingMode = {}));
    const serverside = typeof process === "object";
    class Routing extends _core.Events {
      #mode;
      get mode() {
        return this.#mode;
      }
      #history;
      get history() {
        return this.#history;
      }
      #initialised = false;
      get initialised() {
        return this.#initialised;
      }
      #resolve;
      #ready = new Promise(resolve => this.#resolve = resolve);
      get ready() {
        return this.#ready;
      }
      #uri;
      get uri() {
        return this.#uri;
      }
      missing;
      redirect;
      #resolveConfigured;
      #configured = new Promise(resolve => this.#resolveConfigured = resolve);
      constructor() {
        super();
        const {
          specifier
        } = globalThis.__app_package;
        !serverside && bimport(`${specifier}/config`).then(({
          default: config
        }) => {
          let configured = config.routing?.mode;
          let routingMode = configured === "hash" ? RoutingMode.Hash : RoutingMode.Pathname;
          location.protocol === "file:" && (routingMode = RoutingMode.Hash);
          ![0, 1].includes(routingMode) && (routingMode = location.protocol === "file:" ? RoutingMode.Hash : RoutingMode.Pathname);
          this.#mode = routingMode;
          this.#history = new _history.BeyondHistory(this, RoutingMode);
          this.#resolveConfigured();
        });
      }
      #redirect = async uri => {
        if (typeof this.redirect !== "function") return;
        const redirected = await this.redirect(uri);
        if (!redirected) return;
        if (typeof redirected !== "string") {
          console.error(`Invalid route value set by custom routing function`, redirected);
          return;
        }
        if (uri.pathname === redirected) return;
        this.pushState(redirected);
        return true;
      };
      pushState(uri, state) {
        this.#configured.then(() => {
          this.#history.pushState(uri, state);
          this.update().catch(exc => console.error(exc.stack));
        });
      }
      replaceState(state, title, uri) {
        this.#configured.then(() => {
          this.#history.replaceState(state, title, uri);
          this.update().catch(exc => console.error(exc.stack));
        });
      }
      #cancellationToken = new _core.CancellationToken();
      update = async () => {
        const cancellationTokenId = this.#cancellationToken.reset();
        const {
          hash,
          pathname,
          search
        } = location;
        const _uri = this.#mode === RoutingMode.Hash ? `/${hash.slice(1)}` : pathname + search + hash;
        if (this.#uri?.uri === _uri) return;
        const uri = this.#uri = new _uri2.URI(_uri);
        const redirected = await this.#redirect(uri);
        if (!this.#cancellationToken.check(cancellationTokenId)) return;
        if (redirected) return;
        this.#history && uri.uri !== this.#history.current && console.error(`History current "${this.#history.current}" is not equal to actual uri "${uri.uri}"`);
        this.#initialised ? this.trigger("change") : this.#resolve();
        this.#initialised = true;
      };
      #started = false;
      setup() {
        this.#started = true;
        !serverside && this.update().catch(exc => console.error(exc.stack));
      }
      back() {
        this.#history.back();
      }
      forward() {
        this.#history.forward();
      }
    }
    exports.Routing = Routing;
    const routing2 = new Routing();
    exports.routing = routing2;
    globalThis.routing = routing2;
    !serverside && (beyond.navigate = (uri, state) => routing2.pushState(uri, state));
    !serverside && (beyond.pushState = (uri, state) => routing2.pushState(uri, state));
    !serverside && (beyond.back = () => routing2.back());
    !serverside && (beyond.forward = () => routing2.forward());
    !serverside && window.addEventListener("popstate", () => routing2.update().catch(exc => console.error(exc.stack)));
  }
});
ims.set("./uri/querystring", {
  hash: 187911159,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.QueryString = void 0;
    class QueryString extends Map {
      constructor(search) {
        super();
        if (search.trim() === "") return;
        search = search.slice(0, 1) === "?" ? search.slice(1) : search;
        const split = search.split("&");
        for (let i = 0; i < split.length; ++i) {
          const param = split[i].split("=", 2);
          const value = param[1] ? decodeURIComponent(param[1].replace(/\+/g, " ")) : void 0;
          this.set(param[0], value);
        }
      }
    }
    exports.QueryString = QueryString;
  }
});
ims.set("./uri/uri", {
  hash: 748332499,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.URI = void 0;
    var _querystring = require2("./querystring");
    class URI2 {
      #uri;
      get uri() {
        return this.#uri;
      }
      #pathname;
      get pathname() {
        return this.#pathname;
      }
      #search;
      get search() {
        return this.#search;
      }
      #qs;
      get qs() {
        return this.#qs;
      }
      #hash;
      get hash() {
        return this.#hash;
      }
      constructor(uri) {
        this.#uri = uri;
        const [u, hash] = uri.split("#");
        const [pathname, search] = u.split("?");
        this.#pathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
        this.#search = search ? search : "";
        this.#qs = new _querystring.QueryString(this.#search);
        this.#hash = hash;
      }
    }
    exports.URI = URI2;
  }
});
__pkg.exports.descriptor = [{
  "im": "./routing",
  "from": "routing",
  "name": "routing"
}, {
  "im": "./uri/uri",
  "from": "URI",
  "name": "URI"
}];
var routing, URI;
__pkg.exports.process = function ({
  require: require2,
  prop,
  value
}) {
  (require2 || prop === "routing") && (routing = require2 ? require2("./routing").routing : value);
  (require2 || prop === "URI") && (URI = require2 ? require2("./uri/uri").URI : value);
};
__pkg.initialise(ims);
};

code(module, require);
_exports(module.exports);
}}});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL0BiZXlvbmQtanMva2VybmVsL3JvdXRpbmcuMC4xLjkuanMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvcm91dGluZy9fX3NvdXJjZXMvcm91dGluZy9oaXN0b3J5L2hpc3RvcnkudHMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9rZXJuZWwvcm91dGluZy9fX3NvdXJjZXMvcm91dGluZy9oaXN0b3J5L3Bvc2l0aW9uLnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL3JvdXRpbmcvX19zb3VyY2VzL3JvdXRpbmcvaGlzdG9yeS9yZWNvcmRzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMva2VybmVsL3JvdXRpbmcvX19zb3VyY2VzL3JvdXRpbmcvcm91dGluZy50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9yb3V0aW5nL19fc291cmNlcy9yb3V0aW5nL3VyaS9xdWVyeXN0cmluZy50cyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL2tlcm5lbC9yb3V0aW5nL19fc291cmNlcy9yb3V0aW5nL3VyaS91cmkudHMiXSwibmFtZXMiOlsicm91dGluZ18wXzFfOV9leHBvcnRzIiwiX19leHBvcnQiLCJVUkkiLCJyb3V0aW5nIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9fdG9Db21tb25KUyIsIl9wb3NpdGlvbiIsInJlcXVpcmUyIiwiX3JlY29yZHMiLCJCZXlvbmRIaXN0b3J5IiwicG9zaXRpb24iLCJyZWNvcmRzIiwidmFsaWQiLCJjdXJyZW50IiwidXJpIiwiaW5pdGlhbCIsImhpc3RvcnkiLCJsZW5ndGgiLCJwcm9jZXNzQnJvd3NlclVSSSIsIiNwcm9jZXNzQnJvd3NlclVSSSIsInJvdXRpbmcyIiwiUm91dGluZ01vZGVFbnVtIiwiUm91dGluZ01vZGUiLCJtb2RlIiwiSGFzaCIsInN1YnN0ciIsInB1c2giLCIjcHVzaCIsInJlc2V0Iiwic2F2ZSIsInJlcGxhY2VTdGF0ZSIsInN0YXRlIiwidGl0bGUiLCJFcnJvciIsInVwZGF0ZUN1cnJlbnRVUkkiLCJ2YWx1ZSIsInB1c2hTdGF0ZSIsImxvY2F0aW9uIiwicGF0aG5hbWUiLCJzZWFyY2giLCJoYXNoIiwiYmFjayIsInByZXZpb3VzIiwiZ28iLCJmb3J3YXJkIiwiZm9sbG93aW5nIiwiY29uc3RydWN0b3IiLCJNb2RlIiwiSGlzdG9yeVBvc2l0aW9uIiwiSGlzdG9yeVJlY29yZHMiLCJzbGljZSIsImNoZWNrIiwiY29uc29sZSIsImVycm9yIiwiX19iZXlvbmRfbmF2aWdhdGlvbl9wb3NpdGlvbiIsImVudHJpZXMiLCJwYXJzZWQiLCJzdG9yZWQiLCJzZXNzaW9uU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJleGMiLCJzdGFjayIsIkFycmF5Iiwid2FybmluZyIsIndhcm4iLCJzYW5pdGl6ZVVSSSIsIiNzYW5pdGl6ZVVSSSIsInN0YXJ0c1dpdGgiLCJnZXQiLCJpbmRleCIsImZpbHRlciIsImVudHJ5Iiwic2V0SXRlbSIsInN0cmluZ2lmeSIsIl91cmkyIiwiX2NvcmUiLCJfaGlzdG9yeSIsIlJvdXRpbmdNb2RlMiIsInNlcnZlcnNpZGUiLCJwcm9jZXNzIiwiUm91dGluZyIsIkV2ZW50cyIsImluaXRpYWxpc2VkIiwicmVzb2x2ZSIsInJlYWR5IiwiUHJvbWlzZSIsIm1pc3NpbmciLCJyZWRpcmVjdCIsInJlc29sdmVDb25maWd1cmVkIiwiY29uZmlndXJlZCIsInNwZWNpZmllciIsImdsb2JhbFRoaXMiLCJfX2FwcF9wYWNrYWdlIiwiYmltcG9ydCIsInRoZW4iLCJkZWZhdWx0IiwiY29uZmlnIiwicm91dGluZ01vZGUiLCJQYXRobmFtZSIsInByb3RvY29sIiwiaW5jbHVkZXMiLCJyZWRpcmVjdGVkIiwidXBkYXRlIiwiY2F0Y2giLCJjYW5jZWxsYXRpb25Ub2tlbiIsIkNhbmNlbGxhdGlvblRva2VuIiwiY2FuY2VsbGF0aW9uVG9rZW5JZCIsIl91cmkiLCJ0cmlnZ2VyIiwic3RhcnRlZCIsInNldHVwIiwiYmV5b25kIiwibmF2aWdhdGUiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiUXVlcnlTdHJpbmciLCJNYXAiLCJ0cmltIiwic3BsaXQiLCJpIiwicGFyYW0iLCJkZWNvZGVVUklDb21wb25lbnQiLCJyZXBsYWNlIiwic2V0IiwiX3F1ZXJ5c3RyaW5nIiwiVVJJMiIsInFzIiwidSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEscUJBQUE7QUFBQUMsUUFBQSxDQUFBRCxxQkFBQTtFQUFBRSxHQUFBLEVBQUFBLENBQUEsS0FBQUEsR0FBQTtFQUFBQyxPQUFBLEVBQUFBLENBQUEsS0FBQUE7QUFBQTtBQUFBQyxNQUFBLENBQUFDLE9BQUEsR0FBQUMsWUFBQSxDQUFBTixxQkFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDQUEsSUFBQU8sU0FBQSxHQUFBQyxRQUFBO0lBQ0EsSUFBQUMsUUFBQSxHQUFBRCxRQUFBO0lBT00sTUFBT0UsYUFBQSxDQUFhO01BQ2IsQ0FBQUMsUUFBQTtNQUNULElBQUlBLFNBQUEsRUFBUTtRQUNSLE9BQU8sS0FBSyxDQUFBQSxRQUFBO01BQ2hCO01BRVMsQ0FBQUMsT0FBQTtNQUNULElBQUlBLFFBQUEsRUFBTztRQUNQLE9BQU8sS0FBSyxDQUFBQSxPQUFBO01BQ2hCO01BRUEsSUFBSUMsTUFBQSxFQUFLO1FBQ0wsT0FBTyxLQUFLLENBQUFELE9BQUEsQ0FBU0MsS0FBQTtNQUN6QjtNQUVBLElBQUlDLFFBQUEsRUFBTztRQUNQLE9BQU8sS0FBS0QsS0FBQSxHQUFRLEtBQUssQ0FBQUQsT0FBQSxDQUFTRSxPQUFBLENBQVFDLEdBQUEsR0FBTTtNQUNwRDtNQUVBLENBQUFDLE9BQUEsR0FBbUJDLE9BQUEsQ0FBUUMsTUFBQTtNQUMzQixJQUFJRixRQUFBLEVBQU87UUFDUCxPQUFPLEtBQUssQ0FBQUEsT0FBQTtNQUNoQjtNQVNB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