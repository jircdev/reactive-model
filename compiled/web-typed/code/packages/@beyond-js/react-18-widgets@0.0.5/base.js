System.register(["@beyond-js/kernel@0.1.9/bundle","react@18.2.0","scheduler@0.23.0","react-dom@18.2.0","react-dom@18.2.0/client","@beyond-js/kernel@0.1.9/core","@beyond-js/widgets@0.1.4/render","@beyond-js/kernel@0.1.9/styles","@beyond-js/widgets@0.1.4/controller"], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["@beyond-js/kernel","0.1.9"],["react","18.2.0"],["scheduler","0.23.0"],["react-dom","18.2.0"],["@beyond-js/widgets","0.1.4"],["@beyond-js/react-18-widgets","0.0.5"]]);
	return globalThis.bimport(globalThis.bimport.resolve(specifier, dependencies));
};


var dependencies = new Map();
var require = dependency => dependencies.get(dependency);
return {
setters: [dep => dependencies.set('@beyond-js/kernel@0.1.9/bundle', dep), dep => dependencies.set('react@18.2.0', dep), dep => dependencies.set('scheduler@0.23.0', dep), dep => dependencies.set('react-dom@18.2.0', dep), dep => dependencies.set('react-dom@18.2.0/client', dep), dep => dependencies.set('@beyond-js/kernel@0.1.9/core', dep), dep => dependencies.set('@beyond-js/widgets@0.1.4/render', dep), dep => dependencies.set('@beyond-js/kernel@0.1.9/styles', dep), dep => dependencies.set('@beyond-js/widgets@0.1.4/controller', dep)],
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

// .beyond/uimport/temp/@beyond-js/react-18-widgets/base.0.0.5.js
var base_0_0_5_exports = {};
__export(base_0_0_5_exports, {
  ReactWidgetController: () => ReactWidgetController,
  __beyond_pkg: () => __beyond_pkg,
  hmr: () => hmr
});
module.exports = __toCommonJS(base_0_0_5_exports);

// node_modules/@beyond-js/react-18-widgets/base/base.browser.mjs
var dependency_0 = __toESM(require("@beyond-js/kernel@0.1.9/bundle"), 0);
var dependency_1 = __toESM(require("react@18.2.0"), 0);
var dependency_2 = __toESM(require("react-dom@18.2.0/client"), 0);
var dependency_3 = __toESM(require("@beyond-js/widgets@0.1.4/controller"), 0);
var import_meta = {};
var {
  Bundle: __Bundle
} = dependency_0;
var __pkg = new __Bundle({
  "module": {
    "vspecifier": "@beyond-js/react-18-widgets@0.0.4/base"
  },
  "type": "ts"
}, _context.meta.url).package();
;
__pkg.dependencies.update([["react", dependency_1], ["react-dom/client", dependency_2], ["@beyond-js/widgets/controller", dependency_3]]);
var ims = /* @__PURE__ */new Map();
ims.set("./controller", {
  hash: 2510685826,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ReactWidgetController = void 0;
    var React = require2("react");
    var _client = require2("react-dom/client");
    var _controller = require2("@beyond-js/widgets/controller");
    var _widget = require2("./widget");
    var _wrapper = require2("./wrapper");
    class ReactWidgetController2 extends _controller.WidgetClientController {
      #wrapper;
      #root;
      #mounted = false;
      get mounted() {
        return this.#mounted;
      }
      get Widget() {
        return null;
      }
      mount(props) {
        if (this.#mounted) return;
        this.#mounted = true;
        if (!this.Widget) {
          return {
            errors: [`Widget "${this.element}" does not export a Widget class`]
          };
        }
        props = Object.assign({
          widget: this.widget,
          attributes: this.attributes,
          component: this.widget,
          store: this.store
        }, props ? props : {});
        const holder = this.widget.holder;
        const hydrate = !!holder.children.length;
        try {
          const wrapper = this.#wrapper = new _wrapper.Wrapper(this);
          const {
            styles,
            widget
          } = this;
          const {
            holder: holder2
          } = widget;
          const p = {
            wrapper,
            props,
            styles,
            holder: holder2,
            hydrate
          };
          const element = React.createElement(_widget.default, p);
          if (hydrate) {
            this.#root = (0, _client.hydrateRoot)(holder2, element);
          } else {
            const root = this.#root = (0, _client.createRoot)(holder2);
            root.render(element);
          }
        } catch (exc) {
          console.log(`Error rendering widget "${this.widget.localName}":`);
          console.log(exc.stack);
        }
      }
      unmount() {
        if (!this.#mounted) return;
        this.#mounted = false;
        this.#root.unmount();
      }
      refresh() {
        this.#wrapper.changed();
      }
    }
    exports.ReactWidgetController = ReactWidgetController2;
  }
});
ims.set("./styles", {
  hash: 3645751033,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = _default;
    var React = require2("react");
    function _default({
      styles
    }) {
      const rs = React.useState(0);
      React.useEffect(() => {
        const refresh = () => rs[1](prev => prev + 1);
        styles.on("change", refresh);
        return () => styles.off("change", refresh) && void 0;
      }, []);
      const head = [...styles.resources].map(url => {
        const loaded = () => styles.onloaded(url);
        return React.createElement("link", {
          key: url,
          href: url,
          rel: "stylesheet",
          onLoad: loaded,
          onError: loaded
        });
      });
      return React.createElement(React.Fragment, null, head);
    }
  }
});
ims.set("./widget", {
  hash: 90867181,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = _default;
    var React = require2("react");
    var _styles = require2("./styles");
    function _default({
      wrapper,
      props,
      styles,
      holder,
      hydrate
    }) {
      const elements = [];
      elements.push(React.createElement(_styles.default, {
        key: "styles",
        styles,
        widget: props.widget
      }));
      const rs = React.useState(0);
      const refresh = () => rs[1](rs[0] + 1);
      wrapper.changed = refresh;
      const loaded = (() => {
        !styles.loaded && styles.ready.then(refresh);
        holder.style.display = "";
        return styles.loaded;
      })();
      const {
        Widget
      } = wrapper;
      const widget = React.createElement(Widget, {
        key: "widget",
        ...props
      });
      (hydrate || loaded) && elements.push(widget);
      return React.createElement(React.Fragment, null, elements);
    }
  }
});
ims.set("./wrapper", {
  hash: 4175409966,
  creator: function (require2, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.Wrapper = void 0;
    class Wrapper {
      #Widget;
      get Widget() {
        return this.#Widget.Widget;
      }
      changed = () => void 0;
      constructor(Widget) {
        this.#Widget = Widget;
      }
    }
    exports.Wrapper = Wrapper;
  }
});
__pkg.exports.descriptor = [{
  "im": "./controller",
  "from": "ReactWidgetController",
  "name": "ReactWidgetController"
}];
var ReactWidgetController;
__pkg.exports.process = function ({
  require: require2,
  prop,
  value
}) {
  (require2 || prop === "ReactWidgetController") && (ReactWidgetController = require2 ? require2("./controller").ReactWidgetController : value);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL0BiZXlvbmQtanMvcmVhY3QtMTgtd2lkZ2V0cy9iYXNlLjAuMC41LmpzIiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMvcmVhY3QtMTgtd2lkZ2V0cy9iYXNlL19fc291cmNlcy9iYXNlL2NvbnRyb2xsZXIudHMiLCIuLi9ub2RlX21vZHVsZXMvQGJleW9uZC1qcy9yZWFjdC0xOC13aWRnZXRzL2Jhc2UvX19zb3VyY2VzL2Jhc2Uvc3R5bGVzLnRzeCIsIi4uL25vZGVfbW9kdWxlcy9AYmV5b25kLWpzL3JlYWN0LTE4LXdpZGdldHMvYmFzZS9fX3NvdXJjZXMvYmFzZS93aWRnZXQudHN4IiwiLi4vbm9kZV9tb2R1bGVzL0BiZXlvbmQtanMvcmVhY3QtMTgtd2lkZ2V0cy9iYXNlL19fc291cmNlcy9iYXNlL3dyYXBwZXIudHMiXSwibmFtZXMiOlsiYmFzZV8wXzBfNV9leHBvcnRzIiwiX19leHBvcnQiLCJSZWFjdFdpZGdldENvbnRyb2xsZXIiLCJfX2JleW9uZF9wa2ciLCJobXIiLCJtb2R1bGUiLCJleHBvcnRzIiwiX190b0NvbW1vbkpTIiwiUmVhY3QiLCJyZXF1aXJlMiIsIl9jbGllbnQiLCJfY29udHJvbGxlciIsIl93aWRnZXQiLCJfd3JhcHBlciIsIlJlYWN0V2lkZ2V0Q29udHJvbGxlcjIiLCJXaWRnZXRDbGllbnRDb250cm9sbGVyIiwid3JhcHBlciIsInJvb3QiLCJtb3VudGVkIiwiV2lkZ2V0IiwibW91bnQiLCJwcm9wcyIsImVycm9ycyIsImVsZW1lbnQiLCJPYmplY3QiLCJhc3NpZ24iLCJ3aWRnZXQiLCJhdHRyaWJ1dGVzIiwiY29tcG9uZW50Iiwic3RvcmUiLCJob2xkZXIiLCJoeWRyYXRlIiwiY2hpbGRyZW4iLCJsZW5ndGgiLCJXcmFwcGVyIiwic3R5bGVzIiwiaG9sZGVyMiIsInAiLCJjcmVhdGVFbGVtZW50IiwiZGVmYXVsdCIsImh5ZHJhdGVSb290IiwiY3JlYXRlUm9vdCIsInJlbmRlciIsImV4YyIsImNvbnNvbGUiLCJsb2ciLCJsb2NhbE5hbWUiLCJzdGFjayIsInVubW91bnQiLCJyZWZyZXNoIiwiY2hhbmdlZCIsIl9kZWZhdWx0IiwicnMiLCJ1c2VTdGF0ZSIsInVzZUVmZmVjdCIsInByZXYiLCJvbiIsIm9mZiIsImhlYWQiLCJyZXNvdXJjZXMiLCJtYXAiLCJ1cmwiLCJsb2FkZWQiLCJvbmxvYWRlZCIsImtleSIsImhyZWYiLCJyZWwiLCJvbkxvYWQiLCJvbkVycm9yIiwiRnJhZ21lbnQiLCJfc3R5bGVzIiwiZWxlbWVudHMiLCJwdXNoIiwicmVhZHkiLCJ0aGVuIiwic3R5bGUiLCJkaXNwbGF5IiwiY29uc3RydWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLElBQUFBLGtCQUFBO0FBQUFDLFFBQUEsQ0FBQUQsa0JBQUE7RUFBQUUscUJBQUEsRUFBQUEsQ0FBQSxLQUFBQSxxQkFBQTtFQUFBQyxZQUFBLEVBQUFBLENBQUEsS0FBQUEsWUFBQTtFQUFBQyxHQUFBLEVBQUFBLENBQUEsS0FBQUE7QUFBQTtBQUFBQyxNQUFBLENBQUFDLE9BQUEsR0FBQUMsWUFBQSxDQUFBUCxrQkFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNBQSxJQUFBUSxLQUFBLEdBQUFDLFFBQUE7SUFDQSxJQUFBQyxPQUFBLEdBQUFELFFBQUE7SUFDQSxJQUFBRSxXQUFBLEdBQUFGLFFBQUE7SUFDQSxJQUFBRyxPQUFBLEdBQUFILFFBQUE7SUFDQSxJQUFBSSxRQUFBLEdBQUFKLFFBQUE7SUFFaUIsTUFDRkssc0JBQUEsU0FBOEJILFdBQUEsQ0FBQUksc0JBQUEsQ0FBc0I7TUFDL0QsQ0FBQUMsT0FBQTtNQUNBLENBQUFDLElBQUE7TUFFQSxDQUFBQyxPQUFBLEdBQVc7TUFDWCxJQUFJQSxRQUFBLEVBQU87UUFDUCxPQUFPLEtBQUssQ0FBQUEsT0FBQTtNQUNoQjtNQUdBLElBQUlDLE9BQUEsRUFBTTtRQUNOLE9B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QU96QyxNQUFBLENBQU8yQixNQUFBO01BQ2xCLElBQUM7TUFFRCxNQUFNO1FBQUMzQztNQUFNLElBQUlILE9BQUE7TUFDakIsTUFBTVUsTUFBQSxHQUFTbEIsS0FBQSxDQUFBOEIsYUFBQSxDQUFDbkIsTUFBQSxFQUFNO1FBQUM2QyxHQUFBLEVBQUk7UUFBUSxHQUFLM0M7TUFBSztNQUM3QyxDQUFDVSxPQUFBLElBQVcrQixNQUFBLEtBQVdTLFFBQUEsQ0FBU0MsSUFBQSxDQUFLOUMsTUFBTTtNQUUzQyxPQUFRbEIsS0FBQSxDQUFBOEIsYUFBQSxDQUFBOUIsS0FBQSxDQUFBNkQsUUFBQSxRQUFHRSxRQUFRO0lBQ3ZCOzs7Ozs7Ozs7Ozs7SUN0Qk0sTUFBT3JDLE9BQUEsQ0FBTztNQUNoQixDQUFBZixNQUFBO01BQ0EsSUFBSUEsT0FBQSxFQUFNO1FBQ04sT0FBTyxLQUFLLENBQUFBLE1BQUEsQ0FBUUEsTUFBQTtNQUN4QjtNQUdBK0IsT0FBQSxHQUFVQSxDQUFBLEtBQVk7TUFFdEIyQixZQUFZMUQsTUFBQSxFQUE2QjtRQUNyQyxLQUFLLENBQUFBLE1BQUEsR0FBVUEsTUFBQTtNQUNuQjs7SUFDSGIsT0FBQSxDQUFBNEIsT0FBQSxHQUFBQSxPQUFBIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvcmVhY3RpdmUtbW9kZWwvb3V0In0=