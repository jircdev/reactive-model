System.register(["@beyond-js/kernel@0.1.9/bundle", "@beyond-js/events@0.0.6/events"], function (_export, _context) {
  "use strict";

  var dependency_0, dependency_1, bimport, __Bundle, __pkg, ims, ReactiveModel, reactiveProp, reactiveProps, __beyond_pkg, hmr;
  _export({
    ReactiveModel: void 0,
    reactiveProp: void 0,
    reactiveProps: void 0
  });
  return {
    setters: [function (_beyondJsKernel019Bundle) {
      dependency_0 = _beyondJsKernel019Bundle;
    }, function (_beyondJsEvents006Events) {
      dependency_1 = _beyondJsEvents006Events;
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
        hash: 192738134,
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
            localdb = false;
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
            load(id) {
              console.log(10, "cargamos", this.localdb);
              // const db = DBManager.
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
        this.on = (event, listener) => __pkg.hmr.on(event, listener);
        this.off = (event, listener) => __pkg.hmr.off(event, listener);
      }());
      __pkg.initialise(ims);
    }
  };
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfZXZlbnRzIiwicmVxdWlyZSIsIl9wcm9wZXJ0eSIsIlJlYWN0aXZlTW9kZWwiLCJFdmVudHMiLCJzY2hlbWEiLCJmZXRjaGluZyIsImZldGNoZWQiLCJwcm9jZXNzaW5nIiwicmVhZHkiLCJwcm9jZXNzZWQiLCJsb2NhbGRiIiwicHJvcGVydGllcyIsImxvYWRlZCIsInRyaWdnZXJFdmVudCIsImV2ZW50IiwidHJpZ2dlciIsInNldCIsInByb3BlcnR5IiwidmFsdWUiLCJwcm9wcyIsInVuZGVmaW5lZCIsInVwZGF0ZWQiLCJwcm9wIiwia2V5IiwiT2JqZWN0IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiZ2V0UHJvcGVydGllcyIsImtleXMiLCJmb3JFYWNoIiwic3RhcnRzV2l0aCIsInJlcGxhY2UiLCJsb2FkIiwiaWQiLCJjb25zb2xlIiwibG9nIiwiZXhwb3J0cyIsIl9fZGVjb3JhdGUiLCJyZWFjdGl2ZVByb3BzIiwicmVhY3RpdmVQcm9wIiwidGFyZ2V0IiwicHJvcEtleSIsInZhbCIsImRlZmluZVByb3BlcnR5IiwiZ2V0IiwibmV3VmFsIiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsImluY2x1ZGVzIl0sInNvdXJjZXMiOlsiL2luZGV4LnRzIiwiL3Byb3BlcnR5LnRzIl0sInNvdXJjZXNDb250ZW50IjpbbnVsbCxudWxsXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VBQUEsSUFBQUEsT0FBQSxHQUFBQyxPQUFBO1VBQ0EsSUFBQUMsU0FBQSxHQUFBRCxPQUFBOzs7Ozs7OztVQTRCTyxXQVJQOzs7Ozs7OztVQVFpQixNQUNGRSxhQUFpQixTQUFRSCxPQUFBLENBQUFJLE1BQU07WUFDbkNDLE1BQU07WUFJaEJDLFFBQVE7WUFDUkMsT0FBTyxHQUFZLEtBQUs7WUFDeEJDLFVBQVUsR0FBWSxLQUFLO1lBQzNCQyxLQUFLLEdBQVksS0FBSztZQUN0QkMsU0FBUyxH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