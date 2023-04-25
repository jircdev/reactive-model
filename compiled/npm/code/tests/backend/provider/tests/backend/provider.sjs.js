System.register(["@beyond-js/backend/client", "@beyond-js/kernel/bundle"], function (_export, _context) {
  "use strict";

  var dependency_0, dependency_1, __Bundle, __pkg, ActionsBridge, ims, UserProvider, UsersProvider, __beyond_pkg, hmr;
  _export({
    UserProvider: void 0,
    UsersProvider: void 0
  });
  return {
    setters: [function (_beyondJsBackendClient) {
      dependency_0 = _beyondJsBackendClient;
    }, function (_beyondJsKernelBundle) {
      dependency_1 = _beyondJsKernelBundle;
    }],
    execute: function () {
      ({
        Bundle: __Bundle
      } = dependency_1);
      __pkg = new __Bundle({
        "module": {
          "vspecifier": "@beyond-js/reactive@0.0.3.beta.dts.1/tests/backend/provider"
        },
        "type": "bridge"
      }, _context.meta.url).package();
      ;
      __pkg.dependencies.update([['@beyond-js/backend/client', dependency_0]]);
      ({
        ActionsBridge
      } = brequire('@beyond-js/backend/client'));
      ims = new Map();
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
      // Module exports
      __pkg.exports.process = function ({
        require,
        prop,
        value
      }) {
        (require || prop === 'UserProvider') && _export("UserProvider", UserProvider = require ? require('./index').UserProvider : value);
        (require || prop === 'UsersProvider') && _export("UsersProvider", UsersProvider = require ? require('./users').UsersProvider : value);
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
//# sourceMappingURL=tests/backend/provider.sjs.js.map