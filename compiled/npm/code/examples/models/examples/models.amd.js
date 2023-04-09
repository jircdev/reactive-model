define(["exports", "module", "@beyond-js/kernel/bundle", "@beyond-js/reactive/model"], function (_exports, _amd_module, dependency_0, dependency_1) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.hmr = _exports.__beyond_pkg = _exports.User = void 0;
  const {
    Bundle: __Bundle
  } = dependency_0;
  const __pkg = new __Bundle({
    "module": {
      "vspecifier": "@beyond-js/reactive@0.0.3/examples/models"
    },
    "type": "ts"
  }, _amd_module.uri).package();
  ;
  __pkg.dependencies.update([['@beyond-js/reactive/model', dependency_1]]);
  const ims = new Map();

  /***********************
  INTERNAL MODULE: ./index
  ***********************/

  ims.set('./index', {
    hash: 542296685,
    creator: function (require, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.User = void 0;
      var _model = require("@beyond-js/reactive/model");
      /*bundle */
      class User extends _model.ReactiveModel {
        properties = ["name", "lastname"];
        example() {
          //    this.name = "algo";
        }
      }
      exports.User = User;
    }
  });
  __pkg.exports.descriptor = [{
    "im": "./index",
    "from": "User",
    "name": "User"
  }];
  let User;

  // Module exports
  _exports.User = User;
  __pkg.exports.process = function ({
    require,
    prop,
    value
  }) {
    (require || prop === 'User') && (_exports.User = User = require ? require('./index').User : value);
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
//# sourceMappingURL=examples/models.amd.js.map