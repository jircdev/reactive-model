define(["exports", "module", "@beyond-js/widgets/render", "@beyond-js/kernel/bundle", "@beyond-js/kernel/styles", "@beyond-js/react-18-widgets/page", "react"], function (_exports, _amd_module, dependency_0, dependency_1, dependency_2, dependency_3, dependency_4) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.hmr = _exports.__beyond_pkg = _exports.Page = _exports.Controller = void 0;
  const {
    Bundle: __Bundle
  } = dependency_1;
  const __pkg = new __Bundle({
    "module": {
      "vspecifier": "@beyond-js/reactive@0.0.3.beta.dts.1/home"
    },
    "type": "widget"
  }, _amd_module.uri).package();
  ;
  __pkg.dependencies.update([['@beyond-js/widgets/render', dependency_0], ['@beyond-js/kernel/styles', dependency_2], ['@beyond-js/react-18-widgets/page', dependency_3], ['react', dependency_4]]);
  brequire('@beyond-js/widgets/render').widgets.register([{
    "name": "home-page",
    "vspecifier": "@beyond-js/reactive@0.0.3.beta.dts.1/home",
    "is": "page",
    "route": "/"
  }]);
  brequire('@beyond-js/kernel/styles').styles.register('@beyond-js/reactive@0.0.3.beta.dts.1/home');
  const ims = new Map();

  /****************************
  INTERNAL MODULE: ./controller
  ****************************/

  ims.set('./controller', {
    hash: 1765502989,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Controller = void 0;
      var _page = require("@beyond-js/react-18-widgets/page");
      var _views = require("./views");
      /*bundle*/
      class Controller extends _page.PageReactWidgetController {
        get Widget() {
          return _views.Page;
        }
        show() {
          // const user = new User(1);
        }
      }
      exports.Controller = Controller;
    }
  });

  /*****************************
  INTERNAL MODULE: ./views/index
  *****************************/

  ims.set('./views/index', {
    hash: 1643425434,
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
        }, React.createElement("h1", null, "Hola felix"));
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
  let Controller, Page;

  // Module exports
  _exports.Page = Page;
  _exports.Controller = Controller;
  __pkg.exports.process = function ({
    require,
    prop,
    value
  }) {
    (require || prop === 'Controller') && (_exports.Controller = Controller = require ? require('./controller').Controller : value);
    (require || prop === 'Page') && (_exports.Page = Page = require ? require('./views/index').Page : value);
  };
  const __beyond_pkg = __pkg;
  _exports.__beyond_pkg = __beyond_pkg;
  const hmr = new function () {
    this.on = (event, listener) => void 0;
    this.off = (event, listener) => void 0;
  }();
  _exports.hmr = hmr;
  __pkg.initialise(ims);
});
//# sourceMappingURL=home.amd.js.map