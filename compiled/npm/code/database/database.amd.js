define(["exports", "module", "@beyond-js/kernel/bundle", "dexie", "@beyond-js/events/events", "@beyond-js/kernel/core"], function (_exports, _amd_module, dependency_0, dependency_1, dependency_2, dependency_3) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.hmr = _exports.__beyond_pkg = _exports.DatabaseManager = _exports.DBManager = void 0;
  const {
    Bundle: __Bundle
  } = dependency_0;
  const __pkg = new __Bundle({
    "module": {
      "vspecifier": "@beyond-js/reactive@0.0.3.beta.dts.1/database"
    },
    "type": "ts"
  }, _amd_module.uri).package();
  ;
  __pkg.dependencies.update([['dexie', dependency_1], ['@beyond-js/events/events', dependency_2], ['@beyond-js/kernel/core', dependency_3]]);
  const ims = new Map();

  /**************************
  INTERNAL MODULE: ./database
  **************************/

  ims.set('./database', {
    hash: 2654661490,
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
          Object.keys(data).forEach(store => {
            const items = data[store].split(",");
            const filter = new Set(items);
            filter.add("offline");
            data[store] = Array.from(filter).join(",");
          });
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
    hash: 1175347211,
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
    "from": "DatabaseManager",
    "name": "DatabaseManager"
  }, {
    "im": "./index",
    "from": "DBManager",
    "name": "DBManager"
  }];
  let DatabaseManager, DBManager;

  // Module exports
  _exports.DBManager = DBManager;
  _exports.DatabaseManager = DatabaseManager;
  __pkg.exports.process = function ({
    require,
    prop,
    value
  }) {
    (require || prop === 'DatabaseManager') && (_exports.DatabaseManager = DatabaseManager = require ? require('./index').DatabaseManager : value);
    (require || prop === 'DBManager') && (_exports.DBManager = DBManager = require ? require('./index').DBManager : value);
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
//# sourceMappingURL=database.amd.js.map