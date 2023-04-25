"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmr = exports.__beyond_pkg = exports.UsersProvider = exports.UserProvider = void 0;
var dependency_0 = require("@beyond-js/backend/client");
var dependency_1 = require("@beyond-js/kernel/bundle");
var dependency_2 = require("@beyond-js/reactive/tests/backend/database");
var dependency_3 = require("socket.io");
const {
  Bundle: __Bundle
} = dependency_1;
const __pkg = new __Bundle({
  "module": {
    "vspecifier": "@beyond-js/reactive@0.0.3.beta.dts.1/tests/backend/provider"
  },
  "type": "bridge"
}).package();
;
__pkg.dependencies.update([['@beyond-js/backend/client', dependency_0], ['@beyond-js/reactive/tests/backend/database', dependency_2], ['socket.io', dependency_3]]);
const {
  ActionsBridge
} = brequire('@beyond-js/backend/client');
const ims = new Map();

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {
  hash: 3990362,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.UserProvider = void 0;
    var _beyond_context = require("beyond_context");
    /*actions*/ /*bundle*/
    class UserProvider extends ActionsBridge {
      async publish(data) {
        return await this.execute("index//UserProvider//publish", ...arguments);
      }
      async load({
        id
      }) {
        return await this.execute("index//UserProvider//load", ...arguments);
      }
      async list() {
        return await this.execute("index//UserProvider//list", ...arguments);
      }
      async bulkSave(data) {
        return await this.execute("index//UserProvider//bulkSave", ...arguments);
      }
      constructor() {
        super("unknown", _beyond_context.bundle);
      }
    }
    exports.UserProvider = UserProvider;
  }
});

/***********************
INTERNAL MODULE: ./users
***********************/

ims.set('./users', {
  hash: 3376099387,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.UsersProvider = void 0;
    var _beyond_context = require("beyond_context");
    /*actions*/ /*bundle*/
    class UsersProvider extends ActionsBridge {
      async save(data) {
        return await this.execute("users//UsersProvider//save", ...arguments);
      }
      async load({
        id
      }) {
        return await this.execute("users//UsersProvider//load", ...arguments);
      }
      async list() {
        return await this.execute("users//UsersProvider//list", ...arguments);
      }
      async send() {
        return await this.execute("users//UsersProvider//send", ...arguments);
      }
      constructor() {
        super("unknown", _beyond_context.bundle);
      }
    }
    exports.UsersProvider = UsersProvider;
  }
});
__pkg.exports.descriptor = [{
  "im": "./index",
  "from": "UserProvider",
  "name": "UserProvider"
}, {
  "im": "./users",
  "from": "UsersProvider",
  "name": "UsersProvider"
}];
let UserProvider, UsersProvider;

// Module exports
exports.UsersProvider = UsersProvider;
exports.UserProvider = UserProvider;
__pkg.exports.process = function ({
  require,
  prop,
  value
}) {
  (require || prop === 'UserProvider') && (exports.UserProvider = UserProvider = require ? require('./index').UserProvider : value);
  (require || prop === 'UsersProvider') && (exports.UsersProvider = UsersProvider = require ? require('./users').UsersProvider : value);
};
const __beyond_pkg = __pkg;
exports.__beyond_pkg = __beyond_pkg;
const hmr = new function () {
  this.on = (event, listener) => void 0;
  this.off = (event, listener) => void 0;
}();
exports.hmr = hmr;
__pkg.initialise(ims);
//# sourceMappingURL=tests/backend/provider.cjs.js.map