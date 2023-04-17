System.register(["@beyond-js/kernel@0.1.9/bundle", "@beyond-js/reactive@0.0.3/database", "dexie@3.2.3", "@beyond-js/reactive@0.0.3/model"], function (_export, _context) {
  "use strict";

  var dependency_0, dependency_1, dependency_2, dependency_3, bimport, __Bundle, __pkg, ims, database, User, __beyond_pkg, hmr;
  _export({
    database: void 0,
    User: void 0
  });
  return {
    setters: [function (_beyondJsKernel019Bundle) {
      dependency_0 = _beyondJsKernel019Bundle;
    }, function (_beyondJsReactive003Database) {
      dependency_1 = _beyondJsReactive003Database;
    }, function (_dexie2) {
      dependency_2 = _dexie2;
    }, function (_beyondJsReactive003Model) {
      dependency_3 = _beyondJsReactive003Model;
    }],
    execute: function () {
      bimport = specifier => {
        const dependencies = new Map([["@beyond-js/events", "0.0.6"], ["@beyond-js/kernel", "0.1.9"], ["@beyond-js/local", "0.1.3"], ["@beyond-js/react-18-widgets", "0.0.5"], ["ajv", "8.12.0"], ["dexie", "3.2.3"], ["socket.io-client", "4.6.1"], ["@beyond-js/reactive", "0.0.3"], ["@beyond-js/reactive", "0.0.3"]]);
        return globalThis.bimport(globalThis.bimport.resolve(specifier, dependencies));
      };
      ({
        Bundle: __Bundle
      } = dependency_0);
      __pkg = new __Bundle({
        "module": {
          "vspecifier": "@beyond-js/reactive@0.0.3/examples/models"
        },
        "type": "ts"
      }, _context.meta.url).package();
      ;
      __pkg.dependencies.update([['@beyond-js/reactive/database', dependency_1], ['dexie', dependency_2], ['@beyond-js/reactive/model', dependency_3]]);
      ims = new Map();
      /***********************
      INTERNAL MODULE: ./index
      ***********************/
      ims.set('./index', {
        hash: 1792788298,
        creator: function (require, exports) {
          "use strict";

          var _database = require("@beyond-js/reactive/database");
          (async () => {
            console.log(100, "empezando", _database.DBManager);
          })();
        }
      });

      /**************************
      INTERNAL MODULE: ./register
      **************************/

      ims.set('./register', {
        hash: 3499107781,
        creator: function (require, exports) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.database = database;
          var _dexie = require("dexie");
          const db = new _dexie.default("ReactiveDatabase");
          db.version(1).stores({
            schemas: "name, table, fields"
          });
          const map = new Map();
          /* bundle */
          function database(name) {
            if (map.has(name)) return map.get(name);
            const schema = new _dexie.default(name);
            map.set(name, {
              db: schema,
              version: 1
            });
            return schema;
          }
        }
      });

      /**********************
      INTERNAL MODULE: ./user
      **********************/

      ims.set('./user', {
        hash: 1082467671,
        creator: function (require, exports) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.User = void 0;
          var _model = require("@beyond-js/reactive/model");
          /*bundle */
          class User extends _model.Item {
            properties = ["name", "lastname"];
            localdb = true;
            table = "users";
            db = "tests";
            constructor(id) {
              super(id);
              this.addLocalProvider("tests", "users");
            }
            example() {
              //    this.name = "algo";
            }
          }
          exports.User = User;
        }
      });
      __pkg.exports.descriptor = [{
        "im": "./register",
        "from": "database",
        "name": "database"
      }, {
        "im": "./user",
        "from": "User",
        "name": "User"
      }];
      // Module exports
      __pkg.exports.process = function ({
        require,
        prop,
        value
      }) {
        (require || prop === 'database') && _export("database", database = require ? require('./register').database : value);
        (require || prop === 'User') && _export("User", User = require ? require('./user').User : value);
      };
      _export("__beyond_pkg", __beyond_pkg = __pkg);
      _export("hmr", hmr = new function () {
        this.on = (event, listener) => __pkg.hmr.on(event, listener);
        this.off = (event, listener) => __pkg.hmr.off(event, listener);
      }());
      __pkg.initialise(ims);
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZGF0YWJhc2UiLCJyZXF1aXJlIiwiY29uc29sZSIsImxvZyIsIkRCTWFuYWdlciIsIl9kZXhpZSIsImRiIiwiZGVmYXVsdCIsInZlcnNpb24iLCJzdG9yZXMiLCJzY2hlbWFzIiwibWFwIiwiTWFwIiwiZGF0YWJhc2UiLCJuYW1lIiwiaGFzIiwiZ2V0Iiwic2NoZW1hIiwic2V0IiwiX21vZGVsIiwiVXNlciIsIkl0ZW0iLCJwcm9wZXJ0aWVzIiwibG9jYWxkYiIsInRhYmxlIiwiY29uc3RydWN0b3IiLCJpZCIsImFkZExvY2FsUHJvdmlkZXIiLCJleGFtcGxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbIi9pbmRleC50cyIsIi9yZWdpc3Rlci50cyIsIi91c2VyLnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsLG51bGxdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztVQUFBLElBQUFBLFNBQUEsR0FBQUMsT0FBQTtVQUVBLENBQUMsWUFBVztZQUNYQyxPQUFPLENBQUNDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsV0FBVyxFQUFFSCxTQUFBLENBQUFJLFNBQVMsQ0FBQztVQUN6QyxDQUFDLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDSkosSUFBQUMsTUFBQSxHQUFBSixPQUFBO1VBRUEsTUFBTUssRUFBRSxHQUFHLElBQUlELE1BQUEsQ0FBQUUsT0FBSyxDQUFDLGtCQUFrQixDQUFDO1VBQ3hDRCxFQUFFLENBQUNFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsTUFBTSxDQUFDO1lBQUVDLE9BQU8sRUFBRTtVQUFxQixDQUFFLENBQUM7VUFFeEQsTUFBTUMsR0FBRyxHQUFHLElBQUlDLEdBQUcsRUFBRTtVQUNkO1VBQVksU0FBVUMsUUFBUUEsQ0FBQ0MsSUFBSTtZQUN6QyxJQUFJSCxHQUFHLENBQUNJLEdBQUcsQ0FBQ0QsSUFBSSxDQUFDLEVBQUUsT0FBT0gsR0FBRyxDQUFDSyxHQUFHLENBQUNGLElBQUksQ0FBQztZQUV2QyxNQUFNRyxNQUFNLEdBQUcsSUFBSVosTUFBQSxDQUFBRSxPQUFLLENBQUNPLElBQUksQ0FBQztZQUM5QkgsR0FBRyxDQUFDTyxHQUFHLENBQUNKLElBQUksRUFBRTtjQUFFUixFQUFFLEVBQUVXLE1BQU07Y0FBRVQsT0FBTyxFQUFFO1lBQUMsQ0FBRSxDQUFDO1lBRXpDLE9BQU9TLE1BQU07VUFDZDs7Ozs7Ozs7Ozs7Ozs7Ozs7VUNiQSxJQUFBRSxNQUFBLEdBQUFsQixPQUFBO1VBU087VUFBVyxNQUFPbUIsSUFBSyxTQUFRRCxNQUFBLENBQUFFLElBQVc7WUFDdENDLFVBQVUsR0FBRyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUM7WUFFakNDLE9BQU8sR0FBRyxJQUFJO1lBQ2RDLEtBQUssR0FBRyxPQUFPO1lBQ2ZsQixFQUFFLEdBQUcsT0FBTztZQUV0Qm1CLFlBQVlDLEVBQUU7Y0FDYixLQUFLLENBQUNBLEVBQUUsQ0FBQztjQUNULElBQUksQ0FBQ0MsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQztZQUN4QztZQUVBQyxPQUFPQSxDQUFBO2NBQ047WUFBQTs7VUFFREMsT0FBQSxDQUFBVCxJQUFBLEdBQUFBLElBQUEifQ==