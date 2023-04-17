System.register(["@beyond-js/kernel@0.1.9/bundle"], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["@beyond-js/kernel","0.1.9"],["@beyond-js/widgets","0.1.4"]]);
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

// .beyond/uimport/temp/@beyond-js/widgets/application.0.1.4.js
var application_0_1_4_exports = {};
__export(application_0_1_4_exports, {
  __beyond_pkg: () => __beyond_pkg,
  hmr: () => hmr
});
module.exports = __toCommonJS(application_0_1_4_exports);

// node_modules/@beyond-js/widgets/application/application.browser.mjs
var dependency_0 = __toESM(require("@beyond-js/kernel@0.1.9/bundle"), 0);
var import_meta = {};
var {
  Bundle: __Bundle
} = dependency_0;
var __pkg = new __Bundle({
  "module": {
    "vspecifier": "@beyond-js/widgets@0.1.4/application"
  },
  "type": "ts"
}, _context.meta.url).package();
;
__pkg.dependencies.update([]);
var ims = /* @__PURE__ */new Map();
ims.set("./startup", {
  hash: 3577862121,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    function createLayout(config) {
      const {
        layout
      } = config;
      const element = document.createElement(layout ? layout : "beyond-layout-children");
      document.body.append(element);
    }
    function startup() {
      const promises = [];
      const {
        specifier
      } = globalThis.__app_package;
      promises.push(bimport(`${specifier}/config`));
      promises.push(bimport(`${specifier}/start`));
      promises.push(bimport("@beyond-js/kernel/core"));
      promises.push(bimport("@beyond-js/kernel/routing"));
      promises.push(bimport("@beyond-js/widgets/routing"));
      promises.push(bimport("@beyond-js/widgets/layout"));
      Promise.all(promises).then(([{
        default: config
      }]) => createLayout(config)).catch(exc => console.log(exc.stack));
    }
    (() => {
      if (!globalThis.__ssr_fetch) {
        startup();
        return;
      }
      window.__ssr_fetch.then(ssr => {
        if (!ssr.json || ssr.json.errors?.length) {
          console.error("Error getting ssr data:", ssr.json.errors);
          startup();
          return;
        }
        const promises = [];
        const {
          specifier
        } = globalThis.__app_package;
        promises.push(bimport(`${specifier}/config`));
        promises.push(bimport(`${specifier}/start`));
        promises.push(bimport("@beyond-js/widgets/render"));
        promises.push(bimport("@beyond-js/widgets/layout"));
        Promise.all(promises).then(([{
          default: config
        },, render, layout]) => {
          const specs = new Map(ssr.json.widgets.specs);
          render.widgets.register([...specs.values()]);
          const instances = ssr.json.widgets.instances;
          const prerender = render.prerender;
          instances.forEach(instance => prerender.ssr.push(instance));
          const lssr = layout.ssr;
          lssr.data(ssr.json.main, ssr.json.page);
          createLayout(config);
        }).catch(exc => console.log(exc.stack));
      });
    })();
  }
});
__pkg.exports.process = function ({
  require: require2,
  prop,
  value
}) {};
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL0BiZXlvbmQtanMvd2lkZ2V0cy9hcHBsaWNhdGlvbi4wLjEuNC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL3dpZGdldHMvYXBwbGljYXRpb24vX19zb3VyY2VzL2FwcGxpY2F0aW9uL3N0YXJ0dXAudHMiXSwibmFtZXMiOlsiYXBwbGljYXRpb25fMF8xXzRfZXhwb3J0cyIsIl9fZXhwb3J0IiwiX19iZXlvbmRfcGtnIiwiaG1yIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9fdG9Db21tb25KUyIsImNyZWF0ZUxheW91dCIsImNvbmZpZyIsImxheW91dCIsImVsZW1lbnQiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJib2R5IiwiYXBwZW5kIiwic3RhcnR1cCIsInByb21pc2VzIiwic3BlY2lmaWVyIiwiZ2xvYmFsVGhpcyIsIl9fYXBwX3BhY2thZ2UiLCJwdXNoIiwiYmltcG9ydCIsIlByb21pc2UiLCJhbGwiLCJ0aGVuIiwiZGVmYXVsdCIsImNhdGNoIiwiZXhjIiwiY29uc29sZSIsImxvZyIsInN0YWNrIiwiX19zc3JfZmV0Y2giLCJ3aW5kb3ciLCJzc3IiLCJqc29uIiwiZXJyb3JzIiwibGVuZ3RoIiwiZXJyb3IiLCJyZW5kZXIiLCJzcGVjcyIsIk1hcCIsIndpZGdldHMiLCJyZWdpc3RlciIsInZhbHVlcyIsImluc3RhbmNlcyIsInByZXJlbmRlciIsImZvckVhY2giLCJpbnN0YW5jZSIsImxzc3IiLCJkYXRhIiwibWFpbiIsInBhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLHlCQUFBO0FBQUFDLFFBQUEsQ0FBQUQseUJBQUE7RUFBQUUsWUFBQSxFQUFBQSxDQUFBLEtBQUFBLFlBQUE7RUFBQUMsR0FBQSxFQUFBQSxDQUFBLEtBQUFBO0FBQUE7QUFBQUMsTUFBQSxDQUFBQyxPQUFBLEdBQUFDLFlBQUEsQ0FBQU4seUJBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNLQSxTQUFTTyxhQUFhQyxNQUFBLEVBQVc7TUFDN0IsTUFBTTtRQUFDQztNQUFNLElBQUlELE1BQUE7TUFDakIsTUFBTUUsT0FBQSxHQUFVQyxRQUFBLENBQVNDLGFBQUEsQ0FBY0gsTUFBQSxHQUFTQSxNQUFBLEdBQVMsd0JBQXdCO01BQ2pGRSxRQUFBLENBQVNFLElBQUEsQ0FBS0MsTUFBQSxDQUFPSixPQUFPO0lBQ2hDO0lBRUEsU0FBU0ssUUFBQSxFQUFPO01BQ1osTUFBTUMsUUFBQSxHQUEyQjtNQUVqQyxNQUFNO1FBQUNDO01BQVMsSUFBVUMsVUFBQSxDQUFZQyxhQUFBO01BQ3RDSCxRQUFBLENBQVNJLElBQUEsQ0FBS0MsT0FBQSxDQUFRLEdBQUdKLFNBQUEsU0FBa0IsQ0FBQztNQUM1Q0QsUUFBQSxDQUFTSSxJQUFBLENBQUtDLE9BQUEsQ0FBUSxHQUFHSixTQUFBLFFBQWlCLENBQUM7TUFFM0NELFFBQUEsQ0FBU0ksSUFBQSxDQUFLQyxPQUFBLENBQVEsd0JBQXdCLENBQUM7TUFDL0NMLFFBQUEsQ0FBU0ksSUFBQSxDQUFLQyxPQUFBLENBQVEsMkJBQTJCLENBQUM7TUFDbERMLFFBQUEsQ0FBU0ksSUFBQSxDQUFLQyxPQUFBLENBQVEsNEJBQTRCLENBQUM7TUFDbkRMLFFBQUEsQ0FBU0ksSUFBQSxDQUFLQyxPQUFBLENBQVEsMkJBQTJCLENBQUM7TUFFbERDLE9BQUEsQ0FBUUMsR0FBQSxDQUFJUCxRQUFRLEVBQ2ZRLElBQUEsQ0FBSyxDQUFDLENBQUM7UUFBQ0MsT0FBQSxFQUFTakI7TUFBTSxDQUFDLE1BQU1ELFlBQUEsQ0FBYUMsTUFBTSxDQUFDLEVBQ2xEa0IsS0FBQSxDQUFNQyxHQUFBLElBQU9DLE9BQUEsQ0FBUUMsR0FBQSxDQUFJRixHQUFBLENBQUlHLEtBQUssQ0FBQztJQUM1QztJQUVBLENBQUMsTUFBSztNQUNGLElBQUksQ0FBT1osVUFBQSxDQUFZYSxXQUFBLEVBQWE7UUFDaENoQixPQUFBLEVBQU87UUFDUDs7TUFNRWlCLE1BQUEsQ0FBUUQsV0FBQSxDQUFZUCxJQUFBLENBQU1TLEdBQUEsSUFBWTtRQUN4QyxJQUFJLENBQUNBLEdBQUEsQ0FBSUMsSUFBQSxJQUFRRCxHQUFBLENBQUlDLElBQUEsQ0FBS0MsTUFBQSxFQUFRQyxNQUFBLEVBQVE7VUFDdENSLE9BQUEsQ0FBUVMsS0FBQSxDQUFNLDJCQUEyQkosR0FBQSxDQUFJQyxJQUFBLENBQUtDLE1BQU07VUFDeERwQixPQUFBLEVBQU87VUFDUDs7UUFHSixNQUFNQyxRQUFBLEdBQTJCO1FBRWpDLE1BQU07VUFBQ0M7UUFBUyxJQUFVQyxVQUFBLENBQVlDLGFBQUE7UUFDdENILFFBQUEsQ0FBU0ksSUFBQSxDQUFLQyxPQUFBLENBQVEsR0FBR0osU0FBQSxTQUFrQixDQUFDO1FBQzVDRCxRQUFBLENBQVNJLElBQUEsQ0FBS0MsT0FBQSxDQUFRLEdBQUdKLFNBQUEsUUFBaUIsQ0FBQztRQUUzQ0QsUUFBQSxDQUFTSSxJQUFBLENBQUtDLE9BQUEsQ0FBUSwyQkFBMkIsQ0FBQztRQUNsREwsUUFBQSxDQUFTSSxJQUFBLENBQUtDLE9BQUEsQ0FBUSwyQkFBMkIsQ0FBQztRQUVsREMsT0FBQSxDQUFRQyxHQUFBLENBQUlQLFFBQVEsRUFBRVEsSUFBQSxDQUFLLENBQUMsQ0FBQztVQUFDQyxPQUFBLEVBQVNqQjtRQUFNLElBQUs4QixNQUFBLEVBQVE3QixNQUFNLE1BQUs7VUFFakUsTUFBTThCLEtBQUEsR0FBUSxJQUFJQyxHQUFBLENBQUlQLEdBQUEsQ0FBSUMsSUFBQSxDQUFLTyxPQUFBLENBQVFGLEtBQUs7VUFDNUNELE1BQUEsQ0FBT0csT0FBQSxDQUFRQyxRQUFBLENBQVMsQ0FBQyxHQUFHSCxLQUFBLENBQU1JLE1BQUEsRUFBUSxDQUFDO1VBRzNDLE1BQU1DLFNBQUEsR0FBWVgsR0FBQSxDQUFJQyxJQUFBLENBQUtPLE9BQUEsQ0FBUUcsU0FBQTtVQUNuQyxNQUFNQyxTQUFBLEdBQXNCUCxNQUFBLENBQU9PLFNBQUE7VUFDbkNELFNBQUEsQ0FBVUUsT0FBQSxDQUFTQyxRQUFBLElBQWtCRixTQUFBLENBQVVaLEdBQUEsQ0FBSWIsSUFBQSxDQUFLMkIsUUFBUSxDQUFDO1VBR2pFLE1BQU1DLElBQUEsR0FBaUJ2QyxNQUFBLENBQU93QixHQUFBO1VBQzlCZSxJQUFBLENBQUtDLElBQUEsQ0FBS2hCLEdBQUEsQ0FBSUMsSUFBQSxDQUFLZ0IsSUFBQSxFQUFNakIsR0FBQSxDQUFJQyxJQUFBLENBQUtpQixJQUFJO1VBQ3RDNUMsWUFBQSxDQUFhQyxNQUFNO1FBQ3ZCLENBQUMsRUFBRWtCLEtBQUEsQ0FBTUMsR0FBQSxJQUFPQyxPQUFBLENBQVFDLEdBQUEsQ0FBSUYsR0FBQSxDQUFJRyxLQUFLLENBQUM7TUFDMUMsQ0FBQztJQUNMLElBQUMiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii9yZWFjdGl2ZS1tb2RlbC9vdXQifQ==