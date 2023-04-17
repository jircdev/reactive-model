System.register([], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["dexie","3.2.3"]]);
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

// .beyond/uimport/temp/dexie.3.2.3.js
var dexie_3_2_3_exports = {};
__export(dexie_3_2_3_exports, {
  Dexie: () => Dexie$1,
  RangeSet: () => RangeSet,
  default: () => dexie_3_2_3_default,
  liveQuery: () => liveQuery,
  mergeRanges: () => mergeRanges,
  rangesOverlap: () => rangesOverlap
});
module.exports = __toCommonJS(dexie_3_2_3_exports);

// node_modules/dexie/dist/modern/dexie.mjs
var _global = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
var keys = Object.keys;
var isArray = Array.isArray;
if (typeof Promise !== "undefined" && !_global.Promise) {
  _global.Promise = Promise;
}
function extend(obj, extension) {
  if (typeof extension !== "object") return obj;
  keys(extension).forEach(function (key) {
    obj[key] = extension[key];
  });
  return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
  return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
  if (typeof extension === "function") extension = extension(getProto(proto));
  (typeof Reflect === "undefined" ? keys : Reflect.ownKeys)(extension).forEach(key => {
    setProp(proto, key, extension[key]);
  });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
  defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === "function" ? {
    get: functionOrGetSet.get,
    set: functionOrGetSet.set,
    configurable: true
  } : {
    value: functionOrGetSet,
    configurable: true,
    writable: true
  }, options));
}
function derive(Child) {
  return {
    from: function (Parent) {
      Child.prototype = Object.create(Parent.prototype);
      setProp(Child.prototype, "constructor", Child);
      return {
        extend: props.bind(null, Child.prototype)
      };
    }
  };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
  const pd = getOwnPropertyDescriptor(obj, prop);
  let proto;
  return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
  return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
  return overridedFactory(origFunc);
}
function assert(b) {
  if (!b) throw new Error("Assertion Failed");
}
function asap$1(fn) {
  if (_global.setImmediate) setImmediate(fn);else setTimeout(fn, 0);
}
function arrayToObject(array, extractor) {
  return array.reduce((result, item, i) => {
    var nameAndValue = extractor(item, i);
    if (nameAndValue) result[nameAndValue[0]] = nameAndValue[1];
    return result;
  }, {});
}
function tryCatch(fn, onerror, args) {
  try {
    fn.apply(null, args);
  } catch (ex) {
    onerror && onerror(ex);
  }
}
function getByKeyPath(obj, keyPath) {
  if (hasOwn(obj, keyPath)) return obj[keyPath];
  if (!keyPath) return obj;
  if (typeof keyPath !== "string") {
    var rv = [];
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      var val = getByKeyPath(obj, keyPath[i]);
      rv.push(val);
    }
    return rv;
  }
  var period = keyPath.indexOf(".");
  if (period !== -1) {
    var innerObj = obj[keyPath.substr(0, period)];
    return innerObj === void 0 ? void 0 : getByKeyPath(innerObj, keyPath.substr(period + 1));
  }
  return void 0;
}
function setByKeyPath(obj, keyPath, value) {
  if (!obj || keyPath === void 0) return;
  if ("isFrozen" in Object && Object.isFrozen(obj)) return;
  if (typeof keyPath !== "string" && "length" in keyPath) {
    assert(typeof value !== "string" && "length" in value);
    for (var i = 0, l = keyPath.length; i < l; ++i) {
      setByKeyPath(obj, keyPath[i], value[i]);
    }
  } else {
    var period = keyPath.indexOf(".");
    if (period !== -1) {
      var currentKeyPath = keyPath.substr(0, period);
      var remainingKeyPath = keyPath.substr(period + 1);
      if (remainingKeyPath === "") {
        if (value === void 0) {
          if (isArray(obj) && !isNaN(parseInt(currentKeyPath))) obj.splice(currentKeyPath, 1);else delete obj[currentKeyPath];
        } else obj[currentKeyPath] = value;
      } else {
        var innerObj = obj[currentKeyPath];
        if (!innerObj || !hasOwn(obj, currentKeyPath)) innerObj = obj[currentKeyPath] = {};
        setByKeyPath(innerObj, remainingKeyPath, value);
      }
    } else {
      if (value === void 0) {
        if (isArray(obj) && !isNaN(parseInt(keyPath))) obj.splice(keyPath, 1);else delete obj[keyPath];
      } else obj[keyPath] = value;
    }
  }
}
function delByKeyPath(obj, keyPath) {
  if (typeof keyPath === "string") setByKeyPath(obj, keyPath, void 0);else if ("length" in keyPath) [].map.call(keyPath, function (kp) {
    setByKeyPath(obj, kp, void 0);
  });
}
function shallowClone(obj) {
  var rv = {};
  for (var m in obj) {
    if (hasOwn(obj, m)) rv[m] = obj[m];
  }
  return rv;
}
var concat = [].concat;
function flatten(a) {
  return concat.apply([], a);
}
var intrinsicTypeNames = "Boolean,String,Date,RegExp,Blob,File,FileList,FileSystemFileHandle,ArrayBuffer,DataView,Uint8ClampedArray,ImageBitmap,ImageData,Map,Set,CryptoKey".split(",").concat(flatten([8, 16, 32, 64].map(num => ["Int", "Uint", "Float"].map(t => t + num + "Array")))).filter(t => _global[t]);
var intrinsicTypes = intrinsicTypeNames.map(t => _global[t]);
arrayToObject(intrinsicTypeNames, x => [x, true]);
var circularRefs = null;
function deepClone(any) {
  circularRefs = typeof WeakMap !== "undefined" && /* @__PURE__ */new WeakMap();
  const rv = innerDeepClone(any);
  circularRefs = null;
  return rv;
}
function innerDeepClone(any) {
  if (!any || typeof any !== "object") return any;
  let rv = circularRefs && circularRefs.get(any);
  if (rv) return rv;
  if (isArray(any)) {
    rv = [];
    circularRefs && circularRefs.set(any, rv);
    for (var i = 0, l = any.length; i < l; ++i) {
      rv.push(innerDeepClone(any[i]));
    }
  } else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
    rv = any;
  } else {
    const proto = getProto(any);
    rv = proto === Object.prototype ? {} : Object.create(proto);
    circularRefs && circularRefs.set(any, rv);
    for (var prop in any) {
      if (hasOwn(any, prop)) {
        rv[prop] = innerDeepClone(any[prop]);
      }
    }
  }
  return rv;
}
var {
  toString
} = {};
function toStringTag(o) {
  return toString.call(o).slice(8, -1);
}
var iteratorSymbol = typeof Symbol !== "undefined" ? Symbol.iterator : "@@iterator";
var getIteratorOf = typeof iteratorSymbol === "symbol" ? function (x) {
  var i;
  return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function () {
  return null;
};
var NO_CHAR_ARRAY = {};
function getArrayOf(arrayLike) {
  var i, a, x, it;
  if (arguments.length === 1) {
    if (isArray(arrayLike)) return arrayLike.slice();
    if (this === NO_CHAR_ARRAY && typeof arrayLike === "string") return [arrayLike];
    if (it = getIteratorOf(arrayLike)) {
      a = [];
      while (x = it.next(), !x.done) a.push(x.value);
      return a;
    }
    if (arrayLike == null) return [arrayLike];
    i = arrayLike.length;
    if (typeof i === "number") {
      a = new Array(i);
      while (i--) a[i] = arrayLike[i];
      return a;
    }
    return [arrayLike];
  }
  i = arguments.length;
  a = new Array(i);
  while (i--) a[i] = arguments[i];
  return a;
}
var isAsyncFunction = typeof Symbol !== "undefined" ? fn => fn[Symbol.toStringTag] === "AsyncFunction" : () => false;
var debug = typeof location !== "undefined" && /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
  debug = value;
  libraryFilter = filter;
}
var libraryFilter = () => true;
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
  if (NEEDS_THROW_FOR_STACK) try {
    getErrorWithStack.arguments;
    throw new Error();
  } catch (e) {
    return e;
  }
  return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
  var stack = exception.stack;
  if (!stack) return "";
  numIgnoredFrames = numIgnoredFrames || 0;
  if (stack.indexOf(exception.name) === 0) numIgnoredFrames += (exception.name + exception.message).split("\n").length;
  return stack.split("\n").slice(numIgnoredFrames).filter(libraryFilter).map(frame => "\n" + frame).join("");
}
var dexieErrorNames = ["Modify", "Bulk", "OpenFailed", "VersionChange", "Schema", "Upgrade", "InvalidTable", "MissingAPI", "NoSuchDatabase", "InvalidArgument", "SubTransaction", "Unsupported", "Internal", "DatabaseClosed", "PrematureCommit", "ForeignAwait"];
var idbDomErrorNames = ["Unknown", "Constraint", "Data", "TransactionInactive", "ReadOnly", "Version", "NotFound", "InvalidState", "InvalidAccess", "Abort", "Timeout", "QuotaExceeded", "Syntax", "DataClone"];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
  VersionChanged: "Database version changed by other database connection",
  DatabaseClosed: "Database has been closed",
  Abort: "Transaction aborted",
  TransactionInactive: "Transaction has already completed or failed",
  MissingAPI: "IndexedDB API missing. Please visit https://tinyurl.com/y2uuvskb"
};
function DexieError(name, msg) {
  this._e = getErrorWithStack();
  this.name = name;
  this.message = msg;
}
derive(DexieError).from(Error).extend({
  stack: {
    get: function () {
      return this._stack || (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
    }
  },
  toString: function () {
    return this.name + ": " + this.message;
  }
});
function getMultiErrorMessage(msg, failures) {
  return msg + ". Errors: " + Object.keys(failures).map(key => failures[key].toString()).filter((v, i, s) => s.indexOf(v) === i).join("\n");
}
function ModifyError(msg, failures, successCount, failedKeys) {
  this._e = getErrorWithStack();
  this.failures = failures;
  this.failedKeys = failedKeys;
  this.successCount = successCount;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
  this._e = getErrorWithStack();
  this.name = "BulkError";
  this.failures = Object.keys(failures).map(pos => failures[pos]);
  this.failuresByPos = failures;
  this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
var errnames = errorList.reduce((obj, name) => (obj[name] = name + "Error", obj), {});
var BaseException = DexieError;
var exceptions = errorList.reduce((obj, name) => {
  var fullName = name + "Error";
  function DexieError2(msgOrInner, inner) {
    this._e = getErrorWithStack();
    this.name = fullName;
    if (!msgOrInner) {
      this.message = defaultTexts[name] || fullName;
      this.inner = null;
    } else if (typeof msgOrInner === "string") {
      this.message = `${msgOrInner}${!inner ? "" : "\n " + inner}`;
      this.inner = inner || null;
    } else if (typeof msgOrInner === "object") {
      this.message = `${msgOrInner.name} ${msgOrInner.message}`;
      this.inner = msgOrInner;
    }
  }
  derive(DexieError2).from(BaseException);
  obj[name] = DexieError2;
  return obj;
}, {});
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce((obj, name) => {
  obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
function mapError(domError, message) {
  if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name]) return domError;
  var rv = new exceptionMap[domError.name](message || domError.message, domError);
  if ("stack" in domError) {
    setProp(rv, "stack", {
      get: function () {
        return this.inner.stack;
      }
    });
  }
  return rv;
}
var fullNameExceptions = errorList.reduce((obj, name) => {
  if (["Syntax", "Type", "Range"].indexOf(name) === -1) obj[name + "Error"] = exceptions[name];
  return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;
function nop() {}
function mirror(val) {
  return val;
}
function pureFunctionChain(f1, f2) {
  if (f1 == null || f1 === mirror) return f2;
  return function (val) {
    return f2(f1(val));
  };
}
function callBoth(on1, on2) {
  return function () {
    on1.apply(this, arguments);
    on2.apply(this, arguments);
  };
}
function hookCreatingChain(f1, f2) {
  if (f1 === nop) return f2;
  return function () {
    var res = f1.apply(this, arguments);
    if (res !== void 0) arguments[0] = res;
    var onsuccess = this.onsuccess,
      onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess) this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror) this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res2 !== void 0 ? res2 : res;
  };
}
function hookDeletingChain(f1, f2) {
  if (f1 === nop) return f2;
  return function () {
    f1.apply(this, arguments);
    var onsuccess = this.onsuccess,
      onerror = this.onerror;
    this.onsuccess = this.onerror = null;
    f2.apply(this, arguments);
    if (onsuccess) this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror) this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
  };
}
function hookUpdatingChain(f1, f2) {
  if (f1 === nop) return f2;
  return function (modifications) {
    var res = f1.apply(this, arguments);
    extend(modifications, res);
    var onsuccess = this.onsuccess,
      onerror = this.onerror;
    this.onsuccess = null;
    this.onerror = null;
    var res2 = f2.apply(this, arguments);
    if (onsuccess) this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
    if (onerror) this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    return res === void 0 ? res2 === void 0 ? void 0 : res2 : extend(res, res2);
  };
}
function reverseStoppableEventChain(f1, f2) {
  if (f1 === nop) return f2;
  return function () {
    if (f2.apply(this, arguments) === false) return false;
    return f1.apply(this, arguments);
  };
}
function promisableChain(f1, f2) {
  if (f1 === nop) return f2;
  return function () {
    var res = f1.apply(this, arguments);
    if (res && typeof res.then === "function") {
      var thiz = this,
        i = arguments.length,
        args = new Array(i);
      while (i--) args[i] = arguments[i];
      return res.then(function () {
        return f2.apply(thiz, args);
      });
    }
    return f2.apply(this, arguments);
  };
}
var INTERNAL = {};
var LONG_STACKS_CLIP_LIMIT = 100,
  MAX_LONG_STACKS = 20,
  ZONE_ECHO_LIMIT = 100,
  [resolvedNativePromise, nativePromiseProto, resolvedGlobalPromise] = typeof Promise === "undefined" ? [] : (() => {
    let globalP = Promise.resolve();
    if (typeof crypto === "undefined" || !crypto.subtle) return [globalP, getProto(globalP), globalP];
    const nativeP = crypto.subtle.digest("SHA-512", new Uint8Array([0]));
    return [nativeP, getProto(nativeP), globalP];
  })(),
  nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
var schedulePhysicalTick = resolvedGlobalPromise ? () => {
  resolvedGlobalPromise.then(physicalTick);
} : _global.setImmediate ? setImmediate.bind(null, physicalTick) : _global.MutationObserver ? () => {
  var hiddenDiv = document.createElement("div");
  new MutationObserver(() => {
    physicalTick();
    hiddenDiv = null;
  }).observe(hiddenDiv, {
    attributes: true
  });
  hiddenDiv.setAttribute("i", "1");
} : () => {
  setTimeout(physicalTick, 0);
};
var asap = function (callback, args) {
  microtickQueue.push([callback, args]);
  if (needsNewPhysicalTick) {
    schedulePhysicalTick();
    needsNewPhysicalTick = false;
  }
};
var isOutsideMicroTick = true,
  needsNewPhysicalTick = true,
  unhandledErrors = [],
  rejectingErrors = [],
  currentFulfiller = null,
  rejectionMapper = mirror;
var globalPSD = {
  id: "global",
  global: true,
  ref: 0,
  unhandleds: [],
  onunhandled: globalError,
  pgp: false,
  env: {},
  finalize: function () {
    this.unhandleds.forEach(uh => {
      try {
        globalError(uh[0], uh[1]);
      } catch (e) {}
    });
  }
};
var PSD = globalPSD;
var microtickQueue = [];
var numScheduledCalls = 0;
var tickFinalizers = [];
function DexiePromise(fn) {
  if (typeof this !== "object") throw new TypeError("Promises must be constructed via new");
  this._listeners = [];
  this.onuncatched = nop;
  this._lib = false;
  var psd = this._PSD = PSD;
  if (debug) {
    this._stackHolder = getErrorWithStack();
    this._prev = null;
    this._numPrev = 0;
  }
  if (typeof fn !== "function") {
    if (fn !== INTERNAL) throw new TypeError("Not a function");
    this._state = arguments[1];
    this._value = arguments[2];
    if (this._state === false) handleRejection(this, this._value);
    return;
  }
  this._state = null;
  this._value = null;
  ++psd.ref;
  executePromiseTask(this, fn);
}
var thenProp = {
  get: function () {
    var psd = PSD,
      microTaskId = totalEchoes;
    function then(onFulfilled, onRejected) {
      var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
      const cleanup = possibleAwait && !decrementExpectedAwaits();
      var rv = new DexiePromise((resolve, reject) => {
        propagateToListener(this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait, cleanup), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait, cleanup), resolve, reject, psd));
      });
      debug && linkToPreviousPromise(rv, this);
      return rv;
    }
    then.prototype = INTERNAL;
    return then;
  },
  set: function (value) {
    setProp(this, "then", value && value.prototype === INTERNAL ? thenProp : {
      get: function () {
        return value;
      },
      set: thenProp.set
    });
  }
};
props(DexiePromise.prototype, {
  then: thenProp,
  _then: function (onFulfilled, onRejected) {
    propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
  },
  catch: function (onRejected) {
    if (arguments.length === 1) return this.then(null, onRejected);
    var type2 = arguments[0],
      handler = arguments[1];
    return typeof type2 === "function" ? this.then(null, err => err instanceof type2 ? handler(err) : PromiseReject(err)) : this.then(null, err => err && err.name === type2 ? handler(err) : PromiseReject(err));
  },
  finally: function (onFinally) {
    return this.then(value => {
      onFinally();
      return value;
    }, err => {
      onFinally();
      return PromiseReject(err);
    });
  },
  stack: {
    get: function () {
      if (this._stack) return this._stack;
      try {
        stack_being_generated = true;
        var stacks = getStack(this, [], MAX_LONG_STACKS);
        var stack = stacks.join("\nFrom previous: ");
        if (this._state !== null) this._stack = stack;
        return stack;
      } finally {
        stack_being_generated = false;
      }
    }
  },
  timeout: function (ms, msg) {
    return ms < Infinity ? new DexiePromise((resolve, reject) => {
      var handle = setTimeout(() => reject(new exceptions.Timeout(msg)), ms);
      this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
    }) : this;
  }
});
if (typeof Symbol !== "undefined" && Symbol.toStringTag) setProp(DexiePromise.prototype, Symbol.toStringTag, "Dexie.Promise");
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
  this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
  this.onRejected = typeof onRejected === "function" ? onRejected : null;
  this.resolve = resolve;
  this.reject = reject;
  this.psd = zone;
}
props(DexiePromise, {
  all: function () {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(function (resolve, reject) {
      if (values.length === 0) resolve([]);
      var remaining = values.length;
      values.forEach((a, i) => DexiePromise.resolve(a).then(x => {
        values[i] = x;
        if (! --remaining) resolve(values);
      }, reject));
    });
  },
  resolve: value => {
    if (value instanceof DexiePromise) return value;
    if (value && typeof value.then === "function") return new DexiePromise((resolve, reject) => {
      value.then(resolve, reject);
    });
    var rv = new DexiePromise(INTERNAL, true, value);
    linkToPreviousPromise(rv, currentFulfiller);
    return rv;
  },
  reject: PromiseReject,
  race: function () {
    var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise((resolve, reject) => {
      values.map(value => DexiePromise.resolve(value).then(resolve, reject));
    });
  },
  PSD: {
    get: () => PSD,
    set: value => PSD = value
  },
  totalEchoes: {
    get: () => totalEchoes
  },
  newPSD: newScope,
  usePSD,
  scheduler: {
    get: () => asap,
    set: value => {
      asap = value;
    }
  },
  rejectionMapper: {
    get: () => rejectionMapper,
    set: value => {
      rejectionMapper = value;
    }
  },
  follow: (fn, zoneProps) => {
    return new DexiePromise((resolve, reject) => {
      return newScope((resolve2, reject2) => {
        var psd = PSD;
        psd.unhandleds = [];
        psd.onunhandled = reject2;
        psd.finalize = callBoth(function () {
          run_at_end_of_this_or_next_physical_tick(() => {
            this.unhandleds.length === 0 ? resolve2() : reject2(this.unhandleds[0]);
          });
        }, psd.finalize);
        fn();
      }, zoneProps, resolve, reject);
    });
  }
});
if (NativePromise) {
  if (NativePromise.allSettled) setProp(DexiePromise, "allSettled", function () {
    const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise(resolve => {
      if (possiblePromises.length === 0) resolve([]);
      let remaining = possiblePromises.length;
      const results = new Array(remaining);
      possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then(value => results[i] = {
        status: "fulfilled",
        value
      }, reason => results[i] = {
        status: "rejected",
        reason
      }).then(() => --remaining || resolve(results)));
    });
  });
  if (NativePromise.any && typeof AggregateError !== "undefined") setProp(DexiePromise, "any", function () {
    const possiblePromises = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
    return new DexiePromise((resolve, reject) => {
      if (possiblePromises.length === 0) reject(new AggregateError([]));
      let remaining = possiblePromises.length;
      const failures = new Array(remaining);
      possiblePromises.forEach((p, i) => DexiePromise.resolve(p).then(value => resolve(value), failure => {
        failures[i] = failure;
        if (! --remaining) reject(new AggregateError(failures));
      }));
    });
  });
}
function executePromiseTask(promise, fn) {
  try {
    fn(value => {
      if (promise._state !== null) return;
      if (value === promise) throw new TypeError("A promise cannot be resolved with itself.");
      var shouldExecuteTick = promise._lib && beginMicroTickScope();
      if (value && typeof value.then === "function") {
        executePromiseTask(promise, (resolve, reject) => {
          value instanceof DexiePromise ? value._then(resolve, reject) : value.then(resolve, reject);
        });
      } else {
        promise._state = true;
        promise._value = value;
        propagateAllListeners(promise);
      }
      if (shouldExecuteTick) endMicroTickScope();
    }, handleRejection.bind(null, promise));
  } catch (ex) {
    handleRejection(promise, ex);
  }
}
function handleRejection(promise, reason) {
  rejectingErrors.push(reason);
  if (promise._state !== null) return;
  var shouldExecuteTick = promise._lib && beginMicroTickScope();
  reason = rejectionMapper(reason);
  promise._state = false;
  promise._value = reason;
  debug && reason !== null && typeof reason === "object" && !reason._promise && tryCatch(() => {
    var origProp = getPropertyDescriptor(reason, "stack");
    reason._promise = promise;
    setProp(reason, "stack", {
      get: () => stack_being_generated ? origProp && (origProp.get ? origProp.get.apply(reason) : origProp.value) : promise.stack
    });
  });
  addPossiblyUnhandledError(promise);
  propagateAllListeners(promise);
  if (shouldExecuteTick) endMicroTickScope();
}
function propagateAllListeners(promise) {
  var listeners = promise._listeners;
  promise._listeners = [];
  for (var i = 0, len = listeners.length; i < len; ++i) {
    propagateToListener(promise, listeners[i]);
  }
  var psd = promise._PSD;
  --psd.ref || psd.finalize();
  if (numScheduledCalls === 0) {
    ++numScheduledCalls;
    asap(() => {
      if (--numScheduledCalls === 0) finalizePhysicalTick();
    }, []);
  }
}
function propagateToListener(promise, listener) {
  if (promise._state === null) {
    promise._listeners.push(listener);
    return;
  }
  var cb = promise._state ? listener.onFulfilled : listener.onRejected;
  if (cb === null) {
    return (promise._state ? listener.resolve : listener.reject)(promise._value);
  }
  ++listener.psd.ref;
  ++numScheduledCalls;
  asap(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
  try {
    currentFulfiller = promise;
    var ret,
      value = promise._value;
    if (promise._state) {
      ret = cb(value);
    } else {
      if (rejectingErrors.length) rejectingErrors = [];
      ret = cb(value);
      if (rejectingErrors.indexOf(value) === -1) markErrorAsHandled(promise);
    }
    listener.resolve(ret);
  } catch (e) {
    listener.reject(e);
  } finally {
    currentFulfiller = null;
    if (--numScheduledCalls === 0) finalizePhysicalTick();
    --listener.psd.ref || listener.psd.finalize();
  }
}
function getStack(promise, stacks, limit) {
  if (stacks.length === limit) return stacks;
  var stack = "";
  if (promise._state === false) {
    var failure = promise._value,
      errorName,
      message;
    if (failure != null) {
      errorName = failure.name || "Error";
      message = failure.message || failure;
      stack = prettyStack(failure, 0);
    } else {
      errorName = failure;
      message = "";
    }
    stacks.push(errorName + (message ? ": " + message : "") + stack);
  }
  if (debug) {
    stack = prettyStack(promise._stackHolder, 2);
    if (stack && stacks.indexOf(stack) === -1) stacks.push(stack);
    if (promise._prev) getStack(promise._prev, stacks, limit);
  }
  return stacks;
}
function linkToPreviousPromise(promise, prev) {
  var numPrev = prev ? prev._numPrev + 1 : 0;
  if (numPrev < LONG_STACKS_CLIP_LIMIT) {
    promise._prev = prev;
    promise._numPrev = numPrev;
  }
}
function physicalTick() {
  beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
  var wasRootExec = isOutsideMicroTick;
  isOutsideMicroTick = false;
  needsNewPhysicalTick = false;
  return wasRootExec;
}
function endMicroTickScope() {
  var callbacks, i, l;
  do {
    while (microtickQueue.length > 0) {
      callbacks = microtickQueue;
      microtickQueue = [];
      l = callbacks.length;
      for (i = 0; i < l; ++i) {
        var item = callbacks[i];
        item[0].apply(null, item[1]);
      }
    }
  } while (microtickQueue.length > 0);
  isOutsideMicroTick = true;
  needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
  var unhandledErrs = unhandledErrors;
  unhandledErrors = [];
  unhandledErrs.forEach(p => {
    p._PSD.onunhandled.call(null, p._value, p);
  });
  var finalizers = tickFinalizers.slice(0);
  var i = finalizers.length;
  while (i) finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
  function finalizer() {
    fn();
    tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
  }
  tickFinalizers.push(finalizer);
  ++numScheduledCalls;
  asap(() => {
    if (--numScheduledCalls === 0) finalizePhysicalTick();
  }, []);
}
function addPossiblyUnhandledError(promise) {
  if (!unhandledErrors.some(p => p._value === promise._value)) unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
  var i = unhandledErrors.length;
  while (i) if (unhandledErrors[--i]._value === promise._value) {
    unhandledErrors.splice(i, 1);
    return;
  }
}
function PromiseReject(reason) {
  return new DexiePromise(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
  var psd = PSD;
  return function () {
    var wasRootExec = beginMicroTickScope(),
      outerScope = PSD;
    try {
      switchToZone(psd, true);
      return fn.apply(this, arguments);
    } catch (e) {
      errorCatcher && errorCatcher(e);
    } finally {
      switchToZone(outerScope, false);
      if (wasRootExec) endMicroTickScope();
    }
  };
}
var task = {
  awaits: 0,
  echoes: 0,
  id: 0
};
var taskCounter = 0;
var zoneStack = [];
var zoneEchoes = 0;
var totalEchoes = 0;
var zone_id_counter = 0;
function newScope(fn, props2, a1, a2) {
  var parent = PSD,
    psd = Object.create(parent);
  psd.parent = parent;
  psd.ref = 0;
  psd.global = false;
  psd.id = ++zone_id_counter;
  var globalEnv = globalPSD.env;
  psd.env = patchGlobalPromise ? {
    Promise: DexiePromise,
    PromiseProp: {
      value: DexiePromise,
      configurable: true,
      writable: true
    },
    all: DexiePromise.all,
    race: DexiePromise.race,
    allSettled: DexiePromise.allSettled,
    any: DexiePromise.any,
    resolve: DexiePromise.resolve,
    reject: DexiePromise.reject,
    nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
    gthen: getPatchedPromiseThen(globalEnv.gthen, psd)
  } : {};
  if (props2) extend(psd, props2);
  ++parent.ref;
  psd.finalize = function () {
    --this.parent.ref || this.parent.finalize();
  };
  var rv = usePSD(psd, fn, a1, a2);
  if (psd.ref === 0) psd.finalize();
  return rv;
}
function incrementExpectedAwaits() {
  if (!task.id) task.id = ++taskCounter;
  ++task.awaits;
  task.echoes += ZONE_ECHO_LIMIT;
  return task.id;
}
function decrementExpectedAwaits() {
  if (!task.awaits) return false;
  if (--task.awaits === 0) task.id = 0;
  task.echoes = task.awaits * ZONE_ECHO_LIMIT;
  return true;
}
if (("" + nativePromiseThen).indexOf("[native code]") === -1) {
  incrementExpectedAwaits = decrementExpectedAwaits = nop;
}
function onPossibleParallellAsync(possiblePromise) {
  if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
    incrementExpectedAwaits();
    return possiblePromise.then(x => {
      decrementExpectedAwaits();
      return x;
    }, e => {
      decrementExpectedAwaits();
      return rejection(e);
    });
  }
  return possiblePromise;
}
function zoneEnterEcho(targetZone) {
  ++totalEchoes;
  if (!task.echoes || --task.echoes === 0) {
    task.echoes = task.id = 0;
  }
  zoneStack.push(PSD);
  switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
  var zone = zoneStack[zoneStack.length - 1];
  zoneStack.pop();
  switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
  var currentZone = PSD;
  if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (! --zoneEchoes || targetZone !== PSD)) {
    enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
  }
  if (targetZone === PSD) return;
  PSD = targetZone;
  if (currentZone === globalPSD) globalPSD.env = snapShot();
  if (patchGlobalPromise) {
    var GlobalPromise = globalPSD.env.Promise;
    var targetEnv = targetZone.env;
    nativePromiseProto.then = targetEnv.nthen;
    GlobalPromise.prototype.then = targetEnv.gthen;
    if (currentZone.global || targetZone.global) {
      Object.defineProperty(_global, "Promise", targetEnv.PromiseProp);
      GlobalPromise.all = targetEnv.all;
      GlobalPromise.race = targetEnv.race;
      GlobalPromise.resolve = targetEnv.resolve;
      GlobalPromise.reject = targetEnv.reject;
      if (targetEnv.allSettled) GlobalPromise.allSettled = targetEnv.allSettled;
      if (targetEnv.any) GlobalPromise.any = targetEnv.any;
    }
  }
}
function snapShot() {
  var GlobalPromise = _global.Promise;
  return patchGlobalPromise ? {
    Promise: GlobalPromise,
    PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
    all: GlobalPromise.all,
    race: GlobalPromise.race,
    allSettled: GlobalPromise.allSettled,
    any: GlobalPromise.any,
    resolve: GlobalPromise.resolve,
    reject: GlobalPromise.reject,
    nthen: nativePromiseProto.then,
    gthen: GlobalPromise.prototype.then
  } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
  var outerScope = PSD;
  try {
    switchToZone(psd, true);
    return fn(a1, a2, a3);
  } finally {
    switchToZone(outerScope, false);
  }
}
function enqueueNativeMicroTask(job) {
  nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait, cleanup) {
  return typeof fn !== "function" ? fn : function () {
    var outerZone = PSD;
    if (possibleAwait) incrementExpectedAwaits();
    switchToZone(zone, true);
    try {
      return fn.apply(this, arguments);
    } finally {
      switchToZone(outerZone, false);
      if (cleanup) enqueueNativeMicroTask(decrementExpectedAwaits);
    }
  };
}
function getPatchedPromiseThen(origThen, zone) {
  return function (onResolved, onRejected) {
    return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone), nativeAwaitCompatibleWrap(onRejected, zone));
  };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
  var rv;
  try {
    rv = promise.onuncatched(err);
  } catch (e) {}
  if (rv !== false) try {
    var event,
      eventData = {
        promise,
        reason: err
      };
    if (_global.document && document.createEvent) {
      event = document.createEvent("Event");
      event.initEvent(UNHANDLEDREJECTION, true, true);
      extend(event, eventData);
    } else if (_global.CustomEvent) {
      event = new CustomEvent(UNHANDLEDREJECTION, {
        detail: eventData
      });
      extend(event, eventData);
    }
    if (event && _global.dispatchEvent) {
      dispatchEvent(event);
      if (!_global.PromiseRejectionEvent && _global.onunhandledrejection) try {
        _global.onunhandledrejection(event);
      } catch (_) {}
    }
    if (debug && event && !event.defaultPrevented) {
      console.warn(`Unhandled rejection: ${err.stack || err}`);
    }
  } catch (e) {}
}
var rejection = DexiePromise.reject;
function tempTransaction(db, mode, storeNames, fn) {
  if (!db.idbdb || !db._state.openComplete && !PSD.letThrough && !db._vip) {
    if (db._state.openComplete) {
      return rejection(new exceptions.DatabaseClosed(db._state.dbOpenError));
    }
    if (!db._state.isBeingOpened) {
      if (!db._options.autoOpen) return rejection(new exceptions.DatabaseClosed());
      db.open().catch(nop);
    }
    return db._state.dbReadyPromise.then(() => tempTransaction(db, mode, storeNames, fn));
  } else {
    var trans = db._createTransaction(mode, storeNames, db._dbSchema);
    try {
      trans.create();
      db._state.PR1398_maxLoop = 3;
    } catch (ex) {
      if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
        console.warn("Dexie: Need to reopen db");
        db._close();
        return db.open().then(() => tempTransaction(db, mode, storeNames, fn));
      }
      return rejection(ex);
    }
    return trans._promise(mode, (resolve, reject) => {
      return newScope(() => {
        PSD.trans = trans;
        return fn(resolve, reject, trans);
      });
    }).then(result => {
      return trans._completion.then(() => result);
    });
  }
}
var DEXIE_VERSION = "3.2.3";
var maxString = String.fromCharCode(65535);
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== "undefined" && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = frame => !/(dexie\.js|dexie\.min\.js)/.test(frame);
var DBNAMES_DB = "__dbnames";
var READONLY = "readonly";
var READWRITE = "readwrite";
function combine(filter1, filter2) {
  return filter1 ? filter2 ? function () {
    return filter1.apply(this, arguments) && filter2.apply(this, arguments);
  } : filter1 : filter2;
}
var AnyRange = {
  type: 3,
  lower: -Infinity,
  lowerOpen: false,
  upper: [[]],
  upperOpen: false
};
function workaroundForUndefinedPrimKey(keyPath) {
  return typeof keyPath === "string" && !/\./.test(keyPath) ? obj => {
    if (obj[keyPath] === void 0 && keyPath in obj) {
      obj = deepClone(obj);
      delete obj[keyPath];
    }
    return obj;
  } : obj => obj;
}
var Table = class {
  _trans(mode, fn, writeLocked) {
    const trans = this._tx || PSD.trans;
    const tableName = this.name;
    function checkTableInTransaction(resolve, reject, trans2) {
      if (!trans2.schema[tableName]) throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
      return fn(trans2.idbtrans, trans2);
    }
    const wasRootExec = beginMicroTickScope();
    try {
      return trans && trans.db === this.db ? trans === PSD.trans ? trans._promise(mode, checkTableInTransaction, writeLocked) : newScope(() => trans._promise(mode, checkTableInTransaction, writeLocked), {
        trans,
        transless: PSD.transless || PSD
      }) : tempTransaction(this.db, mode, [this.name], checkTableInTransaction);
    } finally {
      if (wasRootExec) endMicroTickScope();
    }
  }
  get(keyOrCrit, cb) {
    if (keyOrCrit && keyOrCrit.constructor === Object) return this.where(keyOrCrit).first(cb);
    return this._trans("readonly", trans => {
      return this.core.get({
        trans,
        key: keyOrCrit
      }).then(res => this.hook.reading.fire(res));
    }).then(cb);
  }
  where(indexOrCrit) {
    if (typeof indexOrCrit === "string") return new this.db.WhereClause(this, indexOrCrit);
    if (isArray(indexOrCrit)) return new this.db.WhereClause(this, `[${indexOrCrit.join("+")}]`);
    const keyPaths = keys(indexOrCrit);
    if (keyPaths.length === 1) return this.where(keyPaths[0]).equals(indexOrCrit[keyPaths[0]]);
    const compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(ix => ix.compound && keyPaths.every(keyPath => ix.keyPath.indexOf(keyPath) >= 0) && ix.keyPath.every(keyPath => keyPaths.indexOf(keyPath) >= 0))[0];
    if (compoundIndex && this.db._maxKey !== maxString) return this.where(compoundIndex.name).equals(compoundIndex.keyPath.map(kp => indexOrCrit[kp]));
    if (!compoundIndex && debug) console.warn(`The query ${JSON.stringify(indexOrCrit)} on ${this.name} would benefit of a compound index [${keyPaths.join("+")}]`);
    const {
      idxByName
    } = this.schema;
    const idb = this.db._deps.indexedDB;
    function equals(a, b) {
      try {
        return idb.cmp(a, b) === 0;
      } catch (e) {
        return false;
      }
    }
    const [idx, filterFunction] = keyPaths.reduce(([prevIndex, prevFilterFn], keyPath) => {
      const index = idxByName[keyPath];
      const value = indexOrCrit[keyPath];
      return [prevIndex || index, prevIndex || !index ? combine(prevFilterFn, index && index.multi ? x => {
        const prop = getByKeyPath(x, keyPath);
        return isArray(prop) && prop.some(item => equals(value, item));
      } : x => equals(value, getByKeyPath(x, keyPath))) : prevFilterFn];
    }, [null, null]);
    return idx ? this.where(idx.name).equals(indexOrCrit[idx.keyPath]).filter(filterFunction) : compoundIndex ? this.filter(filterFunction) : this.where(keyPaths).equals("");
  }
  filter(filterFunction) {
    return this.toCollection().and(filterFunction);
  }
  count(thenShortcut) {
    return this.toCollection().count(thenShortcut);
  }
  offset(offset) {
    return this.toCollection().offset(offset);
  }
  limit(numRows) {
    return this.toCollection().limit(numRows);
  }
  each(callback) {
    return this.toCollection().each(callback);
  }
  toArray(thenShortcut) {
    return this.toCollection().toArray(thenShortcut);
  }
  toCollection() {
    return new this.db.Collection(new this.db.WhereClause(this));
  }
  orderBy(index) {
    return new this.db.Collection(new this.db.WhereClause(this, isArray(index) ? `[${index.join("+")}]` : index));
  }
  reverse() {
    return this.toCollection().reverse();
  }
  mapToClass(constructor) {
    this.schema.mappedClass = constructor;
    const readHook = obj => {
      if (!obj) return obj;
      const res = Object.create(constructor.prototype);
      for (var m in obj) if (hasOwn(obj, m)) try {
        res[m] = obj[m];
      } catch (_) {}
      return res;
    };
    if (this.schema.readHook) {
      this.hook.reading.unsubscribe(this.schema.readHook);
    }
    this.schema.readHook = readHook;
    this.hook("reading", readHook);
    return constructor;
  }
  defineClass() {
    function Class(content) {
      extend(this, content);
    }
    return this.mapToClass(Class);
  }
  add(obj, key) {
    const {
      auto,
      keyPath
    } = this.schema.primKey;
    let objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", trans => {
      return this.core.mutate({
        trans,
        type: "add",
        keys: key != null ? [key] : null,
        values: [objToAdd]
      });
    }).then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult).then(lastResult => {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {}
      }
      return lastResult;
    });
  }
  update(keyOrObject, modifications) {
    if (typeof keyOrObject === "object" && !isArray(keyOrObject)) {
      const key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
      if (key === void 0) return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
      try {
        if (typeof modifications !== "function") {
          keys(modifications).forEach(keyPath => {
            setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
          });
        } else {
          modifications(keyOrObject, {
            value: keyOrObject,
            primKey: key
          });
        }
      } catch (_a) {}
      return this.where(":id").equals(key).modify(modifications);
    } else {
      return this.where(":id").equals(keyOrObject).modify(modifications);
    }
  }
  put(obj, key) {
    const {
      auto,
      keyPath
    } = this.schema.primKey;
    let objToAdd = obj;
    if (keyPath && auto) {
      objToAdd = workaroundForUndefinedPrimKey(keyPath)(obj);
    }
    return this._trans("readwrite", trans => this.core.mutate({
      trans,
      type: "put",
      values: [objToAdd],
      keys: key != null ? [key] : null
    })).then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : res.lastResult).then(lastResult => {
      if (keyPath) {
        try {
          setByKeyPath(obj, keyPath, lastResult);
        } catch (_) {}
      }
      return lastResult;
    });
  }
  delete(key) {
    return this._trans("readwrite", trans => this.core.mutate({
      trans,
      type: "delete",
      keys: [key]
    })).then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0);
  }
  clear() {
    return this._trans("readwrite", trans => this.core.mutate({
      trans,
      type: "deleteRange",
      range: AnyRange
    })).then(res => res.numFailures ? DexiePromise.reject(res.failures[0]) : void 0);
  }
  bulkGet(keys2) {
    return this._trans("readonly", trans => {
      return this.core.getMany({
        keys: keys2,
        trans
      }).then(result => result.map(res => this.hook.reading.fire(res)));
    });
  }
  bulkAdd(objects, keysOrOptions, options) {
    const keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    const wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", trans => {
      const {
        auto,
        keyPath
      } = this.schema.primKey;
      if (keyPath && keys2) throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length) throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      const numObjects = objects.length;
      let objectsToAdd = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return this.core.mutate({
        trans,
        type: "add",
        keys: keys2,
        values: objectsToAdd,
        wantResults
      }).then(({
        numFailures,
        results,
        lastResult,
        failures
      }) => {
        const result = wantResults ? results : lastResult;
        if (numFailures === 0) return result;
        throw new BulkError(`${this.name}.bulkAdd(): ${numFailures} of ${numObjects} operations failed`, failures);
      });
    });
  }
  bulkPut(objects, keysOrOptions, options) {
    const keys2 = Array.isArray(keysOrOptions) ? keysOrOptions : void 0;
    options = options || (keys2 ? void 0 : keysOrOptions);
    const wantResults = options ? options.allKeys : void 0;
    return this._trans("readwrite", trans => {
      const {
        auto,
        keyPath
      } = this.schema.primKey;
      if (keyPath && keys2) throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
      if (keys2 && keys2.length !== objects.length) throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
      const numObjects = objects.length;
      let objectsToPut = keyPath && auto ? objects.map(workaroundForUndefinedPrimKey(keyPath)) : objects;
      return this.core.mutate({
        trans,
        type: "put",
        keys: keys2,
        values: objectsToPut,
        wantResults
      }).then(({
        numFailures,
        results,
        lastResult,
        failures
      }) => {
        const result = wantResults ? results : lastResult;
        if (numFailures === 0) return result;
        throw new BulkError(`${this.name}.bulkPut(): ${numFailures} of ${numObjects} operations failed`, failures);
      });
    });
  }
  bulkDelete(keys2) {
    const numKeys = keys2.length;
    return this._trans("readwrite", trans => {
      return this.core.mutate({
        trans,
        type: "delete",
        keys: keys2
      });
    }).then(({
      numFailures,
      lastResult,
      failures
    }) => {
      if (numFailures === 0) return lastResult;
      throw new BulkError(`${this.name}.bulkDelete(): ${numFailures} of ${numKeys} operations failed`, failures);
    });
  }
};
function Events(ctx) {
  var evs = {};
  var rv = function (eventName, subscriber) {
    if (subscriber) {
      var i2 = arguments.length,
        args = new Array(i2 - 1);
      while (--i2) args[i2 - 1] = arguments[i2];
      evs[eventName].subscribe.apply(null, args);
      return ctx;
    } else if (typeof eventName === "string") {
      return evs[eventName];
    }
  };
  rv.addEventType = add;
  for (var i = 1, l = arguments.length; i < l; ++i) {
    add(arguments[i]);
  }
  return rv;
  function add(eventName, chainFunction, defaultFunction) {
    if (typeof eventName === "object") return addConfiguredEvents(eventName);
    if (!chainFunction) chainFunction = reverseStoppableEventChain;
    if (!defaultFunction) defaultFunction = nop;
    var context = {
      subscribers: [],
      fire: defaultFunction,
      subscribe: function (cb) {
        if (context.subscribers.indexOf(cb) === -1) {
          context.subscribers.push(cb);
          context.fire = chainFunction(context.fire, cb);
        }
      },
      unsubscribe: function (cb) {
        context.subscribers = context.subscribers.filter(function (fn) {
          return fn !== cb;
        });
        context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
      }
    };
    evs[eventName] = rv[eventName] = context;
    return context;
  }
  function addConfiguredEvents(cfg) {
    keys(cfg).forEach(function (eventName) {
      var args = cfg[eventName];
      if (isArray(args)) {
        add(eventName, cfg[eventName][0], cfg[eventName][1]);
      } else if (args === "asap") {
        var context = add(eventName, mirror, function fire() {
          var i2 = arguments.length,
            args2 = new Array(i2);
          while (i2--) args2[i2] = arguments[i2];
          context.subscribers.forEach(function (fn) {
            asap$1(function fireEvent() {
              fn.apply(null, args2);
            });
          });
        });
      } else throw new exceptions.InvalidArgument("Invalid event config");
    });
  }
}
function makeClassConstructor(prototype, constructor) {
  derive(constructor).from({
    prototype
  });
  return constructor;
}
function createTableConstructor(db) {
  return makeClassConstructor(Table.prototype, function Table2(name, tableSchema, trans) {
    this.db = db;
    this._tx = trans;
    this.name = name;
    this.schema = tableSchema;
    this.hook = db._allTables[name] ? db._allTables[name].hook : Events(null, {
      "creating": [hookCreatingChain, nop],
      "reading": [pureFunctionChain, mirror],
      "updating": [hookUpdatingChain, nop],
      "deleting": [hookDeletingChain, nop]
    });
  });
}
function isPlainKeyRange(ctx, ignoreLimitFilter) {
  return !(ctx.filter || ctx.algorithm || ctx.or) && (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
}
function addFilter(ctx, fn) {
  ctx.filter = combine(ctx.filter, fn);
}
function addReplayFilter(ctx, factory, isLimitFilter) {
  var curr = ctx.replayFilter;
  ctx.replayFilter = curr ? () => combine(curr(), factory()) : factory;
  ctx.justLimit = isLimitFilter && !curr;
}
function addMatchFilter(ctx, fn) {
  ctx.isMatch = combine(ctx.isMatch, fn);
}
function getIndexOrStore(ctx, coreSchema) {
  if (ctx.isPrimKey) return coreSchema.primaryKey;
  const index = coreSchema.getIndexByKeyPath(ctx.index);
  if (!index) throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + coreSchema.name + " is not indexed");
  return index;
}
function openCursor(ctx, coreTable, trans) {
  const index = getIndexOrStore(ctx, coreTable.schema);
  return coreTable.openCursor({
    trans,
    values: !ctx.keysOnly,
    reverse: ctx.dir === "prev",
    unique: !!ctx.unique,
    query: {
      index,
      range: ctx.range
    }
  });
}
function iter(ctx, fn, coreTrans, coreTable) {
  const filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
  if (!ctx.or) {
    return iterate(openCursor(ctx, coreTable, coreTrans), combine(ctx.algorithm, filter), fn, !ctx.keysOnly && ctx.valueMapper);
  } else {
    const set = {};
    const union = (item, cursor, advance) => {
      if (!filter || filter(cursor, advance, result => cursor.stop(result), err => cursor.fail(err))) {
        var primaryKey = cursor.primaryKey;
        var key = "" + primaryKey;
        if (key === "[object ArrayBuffer]") key = "" + new Uint8Array(primaryKey);
        if (!hasOwn(set, key)) {
          set[key] = true;
          fn(item, cursor, advance);
        }
      }
    };
    return Promise.all([ctx.or._iterate(union, coreTrans), iterate(openCursor(ctx, coreTable, coreTrans), ctx.algorithm, union, !ctx.keysOnly && ctx.valueMapper)]);
  }
}
function iterate(cursorPromise, filter, fn, valueMapper) {
  var mappedFn = valueMapper ? (x, c, a) => fn(valueMapper(x), c, a) : fn;
  var wrappedFn = wrap(mappedFn);
  return cursorPromise.then(cursor => {
    if (cursor) {
      return cursor.start(() => {
        var c = () => cursor.continue();
        if (!filter || filter(cursor, advancer => c = advancer, val => {
          cursor.stop(val);
          c = nop;
        }, e => {
          cursor.fail(e);
          c = nop;
        })) wrappedFn(cursor.value, cursor, advancer => c = advancer);
        c();
      });
    }
  });
}
function cmp(a, b) {
  try {
    const ta = type(a);
    const tb = type(b);
    if (ta !== tb) {
      if (ta === "Array") return 1;
      if (tb === "Array") return -1;
      if (ta === "binary") return 1;
      if (tb === "binary") return -1;
      if (ta === "string") return 1;
      if (tb === "string") return -1;
      if (ta === "Date") return 1;
      if (tb !== "Date") return NaN;
      return -1;
    }
    switch (ta) {
      case "number":
      case "Date":
      case "string":
        return a > b ? 1 : a < b ? -1 : 0;
      case "binary":
        {
          return compareUint8Arrays(getUint8Array(a), getUint8Array(b));
        }
      case "Array":
        return compareArrays(a, b);
    }
  } catch (_a) {}
  return NaN;
}
function compareArrays(a, b) {
  const al = a.length;
  const bl = b.length;
  const l = al < bl ? al : bl;
  for (let i = 0; i < l; ++i) {
    const res = cmp(a[i], b[i]);
    if (res !== 0) return res;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function compareUint8Arrays(a, b) {
  const al = a.length;
  const bl = b.length;
  const l = al < bl ? al : bl;
  for (let i = 0; i < l; ++i) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return al === bl ? 0 : al < bl ? -1 : 1;
}
function type(x) {
  const t = typeof x;
  if (t !== "object") return t;
  if (ArrayBuffer.isView(x)) return "binary";
  const tsTag = toStringTag(x);
  return tsTag === "ArrayBuffer" ? "binary" : tsTag;
}
function getUint8Array(a) {
  if (a instanceof Uint8Array) return a;
  if (ArrayBuffer.isView(a)) return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
  return new Uint8Array(a);
}
var Collection = class {
  _read(fn, cb) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readonly", fn).then(cb);
  }
  _write(fn) {
    var ctx = this._ctx;
    return ctx.error ? ctx.table._trans(null, rejection.bind(null, ctx.error)) : ctx.table._trans("readwrite", fn, "locked");
  }
  _addAlgorithm(fn) {
    var ctx = this._ctx;
    ctx.algorithm = combine(ctx.algorithm, fn);
  }
  _iterate(fn, coreTrans) {
    return iter(this._ctx, fn, coreTrans, this._ctx.table.core);
  }
  clone(props2) {
    var rv = Object.create(this.constructor.prototype),
      ctx = Object.create(this._ctx);
    if (props2) extend(ctx, props2);
    rv._ctx = ctx;
    return rv;
  }
  raw() {
    this._ctx.valueMapper = null;
    return this;
  }
  each(fn) {
    var ctx = this._ctx;
    return this._read(trans => iter(ctx, fn, trans, ctx.table.core));
  }
  count(cb) {
    return this._read(trans => {
      const ctx = this._ctx;
      const coreTable = ctx.table.core;
      if (isPlainKeyRange(ctx, true)) {
        return coreTable.count({
          trans,
          query: {
            index: getIndexOrStore(ctx, coreTable.schema),
            range: ctx.range
          }
        }).then(count2 => Math.min(count2, ctx.limit));
      } else {
        var count = 0;
        return iter(ctx, () => {
          ++count;
          return false;
        }, trans, coreTable).then(() => count);
      }
    }).then(cb);
  }
  sortBy(keyPath, cb) {
    const parts = keyPath.split(".").reverse(),
      lastPart = parts[0],
      lastIndex = parts.length - 1;
    function getval(obj, i) {
      if (i) return getval(obj[parts[i]], i - 1);
      return obj[lastPart];
    }
    var order = this._ctx.dir === "next" ? 1 : -1;
    function sorter(a, b) {
      var aVal = getval(a, lastIndex),
        bVal = getval(b, lastIndex);
      return aVal < bVal ? -order : aVal > bVal ? order : 0;
    }
    return this.toArray(function (a) {
      return a.sort(sorter);
    }).then(cb);
  }
  toArray(cb) {
    return this._read(trans => {
      var ctx = this._ctx;
      if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
        const {
          valueMapper
        } = ctx;
        const index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          limit: ctx.limit,
          values: true,
          query: {
            index,
            range: ctx.range
          }
        }).then(({
          result
        }) => valueMapper ? result.map(valueMapper) : result);
      } else {
        const a = [];
        return iter(ctx, item => a.push(item), trans, ctx.table.core).then(() => a);
      }
    }, cb);
  }
  offset(offset) {
    var ctx = this._ctx;
    if (offset <= 0) return this;
    ctx.offset += offset;
    if (isPlainKeyRange(ctx)) {
      addReplayFilter(ctx, () => {
        var offsetLeft = offset;
        return (cursor, advance) => {
          if (offsetLeft === 0) return true;
          if (offsetLeft === 1) {
            --offsetLeft;
            return false;
          }
          advance(() => {
            cursor.advance(offsetLeft);
            offsetLeft = 0;
          });
          return false;
        };
      });
    } else {
      addReplayFilter(ctx, () => {
        var offsetLeft = offset;
        return () => --offsetLeft < 0;
      });
    }
    return this;
  }
  limit(numRows) {
    this._ctx.limit = Math.min(this._ctx.limit, numRows);
    addReplayFilter(this._ctx, () => {
      var rowsLeft = numRows;
      return function (cursor, advance, resolve) {
        if (--rowsLeft <= 0) advance(resolve);
        return rowsLeft >= 0;
      };
    }, true);
    return this;
  }
  until(filterFunction, bIncludeStopEntry) {
    addFilter(this._ctx, function (cursor, advance, resolve) {
      if (filterFunction(cursor.value)) {
        advance(resolve);
        return bIncludeStopEntry;
      } else {
        return true;
      }
    });
    return this;
  }
  first(cb) {
    return this.limit(1).toArray(function (a) {
      return a[0];
    }).then(cb);
  }
  last(cb) {
    return this.reverse().first(cb);
  }
  filter(filterFunction) {
    addFilter(this._ctx, function (cursor) {
      return filterFunction(cursor.value);
    });
    addMatchFilter(this._ctx, filterFunction);
    return this;
  }
  and(filter) {
    return this.filter(filter);
  }
  or(indexName) {
    return new this.db.WhereClause(this._ctx.table, indexName, this);
  }
  reverse() {
    this._ctx.dir = this._ctx.dir === "prev" ? "next" : "prev";
    if (this._ondirectionchange) this._ondirectionchange(this._ctx.dir);
    return this;
  }
  desc() {
    return this.reverse();
  }
  eachKey(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function (val, cursor) {
      cb(cursor.key, cursor);
    });
  }
  eachUniqueKey(cb) {
    this._ctx.unique = "unique";
    return this.eachKey(cb);
  }
  eachPrimaryKey(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    return this.each(function (val, cursor) {
      cb(cursor.primaryKey, cursor);
    });
  }
  keys(cb) {
    var ctx = this._ctx;
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function (item, cursor) {
      a.push(cursor.key);
    }).then(function () {
      return a;
    }).then(cb);
  }
  primaryKeys(cb) {
    var ctx = this._ctx;
    if (ctx.dir === "next" && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
      return this._read(trans => {
        var index = getIndexOrStore(ctx, ctx.table.core.schema);
        return ctx.table.core.query({
          trans,
          values: false,
          limit: ctx.limit,
          query: {
            index,
            range: ctx.range
          }
        });
      }).then(({
        result
      }) => result).then(cb);
    }
    ctx.keysOnly = !ctx.isMatch;
    var a = [];
    return this.each(function (item, cursor) {
      a.push(cursor.primaryKey);
    }).then(function () {
      return a;
    }).then(cb);
  }
  uniqueKeys(cb) {
    this._ctx.unique = "unique";
    return this.keys(cb);
  }
  firstKey(cb) {
    return this.limit(1).keys(function (a) {
      return a[0];
    }).then(cb);
  }
  lastKey(cb) {
    return this.reverse().firstKey(cb);
  }
  distinct() {
    var ctx = this._ctx,
      idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
    if (!idx || !idx.multi) return this;
    var set = {};
    addFilter(this._ctx, function (cursor) {
      var strKey = cursor.primaryKey.toString();
      var found = hasOwn(set, strKey);
      set[strKey] = true;
      return !found;
    });
    return this;
  }
  modify(changes) {
    var ctx = this._ctx;
    return this._write(trans => {
      var modifyer;
      if (typeof changes === "function") {
        modifyer = changes;
      } else {
        var keyPaths = keys(changes);
        var numKeys = keyPaths.length;
        modifyer = function (item) {
          var anythingModified = false;
          for (var i = 0; i < numKeys; ++i) {
            var keyPath = keyPaths[i],
              val = changes[keyPath];
            if (getByKeyPath(item, keyPath) !== val) {
              setByKeyPath(item, keyPath, val);
              anythingModified = true;
            }
          }
          return anythingModified;
        };
      }
      const coreTable = ctx.table.core;
      const {
        outbound,
        extractKey
      } = coreTable.schema.primaryKey;
      const limit = this.db._options.modifyChunkSize || 200;
      const totalFailures = [];
      let successCount = 0;
      const failedKeys = [];
      const applyMutateResult = (expectedCount, res) => {
        const {
          failures,
          numFailures
        } = res;
        successCount += expectedCount - numFailures;
        for (let pos of keys(failures)) {
          totalFailures.push(failures[pos]);
        }
      };
      return this.clone().primaryKeys().then(keys2 => {
        const nextChunk = offset => {
          const count = Math.min(limit, keys2.length - offset);
          return coreTable.getMany({
            trans,
            keys: keys2.slice(offset, offset + count),
            cache: "immutable"
          }).then(values => {
            const addValues = [];
            const putValues = [];
            const putKeys = outbound ? [] : null;
            const deleteKeys = [];
            for (let i = 0; i < count; ++i) {
              const origValue = values[i];
              const ctx2 = {
                value: deepClone(origValue),
                primKey: keys2[offset + i]
              };
              if (modifyer.call(ctx2, ctx2.value, ctx2) !== false) {
                if (ctx2.value == null) {
                  deleteKeys.push(keys2[offset + i]);
                } else if (!outbound && cmp(extractKey(origValue), extractKey(ctx2.value)) !== 0) {
                  deleteKeys.push(keys2[offset + i]);
                  addValues.push(ctx2.value);
                } else {
                  putValues.push(ctx2.value);
                  if (outbound) putKeys.push(keys2[offset + i]);
                }
              }
            }
            const criteria = isPlainKeyRange(ctx) && ctx.limit === Infinity && (typeof changes !== "function" || changes === deleteCallback) && {
              index: ctx.index,
              range: ctx.range
            };
            return Promise.resolve(addValues.length > 0 && coreTable.mutate({
              trans,
              type: "add",
              values: addValues
            }).then(res => {
              for (let pos in res.failures) {
                deleteKeys.splice(parseInt(pos), 1);
              }
              applyMutateResult(addValues.length, res);
            })).then(() => (putValues.length > 0 || criteria && typeof changes === "object") && coreTable.mutate({
              trans,
              type: "put",
              keys: putKeys,
              values: putValues,
              criteria,
              changeSpec: typeof changes !== "function" && changes
            }).then(res => applyMutateResult(putValues.length, res))).then(() => (deleteKeys.length > 0 || criteria && changes === deleteCallback) && coreTable.mutate({
              trans,
              type: "delete",
              keys: deleteKeys,
              criteria
            }).then(res => applyMutateResult(deleteKeys.length, res))).then(() => {
              return keys2.length > offset + count && nextChunk(offset + limit);
            });
          });
        };
        return nextChunk(0).then(() => {
          if (totalFailures.length > 0) throw new ModifyError("Error modifying one or more objects", totalFailures, successCount, failedKeys);
          return keys2.length;
        });
      });
    });
  }
  delete() {
    var ctx = this._ctx,
      range = ctx.range;
    if (isPlainKeyRange(ctx) && (ctx.isPrimKey && !hangsOnDeleteLargeKeyRange || range.type === 3)) {
      return this._write(trans => {
        const {
          primaryKey
        } = ctx.table.core.schema;
        const coreRange = range;
        return ctx.table.core.count({
          trans,
          query: {
            index: primaryKey,
            range: coreRange
          }
        }).then(count => {
          return ctx.table.core.mutate({
            trans,
            type: "deleteRange",
            range: coreRange
          }).then(({
            failures,
            lastResult,
            results,
            numFailures
          }) => {
            if (numFailures) throw new ModifyError("Could not delete some values", Object.keys(failures).map(pos => failures[pos]), count - numFailures);
            return count - numFailures;
          });
        });
      });
    }
    return this.modify(deleteCallback);
  }
};
var deleteCallback = (value, ctx) => ctx.value = null;
function createCollectionConstructor(db) {
  return makeClassConstructor(Collection.prototype, function Collection2(whereClause, keyRangeGenerator) {
    this.db = db;
    let keyRange = AnyRange,
      error = null;
    if (keyRangeGenerator) try {
      keyRange = keyRangeGenerator();
    } catch (ex) {
      error = ex;
    }
    const whereCtx = whereClause._ctx;
    const table = whereCtx.table;
    const readingHook = table.hook.reading.fire;
    this._ctx = {
      table,
      index: whereCtx.index,
      isPrimKey: !whereCtx.index || table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name,
      range: keyRange,
      keysOnly: false,
      dir: "next",
      unique: "",
      algorithm: null,
      filter: null,
      replayFilter: null,
      justLimit: true,
      isMatch: null,
      offset: 0,
      limit: Infinity,
      error,
      or: whereCtx.or,
      valueMapper: readingHook !== mirror ? readingHook : null
    };
  });
}
function simpleCompare(a, b) {
  return a < b ? -1 : a === b ? 0 : 1;
}
function simpleCompareReverse(a, b) {
  return a > b ? -1 : a === b ? 0 : 1;
}
function fail(collectionOrWhereClause, err, T) {
  var collection = collectionOrWhereClause instanceof WhereClause ? new collectionOrWhereClause.Collection(collectionOrWhereClause) : collectionOrWhereClause;
  collection._ctx.error = T ? new T(err) : new TypeError(err);
  return collection;
}
function emptyCollection(whereClause) {
  return new whereClause.Collection(whereClause, () => rangeEqual("")).limit(0);
}
function upperFactory(dir) {
  return dir === "next" ? s => s.toUpperCase() : s => s.toLowerCase();
}
function lowerFactory(dir) {
  return dir === "next" ? s => s.toLowerCase() : s => s.toUpperCase();
}
function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp2, dir) {
  var length = Math.min(key.length, lowerNeedle.length);
  var llp = -1;
  for (var i = 0; i < length; ++i) {
    var lwrKeyChar = lowerKey[i];
    if (lwrKeyChar !== lowerNeedle[i]) {
      if (cmp2(key[i], upperNeedle[i]) < 0) return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
      if (cmp2(key[i], lowerNeedle[i]) < 0) return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
      if (llp >= 0) return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
      return null;
    }
    if (cmp2(key[i], lwrKeyChar) < 0) llp = i;
  }
  if (length < lowerNeedle.length && dir === "next") return key + upperNeedle.substr(key.length);
  if (length < key.length && dir === "prev") return key.substr(0, upperNeedle.length);
  return llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1);
}
function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
  var upper,
    lower,
    compare,
    upperNeedles,
    lowerNeedles,
    direction,
    nextKeySuffix,
    needlesLen = needles.length;
  if (!needles.every(s => typeof s === "string")) {
    return fail(whereClause, STRING_EXPECTED);
  }
  function initDirection(dir) {
    upper = upperFactory(dir);
    lower = lowerFactory(dir);
    compare = dir === "next" ? simpleCompare : simpleCompareReverse;
    var needleBounds = needles.map(function (needle) {
      return {
        lower: lower(needle),
        upper: upper(needle)
      };
    }).sort(function (a, b) {
      return compare(a.lower, b.lower);
    });
    upperNeedles = needleBounds.map(function (nb) {
      return nb.upper;
    });
    lowerNeedles = needleBounds.map(function (nb) {
      return nb.lower;
    });
    direction = dir;
    nextKeySuffix = dir === "next" ? "" : suffix;
  }
  initDirection("next");
  var c = new whereClause.Collection(whereClause, () => createRange(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix));
  c._ondirectionchange = function (direction2) {
    initDirection(direction2);
  };
  var firstPossibleNeedle = 0;
  c._addAlgorithm(function (cursor, advance, resolve) {
    var key = cursor.key;
    if (typeof key !== "string") return false;
    var lowerKey = lower(key);
    if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
      return true;
    } else {
      var lowestPossibleCasing = null;
      for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
        var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
        if (casing === null && lowestPossibleCasing === null) firstPossibleNeedle = i + 1;else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
          lowestPossibleCasing = casing;
        }
      }
      if (lowestPossibleCasing !== null) {
        advance(function () {
          cursor.continue(lowestPossibleCasing + nextKeySuffix);
        });
      } else {
        advance(resolve);
      }
      return false;
    }
  });
  return c;
}
function createRange(lower, upper, lowerOpen, upperOpen) {
  return {
    type: 2,
    lower,
    upper,
    lowerOpen,
    upperOpen
  };
}
function rangeEqual(value) {
  return {
    type: 1,
    lower: value,
    upper: value
  };
}
var WhereClause = class {
  get Collection() {
    return this._ctx.table.db.Collection;
  }
  between(lower, upper, includeLower, includeUpper) {
    includeLower = includeLower !== false;
    includeUpper = includeUpper === true;
    try {
      if (this._cmp(lower, upper) > 0 || this._cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper)) return emptyCollection(this);
      return new this.Collection(this, () => createRange(lower, upper, !includeLower, !includeUpper));
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
  }
  equals(value) {
    if (value == null) return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => rangeEqual(value));
  }
  above(value) {
    if (value == null) return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(value, void 0, true));
  }
  aboveOrEqual(value) {
    if (value == null) return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(value, void 0, false));
  }
  below(value) {
    if (value == null) return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(void 0, value, false, true));
  }
  belowOrEqual(value) {
    if (value == null) return fail(this, INVALID_KEY_ARGUMENT);
    return new this.Collection(this, () => createRange(void 0, value));
  }
  startsWith(str) {
    if (typeof str !== "string") return fail(this, STRING_EXPECTED);
    return this.between(str, str + maxString, true, true);
  }
  startsWithIgnoreCase(str) {
    if (str === "") return this.startsWith(str);
    return addIgnoreCaseAlgorithm(this, (x, a) => x.indexOf(a[0]) === 0, [str], maxString);
  }
  equalsIgnoreCase(str) {
    return addIgnoreCaseAlgorithm(this, (x, a) => x === a[0], [str], "");
  }
  anyOfIgnoreCase() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0) return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, (x, a) => a.indexOf(x) !== -1, set, "");
  }
  startsWithAnyOfIgnoreCase() {
    var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0) return emptyCollection(this);
    return addIgnoreCaseAlgorithm(this, (x, a) => a.some(n => x.indexOf(n) === 0), set, maxString);
  }
  anyOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    let compare = this._cmp;
    try {
      set.sort(compare);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    if (set.length === 0) return emptyCollection(this);
    const c = new this.Collection(this, () => createRange(set[0], set[set.length - 1]));
    c._ondirectionchange = direction => {
      compare = direction === "next" ? this._ascending : this._descending;
      set.sort(compare);
    };
    let i = 0;
    c._addAlgorithm((cursor, advance, resolve) => {
      const key = cursor.key;
      while (compare(key, set[i]) > 0) {
        ++i;
        if (i === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (compare(key, set[i]) === 0) {
        return true;
      } else {
        advance(() => {
          cursor.continue(set[i]);
        });
        return false;
      }
    });
    return c;
  }
  notEqual(value) {
    return this.inAnyRange([[minKey, value], [value, this.db._maxKey]], {
      includeLowers: false,
      includeUppers: false
    });
  }
  noneOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (set.length === 0) return new this.Collection(this);
    try {
      set.sort(this._ascending);
    } catch (e) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    const ranges = set.reduce((res, val) => res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]], null);
    ranges.push([set[set.length - 1], this.db._maxKey]);
    return this.inAnyRange(ranges, {
      includeLowers: false,
      includeUppers: false
    });
  }
  inAnyRange(ranges, options) {
    const cmp2 = this._cmp,
      ascending = this._ascending,
      descending = this._descending,
      min = this._min,
      max = this._max;
    if (ranges.length === 0) return emptyCollection(this);
    if (!ranges.every(range => range[0] !== void 0 && range[1] !== void 0 && ascending(range[0], range[1]) <= 0)) {
      return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
    }
    const includeLowers = !options || options.includeLowers !== false;
    const includeUppers = options && options.includeUppers === true;
    function addRange2(ranges2, newRange) {
      let i = 0,
        l = ranges2.length;
      for (; i < l; ++i) {
        const range = ranges2[i];
        if (cmp2(newRange[0], range[1]) < 0 && cmp2(newRange[1], range[0]) > 0) {
          range[0] = min(range[0], newRange[0]);
          range[1] = max(range[1], newRange[1]);
          break;
        }
      }
      if (i === l) ranges2.push(newRange);
      return ranges2;
    }
    let sortDirection = ascending;
    function rangeSorter(a, b) {
      return sortDirection(a[0], b[0]);
    }
    let set;
    try {
      set = ranges.reduce(addRange2, []);
      set.sort(rangeSorter);
    } catch (ex) {
      return fail(this, INVALID_KEY_ARGUMENT);
    }
    let rangePos = 0;
    const keyIsBeyondCurrentEntry = includeUppers ? key => ascending(key, set[rangePos][1]) > 0 : key => ascending(key, set[rangePos][1]) >= 0;
    const keyIsBeforeCurrentEntry = includeLowers ? key => descending(key, set[rangePos][0]) > 0 : key => descending(key, set[rangePos][0]) >= 0;
    function keyWithinCurrentRange(key) {
      return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
    }
    let checkKey = keyIsBeyondCurrentEntry;
    const c = new this.Collection(this, () => createRange(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers));
    c._ondirectionchange = direction => {
      if (direction === "next") {
        checkKey = keyIsBeyondCurrentEntry;
        sortDirection = ascending;
      } else {
        checkKey = keyIsBeforeCurrentEntry;
        sortDirection = descending;
      }
      set.sort(rangeSorter);
    };
    c._addAlgorithm((cursor, advance, resolve) => {
      var key = cursor.key;
      while (checkKey(key)) {
        ++rangePos;
        if (rangePos === set.length) {
          advance(resolve);
          return false;
        }
      }
      if (keyWithinCurrentRange(key)) {
        return true;
      } else if (this._cmp(key, set[rangePos][1]) === 0 || this._cmp(key, set[rangePos][0]) === 0) {
        return false;
      } else {
        advance(() => {
          if (sortDirection === ascending) cursor.continue(set[rangePos][0]);else cursor.continue(set[rangePos][1]);
        });
        return false;
      }
    });
    return c;
  }
  startsWithAnyOf() {
    const set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
    if (!set.every(s => typeof s === "string")) {
      return fail(this, "startsWithAnyOf() only works with strings");
    }
    if (set.length === 0) return emptyCollection(this);
    return this.inAnyRange(set.map(str => [str, str + maxString]));
  }
};
function createWhereClauseConstructor(db) {
  return makeClassConstructor(WhereClause.prototype, function WhereClause2(table, index, orCollection) {
    this.db = db;
    this._ctx = {
      table,
      index: index === ":id" ? null : index,
      or: orCollection
    };
    const indexedDB2 = db._deps.indexedDB;
    if (!indexedDB2) throw new exceptions.MissingAPI();
    this._cmp = this._ascending = indexedDB2.cmp.bind(indexedDB2);
    this._descending = (a, b) => indexedDB2.cmp(b, a);
    this._max = (a, b) => indexedDB2.cmp(a, b) > 0 ? a : b;
    this._min = (a, b) => indexedDB2.cmp(a, b) < 0 ? a : b;
    this._IDBKeyRange = db._deps.IDBKeyRange;
  });
}
function eventRejectHandler(reject) {
  return wrap(function (event) {
    preventDefault(event);
    reject(event.target.error);
    return false;
  });
}
function preventDefault(event) {
  if (event.stopPropagation) event.stopPropagation();
  if (event.preventDefault) event.preventDefault();
}
var DEXIE_STORAGE_MUTATED_EVENT_NAME = "storagemutated";
var STORAGE_MUTATED_DOM_EVENT_NAME = "x-storagemutated-1";
var globalEvents = Events(null, DEXIE_STORAGE_MUTATED_EVENT_NAME);
var Transaction = class {
  _lock() {
    assert(!PSD.global);
    ++this._reculock;
    if (this._reculock === 1 && !PSD.global) PSD.lockOwnerFor = this;
    return this;
  }
  _unlock() {
    assert(!PSD.global);
    if (--this._reculock === 0) {
      if (!PSD.global) PSD.lockOwnerFor = null;
      while (this._blockedFuncs.length > 0 && !this._locked()) {
        var fnAndPSD = this._blockedFuncs.shift();
        try {
          usePSD(fnAndPSD[1], fnAndPSD[0]);
        } catch (e) {}
      }
    }
    return this;
  }
  _locked() {
    return this._reculock && PSD.lockOwnerFor !== this;
  }
  create(idbtrans) {
    if (!this.mode) return this;
    const idbdb = this.db.idbdb;
    const dbOpenError = this.db._state.dbOpenError;
    assert(!this.idbtrans);
    if (!idbtrans && !idbdb) {
      switch (dbOpenError && dbOpenError.name) {
        case "DatabaseClosedError":
          throw new exceptions.DatabaseClosed(dbOpenError);
        case "MissingAPIError":
          throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
        default:
          throw new exceptions.OpenFailed(dbOpenError);
      }
    }
    if (!this.active) throw new exceptions.TransactionInactive();
    assert(this._completion._state === null);
    idbtrans = this.idbtrans = idbtrans || (this.db.core ? this.db.core.transaction(this.storeNames, this.mode, {
      durability: this.chromeTransactionDurability
    }) : idbdb.transaction(this.storeNames, this.mode, {
      durability: this.chromeTransactionDurability
    }));
    idbtrans.onerror = wrap(ev => {
      preventDefault(ev);
      this._reject(idbtrans.error);
    });
    idbtrans.onabort = wrap(ev => {
      preventDefault(ev);
      this.active && this._reject(new exceptions.Abort(idbtrans.error));
      this.active = false;
      this.on("abort").fire(ev);
    });
    idbtrans.oncomplete = wrap(() => {
      this.active = false;
      this._resolve();
      if ("mutatedParts" in idbtrans) {
        globalEvents.storagemutated.fire(idbtrans["mutatedParts"]);
      }
    });
    return this;
  }
  _promise(mode, fn, bWriteLock) {
    if (mode === "readwrite" && this.mode !== "readwrite") return rejection(new exceptions.ReadOnly("Transaction is readonly"));
    if (!this.active) return rejection(new exceptions.TransactionInactive());
    if (this._locked()) {
      return new DexiePromise((resolve, reject) => {
        this._blockedFuncs.push([() => {
          this._promise(mode, fn, bWriteLock).then(resolve, reject);
        }, PSD]);
      });
    } else if (bWriteLock) {
      return newScope(() => {
        var p2 = new DexiePromise((resolve, reject) => {
          this._lock();
          const rv = fn(resolve, reject, this);
          if (rv && rv.then) rv.then(resolve, reject);
        });
        p2.finally(() => this._unlock());
        p2._lib = true;
        return p2;
      });
    } else {
      var p = new DexiePromise((resolve, reject) => {
        var rv = fn(resolve, reject, this);
        if (rv && rv.then) rv.then(resolve, reject);
      });
      p._lib = true;
      return p;
    }
  }
  _root() {
    return this.parent ? this.parent._root() : this;
  }
  waitFor(promiseLike) {
    var root = this._root();
    const promise = DexiePromise.resolve(promiseLike);
    if (root._waitingFor) {
      root._waitingFor = root._waitingFor.then(() => promise);
    } else {
      root._waitingFor = promise;
      root._waitingQueue = [];
      var store = root.idbtrans.objectStore(root.storeNames[0]);
      (function spin() {
        ++root._spinCount;
        while (root._waitingQueue.length) root._waitingQueue.shift()();
        if (root._waitingFor) store.get(-Infinity).onsuccess = spin;
      })();
    }
    var currentWaitPromise = root._waitingFor;
    return new DexiePromise((resolve, reject) => {
      promise.then(res => root._waitingQueue.push(wrap(resolve.bind(null, res))), err => root._waitingQueue.push(wrap(reject.bind(null, err)))).finally(() => {
        if (root._waitingFor === currentWaitPromise) {
          root._waitingFor = null;
        }
      });
    });
  }
  abort() {
    if (this.active) {
      this.active = false;
      if (this.idbtrans) this.idbtrans.abort();
      this._reject(new exceptions.Abort());
    }
  }
  table(tableName) {
    const memoizedTables = this._memoizedTables || (this._memoizedTables = {});
    if (hasOwn(memoizedTables, tableName)) return memoizedTables[tableName];
    const tableSchema = this.schema[tableName];
    if (!tableSchema) {
      throw new exceptions.NotFound("Table " + tableName + " not part of transaction");
    }
    const transactionBoundTable = new this.db.Table(tableName, tableSchema, this);
    transactionBoundTable.core = this.db.core.table(tableName);
    memoizedTables[tableName] = transactionBoundTable;
    return transactionBoundTable;
  }
};
function createTransactionConstructor(db) {
  return makeClassConstructor(Transaction.prototype, function Transaction2(mode, storeNames, dbschema, chromeTransactionDurability, parent) {
    this.db = db;
    this.mode = mode;
    this.storeNames = storeNames;
    this.schema = dbschema;
    this.chromeTransactionDurability = chromeTransactionDurability;
    this.idbtrans = null;
    this.on = Events(this, "complete", "error", "abort");
    this.parent = parent || null;
    this.active = true;
    this._reculock = 0;
    this._blockedFuncs = [];
    this._resolve = null;
    this._reject = null;
    this._waitingFor = null;
    this._waitingQueue = null;
    this._spinCount = 0;
    this._completion = new DexiePromise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this._completion.then(() => {
      this.active = false;
      this.on.complete.fire();
    }, e => {
      var wasActive = this.active;
      this.active = false;
      this.on.error.fire(e);
      this.parent ? this.parent._reject(e) : wasActive && this.idbtrans && this.idbtrans.abort();
      return rejection(e);
    });
  });
}
function createIndexSpec(name, keyPath, unique, multi, auto, compound, isPrimKey) {
  return {
    name,
    keyPath,
    unique,
    multi,
    auto,
    compound,
    src: (unique && !isPrimKey ? "&" : "") + (multi ? "*" : "") + (auto ? "++" : "") + nameFromKeyPath(keyPath)
  };
}
function nameFromKeyPath(keyPath) {
  return typeof keyPath === "string" ? keyPath : keyPath ? "[" + [].join.call(keyPath, "+") + "]" : "";
}
function createTableSchema(name, primKey, indexes) {
  return {
    name,
    primKey,
    indexes,
    mappedClass: null,
    idxByName: arrayToObject(indexes, index => [index.name, index])
  };
}
function safariMultiStoreFix(storeNames) {
  return storeNames.length === 1 ? storeNames[0] : storeNames;
}
var getMaxKey = IdbKeyRange => {
  try {
    IdbKeyRange.only([[]]);
    getMaxKey = () => [[]];
    return [[]];
  } catch (e) {
    getMaxKey = () => maxString;
    return maxString;
  }
};
function getKeyExtractor(keyPath) {
  if (keyPath == null) {
    return () => void 0;
  } else if (typeof keyPath === "string") {
    return getSinglePathKeyExtractor(keyPath);
  } else {
    return obj => getByKeyPath(obj, keyPath);
  }
}
function getSinglePathKeyExtractor(keyPath) {
  const split = keyPath.split(".");
  if (split.length === 1) {
    return obj => obj[keyPath];
  } else {
    return obj => getByKeyPath(obj, keyPath);
  }
}
function arrayify(arrayLike) {
  return [].slice.call(arrayLike);
}
var _id_counter = 0;
function getKeyPathAlias(keyPath) {
  return keyPath == null ? ":id" : typeof keyPath === "string" ? keyPath : `[${keyPath.join("+")}]`;
}
function createDBCore(db, IdbKeyRange, tmpTrans) {
  function extractSchema(db2, trans) {
    const tables2 = arrayify(db2.objectStoreNames);
    return {
      schema: {
        name: db2.name,
        tables: tables2.map(table => trans.objectStore(table)).map(store => {
          const {
            keyPath,
            autoIncrement
          } = store;
          const compound = isArray(keyPath);
          const outbound = keyPath == null;
          const indexByKeyPath = {};
          const result = {
            name: store.name,
            primaryKey: {
              name: null,
              isPrimaryKey: true,
              outbound,
              compound,
              keyPath,
              autoIncrement,
              unique: true,
              extractKey: getKeyExtractor(keyPath)
            },
            indexes: arrayify(store.indexNames).map(indexName => store.index(indexName)).map(index => {
              const {
                name,
                unique,
                multiEntry,
                keyPath: keyPath2
              } = index;
              const compound2 = isArray(keyPath2);
              const result2 = {
                name,
                compound: compound2,
                keyPath: keyPath2,
                unique,
                multiEntry,
                extractKey: getKeyExtractor(keyPath2)
              };
              indexByKeyPath[getKeyPathAlias(keyPath2)] = result2;
              return result2;
            }),
            getIndexByKeyPath: keyPath2 => indexByKeyPath[getKeyPathAlias(keyPath2)]
          };
          indexByKeyPath[":id"] = result.primaryKey;
          if (keyPath != null) {
            indexByKeyPath[getKeyPathAlias(keyPath)] = result.primaryKey;
          }
          return result;
        })
      },
      hasGetAll: tables2.length > 0 && "getAll" in trans.objectStore(tables2[0]) && !(typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604)
    };
  }
  function makeIDBKeyRange(range) {
    if (range.type === 3) return null;
    if (range.type === 4) throw new Error("Cannot convert never type to IDBKeyRange");
    const {
      lower,
      upper,
      lowerOpen,
      upperOpen
    } = range;
    const idbRange = lower === void 0 ? upper === void 0 ? null : IdbKeyRange.upperBound(upper, !!upperOpen) : upper === void 0 ? IdbKeyRange.lowerBound(lower, !!lowerOpen) : IdbKeyRange.bound(lower, upper, !!lowerOpen, !!upperOpen);
    return idbRange;
  }
  function createDbCoreTable(tableSchema) {
    const tableName = tableSchema.name;
    function mutate({
      trans,
      type: type2,
      keys: keys2,
      values,
      range
    }) {
      return new Promise((resolve, reject) => {
        resolve = wrap(resolve);
        const store = trans.objectStore(tableName);
        const outbound = store.keyPath == null;
        const isAddOrPut = type2 === "put" || type2 === "add";
        if (!isAddOrPut && type2 !== "delete" && type2 !== "deleteRange") throw new Error("Invalid operation type: " + type2);
        const {
          length
        } = keys2 || values || {
          length: 1
        };
        if (keys2 && values && keys2.length !== values.length) {
          throw new Error("Given keys array must have same length as given values array.");
        }
        if (length === 0) return resolve({
          numFailures: 0,
          failures: {},
          results: [],
          lastResult: void 0
        });
        let req;
        const reqs = [];
        const failures = [];
        let numFailures = 0;
        const errorHandler = event => {
          ++numFailures;
          preventDefault(event);
        };
        if (type2 === "deleteRange") {
          if (range.type === 4) return resolve({
            numFailures,
            failures,
            results: [],
            lastResult: void 0
          });
          if (range.type === 3) reqs.push(req = store.clear());else reqs.push(req = store.delete(makeIDBKeyRange(range)));
        } else {
          const [args1, args2] = isAddOrPut ? outbound ? [values, keys2] : [values, null] : [keys2, null];
          if (isAddOrPut) {
            for (let i = 0; i < length; ++i) {
              reqs.push(req = args2 && args2[i] !== void 0 ? store[type2](args1[i], args2[i]) : store[type2](args1[i]));
              req.onerror = errorHandler;
            }
          } else {
            for (let i = 0; i < length; ++i) {
              reqs.push(req = store[type2](args1[i]));
              req.onerror = errorHandler;
            }
          }
        }
        const done = event => {
          const lastResult = event.target.result;
          reqs.forEach((req2, i) => req2.error != null && (failures[i] = req2.error));
          resolve({
            numFailures,
            failures,
            results: type2 === "delete" ? keys2 : reqs.map(req2 => req2.result),
            lastResult
          });
        };
        req.onerror = event => {
          errorHandler(event);
          done(event);
        };
        req.onsuccess = done;
      });
    }
    function openCursor2({
      trans,
      values,
      query: query2,
      reverse,
      unique
    }) {
      return new Promise((resolve, reject) => {
        resolve = wrap(resolve);
        const {
          index,
          range
        } = query2;
        const store = trans.objectStore(tableName);
        const source = index.isPrimaryKey ? store : store.index(index.name);
        const direction = reverse ? unique ? "prevunique" : "prev" : unique ? "nextunique" : "next";
        const req = values || !("openKeyCursor" in source) ? source.openCursor(makeIDBKeyRange(range), direction) : source.openKeyCursor(makeIDBKeyRange(range), direction);
        req.onerror = eventRejectHandler(reject);
        req.onsuccess = wrap(ev => {
          const cursor = req.result;
          if (!cursor) {
            resolve(null);
            return;
          }
          cursor.___id = ++_id_counter;
          cursor.done = false;
          const _cursorContinue = cursor.continue.bind(cursor);
          let _cursorContinuePrimaryKey = cursor.continuePrimaryKey;
          if (_cursorContinuePrimaryKey) _cursorContinuePrimaryKey = _cursorContinuePrimaryKey.bind(cursor);
          const _cursorAdvance = cursor.advance.bind(cursor);
          const doThrowCursorIsNotStarted = () => {
            throw new Error("Cursor not started");
          };
          const doThrowCursorIsStopped = () => {
            throw new Error("Cursor not stopped");
          };
          cursor.trans = trans;
          cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsNotStarted;
          cursor.fail = wrap(reject);
          cursor.next = function () {
            let gotOne = 1;
            return this.start(() => gotOne-- ? this.continue() : this.stop()).then(() => this);
          };
          cursor.start = callback => {
            const iterationPromise = new Promise((resolveIteration, rejectIteration) => {
              resolveIteration = wrap(resolveIteration);
              req.onerror = eventRejectHandler(rejectIteration);
              cursor.fail = rejectIteration;
              cursor.stop = value => {
                cursor.stop = cursor.continue = cursor.continuePrimaryKey = cursor.advance = doThrowCursorIsStopped;
                resolveIteration(value);
              };
            });
            const guardedCallback = () => {
              if (req.result) {
                try {
                  callback();
                } catch (err) {
                  cursor.fail(err);
                }
              } else {
                cursor.done = true;
                cursor.start = () => {
                  throw new Error("Cursor behind last entry");
                };
                cursor.stop();
              }
            };
            req.onsuccess = wrap(ev2 => {
              req.onsuccess = guardedCallback;
              guardedCallback();
            });
            cursor.continue = _cursorContinue;
            cursor.continuePrimaryKey = _cursorContinuePrimaryKey;
            cursor.advance = _cursorAdvance;
            guardedCallback();
            return iterationPromise;
          };
          resolve(cursor);
        }, reject);
      });
    }
    function query(hasGetAll2) {
      return request => {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const {
            trans,
            values,
            limit,
            query: query2
          } = request;
          const nonInfinitLimit = limit === Infinity ? void 0 : limit;
          const {
            index,
            range
          } = query2;
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const idbKeyRange = makeIDBKeyRange(range);
          if (limit === 0) return resolve({
            result: []
          });
          if (hasGetAll2) {
            const req = values ? source.getAll(idbKeyRange, nonInfinitLimit) : source.getAllKeys(idbKeyRange, nonInfinitLimit);
            req.onsuccess = event => resolve({
              result: event.target.result
            });
            req.onerror = eventRejectHandler(reject);
          } else {
            let count = 0;
            const req = values || !("openKeyCursor" in source) ? source.openCursor(idbKeyRange) : source.openKeyCursor(idbKeyRange);
            const result = [];
            req.onsuccess = event => {
              const cursor = req.result;
              if (!cursor) return resolve({
                result
              });
              result.push(values ? cursor.value : cursor.primaryKey);
              if (++count === limit) return resolve({
                result
              });
              cursor.continue();
            };
            req.onerror = eventRejectHandler(reject);
          }
        });
      };
    }
    return {
      name: tableName,
      schema: tableSchema,
      mutate,
      getMany({
        trans,
        keys: keys2
      }) {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const store = trans.objectStore(tableName);
          const length = keys2.length;
          const result = new Array(length);
          let keyCount = 0;
          let callbackCount = 0;
          let req;
          const successHandler = event => {
            const req2 = event.target;
            if ((result[req2._pos] = req2.result) != null) ;
            if (++callbackCount === keyCount) resolve(result);
          };
          const errorHandler = eventRejectHandler(reject);
          for (let i = 0; i < length; ++i) {
            const key = keys2[i];
            if (key != null) {
              req = store.get(keys2[i]);
              req._pos = i;
              req.onsuccess = successHandler;
              req.onerror = errorHandler;
              ++keyCount;
            }
          }
          if (keyCount === 0) resolve(result);
        });
      },
      get({
        trans,
        key
      }) {
        return new Promise((resolve, reject) => {
          resolve = wrap(resolve);
          const store = trans.objectStore(tableName);
          const req = store.get(key);
          req.onsuccess = event => resolve(event.target.result);
          req.onerror = eventRejectHandler(reject);
        });
      },
      query: query(hasGetAll),
      openCursor: openCursor2,
      count({
        query: query2,
        trans
      }) {
        const {
          index,
          range
        } = query2;
        return new Promise((resolve, reject) => {
          const store = trans.objectStore(tableName);
          const source = index.isPrimaryKey ? store : store.index(index.name);
          const idbKeyRange = makeIDBKeyRange(range);
          const req = idbKeyRange ? source.count(idbKeyRange) : source.count();
          req.onsuccess = wrap(ev => resolve(ev.target.result));
          req.onerror = eventRejectHandler(reject);
        });
      }
    };
  }
  const {
    schema,
    hasGetAll
  } = extractSchema(db, tmpTrans);
  const tables = schema.tables.map(tableSchema => createDbCoreTable(tableSchema));
  const tableMap = {};
  tables.forEach(table => tableMap[table.name] = table);
  return {
    stack: "dbcore",
    transaction: db.transaction.bind(db),
    table(name) {
      const result = tableMap[name];
      if (!result) throw new Error(`Table '${name}' not found`);
      return tableMap[name];
    },
    MIN_KEY: -Infinity,
    MAX_KEY: getMaxKey(IdbKeyRange),
    schema
  };
}
function createMiddlewareStack(stackImpl, middlewares) {
  return middlewares.reduce((down, {
    create
  }) => ({
    ...down,
    ...create(down)
  }), stackImpl);
}
function createMiddlewareStacks(middlewares, idbdb, {
  IDBKeyRange,
  indexedDB: indexedDB2
}, tmpTrans) {
  const dbcore = createMiddlewareStack(createDBCore(idbdb, IDBKeyRange, tmpTrans), middlewares.dbcore);
  return {
    dbcore
  };
}
function generateMiddlewareStacks({
  _novip: db
}, tmpTrans) {
  const idbdb = tmpTrans.db;
  const stacks = createMiddlewareStacks(db._middlewares, idbdb, db._deps, tmpTrans);
  db.core = stacks.dbcore;
  db.tables.forEach(table => {
    const tableName = table.name;
    if (db.core.schema.tables.some(tbl => tbl.name === tableName)) {
      table.core = db.core.table(tableName);
      if (db[tableName] instanceof db.Table) {
        db[tableName].core = table.core;
      }
    }
  });
}
function setApiOnPlace({
  _novip: db
}, objs, tableNames, dbschema) {
  tableNames.forEach(tableName => {
    const schema = dbschema[tableName];
    objs.forEach(obj => {
      const propDesc = getPropertyDescriptor(obj, tableName);
      if (!propDesc || "value" in propDesc && propDesc.value === void 0) {
        if (obj === db.Transaction.prototype || obj instanceof db.Transaction) {
          setProp(obj, tableName, {
            get() {
              return this.table(tableName);
            },
            set(value) {
              defineProperty(this, tableName, {
                value,
                writable: true,
                configurable: true,
                enumerable: true
              });
            }
          });
        } else {
          obj[tableName] = new db.Table(tableName, schema);
        }
      }
    });
  });
}
function removeTablesApi({
  _novip: db
}, objs) {
  objs.forEach(obj => {
    for (let key in obj) {
      if (obj[key] instanceof db.Table) delete obj[key];
    }
  });
}
function lowerVersionFirst(a, b) {
  return a._cfg.version - b._cfg.version;
}
function runUpgraders(db, oldVersion, idbUpgradeTrans, reject) {
  const globalSchema = db._dbSchema;
  const trans = db._createTransaction("readwrite", db._storeNames, globalSchema);
  trans.create(idbUpgradeTrans);
  trans._completion.catch(reject);
  const rejectTransaction = trans._reject.bind(trans);
  const transless = PSD.transless || PSD;
  newScope(() => {
    PSD.trans = trans;
    PSD.transless = transless;
    if (oldVersion === 0) {
      keys(globalSchema).forEach(tableName => {
        createTable(idbUpgradeTrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
      });
      generateMiddlewareStacks(db, idbUpgradeTrans);
      DexiePromise.follow(() => db.on.populate.fire(trans)).catch(rejectTransaction);
    } else updateTablesAndIndexes(db, oldVersion, trans, idbUpgradeTrans).catch(rejectTransaction);
  });
}
function updateTablesAndIndexes({
  _novip: db
}, oldVersion, trans, idbUpgradeTrans) {
  const queue = [];
  const versions = db._versions;
  let globalSchema = db._dbSchema = buildGlobalSchema(db, db.idbdb, idbUpgradeTrans);
  let anyContentUpgraderHasRun = false;
  const versToRun = versions.filter(v => v._cfg.version >= oldVersion);
  versToRun.forEach(version => {
    queue.push(() => {
      const oldSchema = globalSchema;
      const newSchema = version._cfg.dbschema;
      adjustToExistingIndexNames(db, oldSchema, idbUpgradeTrans);
      adjustToExistingIndexNames(db, newSchema, idbUpgradeTrans);
      globalSchema = db._dbSchema = newSchema;
      const diff = getSchemaDiff(oldSchema, newSchema);
      diff.add.forEach(tuple => {
        createTable(idbUpgradeTrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
      });
      diff.change.forEach(change => {
        if (change.recreate) {
          throw new exceptions.Upgrade("Not yet support for changing primary key");
        } else {
          const store = idbUpgradeTrans.objectStore(change.name);
          change.add.forEach(idx => addIndex(store, idx));
          change.change.forEach(idx => {
            store.deleteIndex(idx.name);
            addIndex(store, idx);
          });
          change.del.forEach(idxName => store.deleteIndex(idxName));
        }
      });
      const contentUpgrade = version._cfg.contentUpgrade;
      if (contentUpgrade && version._cfg.version > oldVersion) {
        generateMiddlewareStacks(db, idbUpgradeTrans);
        trans._memoizedTables = {};
        anyContentUpgraderHasRun = true;
        let upgradeSchema = shallowClone(newSchema);
        diff.del.forEach(table => {
          upgradeSchema[table] = oldSchema[table];
        });
        removeTablesApi(db, [db.Transaction.prototype]);
        setApiOnPlace(db, [db.Transaction.prototype], keys(upgradeSchema), upgradeSchema);
        trans.schema = upgradeSchema;
        const contentUpgradeIsAsync = isAsyncFunction(contentUpgrade);
        if (contentUpgradeIsAsync) {
          incrementExpectedAwaits();
        }
        let returnValue;
        const promiseFollowed = DexiePromise.follow(() => {
          returnValue = contentUpgrade(trans);
          if (returnValue) {
            if (contentUpgradeIsAsync) {
              var decrementor = decrementExpectedAwaits.bind(null, null);
              returnValue.then(decrementor, decrementor);
            }
          }
        });
        return returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue) : promiseFollowed.then(() => returnValue);
      }
    });
    queue.push(idbtrans => {
      if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
        const newSchema = version._cfg.dbschema;
        deleteRemovedTables(newSchema, idbtrans);
      }
      removeTablesApi(db, [db.Transaction.prototype]);
      setApiOnPlace(db, [db.Transaction.prototype], db._storeNames, db._dbSchema);
      trans.schema = db._dbSchema;
    });
  });
  function runQueue() {
    return queue.length ? DexiePromise.resolve(queue.shift()(trans.idbtrans)).then(runQueue) : DexiePromise.resolve();
  }
  return runQueue().then(() => {
    createMissingTables(globalSchema, idbUpgradeTrans);
  });
}
function getSchemaDiff(oldSchema, newSchema) {
  const diff = {
    del: [],
    add: [],
    change: []
  };
  let table;
  for (table in oldSchema) {
    if (!newSchema[table]) diff.del.push(table);
  }
  for (table in newSchema) {
    const oldDef = oldSchema[table],
      newDef = newSchema[table];
    if (!oldDef) {
      diff.add.push([table, newDef]);
    } else {
      const change = {
        name: table,
        def: newDef,
        recreate: false,
        del: [],
        add: [],
        change: []
      };
      if ("" + (oldDef.primKey.keyPath || "") !== "" + (newDef.primKey.keyPath || "") || oldDef.primKey.auto !== newDef.primKey.auto && !isIEOrEdge) {
        change.recreate = true;
        diff.change.push(change);
      } else {
        const oldIndexes = oldDef.idxByName;
        const newIndexes = newDef.idxByName;
        let idxName;
        for (idxName in oldIndexes) {
          if (!newIndexes[idxName]) change.del.push(idxName);
        }
        for (idxName in newIndexes) {
          const oldIdx = oldIndexes[idxName],
            newIdx = newIndexes[idxName];
          if (!oldIdx) change.add.push(newIdx);else if (oldIdx.src !== newIdx.src) change.change.push(newIdx);
        }
        if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
          diff.change.push(change);
        }
      }
    }
  }
  return diff;
}
function createTable(idbtrans, tableName, primKey, indexes) {
  const store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? {
    keyPath: primKey.keyPath,
    autoIncrement: primKey.auto
  } : {
    autoIncrement: primKey.auto
  });
  indexes.forEach(idx => addIndex(store, idx));
  return store;
}
function createMissingTables(newSchema, idbtrans) {
  keys(newSchema).forEach(tableName => {
    if (!idbtrans.db.objectStoreNames.contains(tableName)) {
      createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
    }
  });
}
function deleteRemovedTables(newSchema, idbtrans) {
  [].slice.call(idbtrans.db.objectStoreNames).forEach(storeName => newSchema[storeName] == null && idbtrans.db.deleteObjectStore(storeName));
}
function addIndex(store, idx) {
  store.createIndex(idx.name, idx.keyPath, {
    unique: idx.unique,
    multiEntry: idx.multi
  });
}
function buildGlobalSchema(db, idbdb, tmpTrans) {
  const globalSchema = {};
  const dbStoreNames = slice(idbdb.objectStoreNames, 0);
  dbStoreNames.forEach(storeName => {
    const store = tmpTrans.objectStore(storeName);
    let keyPath = store.keyPath;
    const primKey = createIndexSpec(nameFromKeyPath(keyPath), keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== "string", true);
    const indexes = [];
    for (let j = 0; j < store.indexNames.length; ++j) {
      const idbindex = store.index(store.indexNames[j]);
      keyPath = idbindex.keyPath;
      var index = createIndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== "string", false);
      indexes.push(index);
    }
    globalSchema[storeName] = createTableSchema(storeName, primKey, indexes);
  });
  return globalSchema;
}
function readGlobalSchema({
  _novip: db
}, idbdb, tmpTrans) {
  db.verno = idbdb.version / 10;
  const globalSchema = db._dbSchema = buildGlobalSchema(db, idbdb, tmpTrans);
  db._storeNames = slice(idbdb.objectStoreNames, 0);
  setApiOnPlace(db, [db._allTables], keys(globalSchema), globalSchema);
}
function verifyInstalledSchema(db, tmpTrans) {
  const installedSchema = buildGlobalSchema(db, db.idbdb, tmpTrans);
  const diff = getSchemaDiff(installedSchema, db._dbSchema);
  return !(diff.add.length || diff.change.some(ch => ch.add.length || ch.change.length));
}
function adjustToExistingIndexNames({
  _novip: db
}, schema, idbtrans) {
  const storeNames = idbtrans.db.objectStoreNames;
  for (let i = 0; i < storeNames.length; ++i) {
    const storeName = storeNames[i];
    const store = idbtrans.objectStore(storeName);
    db._hasGetAll = "getAll" in store;
    for (let j = 0; j < store.indexNames.length; ++j) {
      const indexName = store.indexNames[j];
      const keyPath = store.index(indexName).keyPath;
      const dexieName = typeof keyPath === "string" ? keyPath : "[" + slice(keyPath).join("+") + "]";
      if (schema[storeName]) {
        const indexSpec = schema[storeName].idxByName[dexieName];
        if (indexSpec) {
          indexSpec.name = indexName;
          delete schema[storeName].idxByName[dexieName];
          schema[storeName].idxByName[indexName] = indexSpec;
        }
      }
    }
  }
  if (typeof navigator !== "undefined" && /Safari/.test(navigator.userAgent) && !/(Chrome\/|Edge\/)/.test(navigator.userAgent) && _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope && [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
    db._hasGetAll = false;
  }
}
function parseIndexSyntax(primKeyAndIndexes) {
  return primKeyAndIndexes.split(",").map((index, indexNum) => {
    index = index.trim();
    const name = index.replace(/([&*]|\+\+)/g, "");
    const keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split("+") : name;
    return createIndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), indexNum === 0);
  });
}
var Version = class {
  _parseStoresSpec(stores, outSchema) {
    keys(stores).forEach(tableName => {
      if (stores[tableName] !== null) {
        var indexes = parseIndexSyntax(stores[tableName]);
        var primKey = indexes.shift();
        if (primKey.multi) throw new exceptions.Schema("Primary key cannot be multi-valued");
        indexes.forEach(idx => {
          if (idx.auto) throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
          if (!idx.keyPath) throw new exceptions.Schema("Index must have a name and cannot be an empty string");
        });
        outSchema[tableName] = createTableSchema(tableName, primKey, indexes);
      }
    });
  }
  stores(stores) {
    const db = this.db;
    this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
    const versions = db._versions;
    const storesSpec = {};
    let dbschema = {};
    versions.forEach(version => {
      extend(storesSpec, version._cfg.storesSource);
      dbschema = version._cfg.dbschema = {};
      version._parseStoresSpec(storesSpec, dbschema);
    });
    db._dbSchema = dbschema;
    removeTablesApi(db, [db._allTables, db, db.Transaction.prototype]);
    setApiOnPlace(db, [db._allTables, db, db.Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
    db._storeNames = keys(dbschema);
    return this;
  }
  upgrade(upgradeFunction) {
    this._cfg.contentUpgrade = promisableChain(this._cfg.contentUpgrade || nop, upgradeFunction);
    return this;
  }
};
function createVersionConstructor(db) {
  return makeClassConstructor(Version.prototype, function Version2(versionNumber) {
    this.db = db;
    this._cfg = {
      version: versionNumber,
      storesSource: null,
      dbschema: {},
      tables: {},
      contentUpgrade: null
    };
  });
}
function getDbNamesTable(indexedDB2, IDBKeyRange) {
  let dbNamesDB = indexedDB2["_dbNamesDB"];
  if (!dbNamesDB) {
    dbNamesDB = indexedDB2["_dbNamesDB"] = new Dexie$1(DBNAMES_DB, {
      addons: [],
      indexedDB: indexedDB2,
      IDBKeyRange
    });
    dbNamesDB.version(1).stores({
      dbnames: "name"
    });
  }
  return dbNamesDB.table("dbnames");
}
function hasDatabasesNative(indexedDB2) {
  return indexedDB2 && typeof indexedDB2.databases === "function";
}
function getDatabaseNames({
  indexedDB: indexedDB2,
  IDBKeyRange
}) {
  return hasDatabasesNative(indexedDB2) ? Promise.resolve(indexedDB2.databases()).then(infos => infos.map(info => info.name).filter(name => name !== DBNAMES_DB)) : getDbNamesTable(indexedDB2, IDBKeyRange).toCollection().primaryKeys();
}
function _onDatabaseCreated({
  indexedDB: indexedDB2,
  IDBKeyRange
}, name) {
  !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).put({
    name
  }).catch(nop);
}
function _onDatabaseDeleted({
  indexedDB: indexedDB2,
  IDBKeyRange
}, name) {
  !hasDatabasesNative(indexedDB2) && name !== DBNAMES_DB && getDbNamesTable(indexedDB2, IDBKeyRange).delete(name).catch(nop);
}
function vip(fn) {
  return newScope(function () {
    PSD.letThrough = true;
    return fn();
  });
}
function idbReady() {
  var isSafari = !navigator.userAgentData && /Safari\//.test(navigator.userAgent) && !/Chrom(e|ium)\//.test(navigator.userAgent);
  if (!isSafari || !indexedDB.databases) return Promise.resolve();
  var intervalId;
  return new Promise(function (resolve) {
    var tryIdb = function () {
      return indexedDB.databases().finally(resolve);
    };
    intervalId = setInterval(tryIdb, 100);
    tryIdb();
  }).finally(function () {
    return clearInterval(intervalId);
  });
}
function dexieOpen(db) {
  const state = db._state;
  const {
    indexedDB: indexedDB2
  } = db._deps;
  if (state.isBeingOpened || db.idbdb) return state.dbReadyPromise.then(() => state.dbOpenError ? rejection(state.dbOpenError) : db);
  debug && (state.openCanceller._stackHolder = getErrorWithStack());
  state.isBeingOpened = true;
  state.dbOpenError = null;
  state.openComplete = false;
  const openCanceller = state.openCanceller;
  function throwIfCancelled() {
    if (state.openCanceller !== openCanceller) throw new exceptions.DatabaseClosed("db.open() was cancelled");
  }
  let resolveDbReady = state.dbReadyResolve,
    upgradeTransaction = null,
    wasCreated = false;
  return DexiePromise.race([openCanceller, (typeof navigator === "undefined" ? DexiePromise.resolve() : idbReady()).then(() => new DexiePromise((resolve, reject) => {
    throwIfCancelled();
    if (!indexedDB2) throw new exceptions.MissingAPI();
    const dbName = db.name;
    const req = state.autoSchema ? indexedDB2.open(dbName) : indexedDB2.open(dbName, Math.round(db.verno * 10));
    if (!req) throw new exceptions.MissingAPI();
    req.onerror = eventRejectHandler(reject);
    req.onblocked = wrap(db._fireOnBlocked);
    req.onupgradeneeded = wrap(e => {
      upgradeTransaction = req.transaction;
      if (state.autoSchema && !db._options.allowEmptyDB) {
        req.onerror = preventDefault;
        upgradeTransaction.abort();
        req.result.close();
        const delreq = indexedDB2.deleteDatabase(dbName);
        delreq.onsuccess = delreq.onerror = wrap(() => {
          reject(new exceptions.NoSuchDatabase(`Database ${dbName} doesnt exist`));
        });
      } else {
        upgradeTransaction.onerror = eventRejectHandler(reject);
        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion;
        wasCreated = oldVer < 1;
        db._novip.idbdb = req.result;
        runUpgraders(db, oldVer / 10, upgradeTransaction, reject);
      }
    }, reject);
    req.onsuccess = wrap(() => {
      upgradeTransaction = null;
      const idbdb = db._novip.idbdb = req.result;
      const objectStoreNames = slice(idbdb.objectStoreNames);
      if (objectStoreNames.length > 0) try {
        const tmpTrans = idbdb.transaction(safariMultiStoreFix(objectStoreNames), "readonly");
        if (state.autoSchema) readGlobalSchema(db, idbdb, tmpTrans);else {
          adjustToExistingIndexNames(db, db._dbSchema, tmpTrans);
          if (!verifyInstalledSchema(db, tmpTrans)) {
            console.warn(`Dexie SchemaDiff: Schema was extended without increasing the number passed to db.version(). Some queries may fail.`);
          }
        }
        generateMiddlewareStacks(db, tmpTrans);
      } catch (e) {}
      connections.push(db);
      idbdb.onversionchange = wrap(ev => {
        state.vcFired = true;
        db.on("versionchange").fire(ev);
      });
      idbdb.onclose = wrap(ev => {
        db.on("close").fire(ev);
      });
      if (wasCreated) _onDatabaseCreated(db._deps, dbName);
      resolve();
    }, reject);
  }))]).then(() => {
    throwIfCancelled();
    state.onReadyBeingFired = [];
    return DexiePromise.resolve(vip(() => db.on.ready.fire(db.vip))).then(function fireRemainders() {
      if (state.onReadyBeingFired.length > 0) {
        let remainders = state.onReadyBeingFired.reduce(promisableChain, nop);
        state.onReadyBeingFired = [];
        return DexiePromise.resolve(vip(() => remainders(db.vip))).then(fireRemainders);
      }
    });
  }).finally(() => {
    state.onReadyBeingFired = null;
    state.isBeingOpened = false;
  }).then(() => {
    return db;
  }).catch(err => {
    state.dbOpenError = err;
    try {
      upgradeTransaction && upgradeTransaction.abort();
    } catch (_a) {}
    if (openCanceller === state.openCanceller) {
      db._close();
    }
    return rejection(err);
  }).finally(() => {
    state.openComplete = true;
    resolveDbReady();
  });
}
function awaitIterator(iterator) {
  var callNext = result => iterator.next(result),
    doThrow = error => iterator.throw(error),
    onSuccess = step(callNext),
    onError = step(doThrow);
  function step(getNext) {
    return val => {
      var next = getNext(val),
        value = next.value;
      return next.done ? value : !value || typeof value.then !== "function" ? isArray(value) ? Promise.all(value).then(onSuccess, onError) : onSuccess(value) : value.then(onSuccess, onError);
    };
  }
  return step(callNext)();
}
function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
  var i = arguments.length;
  if (i < 2) throw new exceptions.InvalidArgument("Too few arguments");
  var args = new Array(i - 1);
  while (--i) args[i - 1] = arguments[i];
  scopeFunc = args.pop();
  var tables = flatten(args);
  return [mode, tables, scopeFunc];
}
function enterTransactionScope(db, mode, storeNames, parentTransaction, scopeFunc) {
  return DexiePromise.resolve().then(() => {
    const transless = PSD.transless || PSD;
    const trans = db._createTransaction(mode, storeNames, db._dbSchema, parentTransaction);
    const zoneProps = {
      trans,
      transless
    };
    if (parentTransaction) {
      trans.idbtrans = parentTransaction.idbtrans;
    } else {
      try {
        trans.create();
        db._state.PR1398_maxLoop = 3;
      } catch (ex) {
        if (ex.name === errnames.InvalidState && db.isOpen() && --db._state.PR1398_maxLoop > 0) {
          console.warn("Dexie: Need to reopen db");
          db._close();
          return db.open().then(() => enterTransactionScope(db, mode, storeNames, null, scopeFunc));
        }
        return rejection(ex);
      }
    }
    const scopeFuncIsAsync = isAsyncFunction(scopeFunc);
    if (scopeFuncIsAsync) {
      incrementExpectedAwaits();
    }
    let returnValue;
    const promiseFollowed = DexiePromise.follow(() => {
      returnValue = scopeFunc.call(trans, trans);
      if (returnValue) {
        if (scopeFuncIsAsync) {
          var decrementor = decrementExpectedAwaits.bind(null, null);
          returnValue.then(decrementor, decrementor);
        } else if (typeof returnValue.next === "function" && typeof returnValue.throw === "function") {
          returnValue = awaitIterator(returnValue);
        }
      }
    }, zoneProps);
    return (returnValue && typeof returnValue.then === "function" ? DexiePromise.resolve(returnValue).then(x => trans.active ? x : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn"))) : promiseFollowed.then(() => returnValue)).then(x => {
      if (parentTransaction) trans._resolve();
      return trans._completion.then(() => x);
    }).catch(e => {
      trans._reject(e);
      return rejection(e);
    });
  });
}
function pad(a, value, count) {
  const result = isArray(a) ? a.slice() : [a];
  for (let i = 0; i < count; ++i) result.push(value);
  return result;
}
function createVirtualIndexMiddleware(down) {
  return {
    ...down,
    table(tableName) {
      const table = down.table(tableName);
      const {
        schema
      } = table;
      const indexLookup = {};
      const allVirtualIndexes = [];
      function addVirtualIndexes(keyPath, keyTail, lowLevelIndex) {
        const keyPathAlias = getKeyPathAlias(keyPath);
        const indexList = indexLookup[keyPathAlias] = indexLookup[keyPathAlias] || [];
        const keyLength = keyPath == null ? 0 : typeof keyPath === "string" ? 1 : keyPath.length;
        const isVirtual = keyTail > 0;
        const virtualIndex = {
          ...lowLevelIndex,
          isVirtual,
          keyTail,
          keyLength,
          extractKey: getKeyExtractor(keyPath),
          unique: !isVirtual && lowLevelIndex.unique
        };
        indexList.push(virtualIndex);
        if (!virtualIndex.isPrimaryKey) {
          allVirtualIndexes.push(virtualIndex);
        }
        if (keyLength > 1) {
          const virtualKeyPath = keyLength === 2 ? keyPath[0] : keyPath.slice(0, keyLength - 1);
          addVirtualIndexes(virtualKeyPath, keyTail + 1, lowLevelIndex);
        }
        indexList.sort((a, b) => a.keyTail - b.keyTail);
        return virtualIndex;
      }
      const primaryKey = addVirtualIndexes(schema.primaryKey.keyPath, 0, schema.primaryKey);
      indexLookup[":id"] = [primaryKey];
      for (const index of schema.indexes) {
        addVirtualIndexes(index.keyPath, 0, index);
      }
      function findBestIndex(keyPath) {
        const result2 = indexLookup[getKeyPathAlias(keyPath)];
        return result2 && result2[0];
      }
      function translateRange(range, keyTail) {
        return {
          type: range.type === 1 ? 2 : range.type,
          lower: pad(range.lower, range.lowerOpen ? down.MAX_KEY : down.MIN_KEY, keyTail),
          lowerOpen: true,
          upper: pad(range.upper, range.upperOpen ? down.MIN_KEY : down.MAX_KEY, keyTail),
          upperOpen: true
        };
      }
      function translateRequest(req) {
        const index = req.query.index;
        return index.isVirtual ? {
          ...req,
          query: {
            index,
            range: translateRange(req.query.range, index.keyTail)
          }
        } : req;
      }
      const result = {
        ...table,
        schema: {
          ...schema,
          primaryKey,
          indexes: allVirtualIndexes,
          getIndexByKeyPath: findBestIndex
        },
        count(req) {
          return table.count(translateRequest(req));
        },
        query(req) {
          return table.query(translateRequest(req));
        },
        openCursor(req) {
          const {
            keyTail,
            isVirtual,
            keyLength
          } = req.query.index;
          if (!isVirtual) return table.openCursor(req);
          function createVirtualCursor(cursor) {
            function _continue(key) {
              key != null ? cursor.continue(pad(key, req.reverse ? down.MAX_KEY : down.MIN_KEY, keyTail)) : req.unique ? cursor.continue(cursor.key.slice(0, keyLength).concat(req.reverse ? down.MIN_KEY : down.MAX_KEY, keyTail)) : cursor.continue();
            }
            const virtualCursor = Object.create(cursor, {
              continue: {
                value: _continue
              },
              continuePrimaryKey: {
                value(key, primaryKey2) {
                  cursor.continuePrimaryKey(pad(key, down.MAX_KEY, keyTail), primaryKey2);
                }
              },
              primaryKey: {
                get() {
                  return cursor.primaryKey;
                }
              },
              key: {
                get() {
                  const key = cursor.key;
                  return keyLength === 1 ? key[0] : key.slice(0, keyLength);
                }
              },
              value: {
                get() {
                  return cursor.value;
                }
              }
            });
            return virtualCursor;
          }
          return table.openCursor(translateRequest(req)).then(cursor => cursor && createVirtualCursor(cursor));
        }
      };
      return result;
    }
  };
}
var virtualIndexMiddleware = {
  stack: "dbcore",
  name: "VirtualIndexMiddleware",
  level: 1,
  create: createVirtualIndexMiddleware
};
function getObjectDiff(a, b, rv, prfx) {
  rv = rv || {};
  prfx = prfx || "";
  keys(a).forEach(prop => {
    if (!hasOwn(b, prop)) {
      rv[prfx + prop] = void 0;
    } else {
      var ap = a[prop],
        bp = b[prop];
      if (typeof ap === "object" && typeof bp === "object" && ap && bp) {
        const apTypeName = toStringTag(ap);
        const bpTypeName = toStringTag(bp);
        if (apTypeName !== bpTypeName) {
          rv[prfx + prop] = b[prop];
        } else if (apTypeName === "Object") {
          getObjectDiff(ap, bp, rv, prfx + prop + ".");
        } else if (ap !== bp) {
          rv[prfx + prop] = b[prop];
        }
      } else if (ap !== bp) rv[prfx + prop] = b[prop];
    }
  });
  keys(b).forEach(prop => {
    if (!hasOwn(a, prop)) {
      rv[prfx + prop] = b[prop];
    }
  });
  return rv;
}
function getEffectiveKeys(primaryKey, req) {
  if (req.type === "delete") return req.keys;
  return req.keys || req.values.map(primaryKey.extractKey);
}
var hooksMiddleware = {
  stack: "dbcore",
  name: "HooksMiddleware",
  level: 2,
  create: downCore => ({
    ...downCore,
    table(tableName) {
      const downTable = downCore.table(tableName);
      const {
        primaryKey
      } = downTable.schema;
      const tableMiddleware = {
        ...downTable,
        mutate(req) {
          const dxTrans = PSD.trans;
          const {
            deleting,
            creating,
            updating
          } = dxTrans.table(tableName).hook;
          switch (req.type) {
            case "add":
              if (creating.fire === nop) break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "put":
              if (creating.fire === nop && updating.fire === nop) break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "delete":
              if (deleting.fire === nop) break;
              return dxTrans._promise("readwrite", () => addPutOrDelete(req), true);
            case "deleteRange":
              if (deleting.fire === nop) break;
              return dxTrans._promise("readwrite", () => deleteRange(req), true);
          }
          return downTable.mutate(req);
          function addPutOrDelete(req2) {
            const dxTrans2 = PSD.trans;
            const keys2 = req2.keys || getEffectiveKeys(primaryKey, req2);
            if (!keys2) throw new Error("Keys missing");
            req2 = req2.type === "add" || req2.type === "put" ? {
              ...req2,
              keys: keys2
            } : {
              ...req2
            };
            if (req2.type !== "delete") req2.values = [...req2.values];
            if (req2.keys) req2.keys = [...req2.keys];
            return getExistingValues(downTable, req2, keys2).then(existingValues => {
              const contexts = keys2.map((key, i) => {
                const existingValue = existingValues[i];
                const ctx = {
                  onerror: null,
                  onsuccess: null
                };
                if (req2.type === "delete") {
                  deleting.fire.call(ctx, key, existingValue, dxTrans2);
                } else if (req2.type === "add" || existingValue === void 0) {
                  const generatedPrimaryKey = creating.fire.call(ctx, key, req2.values[i], dxTrans2);
                  if (key == null && generatedPrimaryKey != null) {
                    key = generatedPrimaryKey;
                    req2.keys[i] = key;
                    if (!primaryKey.outbound) {
                      setByKeyPath(req2.values[i], primaryKey.keyPath, key);
                    }
                  }
                } else {
                  const objectDiff = getObjectDiff(existingValue, req2.values[i]);
                  const additionalChanges = updating.fire.call(ctx, objectDiff, key, existingValue, dxTrans2);
                  if (additionalChanges) {
                    const requestedValue = req2.values[i];
                    Object.keys(additionalChanges).forEach(keyPath => {
                      if (hasOwn(requestedValue, keyPath)) {
                        requestedValue[keyPath] = additionalChanges[keyPath];
                      } else {
                        setByKeyPath(requestedValue, keyPath, additionalChanges[keyPath]);
                      }
                    });
                  }
                }
                return ctx;
              });
              return downTable.mutate(req2).then(({
                failures,
                results,
                numFailures,
                lastResult
              }) => {
                for (let i = 0; i < keys2.length; ++i) {
                  const primKey = results ? results[i] : keys2[i];
                  const ctx = contexts[i];
                  if (primKey == null) {
                    ctx.onerror && ctx.onerror(failures[i]);
                  } else {
                    ctx.onsuccess && ctx.onsuccess(req2.type === "put" && existingValues[i] ? req2.values[i] : primKey);
                  }
                }
                return {
                  failures,
                  results,
                  numFailures,
                  lastResult
                };
              }).catch(error => {
                contexts.forEach(ctx => ctx.onerror && ctx.onerror(error));
                return Promise.reject(error);
              });
            });
          }
          function deleteRange(req2) {
            return deleteNextChunk(req2.trans, req2.range, 1e4);
          }
          function deleteNextChunk(trans, range, limit) {
            return downTable.query({
              trans,
              values: false,
              query: {
                index: primaryKey,
                range
              },
              limit
            }).then(({
              result
            }) => {
              return addPutOrDelete({
                type: "delete",
                keys: result,
                trans
              }).then(res => {
                if (res.numFailures > 0) return Promise.reject(res.failures[0]);
                if (result.length < limit) {
                  return {
                    failures: [],
                    numFailures: 0,
                    lastResult: void 0
                  };
                } else {
                  return deleteNextChunk(trans, {
                    ...range,
                    lower: result[result.length - 1],
                    lowerOpen: true
                  }, limit);
                }
              });
            });
          }
        }
      };
      return tableMiddleware;
    }
  })
};
function getExistingValues(table, req, effectiveKeys) {
  return req.type === "add" ? Promise.resolve([]) : table.getMany({
    trans: req.trans,
    keys: effectiveKeys,
    cache: "immutable"
  });
}
function getFromTransactionCache(keys2, cache, clone) {
  try {
    if (!cache) return null;
    if (cache.keys.length < keys2.length) return null;
    const result = [];
    for (let i = 0, j = 0; i < cache.keys.length && j < keys2.length; ++i) {
      if (cmp(cache.keys[i], keys2[j]) !== 0) continue;
      result.push(clone ? deepClone(cache.values[i]) : cache.values[i]);
      ++j;
    }
    return result.length === keys2.length ? result : null;
  } catch (_a) {
    return null;
  }
}
var cacheExistingValuesMiddleware = {
  stack: "dbcore",
  level: -1,
  create: core => {
    return {
      table: tableName => {
        const table = core.table(tableName);
        return {
          ...table,
          getMany: req => {
            if (!req.cache) {
              return table.getMany(req);
            }
            const cachedResult = getFromTransactionCache(req.keys, req.trans["_cache"], req.cache === "clone");
            if (cachedResult) {
              return DexiePromise.resolve(cachedResult);
            }
            return table.getMany(req).then(res => {
              req.trans["_cache"] = {
                keys: req.keys,
                values: req.cache === "clone" ? deepClone(res) : res
              };
              return res;
            });
          },
          mutate: req => {
            if (req.type !== "add") req.trans["_cache"] = null;
            return table.mutate(req);
          }
        };
      }
    };
  }
};
function isEmptyRange(node) {
  return !("from" in node);
}
var RangeSet = function (fromOrTree, to) {
  if (this) {
    extend(this, arguments.length ? {
      d: 1,
      from: fromOrTree,
      to: arguments.length > 1 ? to : fromOrTree
    } : {
      d: 0
    });
  } else {
    const rv = new RangeSet();
    if (fromOrTree && "d" in fromOrTree) {
      extend(rv, fromOrTree);
    }
    return rv;
  }
};
props(RangeSet.prototype, {
  add(rangeSet) {
    mergeRanges(this, rangeSet);
    return this;
  },
  addKey(key) {
    addRange(this, key, key);
    return this;
  },
  addKeys(keys2) {
    keys2.forEach(key => addRange(this, key, key));
    return this;
  },
  [iteratorSymbol]() {
    return getRangeSetIterator(this);
  }
});
function addRange(target, from, to) {
  const diff = cmp(from, to);
  if (isNaN(diff)) return;
  if (diff > 0) throw RangeError();
  if (isEmptyRange(target)) return extend(target, {
    from,
    to,
    d: 1
  });
  const left = target.l;
  const right = target.r;
  if (cmp(to, target.from) < 0) {
    left ? addRange(left, from, to) : target.l = {
      from,
      to,
      d: 1,
      l: null,
      r: null
    };
    return rebalance(target);
  }
  if (cmp(from, target.to) > 0) {
    right ? addRange(right, from, to) : target.r = {
      from,
      to,
      d: 1,
      l: null,
      r: null
    };
    return rebalance(target);
  }
  if (cmp(from, target.from) < 0) {
    target.from = from;
    target.l = null;
    target.d = right ? right.d + 1 : 1;
  }
  if (cmp(to, target.to) > 0) {
    target.to = to;
    target.r = null;
    target.d = target.l ? target.l.d + 1 : 1;
  }
  const rightWasCutOff = !target.r;
  if (left && !target.l) {
    mergeRanges(target, left);
  }
  if (right && rightWasCutOff) {
    mergeRanges(target, right);
  }
}
function mergeRanges(target, newSet) {
  function _addRangeSet(target2, {
    from,
    to,
    l,
    r
  }) {
    addRange(target2, from, to);
    if (l) _addRangeSet(target2, l);
    if (r) _addRangeSet(target2, r);
  }
  if (!isEmptyRange(newSet)) _addRangeSet(target, newSet);
}
function rangesOverlap(rangeSet1, rangeSet2) {
  const i1 = getRangeSetIterator(rangeSet2);
  let nextResult1 = i1.next();
  if (nextResult1.done) return false;
  let a = nextResult1.value;
  const i2 = getRangeSetIterator(rangeSet1);
  let nextResult2 = i2.next(a.from);
  let b = nextResult2.value;
  while (!nextResult1.done && !nextResult2.done) {
    if (cmp(b.from, a.to) <= 0 && cmp(b.to, a.from) >= 0) return true;
    cmp(a.from, b.from) < 0 ? a = (nextResult1 = i1.next(b.from)).value : b = (nextResult2 = i2.next(a.from)).value;
  }
  return false;
}
function getRangeSetIterator(node) {
  let state = isEmptyRange(node) ? null : {
    s: 0,
    n: node
  };
  return {
    next(key) {
      const keyProvided = arguments.length > 0;
      while (state) {
        switch (state.s) {
          case 0:
            state.s = 1;
            if (keyProvided) {
              while (state.n.l && cmp(key, state.n.from) < 0) state = {
                up: state,
                n: state.n.l,
                s: 1
              };
            } else {
              while (state.n.l) state = {
                up: state,
                n: state.n.l,
                s: 1
              };
            }
          case 1:
            state.s = 2;
            if (!keyProvided || cmp(key, state.n.to) <= 0) return {
              value: state.n,
              done: false
            };
          case 2:
            if (state.n.r) {
              state.s = 3;
              state = {
                up: state,
                n: state.n.r,
                s: 0
              };
              continue;
            }
          case 3:
            state = state.up;
        }
      }
      return {
        done: true
      };
    }
  };
}
function rebalance(target) {
  var _a, _b;
  const diff = (((_a = target.r) === null || _a === void 0 ? void 0 : _a.d) || 0) - (((_b = target.l) === null || _b === void 0 ? void 0 : _b.d) || 0);
  const r = diff > 1 ? "r" : diff < -1 ? "l" : "";
  if (r) {
    const l = r === "r" ? "l" : "r";
    const rootClone = {
      ...target
    };
    const oldRootRight = target[r];
    target.from = oldRootRight.from;
    target.to = oldRootRight.to;
    target[r] = oldRootRight[r];
    rootClone[r] = oldRootRight[l];
    target[l] = rootClone;
    rootClone.d = computeDepth(rootClone);
  }
  target.d = computeDepth(target);
}
function computeDepth({
  r,
  l
}) {
  return (r ? l ? Math.max(r.d, l.d) : r.d : l ? l.d : 0) + 1;
}
var observabilityMiddleware = {
  stack: "dbcore",
  level: 0,
  create: core => {
    const dbName = core.schema.name;
    const FULL_RANGE = new RangeSet(core.MIN_KEY, core.MAX_KEY);
    return {
      ...core,
      table: tableName => {
        const table = core.table(tableName);
        const {
          schema
        } = table;
        const {
          primaryKey
        } = schema;
        const {
          extractKey,
          outbound
        } = primaryKey;
        const tableClone = {
          ...table,
          mutate: req => {
            const trans = req.trans;
            const mutatedParts = trans.mutatedParts || (trans.mutatedParts = {});
            const getRangeSet = indexName => {
              const part = `idb://${dbName}/${tableName}/${indexName}`;
              return mutatedParts[part] || (mutatedParts[part] = new RangeSet());
            };
            const pkRangeSet = getRangeSet("");
            const delsRangeSet = getRangeSet(":dels");
            const {
              type: type2
            } = req;
            let [keys2, newObjs] = req.type === "deleteRange" ? [req.range] : req.type === "delete" ? [req.keys] : req.values.length < 50 ? [[], req.values] : [];
            const oldCache = req.trans["_cache"];
            return table.mutate(req).then(res => {
              if (isArray(keys2)) {
                if (type2 !== "delete") keys2 = res.results;
                pkRangeSet.addKeys(keys2);
                const oldObjs = getFromTransactionCache(keys2, oldCache);
                if (!oldObjs && type2 !== "add") {
                  delsRangeSet.addKeys(keys2);
                }
                if (oldObjs || newObjs) {
                  trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs);
                }
              } else if (keys2) {
                const range = {
                  from: keys2.lower,
                  to: keys2.upper
                };
                delsRangeSet.add(range);
                pkRangeSet.add(range);
              } else {
                pkRangeSet.add(FULL_RANGE);
                delsRangeSet.add(FULL_RANGE);
                schema.indexes.forEach(idx => getRangeSet(idx.name).add(FULL_RANGE));
              }
              return res;
            });
          }
        };
        const getRange = ({
          query: {
            index,
            range
          }
        }) => {
          var _a, _b;
          return [index, new RangeSet((_a = range.lower) !== null && _a !== void 0 ? _a : core.MIN_KEY, (_b = range.upper) !== null && _b !== void 0 ? _b : core.MAX_KEY)];
        };
        const readSubscribers = {
          get: req => [primaryKey, new RangeSet(req.key)],
          getMany: req => [primaryKey, new RangeSet().addKeys(req.keys)],
          count: getRange,
          query: getRange,
          openCursor: getRange
        };
        keys(readSubscribers).forEach(method => {
          tableClone[method] = function (req) {
            const {
              subscr
            } = PSD;
            if (subscr) {
              const getRangeSet = indexName => {
                const part = `idb://${dbName}/${tableName}/${indexName}`;
                return subscr[part] || (subscr[part] = new RangeSet());
              };
              const pkRangeSet = getRangeSet("");
              const delsRangeSet = getRangeSet(":dels");
              const [queriedIndex, queriedRanges] = readSubscribers[method](req);
              getRangeSet(queriedIndex.name || "").add(queriedRanges);
              if (!queriedIndex.isPrimaryKey) {
                if (method === "count") {
                  delsRangeSet.add(FULL_RANGE);
                } else {
                  const keysPromise = method === "query" && outbound && req.values && table.query({
                    ...req,
                    values: false
                  });
                  return table[method].apply(this, arguments).then(res => {
                    if (method === "query") {
                      if (outbound && req.values) {
                        return keysPromise.then(({
                          result: resultingKeys
                        }) => {
                          pkRangeSet.addKeys(resultingKeys);
                          return res;
                        });
                      }
                      const pKeys = req.values ? res.result.map(extractKey) : res.result;
                      if (req.values) {
                        pkRangeSet.addKeys(pKeys);
                      } else {
                        delsRangeSet.addKeys(pKeys);
                      }
                    } else if (method === "openCursor") {
                      const cursor = res;
                      const wantValues = req.values;
                      return cursor && Object.create(cursor, {
                        key: {
                          get() {
                            delsRangeSet.addKey(cursor.primaryKey);
                            return cursor.key;
                          }
                        },
                        primaryKey: {
                          get() {
                            const pkey = cursor.primaryKey;
                            delsRangeSet.addKey(pkey);
                            return pkey;
                          }
                        },
                        value: {
                          get() {
                            wantValues && pkRangeSet.addKey(cursor.primaryKey);
                            return cursor.value;
                          }
                        }
                      });
                    }
                    return res;
                  });
                }
              }
            }
            return table[method].apply(this, arguments);
          };
        });
        return tableClone;
      }
    };
  }
};
function trackAffectedIndexes(getRangeSet, schema, oldObjs, newObjs) {
  function addAffectedIndex(ix) {
    const rangeSet = getRangeSet(ix.name || "");
    function extractKey(obj) {
      return obj != null ? ix.extractKey(obj) : null;
    }
    const addKeyOrKeys = key => ix.multiEntry && isArray(key) ? key.forEach(key2 => rangeSet.addKey(key2)) : rangeSet.addKey(key);
    (oldObjs || newObjs).forEach((_, i) => {
      const oldKey = oldObjs && extractKey(oldObjs[i]);
      const newKey = newObjs && extractKey(newObjs[i]);
      if (cmp(oldKey, newKey) !== 0) {
        if (oldKey != null) addKeyOrKeys(oldKey);
        if (newKey != null) addKeyOrKeys(newKey);
      }
    });
  }
  schema.indexes.forEach(addAffectedIndex);
}
var Dexie$1 = class {
  constructor(name, options) {
    this._middlewares = {};
    this.verno = 0;
    const deps = Dexie$1.dependencies;
    this._options = options = {
      addons: Dexie$1.addons,
      autoOpen: true,
      indexedDB: deps.indexedDB,
      IDBKeyRange: deps.IDBKeyRange,
      ...options
    };
    this._deps = {
      indexedDB: options.indexedDB,
      IDBKeyRange: options.IDBKeyRange
    };
    const {
      addons
    } = options;
    this._dbSchema = {};
    this._versions = [];
    this._storeNames = [];
    this._allTables = {};
    this.idbdb = null;
    this._novip = this;
    const state = {
      dbOpenError: null,
      isBeingOpened: false,
      onReadyBeingFired: null,
      openComplete: false,
      dbReadyResolve: nop,
      dbReadyPromise: null,
      cancelOpen: nop,
      openCanceller: null,
      autoSchema: true,
      PR1398_maxLoop: 3
    };
    state.dbReadyPromise = new DexiePromise(resolve => {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise((_, reject) => {
      state.cancelOpen = reject;
    });
    this._state = state;
    this.name = name;
    this.on = Events(this, "populate", "blocked", "versionchange", "close", {
      ready: [promisableChain, nop]
    });
    this.on.ready.subscribe = override(this.on.ready.subscribe, subscribe => {
      return (subscriber, bSticky) => {
        Dexie$1.vip(() => {
          const state2 = this._state;
          if (state2.openComplete) {
            if (!state2.dbOpenError) DexiePromise.resolve().then(subscriber);
            if (bSticky) subscribe(subscriber);
          } else if (state2.onReadyBeingFired) {
            state2.onReadyBeingFired.push(subscriber);
            if (bSticky) subscribe(subscriber);
          } else {
            subscribe(subscriber);
            const db = this;
            if (!bSticky) subscribe(function unsubscribe() {
              db.on.ready.unsubscribe(subscriber);
              db.on.ready.unsubscribe(unsubscribe);
            });
          }
        });
      };
    });
    this.Collection = createCollectionConstructor(this);
    this.Table = createTableConstructor(this);
    this.Transaction = createTransactionConstructor(this);
    this.Version = createVersionConstructor(this);
    this.WhereClause = createWhereClauseConstructor(this);
    this.on("versionchange", ev => {
      if (ev.newVersion > 0) console.warn(`Another connection wants to upgrade database '${this.name}'. Closing db now to resume the upgrade.`);else console.warn(`Another connection wants to delete database '${this.name}'. Closing db now to resume the delete request.`);
      this.close();
    });
    this.on("blocked", ev => {
      if (!ev.newVersion || ev.newVersion < ev.oldVersion) console.warn(`Dexie.delete('${this.name}') was blocked`);else console.warn(`Upgrade '${this.name}' blocked by other connection holding version ${ev.oldVersion / 10}`);
    });
    this._maxKey = getMaxKey(options.IDBKeyRange);
    this._createTransaction = (mode, storeNames, dbschema, parentTransaction) => new this.Transaction(mode, storeNames, dbschema, this._options.chromeTransactionDurability, parentTransaction);
    this._fireOnBlocked = ev => {
      this.on("blocked").fire(ev);
      connections.filter(c => c.name === this.name && c !== this && !c._state.vcFired).map(c => c.on("versionchange").fire(ev));
    };
    this.use(virtualIndexMiddleware);
    this.use(hooksMiddleware);
    this.use(observabilityMiddleware);
    this.use(cacheExistingValuesMiddleware);
    this.vip = Object.create(this, {
      _vip: {
        value: true
      }
    });
    addons.forEach(addon => addon(this));
  }
  version(versionNumber) {
    if (isNaN(versionNumber) || versionNumber < 0.1) throw new exceptions.Type(`Given version is not a positive number`);
    versionNumber = Math.round(versionNumber * 10) / 10;
    if (this.idbdb || this._state.isBeingOpened) throw new exceptions.Schema("Cannot add version when database is open");
    this.verno = Math.max(this.verno, versionNumber);
    const versions = this._versions;
    var versionInstance = versions.filter(v => v._cfg.version === versionNumber)[0];
    if (versionInstance) return versionInstance;
    versionInstance = new this.Version(versionNumber);
    versions.push(versionInstance);
    versions.sort(lowerVersionFirst);
    versionInstance.stores({});
    this._state.autoSchema = false;
    return versionInstance;
  }
  _whenReady(fn) {
    return this.idbdb && (this._state.openComplete || PSD.letThrough || this._vip) ? fn() : new DexiePromise((resolve, reject) => {
      if (this._state.openComplete) {
        return reject(new exceptions.DatabaseClosed(this._state.dbOpenError));
      }
      if (!this._state.isBeingOpened) {
        if (!this._options.autoOpen) {
          reject(new exceptions.DatabaseClosed());
          return;
        }
        this.open().catch(nop);
      }
      this._state.dbReadyPromise.then(resolve, reject);
    }).then(fn);
  }
  use({
    stack,
    create,
    level,
    name
  }) {
    if (name) this.unuse({
      stack,
      name
    });
    const middlewares = this._middlewares[stack] || (this._middlewares[stack] = []);
    middlewares.push({
      stack,
      create,
      level: level == null ? 10 : level,
      name
    });
    middlewares.sort((a, b) => a.level - b.level);
    return this;
  }
  unuse({
    stack,
    name,
    create
  }) {
    if (stack && this._middlewares[stack]) {
      this._middlewares[stack] = this._middlewares[stack].filter(mw => create ? mw.create !== create : name ? mw.name !== name : false);
    }
    return this;
  }
  open() {
    return dexieOpen(this);
  }
  _close() {
    const state = this._state;
    const idx = connections.indexOf(this);
    if (idx >= 0) connections.splice(idx, 1);
    if (this.idbdb) {
      try {
        this.idbdb.close();
      } catch (e) {}
      this._novip.idbdb = null;
    }
    state.dbReadyPromise = new DexiePromise(resolve => {
      state.dbReadyResolve = resolve;
    });
    state.openCanceller = new DexiePromise((_, reject) => {
      state.cancelOpen = reject;
    });
  }
  close() {
    this._close();
    const state = this._state;
    this._options.autoOpen = false;
    state.dbOpenError = new exceptions.DatabaseClosed();
    if (state.isBeingOpened) state.cancelOpen(state.dbOpenError);
  }
  delete() {
    const hasArguments = arguments.length > 0;
    const state = this._state;
    return new DexiePromise((resolve, reject) => {
      const doDelete = () => {
        this.close();
        var req = this._deps.indexedDB.deleteDatabase(this.name);
        req.onsuccess = wrap(() => {
          _onDatabaseDeleted(this._deps, this.name);
          resolve();
        });
        req.onerror = eventRejectHandler(reject);
        req.onblocked = this._fireOnBlocked;
      };
      if (hasArguments) throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
      if (state.isBeingOpened) {
        state.dbReadyPromise.then(doDelete);
      } else {
        doDelete();
      }
    });
  }
  backendDB() {
    return this.idbdb;
  }
  isOpen() {
    return this.idbdb !== null;
  }
  hasBeenClosed() {
    const dbOpenError = this._state.dbOpenError;
    return dbOpenError && dbOpenError.name === "DatabaseClosed";
  }
  hasFailed() {
    return this._state.dbOpenError !== null;
  }
  dynamicallyOpened() {
    return this._state.autoSchema;
  }
  get tables() {
    return keys(this._allTables).map(name => this._allTables[name]);
  }
  transaction() {
    const args = extractTransactionArgs.apply(this, arguments);
    return this._transaction.apply(this, args);
  }
  _transaction(mode, tables, scopeFunc) {
    let parentTransaction = PSD.trans;
    if (!parentTransaction || parentTransaction.db !== this || mode.indexOf("!") !== -1) parentTransaction = null;
    const onlyIfCompatible = mode.indexOf("?") !== -1;
    mode = mode.replace("!", "").replace("?", "");
    let idbMode, storeNames;
    try {
      storeNames = tables.map(table => {
        var storeName = table instanceof this.Table ? table.name : table;
        if (typeof storeName !== "string") throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
        return storeName;
      });
      if (mode == "r" || mode === READONLY) idbMode = READONLY;else if (mode == "rw" || mode == READWRITE) idbMode = READWRITE;else throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
      if (parentTransaction) {
        if (parentTransaction.mode === READONLY && idbMode === READWRITE) {
          if (onlyIfCompatible) {
            parentTransaction = null;
          } else throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
        }
        if (parentTransaction) {
          storeNames.forEach(storeName => {
            if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
              if (onlyIfCompatible) {
                parentTransaction = null;
              } else throw new exceptions.SubTransaction("Table " + storeName + " not included in parent transaction.");
            }
          });
        }
        if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
          parentTransaction = null;
        }
      }
    } catch (e) {
      return parentTransaction ? parentTransaction._promise(null, (_, reject) => {
        reject(e);
      }) : rejection(e);
    }
    const enterTransaction = enterTransactionScope.bind(null, this, idbMode, storeNames, parentTransaction, scopeFunc);
    return parentTransaction ? parentTransaction._promise(idbMode, enterTransaction, "lock") : PSD.trans ? usePSD(PSD.transless, () => this._whenReady(enterTransaction)) : this._whenReady(enterTransaction);
  }
  table(tableName) {
    if (!hasOwn(this._allTables, tableName)) {
      throw new exceptions.InvalidTable(`Table ${tableName} does not exist`);
    }
    return this._allTables[tableName];
  }
};
var symbolObservable = typeof Symbol !== "undefined" && "observable" in Symbol ? Symbol.observable : "@@observable";
var Observable = class {
  constructor(subscribe) {
    this._subscribe = subscribe;
  }
  subscribe(x, error, complete) {
    return this._subscribe(!x || typeof x === "function" ? {
      next: x,
      error,
      complete
    } : x);
  }
  [symbolObservable]() {
    return this;
  }
};
function extendObservabilitySet(target, newSet) {
  keys(newSet).forEach(part => {
    const rangeSet = target[part] || (target[part] = new RangeSet());
    mergeRanges(rangeSet, newSet[part]);
  });
  return target;
}
function liveQuery(querier) {
  return new Observable(observer => {
    const scopeFuncIsAsync = isAsyncFunction(querier);
    function execute(subscr) {
      if (scopeFuncIsAsync) {
        incrementExpectedAwaits();
      }
      const exec = () => newScope(querier, {
        subscr,
        trans: null
      });
      const rv = PSD.trans ? usePSD(PSD.transless, exec) : exec();
      if (scopeFuncIsAsync) {
        rv.then(decrementExpectedAwaits, decrementExpectedAwaits);
      }
      return rv;
    }
    let closed = false;
    let accumMuts = {};
    let currentObs = {};
    const subscription = {
      get closed() {
        return closed;
      },
      unsubscribe: () => {
        closed = true;
        globalEvents.storagemutated.unsubscribe(mutationListener);
      }
    };
    observer.start && observer.start(subscription);
    let querying = false,
      startedListening = false;
    function shouldNotify() {
      return keys(currentObs).some(key => accumMuts[key] && rangesOverlap(accumMuts[key], currentObs[key]));
    }
    const mutationListener = parts => {
      extendObservabilitySet(accumMuts, parts);
      if (shouldNotify()) {
        doQuery();
      }
    };
    const doQuery = () => {
      if (querying || closed) return;
      accumMuts = {};
      const subscr = {};
      const ret = execute(subscr);
      if (!startedListening) {
        globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, mutationListener);
        startedListening = true;
      }
      querying = true;
      Promise.resolve(ret).then(result => {
        querying = false;
        if (closed) return;
        if (shouldNotify()) {
          doQuery();
        } else {
          accumMuts = {};
          currentObs = subscr;
          observer.next && observer.next(result);
        }
      }, err => {
        querying = false;
        observer.error && observer.error(err);
        subscription.unsubscribe();
      });
    };
    doQuery();
    return subscription;
  });
}
var domDeps;
try {
  domDeps = {
    indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
    IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
  };
} catch (e) {
  domDeps = {
    indexedDB: null,
    IDBKeyRange: null
  };
}
var Dexie = Dexie$1;
props(Dexie, {
  ...fullNameExceptions,
  delete(databaseName) {
    const db = new Dexie(databaseName, {
      addons: []
    });
    return db.delete();
  },
  exists(name) {
    return new Dexie(name, {
      addons: []
    }).open().then(db => {
      db.close();
      return true;
    }).catch("NoSuchDatabaseError", () => false);
  },
  getDatabaseNames(cb) {
    try {
      return getDatabaseNames(Dexie.dependencies).then(cb);
    } catch (_a) {
      return rejection(new exceptions.MissingAPI());
    }
  },
  defineClass() {
    function Class(content) {
      extend(this, content);
    }
    return Class;
  },
  ignoreTransaction(scopeFunc) {
    return PSD.trans ? usePSD(PSD.transless, scopeFunc) : scopeFunc();
  },
  vip,
  async: function (generatorFn) {
    return function () {
      try {
        var rv = awaitIterator(generatorFn.apply(this, arguments));
        if (!rv || typeof rv.then !== "function") return DexiePromise.resolve(rv);
        return rv;
      } catch (e) {
        return rejection(e);
      }
    };
  },
  spawn: function (generatorFn, args, thiz) {
    try {
      var rv = awaitIterator(generatorFn.apply(thiz, args || []));
      if (!rv || typeof rv.then !== "function") return DexiePromise.resolve(rv);
      return rv;
    } catch (e) {
      return rejection(e);
    }
  },
  currentTransaction: {
    get: () => PSD.trans || null
  },
  waitFor: function (promiseOrFunction, optionalTimeout) {
    const promise = DexiePromise.resolve(typeof promiseOrFunction === "function" ? Dexie.ignoreTransaction(promiseOrFunction) : promiseOrFunction).timeout(optionalTimeout || 6e4);
    return PSD.trans ? PSD.trans.waitFor(promise) : promise;
  },
  Promise: DexiePromise,
  debug: {
    get: () => debug,
    set: value => {
      setDebug(value, value === "dexie" ? () => true : dexieStackFrameFilter);
    }
  },
  derive,
  extend,
  props,
  override,
  Events,
  on: globalEvents,
  liveQuery,
  extendObservabilitySet,
  getByKeyPath,
  setByKeyPath,
  delByKeyPath,
  shallowClone,
  deepClone,
  getObjectDiff,
  cmp,
  asap: asap$1,
  minKey,
  addons: [],
  connections,
  errnames,
  dependencies: domDeps,
  semVer: DEXIE_VERSION,
  version: DEXIE_VERSION.split(".").map(n => parseInt(n)).reduce((p, c, i) => p + c / Math.pow(10, i * 2))
});
Dexie.maxKey = getMaxKey(Dexie.dependencies.IDBKeyRange);
if (typeof dispatchEvent !== "undefined" && typeof addEventListener !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, updatedParts => {
    if (!propagatingLocally) {
      let event;
      if (isIEOrEdge) {
        event = document.createEvent("CustomEvent");
        event.initCustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, true, true, updatedParts);
      } else {
        event = new CustomEvent(STORAGE_MUTATED_DOM_EVENT_NAME, {
          detail: updatedParts
        });
      }
      propagatingLocally = true;
      dispatchEvent(event);
      propagatingLocally = false;
    }
  });
  addEventListener(STORAGE_MUTATED_DOM_EVENT_NAME, ({
    detail
  }) => {
    if (!propagatingLocally) {
      propagateLocally(detail);
    }
  });
}
function propagateLocally(updateParts) {
  let wasMe = propagatingLocally;
  try {
    propagatingLocally = true;
    globalEvents.storagemutated.fire(updateParts);
  } finally {
    propagatingLocally = wasMe;
  }
}
var propagatingLocally = false;
if (typeof BroadcastChannel !== "undefined") {
  const bc = new BroadcastChannel(STORAGE_MUTATED_DOM_EVENT_NAME);
  if (typeof bc.unref === "function") {
    bc.unref();
  }
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, changedParts => {
    if (!propagatingLocally) {
      bc.postMessage(changedParts);
    }
  });
  bc.onmessage = ev => {
    if (ev.data) propagateLocally(ev.data);
  };
} else if (typeof self !== "undefined" && typeof navigator !== "undefined") {
  globalEvents(DEXIE_STORAGE_MUTATED_EVENT_NAME, changedParts => {
    try {
      if (!propagatingLocally) {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(STORAGE_MUTATED_DOM_EVENT_NAME, JSON.stringify({
            trig: Math.random(),
            changedParts
          }));
        }
        if (typeof self["clients"] === "object") {
          [...self["clients"].matchAll({
            includeUncontrolled: true
          })].forEach(client => client.postMessage({
            type: STORAGE_MUTATED_DOM_EVENT_NAME,
            changedParts
          }));
        }
      }
    } catch (_a) {}
  });
  if (typeof addEventListener !== "undefined") {
    addEventListener("storage", ev => {
      if (ev.key === STORAGE_MUTATED_DOM_EVENT_NAME) {
        const data = JSON.parse(ev.newValue);
        if (data) propagateLocally(data.changedParts);
      }
    });
  }
  const swContainer = self.document && navigator.serviceWorker;
  if (swContainer) {
    swContainer.addEventListener("message", propagateMessageLocally);
  }
}
function propagateMessageLocally({
  data
}) {
  if (data && data.type === STORAGE_MUTATED_DOM_EVENT_NAME) {
    propagateLocally(data.changedParts);
  }
}
DexiePromise.rejectionMapper = mapError;
setDebug(debug, dexieStackFrameFilter);

// .beyond/uimport/temp/dexie.3.2.3.js
var dexie_3_2_3_default = Dexie$1;
};

code(module, require);
_exports(module.exports);
}}});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL2RleGllLjMuMi4zLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9nbG9iYWxzL2dsb2JhbC50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvZnVuY3Rpb25zL3V0aWxzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9oZWxwZXJzL2RlYnVnLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9lcnJvcnMvZXJyb3JzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9mdW5jdGlvbnMvY2hhaW5pbmctZnVuY3Rpb25zLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9oZWxwZXJzL3Byb21pc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2Z1bmN0aW9ucy90ZW1wLXRyYW5zYWN0aW9uLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9nbG9iYWxzL2NvbnN0YW50cy50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvZnVuY3Rpb25zL2NvbWJpbmUudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2RiY29yZS9rZXlyYW5nZS50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvZnVuY3Rpb25zL3dvcmthcm91bmQtdW5kZWZpbmVkLXByaW1rZXkudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2NsYXNzZXMvdGFibGUvdGFibGUudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2hlbHBlcnMvRXZlbnRzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9mdW5jdGlvbnMvbWFrZS1jbGFzcy1jb25zdHJ1Y3Rvci50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvY2xhc3Nlcy90YWJsZS90YWJsZS1jb25zdHJ1Y3Rvci50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvY2xhc3Nlcy9jb2xsZWN0aW9uL2NvbGxlY3Rpb24taGVscGVycy50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvZnVuY3Rpb25zL2NtcC50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvY2xhc3Nlcy9jb2xsZWN0aW9uL2NvbGxlY3Rpb24udHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2NsYXNzZXMvY29sbGVjdGlvbi9jb2xsZWN0aW9uLWNvbnN0cnVjdG9yLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9mdW5jdGlvbnMvY29tcGFyZS1mdW5jdGlvbnMudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2NsYXNzZXMvd2hlcmUtY2xhdXNlL3doZXJlLWNsYXVzZS1oZWxwZXJzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9jbGFzc2VzL3doZXJlLWNsYXVzZS93aGVyZS1jbGF1c2UudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2NsYXNzZXMvd2hlcmUtY2xhdXNlL3doZXJlLWNsYXVzZS1jb25zdHJ1Y3Rvci50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvZnVuY3Rpb25zL2V2ZW50LXdyYXBwZXJzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9nbG9iYWxzL2dsb2JhbC1ldmVudHMudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2NsYXNzZXMvdHJhbnNhY3Rpb24vdHJhbnNhY3Rpb24udHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2NsYXNzZXMvdHJhbnNhY3Rpb24vdHJhbnNhY3Rpb24tY29uc3RydWN0b3IudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2hlbHBlcnMvaW5kZXgtc3BlYy50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvaGVscGVycy90YWJsZS1zY2hlbWEudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2Z1bmN0aW9ucy9xdWlya3MudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2RiY29yZS9nZXQta2V5LWV4dHJhY3Rvci50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvZGJjb3JlL2RiY29yZS1pbmRleGVkZGIudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2NsYXNzZXMvZGV4aWUvZ2VuZXJhdGUtbWlkZGxld2FyZS1zdGFja3MudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2NsYXNzZXMvdmVyc2lvbi9zY2hlbWEtaGVscGVycy50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvY2xhc3Nlcy92ZXJzaW9uL3ZlcnNpb24udHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2NsYXNzZXMvdmVyc2lvbi92ZXJzaW9uLWNvbnN0cnVjdG9yLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9oZWxwZXJzL2RhdGFiYXNlLWVudW1lcmF0b3IudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2NsYXNzZXMvZGV4aWUvdmlwLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL25vZGVfbW9kdWxlcy9zYWZhcmktMTQtaWRiLWZpeC9kaXN0L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9jbGFzc2VzL2RleGllL2RleGllLW9wZW4udHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2hlbHBlcnMveWllbGQtc3VwcG9ydC50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvY2xhc3Nlcy9kZXhpZS90cmFuc2FjdGlvbi1oZWxwZXJzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9kYmNvcmUvdmlydHVhbC1pbmRleC1taWRkbGV3YXJlLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9mdW5jdGlvbnMvZ2V0LW9iamVjdC1kaWZmLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9kYmNvcmUvZ2V0LWVmZmVjdGl2ZS1rZXlzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9ob29rcy9ob29rcy1taWRkbGV3YXJlLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9kYmNvcmUvY2FjaGUtZXhpc3RpbmctdmFsdWVzLW1pZGRsZXdhcmUudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2hlbHBlcnMvcmFuZ2VzZXQudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2xpdmUtcXVlcnkvb2JzZXJ2YWJpbGl0eS1taWRkbGV3YXJlLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9jbGFzc2VzL2RleGllL2RleGllLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9jbGFzc2VzL29ic2VydmFibGUvb2JzZXJ2YWJsZS50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvbGl2ZS1xdWVyeS9leHRlbmQtb2JzZXJ2YWJpbGl0eS1zZXQudHMiLCIuLi9ub2RlX21vZHVsZXMvZGV4aWUvc3JjL2xpdmUtcXVlcnkvbGl2ZS1xdWVyeS50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvY2xhc3Nlcy9kZXhpZS9kZXhpZS1kb20tZGVwZW5kZW5jaWVzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9jbGFzc2VzL2RleGllL2RleGllLXN0YXRpYy1wcm9wcy50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvbGl2ZS1xdWVyeS9wcm9wYWdhdGUtbG9jYWxseS50cyIsIi4uL25vZGVfbW9kdWxlcy9kZXhpZS9zcmMvbGl2ZS1xdWVyeS9lbmFibGUtYnJvYWRjYXN0LnRzIiwiLi4vbm9kZV9tb2R1bGVzL2RleGllL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6WyJkZXhpZV8zXzJfM19leHBvcnRzIiwiX19leHBvcnQiLCJEZXhpZSIsIkRleGllJDEiLCJSYW5nZVNldCIsImRlZmF1bHQiLCJkZXhpZV8zXzJfM19kZWZhdWx0IiwibGl2ZVF1ZXJ5IiwibWVyZ2VSYW5nZXMiLCJyYW5nZXNPdmVybGFwIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9fdG9Db21tb25KUyIsIl9nbG9iYWwiLCJnbG9iYWxUaGlzIiwic2VsZiIsIndpbmRvdyIsImdsb2JhbCIsImtleXMiLCJPYmplY3QiLCJpc0FycmF5IiwiQXJyYXkiLCJQcm9taXNlIiwiZXh0ZW5kIiwib2JqIiwiZXh0ZW5zaW9uIiwiZm9yRWFjaCIsImtleSIsImdldFByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJfaGFzT3duIiwiaGFzT3duUHJvcGVydHkiLCJoYXNPd24iLCJwcm9wIiwiY2FsbCIsInByb3BzIiwicHJvdG8iLCJSZWZsZWN0Iiwib3duS2V5cyIsInNldFByb3AiLCJkZWZpbmVQcm9wZXJ0eSIsImZ1bmN0aW9uT3JHZXRTZXQiLCJvcHRpb25zIiwiZ2V0Iiwic2V0IiwiY29uZmlndXJhYmxlIiwidmFsdWUiLCJ3cml0YWJsZSIsImRlcml2ZSIsIkNoaWxkIiwiZnJvbSIsIlBhcmVudCIsInByb3RvdHlwZSIsImNyZWF0ZSIsImJpbmQiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJnZXRQcm9wZXJ0eURlc2NyaXB0b3IiLCJwZCIsIl9zbGljZSIsInNsaWNlIiwiYXJncyIsInN0YXJ0IiwiZW5kIiwib3ZlcnJpZGUiLCJvcmlnRnVuYyIsIm92ZXJyaWRlZEZhY3RvcnkiLCJhc3NlcnQiLCJiIiwiRXJyb3IiLCJhc2FwJDEiLCJmbiIsInNldEltbWVkaWF0ZSIsInNldFRpbWVvdXQiLCJhcnJheVRvT2JqZWN0IiwiYXJyYXkiLCJleHRyYWN0b3IiLCJyZWR1Y2UiLCJyZXN1bHQiLCJpdGVtIiwiaSIsIm5hbWVBbmRWYWx1ZSIsInRyeUNhdGNoIiwib25lcnJvciIsImFwcGx5IiwiZXgiLCJnZXRCeUtleVBhdGgiLCJrZXlQYXRoIiwicnYiLCJsIiwibGVuZ3RoIiwidmFsIiwicHVzaCIsInBlcmlvZCIsImluZGV4T2YiLCJpbm5lck9iaiIsInN1YnN0ciIsInNldEJ5S2V5UGF0aCIsImlzRnJvemVuIiwiY3VycmVudEtleVBhdGgiLCJyZW1haW5pbmdLZXlQYXRoIiwiaXNOYU4iLCJwYXJzZUludCIsInNwbGljZSIsImRlbEJ5S2V5UGF0aCIsIm1hcCIsImtwIiwic2hhbGxvd0Nsb25lIiwibSIsImNvbmNhdCIsImZsYXR0ZW4iLCJhIiwiaW50cmluc2ljVHlwZU5hbWVzIiwic3BsaXQiLCJudW0iLCJ0IiwiZmlsdGVyIiwiaW50cmluc2ljVHlwZXMiLCJ4IiwiY2lyY3VsYXJSZWZzIiwiZGVlcENsb25lIiwiYW55IiwiV2Vha01hcCIsImlubmVyRGVlcENsb25lIiwiY29uc3RydWN0b3IiLCJ0b1N0cmluZyIsInRvU3RyaW5nVGFnIiwibyIsIml0ZXJhdG9yU3ltYm9sIiwiU3ltYm9sIiwiaXRlcmF0b3IiLCJnZXRJdGVyYXRvck9mIiwiTk9fQ0hBUl9BUlJBWSIsImdldEFycmF5T2YiLCJhcnJheUxpa2UiLCJpdCIsImFyZ3VtZW50cyIsIm5leHQiLCJkb25lIiwiaXNBc3luY0Z1bmN0aW9uIiwiZGVidWciLCJsb2NhdGlvbiIsInRlc3QiLCJocmVmIiwic2V0RGVidWciLCJsaWJyYXJ5RmlsdGVyIiwiTkVFRFNfVEhST1dfRk9SX1NUQUNLIiwic3RhY2siLCJnZXRFcnJvcldpdGhTdGFjayIsImUiLCJwcmV0dHlTdGFjayIsImV4Y2VwdGlvbiIsIm51bUlnbm9yZWRGcmFtZXMiLCJuYW1lIiwibWVzc2FnZSIsImZyYW1lIiwiam9pbiIsImRleGllRXJyb3JOYW1lcyIsImlkYkRvbUVycm9yTmFtZXMiLCJlcnJvckxpc3QiLCJkZWZhdWx0VGV4dHMiLCJWZXJzaW9uQ2hhbmdlZCIsIkRhdGFiYXNlQ2xvc2VkIiwiQWJvcnQiLCJUcmFuc2FjdGlvbkluYWN0aXZlIiwiTWlzc2luZ0FQSSIsIkRleGllRXJyb3IiLCJtc2ciLCJfZSIsIl9zdGFjayIsImdldE11bHRpRXJyb3JNZXNzYWdlIiwiZmFpbHVyZXMiLCJ2IiwicyIsIk1vZGlmeUVycm9yIiwic3VjY2Vzc0NvdW50IiwiZmFpbGVkS2V5cyIsIkJ1bGtFcnJvciIsInBvcyIsImZhaWx1cmVzQnlQb3MiLCJlcnJuYW1lcyIsIkJhc2VFeGNlcHRpb24iLCJleGNlcHRpb25zIiwiZnVsbE5hbWUiLCJEZXhpZUVycm9yMiIsIm1zZ09ySW5uZXIiLCJpbm5lciIsIlN5bnRheCIsIlN5bnRheEVycm9yIiwiVHlwZSIsIlR5cGVFcnJvciIsIlJhbmdlIiwiUmFuZ2VFcnJvciIsImV4Y2VwdGlvbk1hcCIsIm1hcEVycm9yIiwiZG9tRXJyb3IiLCJmdWxsTmFtZUV4Y2VwdGlvbnMiLCJub3AiLCJtaXJyb3IiLCJwdXJlRnVuY3Rpb25DaGFpbiIsImYxIiwiZjIiLCJjYWxsQm90aCIsIm9uMSIsIm9uMiIsImhvb2tDcmVhdGluZ0NoYWluIiwicmVzIiwib25zdWNjZXNzIiwicmVzMiIsImhvb2tEZWxldGluZ0NoYWluIiwiaG9va1VwZGF0aW5nQ2hhaW4iLCJtb2RpZmljYXRpb25zIiwicmV2ZXJzZVN0b3BwYWJsZUV2ZW50Q2hhaW4iLCJwcm9taXNhYmxlQ2hhaW4iLCJ0aGVuIiwidGhpeiIsIklOVEVSTkFMIiwiTE9OR19TVEFDS1NfQ0xJUF9MSU1JVCIsIk1BWF9MT05HX1NUQUNLUyIsIlpPTkVfRUNIT19MSU1JVCIsInJlc29sdmVkTmF0aXZlUHJvbWlzZSIsIm5hdGl2ZVByb21pc2VQcm90byIsInJlc29sdmVkR2xvYmFsUHJvbWlzZSIsImdsb2JhbFAiLCJyZXNvbHZlIiwiY3J5cHRvIiwic3VidGxlIiwibmF0aXZlUCIsImRpZ2VzdCIsIlVpbnQ4QXJyYXkiLCJuYXRpdmVQcm9taXNlVGhlbiIsIk5hdGl2ZVByb21pc2UiLCJwYXRjaEdsb2JhbFByb21pc2UiLCJzdGFja19iZWluZ19nZW5lcmF0ZWQiLCJzY2hlZHVsZVBoeXNpY2FsVGljayIsInBoeXNpY2FsVGljayIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJoaWRkZW5EaXYiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJvYnNlcnZlIiwiYXR0cmlidXRlcyIsInNldEF0dHJpYnV0ZSIsImFzYXAiLCJjYWxsYmFjayIsIm1pY3JvdGlja1F1ZXVlIiwibmVlZHNOZXdQaHlzaWNhbFRpY2siLCJpc091dHNpZGVNaWNyb1RpY2siLCJ1bmhhbmRsZWRFcnJvcnMiLCJyZWplY3RpbmdFcnJvcnMiLCJjdXJyZW50RnVsZmlsbGVyIiwicmVqZWN0aW9uTWFwcGVyIiwiZ2xvYmFsUFNEIiwiaWQiLCJyZWYiLCJ1bmhhbmRsZWRzIiwib251bmhhbmRsZWQiLCJnbG9iYWxFcnJvciIsInBncCIsImVudiIsImZpbmFsaXplIiwidWgiLCJQU0QiLCJudW1TY2hlZHVsZWRDYWxscyIsInRpY2tGaW5hbGl6ZXJzIiwiRGV4aWVQcm9taXNlIiwiX2xpc3RlbmVycyIsIm9udW5jYXRjaGVkIiwiX2xpYiIsInBzZCIsIl9QU0QiLCJfc3RhY2tIb2xkZXIiLCJfcHJldiIsIl9udW1QcmV2IiwiX3N0YXRlIiwiX3ZhbHVlIiwiaGFuZGxlUmVqZWN0aW9uIiwiZXhlY3V0ZVByb21pc2VUYXNrIiwidGhlblByb3AiLCJtaWNyb1Rhc2tJZCIsInRvdGFsRWNob2VzIiwib25GdWxmaWxsZWQiLCJvblJlamVjdGVkIiwicG9zc2libGVBd2FpdCIsImNsZWFudXAiLCJkZWNyZW1lbnRFeHBlY3RlZEF3YWl0cyIsInJlamVjdCIsInByb3BhZ2F0ZVRvTGlzdGVuZXIiLCJMaXN0ZW5lciIsIm5hdGl2ZUF3YWl0Q29tcGF0aWJsZVdyYXAiLCJsaW5rVG9QcmV2aW91c1Byb21pc2UiLCJfdGhlbiIsImNhdGNoIiwidHlwZTIiLCJoYW5kbGVyIiwiZXJyIiwiUHJvbWlzZVJlamVjdCIsImZpbmFsbHkiLCJvbkZpbmFsbHkiLCJzdGFja3MiLCJnZXRTdGFjayIsInRpbWVvdXQiLCJtcyIsIkluZmluaXR5IiwiaGFuZGxlIiwiVGltZW91dCIsImNsZWFyVGltZW91dCIsInNuYXBTaG90Iiwiem9uZSIsImFsbCIsInZhbHVlcyIsIm9uUG9zc2libGVQYXJhbGxlbGxBc3luYyIsInJlbWFpbmluZyIsInJhY2UiLCJuZXdQU0QiLCJuZXdTY29wZSIsInVzZVBTRCIsInNjaGVkdWxlciIsImZvbGxvdyIsInpvbmVQcm9wcyIsInJlc29sdmUyIiwicmVqZWN0MiIsInJ1bl9hdF9lbmRfb2ZfdGhpc19vcl9uZXh0X3BoeXNpY2FsX3RpY2siLCJhbGxTZXR0bGVkIiwicG9zc2libGVQcm9taXNlcyIsInJlc3VsdHMiLCJwIiwic3RhdHVzIiwicmVhc29uIiwiQWdncmVnYXRlRXJyb3IiLCJmYWlsdXJlIiwicHJvbWlzZSIsInNob3VsZEV4ZWN1dGVUaWNrIiwiYmVnaW5NaWNyb1RpY2tTY29wZSIsInByb3BhZ2F0ZUFsbExpc3RlbmVycyIsImVuZE1pY3JvVGlja1Njb3BlIiwiX3Byb21pc2UiLCJvcmlnUHJvcCIsImFkZFBvc3NpYmx5VW5oYW5kbGVkRXJyb3IiLCJsaXN0ZW5lcnMiLCJsZW4iLCJmaW5hbGl6ZVBoeXNpY2FsVGljayIsImxpc3RlbmVyIiwiY2IiLCJjYWxsTGlzdGVuZXIiLCJyZXQiLCJtYXJrRXJyb3JBc0hhbmRsZWQiLCJsaW1pdCIsImVycm9yTmFtZSIsInByZXYiLCJudW1QcmV2Iiwid2FzUm9vdEV4ZWMiLCJjYWxsYmFja3MiLCJ1bmhhbmRsZWRFcnJzIiwiZmluYWxpemVycyIsImZpbmFsaXplciIsInNvbWUiLCJ3cmFwIiwiZXJyb3JDYXRjaGVyIiwib3V0ZXJTY29wZSIsInN3aXRjaFRvWm9uZSIsInRhc2siLCJhd2FpdHMiLCJlY2hvZXMiLCJ0YXNrQ291bnRlciIsInpvbmVTdGFjayIsInpvbmVFY2hvZXMiLCJ6b25lX2lkX2NvdW50ZXIiLCJwcm9wczIiLCJhMSIsImEyIiwicGFyZW50IiwiZ2xvYmFsRW52IiwiUHJvbWlzZVByb3AiLCJudGhlbiIsImdldFBhdGNoZWRQcm9taXNlVGhlbiIsImd0aGVuIiwiaW5jcmVtZW50RXhwZWN0ZWRBd2FpdHMiLCJwb3NzaWJsZVByb21pc2UiLCJyZWplY3Rpb24iLCJ6b25lRW50ZXJFY2hvIiwidGFyZ2V0Wm9uZSIsInpvbmVMZWF2ZUVjaG8iLCJwb3AiLCJiRW50ZXJpbmdab25lIiwiY3VycmVudFpvbmUiLCJlbnF1ZXVlTmF0aXZlTWljcm9UYXNrIiwiR2xvYmFsUHJvbWlzZSIsInRhcmdldEVudiIsImEzIiwiam9iIiwib3V0ZXJab25lIiwib3JpZ1RoZW4iLCJvblJlc29sdmVkIiwiVU5IQU5ETEVEUkVKRUNUSU9OIiwiZXZlbnQiLCJldmVudERhdGEiLCJjcmVhdGVFdmVudCIsImluaXRFdmVudCIsIkN1c3RvbUV2ZW50IiwiZGV0YWlsIiwiZGlzcGF0Y2hFdmVudCIsIlByb21pc2VSZWplY3Rpb25FdmVudCIsIm9udW5oYW5kbGVkcmVqZWN0aW9uIiwiXyIsImRlZmF1bHRQcmV2ZW50ZWQiLCJjb25zb2xlIiwid2FybiIsInRlbXBUcmFuc2FjdGlvbiIsImRiIiwibW9kZSIsInN0b3JlTmFtZXMiLCJpZGJkYiIsIm9wZW5Db21wbGV0ZSIsImxldFRocm91Z2giLCJfdmlwIiwiZGJPcGVuRXJyb3IiLCJpc0JlaW5nT3BlbmVkIiwiX29wdGlvbnMiLCJhdXRvT3BlbiIsIm9wZW4iLCJkYlJlYWR5UHJvbWlzZSIsInRyYW5zIiwiX2NyZWF0ZVRyYW5zYWN0aW9uIiwiX2RiU2NoZW1hIiwiUFIxMzk4X21heExvb3AiLCJJbnZhbGlkU3RhdGUiLCJpc09wZW4iLCJfY2xvc2UiLCJfY29tcGxldGlvbiIsIkRFWElFX1ZFUlNJT04iLCJtYXhTdHJpbmciLCJTdHJpbmciLCJmcm9tQ2hhckNvZGUiLCJtaW5LZXkiLCJJTlZBTElEX0tFWV9BUkdVTUVOVCIsIlNUUklOR19FWFBFQ1RFRCIsImNvbm5lY3Rpb25zIiwiaXNJRU9yRWRnZSIsIm5hdmlnYXRvciIsInVzZXJBZ2VudCIsImhhc0lFRGVsZXRlT2JqZWN0U3RvcmVCdWciLCJoYW5nc09uRGVsZXRlTGFyZ2VLZXlSYW5nZSIsImRleGllU3RhY2tGcmFtZUZpbHRlciIsIkRCTkFNRVNfREIiLCJSRUFET05MWSIsIlJFQURXUklURSIsImNvbWJpbmUiLCJmaWx0ZXIxIiwiZmlsdGVyMiIsIkFueVJhbmdlIiwidHlwZSIsImxvd2VyIiwibG93ZXJPcGVuIiwidXBwZXIiLCJ1cHBlck9wZW4iLCJ3b3JrYXJvdW5kRm9yVW5kZWZpbmVkUHJpbUtleSIsIlRhYmxlIiwiX3RyYW5zIiwid3JpdGVMb2NrZWQiLCJfdHgiLCJ0YWJsZU5hbWUiLCJjaGVja1RhYmxlSW5UcmFuc2FjdGlvbiIsInRyYW5zMiIsInNjaGVtYSIsIk5vdEZvdW5kIiwiaWRidHJhbnMiLCJ0cmFuc2xlc3MiLCJrZXlPckNyaXQiLCJ3aGVyZSIsImZpcnN0IiwiY29yZSIsImhvb2siLCJyZWFkaW5nIiwiZmlyZSIsImluZGV4T3JDcml0IiwiV2hlcmVDbGF1c2UiLCJrZXlQYXRocyIsImVxdWFscyIsImNvbXBvdW5kSW5kZXgiLCJpbmRleGVzIiwicHJpbUtleSIsIml4IiwiY29tcG91bmQiLCJldmVyeSIsIl9tYXhLZXkiLCJKU09OIiwic3RyaW5naWZ5IiwiaWR4QnlOYW1lIiwiaWRiIiwiX2RlcHMiLCJpbmRleGVkREIiLCJjbXAiLCJpZHgiLCJmaWx0ZXJGdW5jdGlvbiIsInByZXZJbmRleCIsInByZXZGaWx0ZXJGbiIsImluZGV4IiwibXVsdGkiLCJ0b0NvbGxlY3Rpb24iLCJhbmQiLCJjb3VudCIsInRoZW5TaG9ydGN1dCIsIm9mZnNldCIsIm51bVJvd3MiLCJlYWNoIiwidG9BcnJheSIsIkNvbGxlY3Rpb24iLCJvcmRlckJ5IiwicmV2ZXJzZSIsIm1hcFRvQ2xhc3MiLCJtYXBwZWRDbGFzcyIsInJlYWRIb29rIiwidW5zdWJzY3JpYmUiLCJkZWZpbmVDbGFzcyIsIkNsYXNzIiwiY29udGVudCIsImFkZCIsImF1dG8iLCJvYmpUb0FkZCIsIm11dGF0ZSIsIm51bUZhaWx1cmVzIiwibGFzdFJlc3VsdCIsInVwZGF0ZSIsImtleU9yT2JqZWN0IiwiSW52YWxpZEFyZ3VtZW50IiwiX2EiLCJtb2RpZnkiLCJwdXQiLCJkZWxldGUiLCJjbGVhciIsInJhbmdlIiwiYnVsa0dldCIsImtleXMyIiwiZ2V0TWFueSIsImJ1bGtBZGQiLCJvYmplY3RzIiwia2V5c09yT3B0aW9ucyIsIndhbnRSZXN1bHRzIiwiYWxsS2V5cyIsIm51bU9iamVjdHMiLCJvYmplY3RzVG9BZGQiLCJidWxrUHV0Iiwib2JqZWN0c1RvUHV0IiwiYnVsa0RlbGV0ZSIsIm51bUtleXMiLCJFdmVudHMiLCJjdHgiLCJldnMiLCJldmVudE5hbWUiLCJzdWJzY3JpYmVyIiwiaTIiLCJzdWJzY3JpYmUiLCJhZGRFdmVudFR5cGUiLCJjaGFpbkZ1bmN0aW9uIiwiZGVmYXVsdEZ1bmN0aW9uIiwiYWRkQ29uZmlndXJlZEV2ZW50cyIsImNvbnRleHQiLCJzdWJzY3JpYmVycyIsImNmZyIsImFyZ3MyIiwiZmlyZUV2ZW50IiwibWFrZUNsYXNzQ29uc3RydWN0b3IiLCJjcmVhdGVUYWJsZUNvbnN0cnVjdG9yIiwiVGFibGUyIiwidGFibGVTY2hlbWEiLCJfYWxsVGFibGVzIiwiaXNQbGFpbktleVJhbmdlIiwiaWdub3JlTGltaXRGaWx0ZXIiLCJhbGdvcml0aG0iLCJvciIsImp1c3RMaW1pdCIsInJlcGxheUZpbHRlciIsImFkZEZpbHRlciIsImFkZFJlcGxheUZpbHRlciIsImZhY3RvcnkiLCJpc0xpbWl0RmlsdGVyIiwiY3VyciIsImFkZE1hdGNoRmlsdGVyIiwiaXNNYXRjaCIsImdldEluZGV4T3JTdG9yZSIsImNvcmVTY2hlbWEiLCJpc1ByaW1LZXkiLCJwcmltYXJ5S2V5IiwiZ2V0SW5kZXhCeUtleVBhdGgiLCJTY2hlbWEiLCJvcGVuQ3Vyc29yIiwiY29yZVRhYmxlIiwia2V5c09ubHkiLCJkaXIiLCJ1bmlxdWUiLCJxdWVyeSIsIml0ZXIiLCJjb3JlVHJhbnMiLCJpdGVyYXRlIiwidmFsdWVNYXBwZXIiLCJ1bmlvbiIsImN1cnNvciIsImFkdmFuY2UiLCJzdG9wIiwiZmFpbCIsIl9pdGVyYXRlIiwiY3Vyc29yUHJvbWlzZSIsIm1hcHBlZEZuIiwiYyIsIndyYXBwZWRGbiIsImNvbnRpbnVlIiwiYWR2YW5jZXIiLCJ0YSIsInRiIiwiTmFOIiwiY29tcGFyZVVpbnQ4QXJyYXlzIiwiZ2V0VWludDhBcnJheSIsImNvbXBhcmVBcnJheXMiLCJhbCIsImJsIiwiQXJyYXlCdWZmZXIiLCJpc1ZpZXciLCJ0c1RhZyIsImJ1ZmZlciIsImJ5dGVPZmZzZXQiLCJieXRlTGVuZ3RoIiwiX3JlYWQiLCJfY3R4IiwiZXJyb3IiLCJ0YWJsZSIsIl93cml0ZSIsIl9hZGRBbGdvcml0aG0iLCJjbG9uZSIsInJhdyIsImNvdW50MiIsIk1hdGgiLCJtaW4iLCJzb3J0QnkiLCJwYXJ0cyIsImxhc3RQYXJ0IiwibGFzdEluZGV4IiwiZ2V0dmFsIiwib3JkZXIiLCJzb3J0ZXIiLCJhVmFsIiwiYlZhbCIsInNvcnQiLCJvZmZzZXRMZWZ0Iiwicm93c0xlZnQiLCJ1bnRpbCIsImJJbmNsdWRlU3RvcEVudHJ5IiwibGFzdCIsImluZGV4TmFtZSIsIl9vbmRpcmVjdGlvbmNoYW5nZSIsImRlc2MiLCJlYWNoS2V5IiwiZWFjaFVuaXF1ZUtleSIsImVhY2hQcmltYXJ5S2V5IiwicHJpbWFyeUtleXMiLCJ1bmlxdWVLZXlzIiwiZmlyc3RLZXkiLCJsYXN0S2V5IiwiZGlzdGluY3QiLCJzdHJLZXkiLCJmb3VuZCIsImNoYW5nZXMiLCJtb2RpZnllciIsImFueXRoaW5nTW9kaWZpZWQiLCJvdXRib3VuZCIsImV4dHJhY3RLZXkiLCJtb2RpZnlDaHVua1NpemUiLCJ0b3RhbEZhaWx1cmVzIiwiYXBwbHlNdXRhdGVSZXN1bHQiLCJleHBlY3RlZENvdW50IiwibmV4dENodW5rIiwiY2FjaGUiLCJhZGRWYWx1ZXMiLCJwdXRWYWx1ZXMiLCJwdXRLZXlzIiwiZGVsZXRlS2V5cyIsIm9yaWdWYWx1ZSIsImN0eDIiLCJjcml0ZXJpYSIsImRlbGV0ZUNhbGxiYWNrIiwiY2hhbmdlU3BlYyIsImNvcmVSYW5nZSIsImNyZWF0ZUNvbGxlY3Rpb25Db25zdHJ1Y3RvciIsIkNvbGxlY3Rpb24yIiwid2hlcmVDbGF1c2UiLCJrZXlSYW5nZUdlbmVyYXRvciIsImtleVJhbmdlIiwid2hlcmVDdHgiLCJyZWFkaW5nSG9vayIsInNpbXBsZUNvbXBhcmUiLCJzaW1wbGVDb21wYXJlUmV2ZXJzZSIsImNvbGxlY3Rpb25PcldoZXJlQ2xhdXNlIiwiVCIsImNvbGxlY3Rpb24iLCJlbXB0eUNvbGxlY3Rpb24iLCJyYW5nZUVxdWFsIiwidXBwZXJGYWN0b3J5IiwidG9VcHBlckNhc2UiLCJ0b0xvd2VyQ2FzZSIsImxvd2VyRmFjdG9yeSIsIm5leHRDYXNpbmciLCJsb3dlcktleSIsInVwcGVyTmVlZGxlIiwibG93ZXJOZWVkbGUiLCJjbXAyIiwibGxwIiwibHdyS2V5Q2hhciIsImFkZElnbm9yZUNhc2VBbGdvcml0aG0iLCJtYXRjaCIsIm5lZWRsZXMiLCJzdWZmaXgiLCJjb21wYXJlIiwidXBwZXJOZWVkbGVzIiwibG93ZXJOZWVkbGVzIiwiZGlyZWN0aW9uIiwibmV4dEtleVN1ZmZpeCIsIm5lZWRsZXNMZW4iLCJpbml0RGlyZWN0aW9uIiwibmVlZGxlQm91bmRzIiwibmVlZGxlIiwibmIiLCJjcmVhdGVSYW5nZSIsImRpcmVjdGlvbjIiLCJmaXJzdFBvc3NpYmxlTmVlZGxlIiwibG93ZXN0UG9zc2libGVDYXNpbmciLCJjYXNpbmciLCJiZXR3ZWVuIiwiaW5jbHVkZUxvd2VyIiwiaW5jbHVkZVVwcGVyIiwiX2NtcCIsImFib3ZlIiwiYWJvdmVPckVxdWFsIiwiYmVsb3ciLCJiZWxvd09yRXF1YWwiLCJzdGFydHNXaXRoIiwic3RyIiwic3RhcnRzV2l0aElnbm9yZUNhc2UiLCJlcXVhbHNJZ25vcmVDYXNlIiwiYW55T2ZJZ25vcmVDYXNlIiwic3RhcnRzV2l0aEFueU9mSWdub3JlQ2FzZSIsIm4iLCJhbnlPZiIsIl9hc2NlbmRpbmciLCJfZGVzY2VuZGluZyIsIm5vdEVxdWFsIiwiaW5BbnlSYW5nZSIsImluY2x1ZGVMb3dlcnMiLCJpbmNsdWRlVXBwZXJzIiwibm9uZU9mIiwicmFuZ2VzIiwiYXNjZW5kaW5nIiwiZGVzY2VuZGluZyIsIl9taW4iLCJtYXgiLCJfbWF4IiwiYWRkUmFuZ2UyIiwicmFuZ2VzMiIsIm5ld1JhbmdlIiwic29ydERpcmVjdGlvbiIsInJhbmdlU29ydGVyIiwicmFuZ2VQb3MiLCJrZXlJc0JleW9uZEN1cnJlbnRFbnRyeSIsImtleUlzQmVmb3JlQ3VycmVudEVudHJ5Iiwia2V5V2l0aGluQ3VycmVudFJhbmdlIiwiY2hlY2tLZXkiLCJzdGFydHNXaXRoQW55T2YiLCJjcmVhdGVXaGVyZUNsYXVzZUNvbnN0cnVjdG9yIiwiV2hlcmVDbGF1c2UyIiwib3JDb2xsZWN0aW9uIiwiaW5kZXhlZERCMiIsIl9JREJLZXlSYW5nZSIsIklEQktleVJhbmdlIiwiZXZlbnRSZWplY3RIYW5kbGVyIiwicHJldmVudERlZmF1bHQiLCJ0YXJnZXQiLCJzdG9wUHJvcGFnYXRpb24iLCJERVhJRV9TVE9SQUdFX01VVEFURURfRVZFTlRfTkFNRSIsIlNUT1JBR0VfTVVUQVRFRF9ET01fRVZFTlRfTkFNRSIsImdsb2JhbEV2ZW50cyIsIlRyYW5zYWN0aW9uIiwiX2xvY2siLCJfcmVjdWxvY2siLCJsb2NrT3duZXJGb3IiLCJfdW5sb2NrIiwiX2Jsb2NrZWRGdW5jcyIsIl9sb2NrZWQiLCJmbkFuZFBTRCIsInNoaWZ0IiwiT3BlbkZhaWxlZCIsImFjdGl2ZSIsInRyYW5zYWN0aW9uIiwiZHVyYWJpbGl0eSIsImNocm9tZVRyYW5zYWN0aW9uRHVyYWJpbGl0eSIsImV2IiwiX3JlamVjdCIsIm9uYWJvcnQiLCJvbiIsIm9uY29tcGxldGUiLCJfcmVzb2x2ZSIsInN0b3JhZ2VtdXRhdGVkIiwiYldyaXRlTG9jayIsIlJlYWRPbmx5IiwicDIiLCJfcm9vdCIsIndhaXRGb3IiLCJwcm9taXNlTGlrZSIsInJvb3QiLCJfd2FpdGluZ0ZvciIsIl93YWl0aW5nUXVldWUiLCJzdG9yZSIsIm9iamVjdFN0b3JlIiwic3BpbiIsIl9zcGluQ291bnQiLCJjdXJyZW50V2FpdFByb21pc2UiLCJhYm9ydCIsIm1lbW9pemVkVGFibGVzIiwiX21lbW9pemVkVGFibGVzIiwidHJhbnNhY3Rpb25Cb3VuZFRhYmxlIiwiY3JlYXRlVHJhbnNhY3Rpb25Db25zdHJ1Y3RvciIsIlRyYW5zYWN0aW9uMiIsImRic2NoZW1hIiwiY29tcGxldGUiLCJ3YXNBY3RpdmUiLCJjcmVhdGVJbmRleFNwZWMiLCJzcmMiLCJuYW1lRnJvbUtleVBhdGgiLCJjcmVhdGVUYWJsZVNjaGVtYSIsInNhZmFyaU11bHRpU3RvcmVGaXgiLCJnZXRNYXhLZXkiLCJJZGJLZXlSYW5nZSIsIm9ubHkiLCJnZXRLZXlFeHRyYWN0b3IiLCJnZXRTaW5nbGVQYXRoS2V5RXh0cmFjdG9yIiwiYXJyYXlpZnkiLCJfaWRfY291bnRlciIsImdldEtleVBhdGhBbGlhcyIsImNyZWF0ZURCQ29yZSIsInRtcFRyYW5zIiwiZXh0cmFjdFNjaGVtYSIsImRiMiIsInRhYmxlczIiLCJvYmplY3RTdG9yZU5hbWVzIiwidGFibGVzIiwiYXV0b0luY3JlbWVudCIsImluZGV4QnlLZXlQYXRoIiwiaXNQcmltYXJ5S2V5IiwiaW5kZXhOYW1lcyIsIm11bHRpRW50cnkiLCJrZXlQYXRoMiIsImNvbXBvdW5kMiIsInJlc3VsdDIiLCJoYXNHZXRBbGwiLCJtYWtlSURCS2V5UmFuZ2UiLCJpZGJSYW5nZSIsInVwcGVyQm91bmQiLCJsb3dlckJvdW5kIiwiYm91bmQiLCJjcmVhdGVEYkNvcmVUYWJsZSIsImlzQWRkT3JQdXQiLCJyZXEiLCJyZXFzIiwiZXJyb3JIYW5kbGVyIiwiYXJnczEiLCJyZXEyIiwib3BlbkN1cnNvcjIiLCJxdWVyeTIiLCJzb3VyY2UiLCJvcGVuS2V5Q3Vyc29yIiwiX19faWQiLCJfY3Vyc29yQ29udGludWUiLCJfY3Vyc29yQ29udGludWVQcmltYXJ5S2V5IiwiY29udGludWVQcmltYXJ5S2V5IiwiX2N1cnNvckFkdmFuY2UiLCJkb1Rocm93Q3Vyc29ySXNOb3RTdGFydGVkIiwiZG9UaHJvd0N1cnNvcklzU3RvcHBlZCIsImdvdE9uZSIsIml0ZXJhdGlvblByb21pc2UiLCJyZXNvbHZlSXRlcmF0aW9uIiwicmVqZWN0SXRlcmF0aW9uIiwiZ3VhcmRlZENhbGxiYWNrIiwiZXYyIiwiaGFzR2V0QWxsMiIsInJlcXVlc3QiLCJub25JbmZpbml0TGltaXQiLCJpZGJLZXlSYW5nZSIsImdldEFsbCIsImdldEFsbEtleXMiLCJrZXlDb3VudCIsImNhbGxiYWNrQ291bnQiLCJzdWNjZXNzSGFuZGxlciIsIl9wb3MiLCJ0YWJsZU1hcCIsIk1JTl9LRVkiLCJNQVhfS0VZIiwiY3JlYXRlTWlkZGxld2FyZVN0YWNrIiwic3RhY2tJbXBsIiwibWlkZGxld2FyZXMiLCJkb3duIiwiY3JlYXRlTWlkZGxld2FyZVN0YWNrcyIsImRiY29yZSIsImdlbmVyYXRlTWlkZGxld2FyZVN0YWNrcyIsIl9ub3ZpcCIsIl9taWRkbGV3YXJlcyIsInRibCIsInNldEFwaU9uUGxhY2UiLCJvYmpzIiwidGFibGVOYW1lcyIsInByb3BEZXNjIiwiZW51bWVyYWJsZSIsInJlbW92ZVRhYmxlc0FwaSIsImxvd2VyVmVyc2lvbkZpcnN0IiwiX2NmZyIsInZlcnNpb24iLCJydW5VcGdyYWRlcnMiLCJvbGRWZXJzaW9uIiwiaWRiVXBncmFkZVRyYW5zIiwiZ2xvYmFsU2NoZW1hIiwiX3N0b3JlTmFtZXMiLCJyZWplY3RUcmFuc2FjdGlvbiIsImNyZWF0ZVRhYmxlIiwicG9wdWxhdGUiLCJ1cGRhdGVUYWJsZXNBbmRJbmRleGVzIiwicXVldWUiLCJ2ZXJzaW9ucyIsIl92ZXJzaW9ucyIsImJ1aWxkR2xvYmFsU2NoZW1hIiwiYW55Q29udGVudFVwZ3JhZGVySGFzUnVuIiwidmVyc1RvUnVuIiwib2xkU2NoZW1hIiwibmV3U2NoZW1hIiwiYWRqdXN0VG9FeGlzdGluZ0luZGV4TmFtZXMiLCJkaWZmIiwiZ2V0U2NoZW1hRGlmZiIsInR1cGxlIiwiY2hhbmdlIiwicmVjcmVhdGUiLCJVcGdyYWRlIiwiYWRkSW5kZXgiLCJkZWxldGVJbmRleCIsImRlbCIsImlkeE5hbWUiLCJjb250ZW50VXBncmFkZSIsInVwZ3JhZGVTY2hlbWEiLCJjb250ZW50VXBncmFkZUlzQXN5bmMiLCJyZXR1cm5WYWx1ZSIsInByb21pc2VGb2xsb3dlZCIsImRlY3JlbWVudG9yIiwiZGVsZXRlUmVtb3ZlZFRhYmxlcyIsInJ1blF1ZXVlIiwiY3JlYXRlTWlzc2luZ1RhYmxlcyIsIm9sZERlZiIsIm5ld0RlZiIsImRlZiIsIm9sZEluZGV4ZXMiLCJuZXdJbmRleGVzIiwib2xkSWR4IiwibmV3SWR4IiwiY3JlYXRlT2JqZWN0U3RvcmUiLCJjb250YWlucyIsInN0b3JlTmFtZSIsImRlbGV0ZU9iamVjdFN0b3JlIiwiY3JlYXRlSW5kZXgiLCJkYlN0b3JlTmFtZXMiLCJqIiwiaWRiaW5kZXgiLCJyZWFkR2xvYmFsU2NoZW1hIiwidmVybm8iLCJ2ZXJpZnlJbnN0YWxsZWRTY2hlbWEiLCJpbnN0YWxsZWRTY2hlbWEiLCJjaCIsIl9oYXNHZXRBbGwiLCJkZXhpZU5hbWUiLCJpbmRleFNwZWMiLCJXb3JrZXJHbG9iYWxTY29wZSIsInBhcnNlSW5kZXhTeW50YXgiLCJwcmltS2V5QW5kSW5kZXhlcyIsImluZGV4TnVtIiwidHJpbSIsInJlcGxhY2UiLCJWZXJzaW9uIiwiX3BhcnNlU3RvcmVzU3BlYyIsInN0b3JlcyIsIm91dFNjaGVtYSIsInN0b3Jlc1NvdXJjZSIsInN0b3Jlc1NwZWMiLCJ1cGdyYWRlIiwidXBncmFkZUZ1bmN0aW9uIiwiY3JlYXRlVmVyc2lvbkNvbnN0cnVjdG9yIiwiVmVyc2lvbjIiLCJ2ZXJzaW9uTnVtYmVyIiwiZ2V0RGJOYW1lc1RhYmxlIiwiZGJOYW1lc0RCIiwiYWRkb25zIiwiZGJuYW1lcyIsImhhc0RhdGFiYXNlc05hdGl2ZSIsImRhdGFiYXNlcyIsImdldERhdGFiYXNlTmFtZXMiLCJpbmZvcyIsImluZm8iLCJfb25EYXRhYmFzZUNyZWF0ZWQiLCJfb25EYXRhYmFzZURlbGV0ZWQiLCJ2aXAiLCJpZGJSZWFkeSIsImlzU2FmYXJpIiwidXNlckFnZW50RGF0YSIsImludGVydmFsSWQiLCJ0cnlJZGIiLCJzZXRJbnRlcnZhbCIsImNsZWFySW50ZXJ2YWwiLCJkZXhpZU9wZW4iLCJzdGF0ZSIsIm9wZW5DYW5jZWxsZXIiLCJ0aHJvd0lmQ2FuY2VsbGVkIiwicmVzb2x2ZURiUmVhZHkiLCJkYlJlYWR5UmVzb2x2ZSIsInVwZ3JhZGVUcmFuc2FjdGlvbiIsIndhc0NyZWF0ZWQiLCJkYk5hbWUiLCJhdXRvU2NoZW1hIiwicm91bmQiLCJvbmJsb2NrZWQiLCJfZmlyZU9uQmxvY2tlZCIsIm9udXBncmFkZW5lZWRlZCIsImFsbG93RW1wdHlEQiIsImNsb3NlIiwiZGVscmVxIiwiZGVsZXRlRGF0YWJhc2UiLCJOb1N1Y2hEYXRhYmFzZSIsIm9sZFZlciIsInBvdyIsIm9udmVyc2lvbmNoYW5nZSIsInZjRmlyZWQiLCJvbmNsb3NlIiwib25SZWFkeUJlaW5nRmlyZWQiLCJyZWFkeSIsImZpcmVSZW1haW5kZXJzIiwicmVtYWluZGVycyIsImF3YWl0SXRlcmF0b3IiLCJjYWxsTmV4dCIsImRvVGhyb3ciLCJ0aHJvdyIsIm9uU3VjY2VzcyIsInN0ZXAiLCJvbkVycm9yIiwiZ2V0TmV4dCIsImV4dHJhY3RUcmFuc2FjdGlvbkFyZ3MiLCJfdGFibGVBcmdzXyIsInNjb3BlRnVuYyIsImVudGVyVHJhbnNhY3Rpb25TY29wZSIsInBhcmVudFRyYW5zYWN0aW9uIiwic2NvcGVGdW5jSXNBc3luYyIsIlByZW1hdHVyZUNvbW1pdCIsInBhZCIsImNyZWF0ZVZpcnR1YWxJbmRleE1pZGRsZXdhcmUiLCJpbmRleExvb2t1cCIsImFsbFZpcnR1YWxJbmRleGVzIiwiYWRkVmlydHVhbEluZGV4ZXMiLCJrZXlUYWlsIiwibG93TGV2ZWxJbmRleCIsImtleVBhdGhBbGlhcyIsImluZGV4TGlzdCIsImtleUxlbmd0aCIsImlzVmlydHVhbCIsInZpcnR1YWxJbmRleCIsInZpcnR1YWxLZXlQYXRoIiwiZmluZEJlc3RJbmRleCIsInRyYW5zbGF0ZVJhbmdlIiwidHJhbnNsYXRlUmVxdWVzdCIsImNyZWF0ZVZpcnR1YWxDdXJzb3IiLCJfY29udGludWUiLCJ2aXJ0dWFsQ3Vyc29yIiwicHJpbWFyeUtleTIiLCJ2aXJ0dWFsSW5kZXhNaWRkbGV3YXJlIiwibGV2ZWwiLCJnZXRPYmplY3REaWZmIiwicHJmeCIsImFwIiwiYnAiLCJhcFR5cGVOYW1lIiwiYnBUeXBlTmFtZSIsImdldEVmZmVjdGl2ZUtleXMiLCJob29rc01pZGRsZXdhcmUiLCJkb3duQ29yZSIsImRvd25UYWJsZSIsInRhYmxlTWlkZGxld2FyZSIsImR4VHJhbnMiLCJkZWxldGluZyIsImNyZWF0aW5nIiwidXBkYXRpbmciLCJhZGRQdXRPckRlbGV0ZSIsImRlbGV0ZVJhbmdlIiwiZHhUcmFuczIiLCJnZXRFeGlzdGluZ1ZhbHVlcyIsImV4aXN0aW5nVmFsdWVzIiwiY29udGV4dHMiLCJleGlzdGluZ1ZhbHVlIiwiZ2VuZXJhdGVkUHJpbWFyeUtleSIsIm9iamVjdERpZmYiLCJhZGRpdGlvbmFsQ2hhbmdlcyIsInJlcXVlc3RlZFZhbHVlIiwiZGVsZXRlTmV4dENodW5rIiwiZWZmZWN0aXZlS2V5cyIsImdldEZyb21UcmFuc2FjdGlvbkNhY2hlIiwiY2FjaGVFeGlzdGluZ1ZhbHVlc01pZGRsZXdhcmUiLCJjYWNoZWRSZXN1bHQiLCJpc0VtcHR5UmFuZ2UiLCJub2RlIiwiZnJvbU9yVHJlZSIsInRvIiwiZCIsInJhbmdlU2V0IiwiYWRkS2V5IiwiYWRkUmFuZ2UiLCJhZGRLZXlzIiwiZ2V0UmFuZ2VTZXRJdGVyYXRvciIsImxlZnQiLCJyaWdodCIsInIiLCJyZWJhbGFuY2UiLCJyaWdodFdhc0N1dE9mZiIsIm5ld1NldCIsIl9hZGRSYW5nZVNldCIsInRhcmdldDIiLCJyYW5nZVNldDEiLCJyYW5nZVNldDIiLCJpMSIsIm5leHRSZXN1bHQxIiwibmV4dFJlc3VsdDIiLCJrZXlQcm92aWRlZCIsInVwIiwiX2IiLCJyb290Q2xvbmUiLCJvbGRSb290UmlnaHQiLCJjb21wdXRlRGVwdGgiLCJvYnNlcnZhYmlsaXR5TWlkZGxld2FyZSIsIkZVTExfUkFOR0UiLCJ0YWJsZUNsb25lIiwibXV0YXRlZFBhcnRzIiwiZ2V0UmFuZ2VTZXQiLCJwYXJ0IiwicGtSYW5nZVNldCIsImRlbHNSYW5nZVNldCIsIm5ld09ianMiLCJvbGRDYWNoZSIsIm9sZE9ianMiLCJ0cmFja0FmZmVjdGVkSW5kZXhlcyIsImdldFJhbmdlIiwicmVhZFN1YnNjcmliZXJzIiwibWV0aG9kIiwic3Vic2NyIiwicXVlcmllZEluZGV4IiwicXVlcmllZFJhbmdlcyIsImtleXNQcm9taXNlIiwicmVzdWx0aW5nS2V5cyIsInBLZXlzIiwid2FudFZhbHVlcyIsInBrZXkiLCJhZGRBZmZlY3RlZEluZGV4IiwiYWRkS2V5T3JLZXlzIiwia2V5MiIsIm9sZEtleSIsIm5ld0tleSIsImRlcHMiLCJkZXBlbmRlbmNpZXMiLCJjYW5jZWxPcGVuIiwiYlN0aWNreSIsInN0YXRlMiIsIm5ld1ZlcnNpb24iLCJ1c2UiLCJhZGRvbiIsInZlcnNpb25JbnN0YW5jZSIsIl93aGVuUmVhZHkiLCJ1bnVzZSIsIm13IiwiaGFzQXJndW1lbnRzIiwiZG9EZWxldGUiLCJiYWNrZW5kREIiLCJoYXNCZWVuQ2xvc2VkIiwiaGFzRmFpbGVkIiwiZHluYW1pY2FsbHlPcGVuZWQiLCJfdHJhbnNhY3Rpb24iLCJvbmx5SWZDb21wYXRpYmxlIiwiaWRiTW9kZSIsIlN1YlRyYW5zYWN0aW9uIiwiZW50ZXJUcmFuc2FjdGlvbiIsIkludmFsaWRUYWJsZSIsInN5bWJvbE9ic2VydmFibGUiLCJvYnNlcnZhYmxlIiwiT2JzZXJ2YWJsZSIsIl9zdWJzY3JpYmUiLCJleHRlbmRPYnNlcnZhYmlsaXR5U2V0IiwicXVlcmllciIsIm9ic2VydmVyIiwiZXhlY3V0ZSIsImV4ZWMiLCJjbG9zZWQiLCJhY2N1bU11dHMiLCJjdXJyZW50T2JzIiwic3Vic2NyaXB0aW9uIiwibXV0YXRpb25MaXN0ZW5lciIsInF1ZXJ5aW5nIiwic3RhcnRlZExpc3RlbmluZyIsInNob3VsZE5vdGlmeSIsImRvUXVlcnkiLCJkb21EZXBzIiwibW96SW5kZXhlZERCIiwid2Via2l0SW5kZXhlZERCIiwibXNJbmRleGVkREIiLCJ3ZWJraXRJREJLZXlSYW5nZSIsImRhdGFiYXNlTmFtZSIsImV4aXN0cyIsImlnbm9yZVRyYW5zYWN0aW9uIiwiYXN5bmMiLCJnZW5lcmF0b3JGbiIsInNwYXduIiwiY3VycmVudFRyYW5zYWN0aW9uIiwicHJvbWlzZU9yRnVuY3Rpb24iLCJvcHRpb25hbFRpbWVvdXQiLCJzZW1WZXIiLCJtYXhLZXkiLCJhZGRFdmVudExpc3RlbmVyIiwidXBkYXRlZFBhcnRzIiwicHJvcGFnYXRpbmdMb2NhbGx5IiwiaW5pdEN1c3RvbUV2ZW50IiwicHJvcGFnYXRlTG9jYWxseSIsInVwZGF0ZVBhcnRzIiwid2FzTWUiLCJCcm9hZGNhc3RDaGFubmVsIiwiYmMiLCJ1bnJlZiIsImNoYW5nZWRQYXJ0cyIsInBvc3RNZXNzYWdlIiwib25tZXNzYWdlIiwiZGF0YSIsImxvY2FsU3RvcmFnZSIsInNldEl0ZW0iLCJ0cmlnIiwicmFuZG9tIiwibWF0Y2hBbGwiLCJpbmNsdWRlVW5jb250cm9sbGVkIiwiY2xpZW50IiwicGFyc2UiLCJuZXdWYWx1ZSIsInN3Q29udGFpbmVyIiwic2VydmljZVdvcmtlciIsInByb3BhZ2F0ZU1lc3NhZ2VMb2NhbGx5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxtQkFBQTtBQUFBQyxRQUFBLENBQUFELG1CQUFBO0VBQUFFLEtBQUEsRUFBQUEsQ0FBQSxLQUFBQyxPQUFBO0VBQUFDLFFBQUEsRUFBQUEsQ0FBQSxLQUFBQSxRQUFBO0VBQUFDLE9BQUEsRUFBQUEsQ0FBQSxLQUFBQyxtQkFBQTtFQUFBQyxTQUFBLEVBQUFBLENBQUEsS0FBQUEsU0FBQTtFQUFBQyxXQUFBLEVBQUFBLENBQUEsS0FBQUEsV0FBQTtFQUFBQyxhQUFBLEVBQUFBLENBQUEsS0FBQUE7QUFBQTtBQUFBQyxNQUFBLENBQUFDLE9BQUEsR0FBQUMsWUFBQSxDQUFBWixtQkFBQTs7O0FDQ08sSUFBTWEsT0FBQSxHQUNULE9BQU9DLFVBQUEsS0FBZSxjQUFjQSxVQUFBLEdBQ3BDLE9BQU9DLElBQUEsS0FBUyxjQUFjQSxJQUFBLEdBQzlCLE9BQU9DLE1BQUEsS0FBVyxjQUFjQSxNQUFBLEdBQ2hDQyxNQUFBO0FDSkcsSUFBTUMsSUFBQSxHQUFPQyxNQUFBLENBQU9ELElBQUE7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OUIsT0FBT2pzQyxJQUFBLEtBQVMsZUFBZSxPQUFPdWEsU0FBQSxLQUFjLGFBQWE7RUFPMUVtVixZQUFBLENBQWFGLGdDQUFBLEVBQW1Dc2MsWUFBQSxJQUFZO0lBQzFELElBQUk7TUFDRixJQUFJLENBQUNSLGtCQUFBLEVBQW9CO1FBQ3ZCLElBQUksT0FBT1ksWUFBQSxLQUFpQixhQUFhO1VBRXZDQSxZQUFBLENBQWFDLE9BQUEsQ0FDWDFjLDhCQUFBLEVBQ0FuUyxJQUFBLENBQUtDLFNBQUEsQ0FBVTtZQUNiNnVCLElBQUEsRUFBTTdsQixJQUFBLENBQUs4bEIsTUFBQSxFQUFNO1lBQ2pCUDtXQUNELENBQUM7O1FBR04sSUFBSSxPQUFPOXJDLElBQUEsQ0FBSyxlQUFlLFVBQVU7VUFFdkMsQ0FBQyxHQUFHQSxJQUFBLENBQUssV0FBV3NzQyxRQUFBLENBQVM7WUFBRUMsbUJBQUEsRUFBcUI7VUFBSSxDQUFFLENBQUMsRUFBRTVyQyxPQUFBLENBQzFENnJDLE1BQUEsSUFDQ0EsTUFBQSxDQUFPVCxXQUFBLENBQVk7WUFDakI1d0IsSUFBQSxFQUFNc1UsOEJBQUE7WUFDTnFjO1dBQ0QsQ0FBQzs7O2FBSVZoc0IsRUFBQSxHQUFNO0dBQ1Q7RUFLRCxJQUFJLE9BQU9zckIsZ0JBQUEsS0FBcUIsYUFBYTtJQUN6Q0EsZ0JBQUEsQ0FBaUIsV0FBWTNhLEVBQUEsSUFBZ0I7TUFDN0MsSUFBSUEsRUFBQSxDQUFHN3ZCLEdBQUEsS0FBUTZ1Qiw4QkFBQSxFQUFnQztRQUM3QyxNQUFNd2MsSUFBQSxHQUFPM3VCLElBQUEsQ0FBS212QixLQUFBLENBQU1oYyxFQUFBLENBQUdpYyxRQUFRO1FBQ25DLElBQUlULElBQUEsRUFBTVQsZ0JBQUEsQ0FBaUJTLElBQUEsQ0FBS0gsWUFBWTs7S0FFL0M7O0VBTUgsTUFBTWEsV0FBQSxHQUFjM3NDLElBQUEsQ0FBSzhOLFFBQUEsSUFBWXlNLFNBQUEsQ0FBVXF5QixhQUFBO0VBQy9DLElBQUlELFdBQUEsRUFBYTtJQUVmQSxXQUFBLENBQVl2QixnQkFBQSxDQUFpQixXQUFXeUIsdUJBQXVCOzs7QUFJbkUsU0FBU0Esd0JBQXdCO0VBQUVaO0FBQUksR0FBZ0I7RUFDckQsSUFBSUEsSUFBQSxJQUFRQSxJQUFBLENBQUs5d0IsSUFBQSxLQUFTc1UsOEJBQUEsRUFBZ0M7SUFDeEQrYixnQkFBQSxDQUFpQlMsSUFBQSxDQUFLSCxZQUFZOztBQUV0QztBQ2hGQXI4QixZQUFBLENBQWFkLGVBQUEsR0FBa0J6RCxRQUFBO0FBRy9CbEQsUUFBQSxDQUFlSixLQUFBLEVBQWErUyxxQkFBcUI7OztBMURqQmpELElBQU9wYixtQkFBQSxHQUFRSCxPQUFBIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvcmVhY3RpdmUtbW9kZWwvb3V0In0=