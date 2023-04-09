System.register(["@beyond-js/kernel/bundle", "@beyond-js/events/events"], function (_export, _context) {
  "use strict";

  var dependency_0, dependency_1, __Bundle, __pkg, ims, ReactiveModel, reactiveProp, reactiveProps, __beyond_pkg, hmr;
  _export({
    ReactiveModel: void 0,
    reactiveProp: void 0,
    reactiveProps: void 0
  });
  return {
    setters: [function (_beyondJsKernelBundle) {
      dependency_0 = _beyondJsKernelBundle;
    }, function (_beyondJsEventsEvents) {
      dependency_1 = _beyondJsEventsEvents;
    }],
    execute: function () {
      ({
        Bundle: __Bundle
      } = dependency_0);
      __pkg = new __Bundle({
        "module": {
          "vspecifier": "@beyond-js/reactive@0.0.3/model"
        },
        "type": "ts"
      }, _context.meta.url).package();
      ;
      __pkg.dependencies.update([['@beyond-js/events/events', dependency_1]]);
      ims = new Map();
      /***********************
      INTERNAL MODULE: ./index
      ***********************/
      ims.set('./index', {
        hash: 990570488,
        creator: function (require, exports) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.ReactiveModel = void 0;
          var _events = require("@beyond-js/events/events");
          var _property = require("./property");
          var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
            var c = arguments.length,
              r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
              d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
          };
          /*bundle*/ /**
                      * The `ReactiveModel` class is a subclass of the `Events` class that provides a simple way to create
                      * reactive properties that can trigger events when they change. It also provides methods for setting
                      * and getting property values.
                      *
                      * @template T - The type of the properties that can be defined in the model.
                      * @extends Events
                      */
          class ReactiveModel extends _events.Events {
            schema;
            fetching;
            fetched = false;
            processing = false;
            ready = false;
            processed = false;
            properties;
            loaded = false;
            /**
             * The `triggerEvent` method triggers a change event on the model, which can be used to notify
             * subscribers of changes to the model's properties.
             *
             * @param {string} event - The name of the event to trigger.
             * @returns {void}
             */
            triggerEvent = (event = "change") => this.trigger(event);
            /**
             * The `set` method sets one or more properties on the model.
             *
             * @param {keyof ReactiveModelPublic<T>} property - The name of the property to set.
             * @param {*} value - The value to set the property to.
             * @returns {void}
             */
            set(property, value) {
              let props = {};
              if (property && value !== undefined) {
                props[property] = value;
              } else if (typeof property === "object" && property !== null) {
                props = property;
              }
              let updated = false;
              for (const prop in props) {
                const key = `#${prop}`;
                if (!Object.prototype.hasOwnProperty.call(this, key)) continue;
                if (this[key] === props[prop]) continue;
                this[key] = props[prop];
                updated = true;
              }
              if (updated) this.triggerEvent();
            }
            /**
             * The `set` method sets one or more properties on the model.
             *
             * @param {keyof ReactiveModelPublic<T>} property - The name of the property to set.
             * @param {*} value - The value to set the property to.
             * @returns {void}
             */
            getProperties() {
              const props = {};
              Object.keys(this).forEach(property => {
                if (property.startsWith("#")) {
                  props[property.replace("#", "")] = this[property];
                }
              });
              return props;
            }
          }
          exports.ReactiveModel = ReactiveModel;
          __decorate([(0, _property.reactiveProps)(["fetching", "fetched", "processing", "processed", "loaded", "ready"])], ReactiveModel.prototype, "fetching", void 0);
        }
      });

      /**************************
      INTERNAL MODULE: ./property
      **************************/

      ims.set('./property', {
        hash: 2665429696,
        creator: function (require, exports) {
          "use strict";

          Object.defineProperty(exports, "__esModule", {
            value: true
          });
          exports.reactiveProp = reactiveProp;
          exports.reactiveProps = reactiveProps;
          /*bundle */
          function reactiveProp(target, propKey) {
            let val = target[propKey];
            Object.defineProperty(target, propKey, {
              get() {
                return val;
              },
              set(newVal) {
                if (newVal === val) return;
                val = newVal;
                target.triggerEvent();
              },
              enumerable: true,
              configurable: true
            });
          }
          /*bundle */
          function reactiveProps(props) {
            return function (target, propKey) {
              if (!props.includes(propKey)) return;
              reactiveProp(target, propKey);
            };
          }
        }
      });
      __pkg.exports.descriptor = [{
        "im": "./index",
        "from": "ReactiveModel",
        "name": "ReactiveModel"
      }, {
        "im": "./property",
        "from": "reactiveProp",
        "name": "reactiveProp"
      }, {
        "im": "./property",
        "from": "reactiveProps",
        "name": "reactiveProps"
      }];
      // Module exports
      __pkg.exports.process = function ({
        require,
        prop,
        value
      }) {
        (require || prop === 'ReactiveModel') && _export("ReactiveModel", ReactiveModel = require ? require('./index').ReactiveModel : value);
        (require || prop === 'reactiveProp') && _export("reactiveProp", reactiveProp = require ? require('./property').reactiveProp : value);
        (require || prop === 'reactiveProps') && _export("reactiveProps", reactiveProps = require ? require('./property').reactiveProps : value);
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
//# sourceMappingURL=model.sjs.js.map