System.register(["react@18.2.0","scheduler@0.23.0","react-dom@18.2.0"], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["react","18.2.0"],["scheduler","0.23.0"],["react-dom","18.2.0"]]);
	return globalThis.bimport(globalThis.bimport.resolve(specifier, dependencies));
};


var dependencies = new Map();
var require = dependency => dependencies.get(dependency);
return {
setters: [dep => dependencies.set('react@18.2.0', dep), dep => dependencies.set('scheduler@0.23.0', dep), dep => dependencies.set('react-dom@18.2.0', dep)],
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
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = {
    exports: {}
  }).exports, mod), mod.exports;
};
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
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
  value: mod,
  enumerable: true
}) : target, mod));
var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
  value: true
}), mod);

// node_modules/react-dom/client.js
var require_client = __commonJS({
  "node_modules/react-dom/client.js"(exports) {
    "use strict";

    var m = require("react-dom@18.2.0");
    if (false) {
      exports.createRoot = m.createRoot;
      exports.hydrateRoot = m.hydrateRoot;
    } else {
      i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      exports.createRoot = function (c, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.createRoot(c, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
      exports.hydrateRoot = function (c, h, o) {
        i.usingClientEntryPoint = true;
        try {
          return m.hydrateRoot(c, h, o);
        } finally {
          i.usingClientEntryPoint = false;
        }
      };
    }
    var i;
  }
});

// .beyond/uimport/temp/react-dom/client.18.2.0.js
var client_18_2_0_exports = {};
__export(client_18_2_0_exports, {
  default: () => client_18_2_0_default
});
module.exports = __toCommonJS(client_18_2_0_exports);
__reExport(client_18_2_0_exports, __toESM(require_client()), module.exports);
var import_client = __toESM(require_client());
var client_18_2_0_default = import_client.default;
};

code(module, require);
_exports(module.exports);
}}});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9yZWFjdC1kb20vY2xpZW50LmpzIiwiLi4vLmJleW9uZC91aW1wb3J0L3RlbXAvcmVhY3QtZG9tL2NsaWVudC4xOC4yLjAuanMiXSwibmFtZXMiOlsicmVxdWlyZV9jbGllbnQiLCJfX2NvbW1vbkpTIiwibm9kZV9tb2R1bGVzL3JlYWN0LWRvbS9jbGllbnQuanMiLCJleHBvcnRzIiwibSIsInJlcXVpcmUiLCJjcmVhdGVSb290IiwiaHlkcmF0ZVJvb3QiLCJpIiwiX19TRUNSRVRfSU5URVJOQUxTX0RPX05PVF9VU0VfT1JfWU9VX1dJTExfQkVfRklSRUQiLCJjIiwibyIsInVzaW5nQ2xpZW50RW50cnlQb2ludCIsImgiLCJjbGllbnRfMThfMl8wX2V4cG9ydHMiLCJfX2V4cG9ydCIsImRlZmF1bHQiLCJjbGllbnRfMThfMl8wX2RlZmF1bHQiLCJtb2R1bGUiLCJfX3RvQ29tbW9uSlMiLCJfX3JlRXhwb3J0IiwiX190b0VTTSIsImltcG9ydF9jbGllbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLGNBQUEsR0FBQUMsVUFBQTtFQUFBLGtDQUFBQyxDQUFBQyxPQUFBO0lBQUE7O0lBRUEsSUFBSUMsQ0FBQSxHQUFJQyxPQUFBLENBQVE7SUFDaEIsSUFBSSxPQUF1QztNQUN6Q0YsT0FBQSxDQUFRRyxVQUFBLEdBQWFGLENBQUEsQ0FBRUUsVUFBQTtNQUN2QkgsT0FBQSxDQUFRSSxXQUFBLEdBQWNILENBQUEsQ0FBRUcsV0FBQTtJQUMxQixPQUFPO01BQ0RDLENBQUEsR0FBSUosQ0FBQSxDQUFFSyxrREFBQTtNQUNWTixPQUFBLENBQVFHLFVBQUEsR0FBYSxVQUFTSSxDQUFBLEVBQUdDLENBQUEsRUFBRztRQUNsQ0gsQ0FBQSxDQUFFSSxxQkFBQSxHQUF3QjtRQUMxQixJQUFJO1VBQ0YsT0FBT1IsQ0FBQSxDQUFFRSxVQUFBLENBQVdJLENBQUEsRUFBR0MsQ0FBQztRQUMxQixVQUFFO1VBQ0FILENBQUEsQ0FBRUkscUJBQUEsR0FBd0I7UUFDNUI7TUFDRjtNQUNBVCxPQUFBLENBQVFJLFdBQUEsR0FBYyxVQUFTRyxDQUFBLEVBQUdHLENBQUEsRUFBR0YsQ0FBQSxFQUFHO1FBQ3RDSCxDQUFBLENBQUVJLHFCQUFBLEdBQXdCO1FBQzFCLElBQUk7VUFDRixPQUFPUixDQUFBLENBQUVHLFdBQUEsQ0FBWUcsQ0FBQSxFQUFHRyxDQUFBLEVBQUdGLENBQUM7UUFDOUIsVUFBRTtVQUNBSCxDQUFBLENBQUVJLHFCQUFBLEdBQXdCO1FBQzVCO01BQ0Y7SUFDRjtJQWpCTSxJQUFBSixDQUFBO0VBQUE7QUFBQTs7O0FDUE4sSUFBQU0scUJBQUE7QUFBQUMsUUFBQSxDQUFBRCxxQkFBQTtFQUFBRSxPQUFBLEVBQUFBLENBQUEsS0FBQUM7QUFBQTtBQUFBQyxNQUFBLENBQUFmLE9BQUEsR0FBQWdCLFlBQUEsQ0FBQUwscUJBQUE7QUFBQU0sVUFBQSxDQUFBTixxQkFBQSxFQUFjTyxPQUFBLENBQUFyQixjQUFBLEtBQWRrQixNQUFBLENBQUFmLE9BQUE7QUFFQSxJQUFBbUIsYUFBQSxHQUFxQkQsT0FBQSxDQUFBckIsY0FBQTtBQUNyQixJQUFPaUIscUJBQUEsR0FBUUssYUFBQSxDQUFBTixPQUFBIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvcmVhY3RpdmUtbW9kZWwvb3V0In0=