import * as dependency_0 from '@beyond-js/widgets/render';
import * as dependency_1 from '@beyond-js/kernel/bundle';
import * as dependency_2 from '@beyond-js/kernel/styles';
import * as dependency_3 from '@beyond-js/react-18-widgets/page';
import * as dependency_4 from '@beyond-js/reactive/examples/models';
import * as dependency_5 from 'react';
import * as dependency_6 from '@beyond-js/reactive@0.0.3/config';

const {Bundle: __Bundle} = dependency_1;
const __pkg = new __Bundle({"module":{"vspecifier":"@beyond-js/reactive@0.0.3/home"},"type":"widget"}, import.meta.url).package();;

__pkg.dependencies.update([['@beyond-js/widgets/render', dependency_0],['@beyond-js/kernel/styles', dependency_2],['@beyond-js/react-18-widgets/page', dependency_3],['@beyond-js/reactive/examples/models', dependency_4],['react', dependency_5],['@beyond-js/reactive/config', dependency_6]]);

brequire('@beyond-js/widgets/render').widgets.register([{"name":"home-page","vspecifier":"@beyond-js/reactive@0.0.3/home","is":"page","route":"/"}]);

brequire('@beyond-js/kernel/styles').styles.register('@beyond-js/reactive@0.0.3/home')


const ims = new Map();

/****************************
INTERNAL MODULE: ./controller
****************************/

ims.set('./controller', {hash: 2240503245, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Controller = void 0;
var _page = require("@beyond-js/react-18-widgets/page");
var _views = require("./views");
var _models = require("@beyond-js/reactive/examples/models");
/*bundle*/class Controller extends _page.PageReactWidgetController {
  get Widget() {
    return _views.Page;
  }
  constructor(a) {
    super(a);
    const user = new _models.User();
    console.log(10, user);
  }
}
exports.Controller = Controller;
}});

/*****************************
INTERNAL MODULE: ./views/index
*****************************/

ims.set('./views/index', {hash: 130100575, creator: function (require, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Page = Page;
var React = require("react");
/*bundle*/function Page() {
  return React.createElement("div", {
    className: "page__container"
  }, React.createElement("h1", null, "ReactiveModel sample ", React.createElement("span", {
    className: "beyond"
  }, "React"), "!"));
}
}});

__pkg.exports.descriptor = [{"im":"./controller","from":"Controller","name":"Controller"},{"im":"./views/index","from":"Page","name":"Page"}];

export let Controller, Page;

// Module exports
__pkg.exports.process = function({require, prop, value}) {
    (require || prop === 'Controller') && (Controller = require ? require('./controller').Controller : value);
    (require || prop === 'Page') && (Page = require ? require('./views/index').Page : value);

};
export const __beyond_pkg = __pkg;

export const hmr = new (function () {
    this.on = (event, listener) => void 0;
    this.off = (event, listener) => void 0;
});


__pkg.initialise(ims);
//# sourceMappingURL=home.browser.mjs.map