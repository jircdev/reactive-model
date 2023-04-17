System.register(["@beyond-js/kernel@0.1.9/bundle", "dexie@3.2.3", "@beyond-js/events@0.0.6/events", "@beyond-js/kernel@0.1.9/core"], function (_export, _context) {
  "use strict";

  var dependency_0, dependency_1, dependency_2, dependency_3, bimport, __Bundle, __pkg, ims, DBManager, __beyond_pkg, hmr;
  _export("DBManager", void 0);
  return {
    setters: [function (_beyondJsKernel019Bundle) {
      dependency_0 = _beyondJsKernel019Bundle;
    }, function (_dexie2) {
      dependency_1 = _dexie2;
    }, function (_beyondJsEvents006Events) {
      dependency_2 = _beyondJsEvents006Events;
    }, function (_beyondJsKernel019Core) {
      dependency_3 = _beyondJsKernel019Core;
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
          "vspecifier": "@beyond-js/reactive@0.0.3/database"
        },
        "type": "ts"
      }, _context.meta.url).package();
      ;
      __pkg.dependencies.update([['dexie', dependency_1], ['@beyond-js/events/events', dependency_2], ['@beyond-js/kernel/core', dependency_3]]);
      ims = new Map();
      /**************************
      INTERNAL MODULE: ./database
      **************************/
      ims.set('./database', {
        hash: 3100028157,
        creator: function (require, exports) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.Database = void 0;
          var _dexie = require("dexie");
          var _events = require("@beyond-js/events/events");
          var _core = require("@beyond-js/kernel/core");
          class Database extends _events.Events {
            #version = 1;
            #db;
            get db() {
              return this.#db;
            }
            #promise;
            #currentVersion;
            static #instance;
            #ready;
            #name;
            get ready() {
              return this.#ready;
            }
            constructor(name, version) {
              super();
              this.#name = name;
              this.#version = version;
              this.create();
              this.#promise = new _core.PendingPromise();
              globalThis.db = this.#db;
            }
            async create() {
              this.#db = new _dexie.default(this.#name);
              this.#currentVersion = this.#db.version(this.#version);
            }
            #onReady = () => {
              this.#ready = true;
              this.#promise.resolve();
              this.#promise = undefined;
            };
            #onError = error => {
              this.#promise.resolve();
              this.#promise = undefined;
              throw new Error(error);
            };
            #nextVersion() {
              this.#version++;
              return this.#version;
            }
            register = async data => {
              this.#currentVersion.stores(data);
              try {
                await this.#db.open();
                return this.#db;
              } catch (e) {
                console.log("error registering", e);
              }
            };
          }
          exports.Database = Database;
        }
      });

      /***********************
      INTERNAL MODULE: ./index
      ***********************/

      ims.set('./index', {
        hash: 2181821041,
        creator: function (require, exports) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.DatabaseManager = exports.DBManager = void 0;
          var _dexie = require("dexie");
          var _events = require("@beyond-js/events/events");
          var _core = require("@beyond-js/kernel/core");
          var _database = require("./database");
          /*bundle */
          class DatabaseManager extends _events.Events {
            #promise;
            #ready;
            get ready() {
              return this.#ready;
            }
            #db;
            get db() {
              return this.#db;
            }
            #databases = new Map();
            constructor() {
              super();
              const db = new _dexie.default("ReactiveDatabase");
              this.#db = db;
              db.version(1).stores({
                schemas: "name, table, fields"
              });
              db.open().then(this.#onFinished).catch(this.#onError);
            }
            #onFinished = () => {
              this.trigger("loaded.reactive.database");
              if (this.#promise) this.#promise.resolve();
            };
            #onError = err => {
              this.trigger("error");
              console.error(err);
            };
            load() {
              if (this.ready) return this.ready;
              if (this.#promise) return this.#promise;
              this.#promise = new _core.PendingPromise();
              const onFinished = () => {
                this.#ready = true;
                this.#promise.resolve();
                this.#promise = undefined;
              };
              this.on("finished", onFinished);
              this.on("error", () => {
                this.#promise.reject();
                this.#promise = undefined;
              });
            }
            async open(identifier) {
              let [name, version = 1] = identifier.split("@");
              if (!this.#databases.has(name)) {
                const schema = new _database.Database(name, version);
                this.#databases.set(name, schema);
                return schema;
              }
              return this.#databases.get(name);
            }
            get = name => this.open(name);
            async config(name, stores) {
              const schema = await this.open(name);
              return schema.register(stores);
            }
          }
          exports.DatabaseManager = DatabaseManager;
          /* bundle */
          const DBManager = new DatabaseManager();
          exports.DBManager = DBManager;
        }
      });
      __pkg.exports.descriptor = [{
        "im": "./index",
        "from": "DBManager",
        "name": "DBManager"
      }];
      // Module exports
      __pkg.exports.process = function ({
        require,
        prop,
        value
      }) {
        (require || prop === 'DBManager') && _export("DBManager", DBManager = require ? require('./index').DBManager : value);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZGV4aWUiLCJyZXF1aXJlIiwiX2V2ZW50cyIsIl9jb3JlIiwiRGF0YWJhc2UiLCJFdmVudHMiLCJ2ZXJzaW9uIiwiZGIiLCJwcm9taXNlIiwiY3VycmVudFZlcnNpb24iLCJpbnN0YW5jZSIsInJlYWR5IiwibmFtZSIsImNvbnN0cnVjdG9yIiwiY3JlYXRlIiwiUGVuZGluZ1Byb21pc2UiLCJnbG9iYWxUaGlzIiwiZGVmYXVsdCIsIm9uUmVhZHkiLCIjb25SZWFkeSIsInJlc29sdmUiLCJ1bmRlZmluZWQiLCJvbkVycm9yIiwiZXJyb3IiLCJFcnJvciIsIm5leHRWZXJzaW9uIiwiI25leHRWZXJzaW9uIiwicmVnaXN0ZXIiLCJkYXRhIiwic3RvcmVzIiwib3BlbiIsImUiLCJjb25zb2xlIiwibG9nIiwiZXhwb3J0cyIsIl9kYXRhYmFzZSIsIkRhdGFiYXNlTWFuYWdlciIsImRhdGFiYXNlcyIsIk1hcCIsInNjaGVtYXMiLCJ0aGVuIiwib25GaW5pc2hlZCIsImNhdGNoIiwiI29uRmluaXNoZWQiLCJ0cmlnZ2VyIiwiZXJyIiwibG9hZCIsIm9uIiwicmVqZWN0IiwiaWRlbnRpZmllciIsInNwbGl0IiwiaGFzIiwic2NoZW1hIiwic2V0IiwiZ2V0IiwiY29uZmlnIiwiREJNYW5hZ2VyIl0sInNvdXJjZXMiOlsiL2RhdGFiYXNlLnRzIiwiL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VBQUEsSUFBQUEsTUFBQSxHQUFBQyxPQUFBO1VBQ0EsSUFBQUMsT0FBQSxHQUFBRCxPQUFBO1VBQ0EsSUFBQUUsS0FBQSxHQUFBRixPQUFBO1VBRU0sTUFBT0csUUFBUyxTQUFRRixPQUFBLENBQUFHLE1BQU07WUFDbkMsQ0FBQUMsT0FBUSxHQUFHLENBQUM7WUFFWixDQUFBQyxFQUFHO1lBQ0gsSUFBSUEsRUFBRUEsQ0FBQTtjQUNMLE9BQU8sSUFB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