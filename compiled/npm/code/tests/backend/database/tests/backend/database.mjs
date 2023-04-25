import * as dependency_0 from '@beyond-js/kernel/bundle';
import * as dependency_1 from 'sqlite3';
import * as dependency_2 from 'sqlite';

const {Bundle: __Bundle} = dependency_0;
const __pkg = new __Bundle({"module":{"vspecifier":"@beyond-js/reactive@0.0.3.beta.dts.1/tests/backend/database"},"type":"ts"}, import.meta.url).package();;

__pkg.dependencies.update([['sqlite3', dependency_1],['sqlite', dependency_2]]);

const ims = new Map();

/**************************
INTERNAL MODULE: ./database
**************************/

ims.set('./database', {hash: 3220043102, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserStore = void 0;
var sqlite3 = require("sqlite3");
var _sqlite2 = require("sqlite");
/*bundle*/class UserStore {
  db;
  constructor() {
    this.db = null;
  }
  async connect() {
    this.db = await (0, _sqlite2.open)({
      filename: "reactive.db",
      driver: sqlite3.Database
    });
  }
  async disconnect() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }
  async loadUser(id) {
    if (!this.db) {
      await this.connect();
    }
    const user = await this.db.get("SELECT * FROM users WHERE id = ?", id);
    return user;
  }
  async storeUser(user) {
    if (!this.db) {
      await this.connect();
    }
    const existingUser = await this.loadUser(user.id);
    if (existingUser) {
      const {
        name,
        lastnames
      } = user;
      await this.db.run("UPDATE users SET name = ?, lastnames = ? WHERE id = ?", name, lastnames, user.id);
    } else {
      const {
        id,
        name,
        lastnames
      } = user;
      await this.db.run("INSERT INTO users (id, name, lastnames) VALUES (?, ?, ?)", id, name, lastnames);
    }
  }
  async loadAll(options) {
    if (!this.db) {
      await this.connect();
    }
    let filter = "";
    let limit = 30;
    if (options) {
      if (options.filter) {
        filter = `WHERE ${options.filter}`;
      }
      if (options.limit) {
        limit = options.limit;
      }
    }
    const query = `SELECT * FROM users ${filter} LIMIT ${limit}`;
    const users = await this.db.all(query);
    return users;
  }
  async bulkSave(users) {
    if (!this.db) {
      await this.connect();
    }
    const insertedUsers = [];
    // Start a transaction
    await this.db.run("BEGIN TRANSACTION");
    try {
      for (const user of users) {
        const insertQuery = `INSERT INTO users (name, lastnames) VALUES (?, ?)`;
        await this.db.run(insertQuery, [user.name, user.lastnames]);
        // Get the last inserted id
        const lastIdResult = await this.db.get("SELECT last_insert_rowid() as lastId");
        const lastId = lastIdResult.lastId;
        // Create a new user object with the inserted id
        const insertedUser = {
          ...user,
          id: lastId
        };
        insertedUsers.push(insertedUser);
      }
      // Commit the transaction
      await this.db.run("COMMIT");
    } catch (error) {
      console.error("Error inserting users:", error);
      // Rollback the transaction in case of an error
      await this.db.run("ROLLBACK");
      throw error;
    }
    return insertedUsers;
  }
}
exports.UserStore = UserStore;
}});

__pkg.exports.descriptor = [{"im":"./database","from":"UserStore","name":"UserStore"}];

export let UserStore;

// Module exports
__pkg.exports.process = function({require, prop, value}) {
    (require || prop === 'UserStore') && (UserStore = require ? require('./database').UserStore : value);

};
export const __beyond_pkg = __pkg;

export const hmr = new (function () {
    this.on = (event, listener) => void 0;
    this.off = (event, listener) => void 0;
});


__pkg.initialise(ims);
//# sourceMappingURL=tests/backend/database.mjs.map