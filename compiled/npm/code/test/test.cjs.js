"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmr = exports.__beyond_pkg = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
const {
  Bundle: __Bundle
} = dependency_0;
const __pkg = new __Bundle({
  "module": {
    "vspecifier": "@beyond-js/reactive@0.0.3/test"
  },
  "type": "ts"
}).package();
;
__pkg.dependencies.update([]);
const ims = new Map();

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {
  hash: 2333637008,
  creator: function (require, exports) {
    //your code here
    "use strict";
  }
});

// Module exports
__pkg.exports.process = function ({
  require,
  prop,
  value
}) {};
const __beyond_pkg = __pkg;
exports.__beyond_pkg = __beyond_pkg;
const hmr = new function () {
  this.on = (event, listener) => void 0;
  this.off = (event, listener) => void 0;
}();
exports.hmr = hmr;
__pkg.initialise(ims);
//# sourceMappingURL=test.cjs.js.map