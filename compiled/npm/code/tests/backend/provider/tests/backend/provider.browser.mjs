import * as dependency_0 from '@beyond-js/backend/client';
import * as dependency_1 from '@beyond-js/kernel/bundle';

const {Bundle: __Bundle} = dependency_1;
const __pkg = new __Bundle({"module":{"vspecifier":"@beyond-js/reactive@0.0.3.beta.dts.1/tests/backend/provider"},"type":"bridge"}, import.meta.url).package();;

__pkg.dependencies.update([['@beyond-js/backend/client', dependency_0]]);

const {ActionsBridge} = brequire('@beyond-js/backend/client');

const ims = new Map();

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {hash: 3990362, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserProvider = void 0;
var _beyond_context = require("beyond_context");
/*actions*/ /*bundle*/class UserProvider extends ActionsBridge {
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
}});

/***********************
INTERNAL MODULE: ./users
***********************/

ims.set('./users', {hash: 3376099387, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UsersProvider = void 0;
var _beyond_context = require("beyond_context");
/*actions*/ /*bundle*/class UsersProvider extends ActionsBridge {
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
}});

__pkg.exports.descriptor = [{"im":"./index","from":"UserProvider","name":"UserProvider"},{"im":"./users","from":"UsersProvider","name":"UsersProvider"}];

export let UserProvider, UsersProvider;

// Module exports
__pkg.exports.process = function({require, prop, value}) {
    (require || prop === 'UserProvider') && (UserProvider = require ? require('./index').UserProvider : value);
    (require || prop === 'UsersProvider') && (UsersProvider = require ? require('./users').UsersProvider : value);

};
export const __beyond_pkg = __pkg;

export const hmr = new (function () {
    this.on = (event, listener) => void 0;
    this.off = (event, listener) => void 0;
});


__pkg.initialise(ims);
//# sourceMappingURL=tests/backend/provider.browser.mjs.map