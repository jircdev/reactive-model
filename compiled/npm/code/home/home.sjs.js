System.register(["@beyond-js/widgets/render", "@beyond-js/kernel/bundle", "@beyond-js/kernel/styles", "@beyond-js/react-18-widgets/page", "@beyond-js/reactive/examples/models", "react", "@beyond-js/reactive@0.0.3/config"], function (_export, _context) {
  "use strict";

  var dependency_0, dependency_1, dependency_2, dependency_3, dependency_4, dependency_5, dependency_6, __Bundle, __pkg, ims, Controller, Page, __beyond_pkg, hmr;
  _export({
    Controller: void 0,
    Page: void 0
  });
  return {
    setters: [function (_beyondJsWidgetsRender) {
      dependency_0 = _beyondJsWidgetsRender;
    }, function (_beyondJsKernelBundle) {
      dependency_1 = _beyondJsKernelBundle;
    }, function (_beyondJsKernelStyles) {
      dependency_2 = _beyondJsKernelStyles;
    }, function (_beyondJsReact18WidgetsPage) {
      dependency_3 = _beyondJsReact18WidgetsPage;
    }, function (_beyondJsReactiveExamplesModels) {
      dependency_4 = _beyondJsReactiveExamplesModels;
    }, function (_react) {
      dependency_5 = _react;
    }, function (_beyondJsReactive003Config) {
      dependency_6 = _beyondJsReactive003Config;
    }],
    execute: function () {
      ({
        Bundle: __Bundle
      } = dependency_1);
      __pkg = new __Bundle({
        "module": {
          "vspecifier": "@beyond-js/reactive@0.0.3/home"
        },
        "type": "widget"
      }, _context.meta.url).package();
      ;
      __pkg.dependencies.update([['@beyond-js/widgets/render', dependency_0], ['@beyond-js/kernel/styles', dependency_2], ['@beyond-js/react-18-widgets/page', dependency_3], ['@beyond-js/reactive/examples/models', dependency_4], ['react', dependency_5], ['@beyond-js/reactive/config', dependency_6]]);
      brequire('@beyond-js/widgets/render').widgets.register([{
        "name": "home-page",
        "vspecifier": "@beyond-js/reactive@0.0.3/home",
        "is": "page",
        "route": "/"
      }]);
      brequire('@beyond-js/kernel/styles').styles.register('@beyond-js/reactive@0.0.3/home');
      ims = new Map();
      /****************************
      INTERNAL MODULE: ./controller
      ****************************/
      ims.set('./controller', {
        hash: 2240503245,
        creator: function (require, exports) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.Controller = void 0;
          var _page = require("@beyond-js/react-18-widgets/page");
          var _views = require("./views");
          var _models = require("@beyond-js/reactive/examples/models");
          /*bundle*/
          class Controller extends _page.PageReactWidgetController {
            get Widget() {
              return _views.Page;
            }
            constructor(a) {
              super(a);
              const user = new _models.User();
              console.log(10, user);
            }
          }
          exports.Controller = Controller;
        }
      });

      /*****************************
      INTERNAL MODULE: ./views/index
      *****************************/

      ims.set('./views/index', {
        hash: 130100575,
        creator: function (require, exports) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.Page = Page;
          var React = require("react");
          /*bundle*/
          function Page() {
            return React.createElement("div", {
              className: "page__container"
            }, React.createElement("h1", null, "ReactiveModel sample ", React.createElement("span", {
              className: "beyond"
            }, "React"), "!"));
          }
        }
      });
      __pkg.exports.descriptor = [{
        "im": "./controller",
        "from": "Controller",
        "name": "Controller"
      }, {
        "im": "./views/index",
        "from": "Page",
        "name": "Page"
      }];
      // Module exports
      __pkg.exports.process = function ({
        require,
        prop,
        value
      }) {
        (require || prop === 'Controller') && _export("Controller", Controller = require ? require('./controller').Controller : value);
        (require || prop === 'Page') && _export("Page", Page = require ? require('./views/index').Page : value);
      };
      _export("__beyond_pkg", __beyond_pkg = __pkg);
      _export("hmr", hmr = new function () {
        this.on = (event, listener) => void 0;
        this.off = (event, listener) => void 0;
      }());
      __pkg.initialise(ims);
    }
  };
});
//# sourceMappingURL=home.sjs.js.map