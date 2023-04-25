import * as dependency_0 from '@beyond-js/kernel/bundle';
import * as dependency_1 from '@beyond-js/reactive/model';
import * as dependency_2 from '@beyond-js/reactive/database';
import * as dependency_3 from 'dexie';
import * as dependency_4 from '@beyond-js/kernel/core';

const {Bundle: __Bundle} = dependency_0;
const __pkg = new __Bundle({"module":{"vspecifier":"@beyond-js/reactive@0.0.3.beta.dts.1/entities"},"type":"ts"}, import.meta.url).package();;

__pkg.dependencies.update([['@beyond-js/reactive/model', dependency_1],['@beyond-js/reactive/database', dependency_2],['dexie', dependency_3],['@beyond-js/kernel/core', dependency_4]]);

const ims = new Map();

/**********************************
INTERNAL MODULE: ./collection/index
**********************************/

ims.set('./collection/index', {hash: 2572665201, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Collection = void 0;
var _model = require("@beyond-js/reactive/model");
var _localProvider = require("./local-provider");
var _publish = require("./publish");
var _load = require("./load");
var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
    r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
    d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/*bundle*/class Collection extends _model.ReactiveModel {
  #items = [];
  items;
  /**
   * Represents the number of elements in the collection
   */
  #total = 0;
  get total() {
    return this.#total;
  }
  provider;
  next;
  #localProvider;
  get localProvider() {
    return this.#localProvider;
  }
  #saveManager;
  #loadManager;
  #provider;
  #initSpecs = {};
  async init(specs = {}) {
    this.#initSpecs = specs;
    const getProperty = property => this[property];
    const setProperty = (property, value) => this[property] = value;
    const bridge = {
      get: getProperty,
      set: setProperty
    };
    this.#localProvider = new _localProvider.CollectionLocalProvider(this, bridge);
    this.localProvider.init();
    this.#saveManager = new _publish.CollectionSaveManager(this, bridge);
    this.#loadManager = new _load.CollectionLoadManager(this, bridge);
  }
}
exports.Collection = Collection;
__decorate([(0, _model.reactiveProps)(["items", "counters", "next", "provider"])], Collection.prototype, "items", void 0);
}});

/*********************************
INTERNAL MODULE: ./collection/load
*********************************/

ims.set('./collection/load', {hash: 3439375798, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionLoadManager = void 0;
class CollectionLoadManager {
  #parent;
  get parent() {
    return this.#parent;
  }
  #localProvider;
  #provider;
  #getProperty;
  #bridge;
  constructor(parent, bridge) {
    this.#parent = parent;
    this.#bridge = bridge;
    this.init();
  }
  init = async () => {
    this.#parent.load = this.load;
    this.#localProvider = this.#bridge.get("localProvider");
    this.#provider = this.#bridge.get("provider");
    this.#parent.load = this.load;
  };
  /**
   * metodo general para las consultas de tipo lista para las colecciones
   * @param params Object filters and configuration
   * parameters:
   *  - next
   *  - limit
   *  - update // siguiente pagina de misma consulta
   * - status // 1, 0, -1
   *  {user: [10,30]}
   *
   * {and: [{user:10}, {user:30}]]}
   *
   *  {user: 10}
   *  {user: [10,30,40,50]}
   * {or: [{user:10}, {user:30}]]}
   * {and: [{user:10}, {user:30}]]}
   *  el provider debe devolver:
   * 	- next
   * 	- entries
   *  - total
   * load({status:1})
   */
  load = async (params = {}) => {
    try {
      this.parent.fetching = true;
      let {
        limit = 30,
        start = 1,
        update
      } = params;
      const {
        next
      } = this.parent;
      start = start ?? (update === true && next ? next : 0);
      if (await this.#bridge.get("localdb")) {
        const localData = await this.#localProvider.load(params);
        this.processEntries(localData);
      }
      if (this.#localProvider && !this.#localProvider.isOnline) return;
      const remoteData = await this.#provider.list(params);
      const {
        status,
        data,
        error
      } = remoteData;
      if (!status) throw error ?? "ERROR_LIST_QUERY";
      const items = this.processEntries(data.entries);
      let itemsValue = params.update === true ? this.parent.items.concat(items) : items;
      const properties = {
        items: itemsValue,
        next: data.next,
        loaded: true,
        fetching: false,
        total: data.total ?? 0
      };
      this.parent.set(properties);
      this.parent.triggerEvent();
      return items;
    } catch (exc) {
      console.error("ERROR LOAD", exc);
      this.#parent.set({
        loaded: false,
        fetchig: true
      });
      this.parent.triggerEvent();
      return {
        status: false,
        error: {
          message: exc
        }
      };
    }
  };
  processEntries = entries => {
    return entries.map(record => {
      const item = new this.parent.item();
      item.set(record, true);
      return item;
    });
  };
  remoteLoad = async params => {
    const response = await this.#provider.load(params);
    if (!response.status) throw "ERROR_DATA_QUERY";
    return response.data;
  };
}
exports.CollectionLoadManager = CollectionLoadManager;
}});

/*******************************************
INTERNAL MODULE: ./collection/local-provider
*******************************************/

ims.set('./collection/local-provider', {hash: 292058588, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionLocalProvider = void 0;
var _model = require("@beyond-js/reactive/model");
var _database = require("@beyond-js/reactive/database");
/*bundle*/class CollectionLocalProvider extends _model.ReactiveModel {
  #isOnline = globalThis.navigator.onLine;
  #store;
  get store() {
    return this.#store;
  }
  #offline;
  #database;
  #storeName;
  #databaseName;
  #originalData;
  #exists = false;
  #found = false;
  get originalData() {
    return this.#originalData;
  }
  #db;
  get isOnline() {
    return this.#isOnline && !this.#offline && !localStorage.getItem("reactive.offline");
  }
  #parent;
  constructor(parent, bridge) {
    super();
    const {
      db,
      storeName
    } = parent;
    this.#parent = parent;
    if (!db || !storeName) throw new Error("database and store are required");
    this.#databaseName = db;
    this.#storeName = storeName;
    globalThis.addEventListener("online", this.handleConnection);
    globalThis.addEventListener("offline", this.handleConnection);
  }
  setOffline(value) {
    this.#offline = value;
    this.triggerEvent();
  }
  init = async () => {
    try {
      const database = await _database.DBManager.get(this.#databaseName);
      this.#database = database;
      this.#store = database.db[this.#storeName];
    } catch (e) {
      console.error(e);
    }
  };
  handleConnection = () => {
    this.triggerEvent();
  };
  /**
   * @todo: Must validated if some item in the collection is not sync.
   * @param data
   * @returns
   */
  #isUnpublished(data) {}
  async load(params) {
    const conditions = Object.keys(params);
    const controls = ["and", "or"];
    conditions.forEach(condition => {
      if (controls.includes(condition)) {
        this.#processControl(condition, params[condition]);
      }
    });
  }
  save(data) {
    if (!this.isOnline) data = data.forEach(item => ({
      ...item,
      offline: true
    }));
    return this.#store.bulkPut(data);
  }
  #processControl(control, conditions) {
    this.#store[control];
  }
}
exports.CollectionLocalProvider = CollectionLocalProvider;
}});

/************************************
INTERNAL MODULE: ./collection/publish
************************************/

ims.set('./collection/publish', {hash: 599700833, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CollectionSaveManager = void 0;
class CollectionSaveManager {
  #parent;
  #bridge;
  #localProvider;
  #provider;
  constructor(parent, bridge) {
    this.#parent = parent;
    this.#bridge = bridge;
    this.init();
  }
  init() {
    this.#parent.save = this.save;
    this.#parent.sync = this.sync;
    this.#parent.publish = this.publish;
    this.#localProvider = this.#bridge.get("localProvider");
    this.#provider = this.#bridge.get("provider");
  }
  save = async (data = []) => {
    await this.#localProvider.save(data);
  };
  publish = async (data = []) => {
    try {
      await this.save(data);
      const response = await this.#provider.bulkSave(data);
      if (!response.status) {
        console.log("error...", response);
      }
    } catch (e) {
      console.log(e);
    }
  };
  sync = () => {
    const data = this.#parent.localProvider.store.where("offline").equals(true).toArray();
    console.log(1300, data);
  };
}
exports.CollectionSaveManager = CollectionSaveManager;
}});

/*************************************
INTERNAL MODULE: ./interfaces/provider
*************************************/

ims.set('./interfaces/provider', {hash: 1824239074, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
}});

/****************************
INTERNAL MODULE: ./item/index
****************************/

ims.set('./item/index', {hash: 2345768741, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Item = void 0;
var _model = require("@beyond-js/reactive/model");
var _localProvider = require("./local-provider");
var _save = require("./save");
var _load = require("./load");
/*bundle*/class Item extends _model.ReactiveModel {
  #info = new Map();
  /**
   * Represent the data that is stored in the local database
   */
  #localData = new Map();
  localdb = true;
  provider;
  storeName;
  db;
  #ignoredFields = [];
  #skeleton = [];
  localProvider;
  get isUnpublished() {
    return this.localProvider.isUnpublished(this.getProperties());
  }
  #saveManager;
  get skeleton() {
    return this.#skeleton;
  }
  __get(property) {
    return this[property];
  }
  get store() {
    return this.localProvider.store;
  }
  #loadManager;
  constructor(id) {
    super();
    this.on("change", this.checkUnpublished);
  }
  setOffline = value => this.localProvider.setOffline(value);
  checkUnpublished = () => {};
  async init({
    id
  }) {
    try {
      const getProperty = property => this.__get(property);
      this.localProvider = new _localProvider.LocalProvider(this, getProperty);
      this.#saveManager = new _save.ItemSaveManager(this, getProperty);
      this.#loadManager = new _load.ItemLoadManager(this, getProperty);
      if (!id) return;
      const data = await this.localProvider.init(id);
      if (this.#skeleton && this.#skeleton.length > 0) {
        this.properties = this.#skeleton;
      }
      if (data) this.set(data, true);
    } catch (e) {
      console.error("error initializing", e);
    }
  }
  addLocalProvider(db, table) {
    if (this.localProvider) return;
  }
  set(data, init = false) {
    // If init is true, store the data in localData Map
    if (init) {
      this.#localData = new Map(Object.entries(data));
    }
    // If a property is in the properties array, define it as a public property
    this.properties.forEach(property => {
      if (data.hasOwnProperty(property)) {
        this[property] = data[property];
      }
    });
  }
  getValues() {
    const values = {};
    this.skeleton.forEach(field => {
      if (this.hasOwnProperty(field)) values[field] = this[field];
    });
    return values;
  }
}
exports.Item = Item;
}});

/***************************
INTERNAL MODULE: ./item/load
***************************/

ims.set('./item/load', {hash: 37441843, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemLoadManager = void 0;
class ItemLoadManager {
  #parent;
  #localProvider;
  #provider;
  #getProperty;
  constructor(parent, getProperty) {
    this.#parent = parent;
    this.#getProperty = getProperty;
    this.init();
  }
  init = async () => {
    this.#parent.load = this.load;
    this.#localProvider = this.#getProperty("localProvider");
    this.#provider = this.#getProperty("provider");
  };
  /**
   *
   * @param id
   * @returns
   */
  load = async id => {
    try {
      const parent = this.#parent;
      this.#parent.fetching = true;
      if (await this.#parent.get("localdb")) {
        const localData = await this.#localProvider.load(id);
      }
      if (this.#localProvider && !this.#localProvider.isOnline) return;
      const remoteData = await this.remoteLoad({
        id
      });
      if (!remoteData) {
        this.#parent.found = false;
      }
      if (remoteData) {
        let same = true;
        Object.keys(remoteData).forEach(key => {
          let original = this.#localProvider.originalData;
          if (original[key] !== remoteData[key]) same = false;
        });
        if (!same) await this.#localProvider.save(remoteData);
      }
    } catch (exc) {
      console.log("ERROR LOAD", exc);
    } finally {
      this.#parent.fetching = false;
    }
  };
  remoteLoad = async params => {
    const response = await this.#provider.load(params);
    if (!response.status) throw "ERROR_DATA_QUERY";
    return response.data;
  };
}
exports.ItemLoadManager = ItemLoadManager;
}});

/*************************************
INTERNAL MODULE: ./item/local-provider
*************************************/

ims.set('./item/local-provider', {hash: 2353489507, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LocalProvider = void 0;
var _model = require("@beyond-js/reactive/model");
var _database = require("@beyond-js/reactive/database");
/*bundle*/class LocalProvider extends _model.ReactiveModel {
  #isOnline = globalThis.navigator.onLine;
  #store;
  get store() {
    return this.#store;
  }
  #offline;
  #database;
  #storeName;
  #databaseName;
  #originalData;
  #exists = false;
  #found = false;
  get originalData() {
    return this.#originalData;
  }
  #db;
  get isOnline() {
    return this.#isOnline && !this.#offline && !localStorage.getItem("reactive.offline");
  }
  #parent;
  #getProperty;
  constructor(parent, getProperty) {
    super();
    this.#getProperty = getProperty;
    const {
      db,
      storeName
    } = parent;
    this.#parent = parent;
    if (!db || !storeName) throw new Error("database and store are required");
    this.#databaseName = db;
    this.#storeName = storeName;
    globalThis.addEventListener("online", this.handleConnection);
    globalThis.addEventListener("offline", this.handleConnection);
  }
  setOffline(value) {
    this.#offline = value;
    this.triggerEvent();
  }
  init = async id => {
    try {
      const database = await _database.DBManager.get(this.#databaseName);
      this.#database = database;
      this.#store = database.db[this.#storeName];
      return this.load({
        id
      });
    } catch (e) {
      console.error(e);
    }
  };
  handleConnection = () => {
    this.triggerEvent();
    console.log("cambio la conexión");
  };
  isUnpublished(data) {
    const properties = Object.keys(data);
    if (!this.#originalData) return true;
    return properties.some(prop => this.#originalData[prop] !== data[prop]);
  }
  async load({
    id = undefined
  } = {}) {
    id = id ?? this.#parent.id;
    try {
      if (!id) {
        throw new Error("id is required");
      }
      const data = await this.#store.get(id);
      if (data) this.#originalData = data;else this.#found = false;
      if (data) this.#exists = true;
      return data;
    } catch (e) {
      console.error(e);
    }
  }
  async save(data) {
    try {
      if (!this.isUnpublished) return;
      if (!this.isOnline) data.offline = true;
      if (this.#exists) return this.#update(data);
      await this.#store.put(data);
    } catch (e) {}
  }
  async #update(data) {
    try {
      if (!this.isUnpublished) return;
      await this.#store.update(data.id, data);
    } catch (e) {}
  }
}
exports.LocalProvider = LocalProvider;
}});

/***************************
INTERNAL MODULE: ./item/save
***************************/

ims.set('./item/save', {hash: 568733684, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemSaveManager = void 0;
class ItemSaveManager {
  #parent;
  #getProperty;
  constructor(parent, getProperty) {
    this.#parent = parent;
    this.#getProperty = getProperty;
    this.init();
  }
  init() {
    this.#parent.save = this.save;
    this.#parent.sync = this.sync;
  }
  save = async (data = undefined) => {
    try {
      if (data) {
        this.#parent.set(data);
      }
      if (!this.#parent.isUnpublished) {
        return;
      }
      const properties = this.#parent.getProperties();
      const promises = [];
      if (this.#parent.localProvider) {
        await this.#parent.localProvider.save(properties);
      }
      if (this.#parent.provider && this.#parent.provider.isOnline) {
        const response = await this.#parent.provider.publish(properties);
        if (this.#parent.localProvider) {
          // this.#parenst.set()
          this.#parent.localProvider.triggerEvent();
        }
      }
      await Promise.all(promises);
    } catch (e) {
      console.error("error saving", e);
    }
  };
  sync = () => {
    const data = this.#getProperty("localProvider").store.where("offline").equals(true).toArray();
  };
}
exports.ItemSaveManager = ItemSaveManager;
}});

__pkg.exports.descriptor = [{"im":"./collection/index","from":"Collection","name":"Collection"},{"im":"./collection/local-provider","from":"CollectionLocalProvider","name":"CollectionLocalProvider"},{"im":"./interfaces/provider","from":"IProvider","name":"IProvider"},{"im":"./item/index","from":"Item","name":"Item"},{"im":"./item/local-provider","from":"LocalProvider","name":"LocalProvider"}];

export let Collection, CollectionLocalProvider, IProvider, Item, LocalProvider;

// Module exports
__pkg.exports.process = function({require, prop, value}) {
    (require || prop === 'Collection') && (Collection = require ? require('./collection/index').Collection : value);
    (require || prop === 'CollectionLocalProvider') && (CollectionLocalProvider = require ? require('./collection/local-provider').CollectionLocalProvider : value);
    (require || prop === 'IProvider') && (IProvider = require ? require('./interfaces/provider').IProvider : value);
    (require || prop === 'Item') && (Item = require ? require('./item/index').Item : value);
    (require || prop === 'LocalProvider') && (LocalProvider = require ? require('./item/local-provider').LocalProvider : value);

};
export const __beyond_pkg = __pkg;

export const hmr = new (function () {
    this.on = (event, listener) => void 0;
    this.off = (event, listener) => void 0;
});


__pkg.initialise(ims);
//# sourceMappingURL=entities.browser.mjs.map