"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmr = exports.__beyond_pkg = exports.User = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
var dependency_1 = require("@beyond-js/reactive/model");
const {
  Bundle: __Bundle
} = dependency_0;
const __pkg = new __Bundle({
  "module": {
    "vspecifier": "@beyond-js/reactive@0.0.3/examples/models"
  },
  "type": "ts"
}).package();
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
exports.User = User;
__pkg.exports.process = function ({
  require,
  prop,
  value
}) {
  (require || prop === 'User') && (exports.User = User = require ? require('./index').User : value);
};
const __beyond_pkg = __pkg;
exports.__beyond_pkg = __beyond_pkg;
const hmr = new function () {
  this.on = (event, listener) => void 0;
  this.off = (event, listener) => void 0;
}();
exports.hmr = hmr;
__pkg.initialise(ims);
//# sourceMappingURL=examples/models.cjs.js.map