import * as dependency_0 from '@beyond-js/kernel/bundle';

const {Bundle: __Bundle} = dependency_0;
const __pkg = new __Bundle({"module":{"vspecifier":"@beyond-js/reactive@0.0.3.beta.dts.1/test"},"type":"ts"}, import.meta.url).package();;

__pkg.dependencies.update([]);

const ims = new Map();

/***********************
INTERNAL MODULE: ./index
***********************/

ims.set('./index', {hash: 2333637008, creator: function (require, exports) {
//your code here
"use strict";
}});

// Module exports
__pkg.exports.process = function({require, prop, value}) {
};
export const __beyond_pkg = __pkg;

export const hmr = new (function () {
    this.on = (event, listener) => void 0;
    this.off = (event, listener) => void 0;
});


__pkg.initialise(ims);
//# sourceMappingURL=test.browser.mjs.map