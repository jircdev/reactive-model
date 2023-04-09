import * as dependency_0 from '@beyond-js/kernel/bundle';
import * as dependency_1 from '@beyond-js/reactive/model';

const {Bundle: __Bundle} = dependency_0;
const __pkg = new __Bundle({"module":{"vspecifier":"@beyond-js/reactive@0.0.3/examples/models"},"type":"ts"}, import.meta.url).package();;

__pkg.dependencies.update([['@beyond-js/reactive/model', dependency_1]]);

const ims = new Map();

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {hash: 542296685, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.User = void 0;
var _model = require("@beyond-js/reactive/model");
/*bundle */class User extends _model.ReactiveModel {
  properties = ["name", "lastname"];
  example() {
    //    this.name = "algo";
  }
}
exports.User = User;
}});

__pkg.exports.descriptor = [{"im":"./index","from":"User","name":"User"}];

export let User;

// Module exports
__pkg.exports.process = function({require, prop, value}) {
    (require || prop === 'User') && (User = require ? require('./index').User : value);

};
export const __beyond_pkg = __pkg;

export const hmr = new (function () {
    this.on = (event, listener) => void 0;
    this.off = (event, listener) => void 0;
});


__pkg.initialise(ims);
//# sourceMappingURL=examples/models.mjs.map