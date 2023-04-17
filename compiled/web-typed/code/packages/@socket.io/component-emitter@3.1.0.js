System.register([], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["@socket.io/component-emitter","3.1.0"]]);
	return globalThis.bimport(globalThis.bimport.resolve(specifier, dependencies));
};


var dependencies = new Map();
var require = dependency => dependencies.get(dependency);
return {
setters: [],
execute: function() {
// Prevent esbuild from considering the context to be amd
const define = void 0;
const module = {};

const code = (module, require) => {
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all) __defProp(target, name, {
    get: all[name],
    enumerable: true
  });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from)) if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
      get: () => from[key],
      enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
    });
  }
  return to;
};
var __toCommonJS = mod => __copyProps(__defProp({}, "__esModule", {
  value: true
}), mod);

// .beyond/uimport/temp/@socket.io/component-emitter.3.1.0.js
var component_emitter_3_1_0_exports = {};
__export(component_emitter_3_1_0_exports, {
  Emitter: () => Emitter
});
module.exports = __toCommonJS(component_emitter_3_1_0_exports);

// node_modules/@socket.io/component-emitter/index.mjs
function Emitter(obj) {
  if (obj) return mixin(obj);
}
function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}
Emitter.prototype.on = Emitter.prototype.addEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
  return this;
};
Emitter.prototype.once = function (event, fn) {
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }
  on.fn = fn;
  this.on(event, on);
  return this;
};
Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function (event, fn) {
  this._callbacks = this._callbacks || {};
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }
  var callbacks = this._callbacks["$" + event];
  if (!callbacks) return this;
  if (1 == arguments.length) {
    delete this._callbacks["$" + event];
    return this;
  }
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  if (callbacks.length === 0) {
    delete this._callbacks["$" + event];
  }
  return this;
};
Emitter.prototype.emit = function (event) {
  this._callbacks = this._callbacks || {};
  var args = new Array(arguments.length - 1),
    callbacks = this._callbacks["$" + event];
  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }
  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }
  return this;
};
Emitter.prototype.emitReserved = Emitter.prototype.emit;
Emitter.prototype.listeners = function (event) {
  this._callbacks = this._callbacks || {};
  return this._callbacks["$" + event] || [];
};
Emitter.prototype.hasListeners = function (event) {
  return !!this.listeners(event).length;
};
};

code(module, require);
_exports(module.exports);
}}});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL0Bzb2NrZXQuaW8vY29tcG9uZW50LWVtaXR0ZXIuMy4xLjAuanMiLCIuLi9ub2RlX21vZHVsZXMvQHNvY2tldC5pby9jb21wb25lbnQtZW1pdHRlci9pbmRleC5tanMiXSwibmFtZXMiOlsiY29tcG9uZW50X2VtaXR0ZXJfM18xXzBfZXhwb3J0cyIsIl9fZXhwb3J0IiwiRW1pdHRlciIsIm1vZHVsZSIsImV4cG9ydHMiLCJfX3RvQ29tbW9uSlMiLCJvYmoiLCJtaXhpbiIsImtleSIsInByb3RvdHlwZSIsIm9uIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiZm4iLCJfY2FsbGJhY2tzIiwicHVzaCIsIm9uY2UiLCJvZmYiLCJhcHBseSIsImFyZ3VtZW50cyIsInJlbW92ZUxpc3RlbmVyIiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImxlbmd0aCIsImNhbGxiYWNrcyIsImNiIiwiaSIsInNwbGljZSIsImVtaXQiLCJhcmdzIiwiQXJyYXkiLCJzbGljZSIsImxlbiIsImVtaXRSZXNlcnZlZCIsImxpc3RlbmVycyIsImhhc0xpc3RlbmVycyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsK0JBQUE7QUFBQUMsUUFBQSxDQUFBRCwrQkFBQTtFQUFBRSxPQUFBLEVBQUFBLENBQUEsS0FBQUE7QUFBQTtBQUFBQyxNQUFBLENBQUFDLE9BQUEsR0FBQUMsWUFBQSxDQUFBTCwrQkFBQTs7O0FDTU8sU0FBU0UsUUFBUUksR0FBQSxFQUFLO0VBQzNCLElBQUlBLEdBQUEsRUFBSyxPQUFPQyxLQUFBLENBQU1ELEdBQUc7QUFDM0I7QUFVQSxTQUFTQyxNQUFNRCxHQUFBLEVBQUs7RUFDbEIsU0FBU0UsR0FBQSxJQUFPTixPQUFBLENBQVFPLFNBQUEsRUFBVztJQUNqQ0gsR0FBQSxDQUFJRSxHQUFBLElBQU9OLE9BQUEsQ0FBUU8sU0FBQSxDQUFVRCxHQUFBO0VBQy9CO0VBQ0EsT0FBT0YsR0FBQTtBQUNUO0FBV0FKLE9BQUEsQ0FBUU8sU0FBQSxDQUFVQyxFQUFBLEdBQ2xCUixPQUFBLENBQVFPLFNBQUEsQ0FBVUUsZ0JBQUEsR0FBbUIsVUFBU0MsS0FBQSxFQUFPQyxFQUFBLEVBQUc7RUFDdEQsS0FBS0MsVUFBQSxHQUFhLEtBQUtBLFVBQUEsSUFBYyxDQUFDO0VBQ3RDLENBQUMsS0FBS0EsVUFBQSxDQUFXLE1BQU1GLEtBQUEsSUFBUyxLQUFLRSxVQUFBLENBQVcsTUFBTUYsS0FBQSxLQUFVLEVBQUMsRUFDOURHLElBQUEsQ0FBS0YsRUFBRTtFQUNWLE9BQU87QUFDVDtBQVlBWCxPQUFBLENBQVFPLFNBQUEsQ0FBVU8sSUFBQSxHQUFPLFVBQVNKLEtBQUEsRUFBT0MsRUFBQSxFQUFHO0VBQzFDLFNBQVNILEdBQUEsRUFBSztJQUNaLEtBQUtPLEdBQUEsQ0FBSUwsS0FBQSxFQUFPRixFQUFFO0lBQ2xCRyxFQUFBLENBQUdLLEtBQUEsQ0FBTSxNQUFNQyxTQUFTO0VBQzFCO0VBRUFULEVBQUEsQ0FBR0csRUFBQSxHQUFLQSxFQUFBO0VBQ1IsS0FBS0gsRUFBQSxDQUFHRSxLQUFBLEVBQU9GLEVBQUU7RUFDakIsT0FBTztBQUNUO0FBWUFSLE9BQUEsQ0FBUU8sU0FBQSxDQUFVUSxHQUFBLEdBQ2xCZixPQUFBLENBQVFPLFNBQUEsQ0FBVVcsY0FBQSxHQUNsQmxCLE9BQUEsQ0FBUU8sU0FBQSxDQUFVWSxrQkFBQSxHQUNsQm5CLE9BQUEsQ0FBUU8sU0FBQSxDQUFVYSxtQkFBQSxHQUFzQixVQUFTVixLQUFBLEVBQU9DLEVBQUEsRUFBRztFQUN6RCxLQUFLQyxVQUFBLEdBQWEsS0FBS0EsVUFBQSxJQUFjLENBQUM7RUFHdEMsSUFBSSxLQUFLSyxTQUFBLENBQVVJLE1BQUEsRUFBUTtJQUN6QixLQUFLVCxVQUFBLEdBQWEsQ0FBQztJQUNuQixPQUFPO0VBQ1Q7RUFHQSxJQUFJVSxTQUFBLEdBQVksS0FBS1YsVUFBQSxDQUFXLE1BQU1GLEtBQUE7RUFDdEMsSUFBSSxDQUFDWSxTQUFBLEVBQVcsT0FBTztFQUd2QixJQUFJLEtBQUtMLFNBQUEsQ0FBVUksTUFBQSxFQUFRO0lBQ3pCLE9BQU8sS0FBS1QsVUFBQSxDQUFXLE1BQU1GLEtBQUE7SUFDN0IsT0FBTztFQUNUO0VBR0EsSUFBSWEsRUFBQTtFQUNKLFNBQVNDLENBQUEsR0FBSSxHQUFHQSxDQUFBLEdBQUlGLFNBQUEsQ0FBVUQsTUFBQSxFQUFRRyxDQUFBLElBQUs7SUFDekNELEVBQUEsR0FBS0QsU0FBQSxDQUFVRSxDQUFBO0lBQ2YsSUFBSUQsRUFBQSxLQUFPWixFQUFBLElBQU1ZLEVBQUEsQ0FBR1osRUFBQSxLQUFPQSxFQUFBLEVBQUk7TUFDN0JXLFNBQUEsQ0FBVUcsTUFBQSxDQUFPRCxDQUFBLEVBQUcsQ0FBQztNQUNyQjtJQUNGO0VBQ0Y7RUFJQSxJQUFJRixTQUFBLENBQVVELE1BQUEsS0FBVyxHQUFHO0lBQzFCLE9BQU8sS0FBS1QsVUFBQSxDQUFXLE1BQU1GLEtBQUE7RUFDL0I7RUFFQSxPQUFPO0FBQ1Q7QUFVQVYsT0FBQSxDQUFRTyxTQUFBLENBQVVtQixJQUFBLEdBQU8sVUFBU2hCLEtBQUEsRUFBTTtFQUN0QyxLQUFLRSxVQUFBLEdBQWEsS0FBS0EsVUFBQSxJQUFjLENBQUM7RUFFdEMsSUFBSWUsSUFBQSxHQUFPLElBQUlDLEtBQUEsQ0FBTVgsU0FBQSxDQUFVSSxNQUFBLEdBQVMsQ0FBQztJQUNyQ0MsU0FBQSxHQUFZLEtBQUtWLFVBQUEsQ0FBVyxNQUFNRixLQUFBO0VBRXRDLFNBQVNjLENBQUEsR0FBSSxHQUFHQSxDQUFBLEdBQUlQLFNBQUEsQ0FBVUksTUFBQSxFQUFRRyxDQUFBLElBQUs7SUFDekNHLElBQUEsQ0FBS0gsQ0FBQSxHQUFJLEtBQUtQLFNBQUEsQ0FBVU8sQ0FBQTtFQUMxQjtFQUVBLElBQUlGLFNBQUEsRUFBVztJQUNiQSxTQUFBLEdBQVlBLFNBQUEsQ0FBVU8sS0FBQSxDQUFNLENBQUM7SUFDN0IsU0FBU0wsQ0FBQSxHQUFJLEdBQUdNLEdBQUEsR0FBTVIsU0FBQSxDQUFVRCxNQUFBLEVBQVFHLENBQUEsR0FBSU0sR0FBQSxFQUFLLEVBQUVOLENBQUEsRUFBRztNQUNwREYsU0FBQSxDQUFVRSxDQUFBLEVBQUdSLEtBQUEsQ0FBTSxNQUFNVyxJQUFJO0lBQy9CO0VBQ0Y7RUFFQSxPQUFPO0FBQ1Q7QUFHQTNCLE9BQUEsQ0FBUU8sU0FBQSxDQUFVd0IsWUFBQSxHQUFlL0IsT0FBQSxDQUFRTyxTQUFBLENBQVVtQixJQUFBO0FBVW5EMUIsT0FBQSxDQUFRTyxTQUFBLENBQVV5QixTQUFBLEdBQVksVUFBU3RCLEtBQUEsRUFBTTtFQUMzQyxLQUFLRSxVQUFBLEdBQWEsS0FBS0EsVUFBQSxJQUFjLENBQUM7RUFDdEMsT0FBTyxLQUFLQSxVQUFBLENBQVcsTUFBTUYsS0FBQSxLQUFVLEVBQUM7QUFDMUM7QUFVQVYsT0FBQSxDQUFRTyxTQUFBLENBQVUwQixZQUFBLEdBQWUsVUFBU3ZCLEtBQUEsRUFBTTtFQUM5QyxPQUFPLENBQUMsQ0FBRSxLQUFLc0IsU0FBQSxDQUFVdEIsS0FBSyxFQUFFVyxNQUFBO0FBQ2xDIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvcmVhY3RpdmUtbW9kZWwvb3V0In0=