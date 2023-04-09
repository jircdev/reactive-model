define(["exports", "module", "@beyond-js/widgets/render", "@beyond-js/kernel/bundle", "@beyond-js/kernel/styles", "@beyond-js/react-18-widgets/base", "react"], function (_exports, _amd_module, dependency_0, dependency_1, dependency_2, dependency_3, dependency_4) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.hmr = _exports.__beyond_pkg = _exports.Controller = void 0;
  const {
    Bundle: __Bundle
  } = dependency_1;
  const __pkg = new __Bundle({
    "module": {
      "vspecifier": "@beyond-js/reactive@0.0.3/layout/main"
    },
    "type": "widget"
  }, _amd_module.uri).package();
  ;
  __pkg.dependencies.update([['@beyond-js/widgets/render', dependency_0], ['@beyond-js/kernel/styles', dependency_2], ['@beyond-js/react-18-widgets/base', dependency_3], ['react', dependency_4]]);
  brequire('@beyond-js/widgets/render').widgets.register([{
    "name": "main-layout",
    "vspecifier": "@beyond-js/reactive@0.0.3/layout/main",
    "is": "layout"
  }]);
  brequire('@beyond-js/kernel/styles').styles.register('@beyond-js/reactive@0.0.3/layout/main');
  const ims = new Map();

  /****************************
  INTERNAL MODULE: ./controller
  ****************************/

  ims.set('./controller', {
    hash: 2328700451,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Controller = void 0;
      var _base = require("@beyond-js/react-18-widgets/base");
      var _views = require("./views");
      /*bundle*/
      class Controller extends _base.ReactWidgetController {
        get Widget() {
          return _views.Layout;
        }
      }
      exports.Controller = Controller;
    }
  });

  /*****************************
  INTERNAL MODULE: ./views/index
  *****************************/

  ims.set('./views/index', {
    hash: 1901748492,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.Layout = Layout;
      var React = require("react");
      function Layout() {
        return React.createElement("main", null, React.createElement("beyond-layout-children", null));
      }
    }
  });
  __pkg.exports.descriptor = [{
    "im": "./controller",
    "from": "Controller",
    "name": "Controller"
  }];
  let Controller;

  // Module exports
  _exports.Controller = Controller;
  __pkg.exports.process = function ({
    require,
    prop,
    value
  }) {
    (require || prop === 'Controller') && (_exports.Controller = Controller = require ? require('./controller').Controller : value);
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
//# sourceMappingURL=layout/main.amd.js.map