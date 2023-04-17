System.register(["@beyond-js/kernel@0.1.9/bundle", "@beyond-js/kernel@0.1.9/transversals", "@beyond-js/widgets@0.1.4/render", "@beyond-js/reactive@0.0.3/database"], function (_export, _context) {
  "use strict";

  var dependency_0, dependency_1, dependency_2, dependency_3, Transversal, __beyond_transversal, widgets, bundles;
  return {
    setters: [function (_beyondJsKernel019Bundle) {
      dependency_0 = _beyondJsKernel019Bundle;
    }, function (_beyondJsKernel019Transversals) {
      dependency_1 = _beyondJsKernel019Transversals;
    }, function (_beyondJsWidgets014Render) {
      dependency_2 = _beyondJsWidgets014Render;
    }, function (_beyondJsReactive003Database) {
      dependency_3 = _beyondJsReactive003Database;
    }],
    execute: function () {
      ({
        Transversal
      } = brequire('@beyond-js/kernel/transversals'));
      _export("__beyond_transversal", __beyond_transversal = new Transversal('start', ''));
      __beyond_transversal.dependencies.update([['@beyond-js/kernel/transversals', dependency_1], ['@beyond-js/widgets/render', dependency_2], ['@beyond-js/reactive/database', dependency_3]]);

      /*************
      BUNDLE: WIDGET
      *************/
      ({
        widgets
      } = brequire('@beyond-js/widgets/render'));
      widgets.register([{
        "name": "main-layout",
        "vspecifier": "@beyond-js/reactive@0.0.3/layout/main",
        "is": "layout"
      }, {
        "name": "home-page",
        "vspecifier": "@beyond-js/reactive@0.0.3/home",
        "is": "page",
        "route": "/"
      }]);
      bundles = [];
      /**************************************
      MODULE: @beyond-js/reactive/register-db
      **************************************/
      bundles.push([{
        "module": {
          "vspecifier": "@beyond-js/reactive@0.0.3/register-db"
        },
        "type": "start"
      }, function (ims, exports) {
        const bimport = specifier => {
          const dependencies = new Map([["@beyond-js/events", "0.0.6"], ["@beyond-js/kernel", "0.1.9"], ["@beyond-js/local", "0.1.3"], ["@beyond-js/react-18-widgets", "0.0.5"], ["ajv", "8.12.0"], ["dexie", "3.2.3"], ["socket.io-client", "4.6.1"], ["@beyond-js/reactive", "0.0.3"], ["@beyond-js/reactive", "0.0.3"]]);
          return globalThis.bimport(globalThis.bimport.resolve(specifier, dependencies));
        };
        /***********************
        INTERNAL MODULE: ./start
        ***********************/

        ims.set('./start', {
          hash: 3787638985,
          creator: function (require, exports) {
            "use strict";

            var _database = require("@beyond-js/reactive/database");
            console.log(103223);
            async function create() {
              try {
                const db = await _database.DBManager.config("test@1", {
                  user: "id, name, lastname"
                });
                const users = [];
                for (let i = 1; i <= 20; i++) {
                  users.push({
                    id: i,
                    name: `User ${i}`,
                    lastname: `Lastname ${i}`
                  });
                  //db.user.add(newUser);
                }
                // db.user.bulkAdd(users);
              } catch (e) {
                console.trace("error", e);
              }
            }
            create();
          }
        });
        return {
          dependencies: ['@beyond-js/reactive/database']
        };
      }]);
      __beyond_transversal.initialise(bundles);
    }
  };
});