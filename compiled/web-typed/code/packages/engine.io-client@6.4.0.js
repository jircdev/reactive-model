System.register(["engine.io-parser@5.0.6","@socket.io/component-emitter@3.1.0"], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["engine.io-parser","5.0.6"],["@socket.io/component-emitter","3.1.0"],["engine.io-client","6.4.0"]]);
	return globalThis.bimport(globalThis.bimport.resolve(specifier, dependencies));
};


var dependencies = new Map();
var require = dependency => dependencies.get(dependency);
return {
setters: [dep => dependencies.set('engine.io-parser@5.0.6', dep), dep => dependencies.set('@socket.io/component-emitter@3.1.0', dep)],
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

// .beyond/uimport/temp/engine.io-client.6.4.0.js
var engine_io_client_6_4_0_exports = {};
__export(engine_io_client_6_4_0_exports, {
  Socket: () => Socket,
  Transport: () => Transport,
  installTimerFunctions: () => installTimerFunctions,
  nextTick: () => nextTick,
  parse: () => parse,
  protocol: () => protocol2,
  transports: () => transports
});
module.exports = __toCommonJS(engine_io_client_6_4_0_exports);

// node_modules/engine.io-client/build/esm/globalThis.browser.js
var globalThisShim = (() => {
  if (typeof self !== "undefined") {
    return self;
  } else if (typeof window !== "undefined") {
    return window;
  } else {
    return Function("return this")();
  }
})();

// node_modules/engine.io-client/build/esm/util.js
function pick(obj, ...attr) {
  return attr.reduce((acc, k) => {
    if (obj.hasOwnProperty(k)) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
}
var NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
var NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
function installTimerFunctions(obj, opts) {
  if (opts.useNativeTimers) {
    obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
    obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
  } else {
    obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
    obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
  }
}
var BASE64_OVERHEAD = 1.33;
function byteLength(obj) {
  if (typeof obj === "string") {
    return utf8Length(obj);
  }
  return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
}
function utf8Length(str) {
  let c = 0,
    length2 = 0;
  for (let i2 = 0, l = str.length; i2 < l; i2++) {
    c = str.charCodeAt(i2);
    if (c < 128) {
      length2 += 1;
    } else if (c < 2048) {
      length2 += 2;
    } else if (c < 55296 || c >= 57344) {
      length2 += 3;
    } else {
      i2++;
      length2 += 4;
    }
  }
  return length2;
}

// node_modules/engine.io-client/build/esm/transport.js
var import_engine = require("engine.io-parser@5.0.6");
var import_component_emitter = require("@socket.io/component-emitter@3.1.0");
var TransportError = class extends Error {
  constructor(reason, description, context) {
    super(reason);
    this.description = description;
    this.context = context;
    this.type = "TransportError";
  }
};
var Transport = class extends import_component_emitter.Emitter {
  constructor(opts) {
    super();
    this.writable = false;
    installTimerFunctions(this, opts);
    this.opts = opts;
    this.query = opts.query;
    this.socket = opts.socket;
  }
  onError(reason, description, context) {
    super.emitReserved("error", new TransportError(reason, description, context));
    return this;
  }
  open() {
    this.readyState = "opening";
    this.doOpen();
    return this;
  }
  close() {
    if (this.readyState === "opening" || this.readyState === "open") {
      this.doClose();
      this.onClose();
    }
    return this;
  }
  send(packets) {
    if (this.readyState === "open") {
      this.write(packets);
    } else {}
  }
  onOpen() {
    this.readyState = "open";
    this.writable = true;
    super.emitReserved("open");
  }
  onData(data) {
    const packet = (0, import_engine.decodePacket)(data, this.socket.binaryType);
    this.onPacket(packet);
  }
  onPacket(packet) {
    super.emitReserved("packet", packet);
  }
  onClose(details) {
    this.readyState = "closed";
    super.emitReserved("close", details);
  }
  pause(onPause) {}
};

// node_modules/engine.io-client/build/esm/contrib/yeast.js
var alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),
  length = 64,
  map = {};
var seed = 0,
  i = 0,
  prev;
function encode(num) {
  let encoded = "";
  do {
    encoded = alphabet[num % length] + encoded;
    num = Math.floor(num / length);
  } while (num > 0);
  return encoded;
}
function decode(str) {
  let decoded = 0;
  for (i = 0; i < str.length; i++) {
    decoded = decoded * length + map[str.charAt(i)];
  }
  return decoded;
}
function yeast() {
  const now = encode(+new Date());
  if (now !== prev) return seed = 0, prev = now;
  return now + "." + encode(seed++);
}
for (; i < length; i++) map[alphabet[i]] = i;

// node_modules/engine.io-client/build/esm/contrib/parseqs.js
function encode2(obj) {
  let str = "";
  for (let i2 in obj) {
    if (obj.hasOwnProperty(i2)) {
      if (str.length) str += "&";
      str += encodeURIComponent(i2) + "=" + encodeURIComponent(obj[i2]);
    }
  }
  return str;
}
function decode2(qs) {
  let qry = {};
  let pairs = qs.split("&");
  for (let i2 = 0, l = pairs.length; i2 < l; i2++) {
    let pair = pairs[i2].split("=");
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
}

// node_modules/engine.io-client/build/esm/contrib/has-cors.js
var value = false;
try {
  value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
} catch (err) {}
var hasCORS = value;

// node_modules/engine.io-client/build/esm/transports/xmlhttprequest.browser.js
function XHR(opts) {
  const xdomain = opts.xdomain;
  try {
    if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) {}
  if (!xdomain) {
    try {
      return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch (e) {}
  }
}

// node_modules/engine.io-client/build/esm/transports/polling.js
var import_engine2 = require("engine.io-parser@5.0.6");
var import_component_emitter2 = require("@socket.io/component-emitter@3.1.0");
function empty() {}
var hasXHR2 = function () {
  const xhr = new XHR({
    xdomain: false
  });
  return null != xhr.responseType;
}();
var Polling = class extends Transport {
  constructor(opts) {
    super(opts);
    this.polling = false;
    if (typeof location !== "undefined") {
      const isSSL = "https:" === location.protocol;
      let port = location.port;
      if (!port) {
        port = isSSL ? "443" : "80";
      }
      this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
      this.xs = opts.secure !== isSSL;
    }
    const forceBase64 = opts && opts.forceBase64;
    this.supportsBinary = hasXHR2 && !forceBase64;
  }
  get name() {
    return "polling";
  }
  doOpen() {
    this.poll();
  }
  pause(onPause) {
    this.readyState = "pausing";
    const pause = () => {
      this.readyState = "paused";
      onPause();
    };
    if (this.polling || !this.writable) {
      let total = 0;
      if (this.polling) {
        total++;
        this.once("pollComplete", function () {
          --total || pause();
        });
      }
      if (!this.writable) {
        total++;
        this.once("drain", function () {
          --total || pause();
        });
      }
    } else {
      pause();
    }
  }
  poll() {
    this.polling = true;
    this.doPoll();
    this.emitReserved("poll");
  }
  onData(data) {
    const callback = packet => {
      if ("opening" === this.readyState && packet.type === "open") {
        this.onOpen();
      }
      if ("close" === packet.type) {
        this.onClose({
          description: "transport closed by the server"
        });
        return false;
      }
      this.onPacket(packet);
    };
    (0, import_engine2.decodePayload)(data, this.socket.binaryType).forEach(callback);
    if ("closed" !== this.readyState) {
      this.polling = false;
      this.emitReserved("pollComplete");
      if ("open" === this.readyState) {
        this.poll();
      } else {}
    }
  }
  doClose() {
    const close = () => {
      this.write([{
        type: "close"
      }]);
    };
    if ("open" === this.readyState) {
      close();
    } else {
      this.once("open", close);
    }
  }
  write(packets) {
    this.writable = false;
    (0, import_engine2.encodePayload)(packets, data => {
      this.doWrite(data, () => {
        this.writable = true;
        this.emitReserved("drain");
      });
    });
  }
  uri() {
    let query = this.query || {};
    const schema = this.opts.secure ? "https" : "http";
    let port = "";
    if (false !== this.opts.timestampRequests) {
      query[this.opts.timestampParam] = yeast();
    }
    if (!this.supportsBinary && !query.sid) {
      query.b64 = 1;
    }
    if (this.opts.port && ("https" === schema && Number(this.opts.port) !== 443 || "http" === schema && Number(this.opts.port) !== 80)) {
      port = ":" + this.opts.port;
    }
    const encodedQuery = encode2(query);
    const ipv6 = this.opts.hostname.indexOf(":") !== -1;
    return schema + "://" + (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) + port + this.opts.path + (encodedQuery.length ? "?" + encodedQuery : "");
  }
  request(opts = {}) {
    Object.assign(opts, {
      xd: this.xd,
      xs: this.xs
    }, this.opts);
    return new Request(this.uri(), opts);
  }
  doWrite(data, fn) {
    const req = this.request({
      method: "POST",
      data
    });
    req.on("success", fn);
    req.on("error", (xhrStatus, context) => {
      this.onError("xhr post error", xhrStatus, context);
    });
  }
  doPoll() {
    const req = this.request();
    req.on("data", this.onData.bind(this));
    req.on("error", (xhrStatus, context) => {
      this.onError("xhr poll error", xhrStatus, context);
    });
    this.pollXhr = req;
  }
};
var Request = class extends import_component_emitter2.Emitter {
  constructor(uri, opts) {
    super();
    installTimerFunctions(this, opts);
    this.opts = opts;
    this.method = opts.method || "GET";
    this.uri = uri;
    this.async = false !== opts.async;
    this.data = void 0 !== opts.data ? opts.data : null;
    this.create();
  }
  create() {
    const opts = pick(this.opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    opts.xdomain = !!this.opts.xd;
    opts.xscheme = !!this.opts.xs;
    const xhr = this.xhr = new XHR(opts);
    try {
      xhr.open(this.method, this.uri, this.async);
      try {
        if (this.opts.extraHeaders) {
          xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
          for (let i2 in this.opts.extraHeaders) {
            if (this.opts.extraHeaders.hasOwnProperty(i2)) {
              xhr.setRequestHeader(i2, this.opts.extraHeaders[i2]);
            }
          }
        }
      } catch (e) {}
      if ("POST" === this.method) {
        try {
          xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch (e) {}
      }
      try {
        xhr.setRequestHeader("Accept", "*/*");
      } catch (e) {}
      if ("withCredentials" in xhr) {
        xhr.withCredentials = this.opts.withCredentials;
      }
      if (this.opts.requestTimeout) {
        xhr.timeout = this.opts.requestTimeout;
      }
      xhr.onreadystatechange = () => {
        if (4 !== xhr.readyState) return;
        if (200 === xhr.status || 1223 === xhr.status) {
          this.onLoad();
        } else {
          this.setTimeoutFn(() => {
            this.onError(typeof xhr.status === "number" ? xhr.status : 0);
          }, 0);
        }
      };
      xhr.send(this.data);
    } catch (e) {
      this.setTimeoutFn(() => {
        this.onError(e);
      }, 0);
      return;
    }
    if (typeof document !== "undefined") {
      this.index = Request.requestsCount++;
      Request.requests[this.index] = this;
    }
  }
  onError(err) {
    this.emitReserved("error", err, this.xhr);
    this.cleanup(true);
  }
  cleanup(fromError) {
    if ("undefined" === typeof this.xhr || null === this.xhr) {
      return;
    }
    this.xhr.onreadystatechange = empty;
    if (fromError) {
      try {
        this.xhr.abort();
      } catch (e) {}
    }
    if (typeof document !== "undefined") {
      delete Request.requests[this.index];
    }
    this.xhr = null;
  }
  onLoad() {
    const data = this.xhr.responseText;
    if (data !== null) {
      this.emitReserved("data", data);
      this.emitReserved("success");
      this.cleanup();
    }
  }
  abort() {
    this.cleanup();
  }
};
Request.requestsCount = 0;
Request.requests = {};
if (typeof document !== "undefined") {
  if (typeof attachEvent === "function") {
    attachEvent("onunload", unloadHandler);
  } else if (typeof addEventListener === "function") {
    const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
    addEventListener(terminationEvent, unloadHandler, false);
  }
}
function unloadHandler() {
  for (let i2 in Request.requests) {
    if (Request.requests.hasOwnProperty(i2)) {
      Request.requests[i2].abort();
    }
  }
}

// node_modules/engine.io-client/build/esm/transports/websocket-constructor.browser.js
var nextTick = (() => {
  const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
  if (isPromiseAvailable) {
    return cb => Promise.resolve().then(cb);
  } else {
    return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
  }
})();
var WebSocket = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
var usingBrowserWebSocket = true;
var defaultBinaryType = "arraybuffer";

// node_modules/engine.io-client/build/esm/transports/websocket.js
var import_engine3 = require("engine.io-parser@5.0.6");
var isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
var WS = class extends Transport {
  constructor(opts) {
    super(opts);
    this.supportsBinary = !opts.forceBase64;
  }
  get name() {
    return "websocket";
  }
  doOpen() {
    if (!this.check()) {
      return;
    }
    const uri = this.uri();
    const protocols = this.opts.protocols;
    const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    if (this.opts.extraHeaders) {
      opts.headers = this.opts.extraHeaders;
    }
    try {
      this.ws = usingBrowserWebSocket && !isReactNative ? protocols ? new WebSocket(uri, protocols) : new WebSocket(uri) : new WebSocket(uri, protocols, opts);
    } catch (err) {
      return this.emitReserved("error", err);
    }
    this.ws.binaryType = this.socket.binaryType || defaultBinaryType;
    this.addEventListeners();
  }
  addEventListeners() {
    this.ws.onopen = () => {
      if (this.opts.autoUnref) {
        this.ws._socket.unref();
      }
      this.onOpen();
    };
    this.ws.onclose = closeEvent => this.onClose({
      description: "websocket connection closed",
      context: closeEvent
    });
    this.ws.onmessage = ev => this.onData(ev.data);
    this.ws.onerror = e => this.onError("websocket error", e);
  }
  write(packets) {
    this.writable = false;
    for (let i2 = 0; i2 < packets.length; i2++) {
      const packet = packets[i2];
      const lastPacket = i2 === packets.length - 1;
      (0, import_engine3.encodePacket)(packet, this.supportsBinary, data => {
        const opts = {};
        if (!usingBrowserWebSocket) {
          if (packet.options) {
            opts.compress = packet.options.compress;
          }
          if (this.opts.perMessageDeflate) {
            const len = "string" === typeof data ? Buffer.byteLength(data) : data.length;
            if (len < this.opts.perMessageDeflate.threshold) {
              opts.compress = false;
            }
          }
        }
        try {
          if (usingBrowserWebSocket) {
            this.ws.send(data);
          } else {
            this.ws.send(data, opts);
          }
        } catch (e) {}
        if (lastPacket) {
          nextTick(() => {
            this.writable = true;
            this.emitReserved("drain");
          }, this.setTimeoutFn);
        }
      });
    }
  }
  doClose() {
    if (typeof this.ws !== "undefined") {
      this.ws.close();
      this.ws = null;
    }
  }
  uri() {
    let query = this.query || {};
    const schema = this.opts.secure ? "wss" : "ws";
    let port = "";
    if (this.opts.port && ("wss" === schema && Number(this.opts.port) !== 443 || "ws" === schema && Number(this.opts.port) !== 80)) {
      port = ":" + this.opts.port;
    }
    if (this.opts.timestampRequests) {
      query[this.opts.timestampParam] = yeast();
    }
    if (!this.supportsBinary) {
      query.b64 = 1;
    }
    const encodedQuery = encode2(query);
    const ipv6 = this.opts.hostname.indexOf(":") !== -1;
    return schema + "://" + (ipv6 ? "[" + this.opts.hostname + "]" : this.opts.hostname) + port + this.opts.path + (encodedQuery.length ? "?" + encodedQuery : "");
  }
  check() {
    return !!WebSocket;
  }
};

// node_modules/engine.io-client/build/esm/transports/index.js
var transports = {
  websocket: WS,
  polling: Polling
};

// node_modules/engine.io-client/build/esm/contrib/parseuri.js
var re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
var parts = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
function parse(str) {
  const src = str,
    b = str.indexOf("["),
    e = str.indexOf("]");
  if (b != -1 && e != -1) {
    str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
  }
  let m = re.exec(str || ""),
    uri = {},
    i2 = 14;
  while (i2--) {
    uri[parts[i2]] = m[i2] || "";
  }
  if (b != -1 && e != -1) {
    uri.source = src;
    uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
    uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
    uri.ipv6uri = true;
  }
  uri.pathNames = pathNames(uri, uri["path"]);
  uri.queryKey = queryKey(uri, uri["query"]);
  return uri;
}
function pathNames(obj, path) {
  const regx = /\/{2,9}/g,
    names = path.replace(regx, "/").split("/");
  if (path.slice(0, 1) == "/" || path.length === 0) {
    names.splice(0, 1);
  }
  if (path.slice(-1) == "/") {
    names.splice(names.length - 1, 1);
  }
  return names;
}
function queryKey(uri, query) {
  const data = {};
  query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function ($0, $1, $2) {
    if ($1) {
      data[$1] = $2;
    }
  });
  return data;
}

// node_modules/engine.io-client/build/esm/socket.js
var import_component_emitter3 = require("@socket.io/component-emitter@3.1.0");
var import_engine4 = require("engine.io-parser@5.0.6");
var Socket = class extends import_component_emitter3.Emitter {
  constructor(uri, opts = {}) {
    super();
    this.writeBuffer = [];
    if (uri && "object" === typeof uri) {
      opts = uri;
      uri = null;
    }
    if (uri) {
      uri = parse(uri);
      opts.hostname = uri.host;
      opts.secure = uri.protocol === "https" || uri.protocol === "wss";
      opts.port = uri.port;
      if (uri.query) opts.query = uri.query;
    } else if (opts.host) {
      opts.hostname = parse(opts.host).host;
    }
    installTimerFunctions(this, opts);
    this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
    if (opts.hostname && !opts.port) {
      opts.port = this.secure ? "443" : "80";
    }
    this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
    this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
    this.transports = opts.transports || ["polling", "websocket"];
    this.writeBuffer = [];
    this.prevBufferLen = 0;
    this.opts = Object.assign({
      path: "/engine.io",
      agent: false,
      withCredentials: false,
      upgrade: true,
      timestampParam: "t",
      rememberUpgrade: false,
      addTrailingSlash: true,
      rejectUnauthorized: true,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: true
    }, opts);
    this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
    if (typeof this.opts.query === "string") {
      this.opts.query = decode2(this.opts.query);
    }
    this.id = null;
    this.upgrades = null;
    this.pingInterval = null;
    this.pingTimeout = null;
    this.pingTimeoutTimer = null;
    if (typeof addEventListener === "function") {
      if (this.opts.closeOnBeforeunload) {
        this.beforeunloadEventListener = () => {
          if (this.transport) {
            this.transport.removeAllListeners();
            this.transport.close();
          }
        };
        addEventListener("beforeunload", this.beforeunloadEventListener, false);
      }
      if (this.hostname !== "localhost") {
        this.offlineEventListener = () => {
          this.onClose("transport close", {
            description: "network connection lost"
          });
        };
        addEventListener("offline", this.offlineEventListener, false);
      }
    }
    this.open();
  }
  createTransport(name) {
    const query = Object.assign({}, this.opts.query);
    query.EIO = import_engine4.protocol;
    query.transport = name;
    if (this.id) query.sid = this.id;
    const opts = Object.assign({}, this.opts.transportOptions[name], this.opts, {
      query,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    });
    return new transports[name](opts);
  }
  open() {
    let transport;
    if (this.opts.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1) {
      transport = "websocket";
    } else if (0 === this.transports.length) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    } else {
      transport = this.transports[0];
    }
    this.readyState = "opening";
    try {
      transport = this.createTransport(transport);
    } catch (e) {
      this.transports.shift();
      this.open();
      return;
    }
    transport.open();
    this.setTransport(transport);
  }
  setTransport(transport) {
    if (this.transport) {
      this.transport.removeAllListeners();
    }
    this.transport = transport;
    transport.on("drain", this.onDrain.bind(this)).on("packet", this.onPacket.bind(this)).on("error", this.onError.bind(this)).on("close", reason => this.onClose("transport close", reason));
  }
  probe(name) {
    let transport = this.createTransport(name);
    let failed = false;
    Socket.priorWebsocketSuccess = false;
    const onTransportOpen = () => {
      if (failed) return;
      transport.send([{
        type: "ping",
        data: "probe"
      }]);
      transport.once("packet", msg => {
        if (failed) return;
        if ("pong" === msg.type && "probe" === msg.data) {
          this.upgrading = true;
          this.emitReserved("upgrading", transport);
          if (!transport) return;
          Socket.priorWebsocketSuccess = "websocket" === transport.name;
          this.transport.pause(() => {
            if (failed) return;
            if ("closed" === this.readyState) return;
            cleanup();
            this.setTransport(transport);
            transport.send([{
              type: "upgrade"
            }]);
            this.emitReserved("upgrade", transport);
            transport = null;
            this.upgrading = false;
            this.flush();
          });
        } else {
          const err = new Error("probe error");
          err.transport = transport.name;
          this.emitReserved("upgradeError", err);
        }
      });
    };
    function freezeTransport() {
      if (failed) return;
      failed = true;
      cleanup();
      transport.close();
      transport = null;
    }
    const onerror = err => {
      const error = new Error("probe error: " + err);
      error.transport = transport.name;
      freezeTransport();
      this.emitReserved("upgradeError", error);
    };
    function onTransportClose() {
      onerror("transport closed");
    }
    function onclose() {
      onerror("socket closed");
    }
    function onupgrade(to) {
      if (transport && to.name !== transport.name) {
        freezeTransport();
      }
    }
    const cleanup = () => {
      transport.removeListener("open", onTransportOpen);
      transport.removeListener("error", onerror);
      transport.removeListener("close", onTransportClose);
      this.off("close", onclose);
      this.off("upgrading", onupgrade);
    };
    transport.once("open", onTransportOpen);
    transport.once("error", onerror);
    transport.once("close", onTransportClose);
    this.once("close", onclose);
    this.once("upgrading", onupgrade);
    transport.open();
  }
  onOpen() {
    this.readyState = "open";
    Socket.priorWebsocketSuccess = "websocket" === this.transport.name;
    this.emitReserved("open");
    this.flush();
    if ("open" === this.readyState && this.opts.upgrade) {
      let i2 = 0;
      const l = this.upgrades.length;
      for (; i2 < l; i2++) {
        this.probe(this.upgrades[i2]);
      }
    }
  }
  onPacket(packet) {
    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
      this.emitReserved("packet", packet);
      this.emitReserved("heartbeat");
      switch (packet.type) {
        case "open":
          this.onHandshake(JSON.parse(packet.data));
          break;
        case "ping":
          this.resetPingTimeout();
          this.sendPacket("pong");
          this.emitReserved("ping");
          this.emitReserved("pong");
          break;
        case "error":
          const err = new Error("server error");
          err.code = packet.data;
          this.onError(err);
          break;
        case "message":
          this.emitReserved("data", packet.data);
          this.emitReserved("message", packet.data);
          break;
      }
    } else {}
  }
  onHandshake(data) {
    this.emitReserved("handshake", data);
    this.id = data.sid;
    this.transport.query.sid = data.sid;
    this.upgrades = this.filterUpgrades(data.upgrades);
    this.pingInterval = data.pingInterval;
    this.pingTimeout = data.pingTimeout;
    this.maxPayload = data.maxPayload;
    this.onOpen();
    if ("closed" === this.readyState) return;
    this.resetPingTimeout();
  }
  resetPingTimeout() {
    this.clearTimeoutFn(this.pingTimeoutTimer);
    this.pingTimeoutTimer = this.setTimeoutFn(() => {
      this.onClose("ping timeout");
    }, this.pingInterval + this.pingTimeout);
    if (this.opts.autoUnref) {
      this.pingTimeoutTimer.unref();
    }
  }
  onDrain() {
    this.writeBuffer.splice(0, this.prevBufferLen);
    this.prevBufferLen = 0;
    if (0 === this.writeBuffer.length) {
      this.emitReserved("drain");
    } else {
      this.flush();
    }
  }
  flush() {
    if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const packets = this.getWritablePackets();
      this.transport.send(packets);
      this.prevBufferLen = packets.length;
      this.emitReserved("flush");
    }
  }
  getWritablePackets() {
    const shouldCheckPayloadSize = this.maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
    if (!shouldCheckPayloadSize) {
      return this.writeBuffer;
    }
    let payloadSize = 1;
    for (let i2 = 0; i2 < this.writeBuffer.length; i2++) {
      const data = this.writeBuffer[i2].data;
      if (data) {
        payloadSize += byteLength(data);
      }
      if (i2 > 0 && payloadSize > this.maxPayload) {
        return this.writeBuffer.slice(0, i2);
      }
      payloadSize += 2;
    }
    return this.writeBuffer;
  }
  write(msg, options, fn) {
    this.sendPacket("message", msg, options, fn);
    return this;
  }
  send(msg, options, fn) {
    this.sendPacket("message", msg, options, fn);
    return this;
  }
  sendPacket(type, data, options, fn) {
    if ("function" === typeof data) {
      fn = data;
      data = void 0;
    }
    if ("function" === typeof options) {
      fn = options;
      options = null;
    }
    if ("closing" === this.readyState || "closed" === this.readyState) {
      return;
    }
    options = options || {};
    options.compress = false !== options.compress;
    const packet = {
      type,
      data,
      options
    };
    this.emitReserved("packetCreate", packet);
    this.writeBuffer.push(packet);
    if (fn) this.once("flush", fn);
    this.flush();
  }
  close() {
    const close = () => {
      this.onClose("forced close");
      this.transport.close();
    };
    const cleanupAndClose = () => {
      this.off("upgrade", cleanupAndClose);
      this.off("upgradeError", cleanupAndClose);
      close();
    };
    const waitForUpgrade = () => {
      this.once("upgrade", cleanupAndClose);
      this.once("upgradeError", cleanupAndClose);
    };
    if ("opening" === this.readyState || "open" === this.readyState) {
      this.readyState = "closing";
      if (this.writeBuffer.length) {
        this.once("drain", () => {
          if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        });
      } else if (this.upgrading) {
        waitForUpgrade();
      } else {
        close();
      }
    }
    return this;
  }
  onError(err) {
    Socket.priorWebsocketSuccess = false;
    this.emitReserved("error", err);
    this.onClose("transport error", err);
  }
  onClose(reason, description) {
    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
      this.clearTimeoutFn(this.pingTimeoutTimer);
      this.transport.removeAllListeners("close");
      this.transport.close();
      this.transport.removeAllListeners();
      if (typeof removeEventListener === "function") {
        removeEventListener("beforeunload", this.beforeunloadEventListener, false);
        removeEventListener("offline", this.offlineEventListener, false);
      }
      this.readyState = "closed";
      this.id = null;
      this.emitReserved("close", reason, description);
      this.writeBuffer = [];
      this.prevBufferLen = 0;
    }
  }
  filterUpgrades(upgrades) {
    const filteredUpgrades = [];
    let i2 = 0;
    const j = upgrades.length;
    for (; i2 < j; i2++) {
      if (~this.transports.indexOf(upgrades[i2])) filteredUpgrades.push(upgrades[i2]);
    }
    return filteredUpgrades;
  }
};
Socket.protocol = import_engine4.protocol;

// node_modules/engine.io-client/build/esm/index.js
var protocol2 = Socket.protocol;
};

code(module, require);
_exports(module.exports);
}}});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL2VuZ2luZS5pby1jbGllbnQuNi40LjAuanMiLCIuLi9ub2RlX21vZHVsZXMvZW5naW5lLmlvLWNsaWVudC9idWlsZC9lc20vZ2xvYmFsVGhpcy5icm93c2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2VuZ2luZS5pby1jbGllbnQvYnVpbGQvZXNtL3V0aWwuanMiLCIuLi9ub2RlX21vZHVsZXMvZW5naW5lLmlvLWNsaWVudC9idWlsZC9lc20vdHJhbnNwb3J0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2VuZ2luZS5pby1jbGllbnQvYnVpbGQvZXNtL2NvbnRyaWIveWVhc3QuanMiLCIuLi9ub2RlX21vZHVsZXMvZW5naW5lLmlvLWNsaWVudC9idWlsZC9lc20vY29udHJpYi9wYXJzZXFzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2VuZ2luZS5pby1jbGllbnQvYnVpbGQvZXNtL2NvbnRyaWIvaGFzLWNvcnMuanMiLCIuLi9ub2RlX21vZHVsZXMvZW5naW5lLmlvLWNsaWVudC9idWlsZC9lc20vdHJhbnNwb3J0cy94bWxodHRwcmVxdWVzdC5icm93c2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2VuZ2luZS5pby1jbGllbnQvYnVpbGQvZXNtL3RyYW5zcG9ydHMvcG9sbGluZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8tY2xpZW50L2J1aWxkL2VzbS90cmFuc3BvcnRzL3dlYnNvY2tldC1jb25zdHJ1Y3Rvci5icm93c2VyLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2VuZ2luZS5pby1jbGllbnQvYnVpbGQvZXNtL3RyYW5zcG9ydHMvd2Vic29ja2V0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2VuZ2luZS5pby1jbGllbnQvYnVpbGQvZXNtL3RyYW5zcG9ydHMvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvZW5naW5lLmlvLWNsaWVudC9idWlsZC9lc20vY29udHJpYi9wYXJzZXVyaS5qcyIsIi4uL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8tY2xpZW50L2J1aWxkL2VzbS9zb2NrZXQuanMiLCIuLi9ub2RlX21vZHVsZXMvZW5naW5lLmlvLWNsaWVudC9idWlsZC9lc20vaW5kZXguanMiXSwibmFtZXMiOlsiZW5naW5lX2lvX2NsaWVudF82XzRfMF9leHBvcnRzIiwiX19leHBvcnQiLCJTb2NrZXQiLCJUcmFuc3BvcnQiLCJpbnN0YWxsVGltZXJGdW5jdGlvbnMiLCJuZXh0VGljayIsInBhcnNlIiwicHJvdG9jb2wiLCJwcm90b2NvbDIiLCJ0cmFuc3BvcnRzIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9fdG9Db21tb25KUyIsImdsb2JhbFRoaXNTaGltIiwic2VsZiIsIndpbmRvdyIsIkZ1bmN0aW9uIiwicGljayIsIm9iaiIsImF0dHIiLCJyZWR1Y2UiLCJhY2MiLCJrIiwiaGFzT3duUHJvcGVydHkiLCJOQVRJVkVfU0VUX1RJTUVPVVQiLCJzZXRUaW1lb3V0IiwiTkFUSVZFX0NMRUFSX1RJTUVPVVQiLCJjbGVhclRpbWVvdXQiLCJvcHRzIiwidXNlTmF0aXZlVGltZXJzIiwic2V0VGltZW91dEZuIiwiYmluZCIsImNsZWFyVGltZW91dEZuIiwiQkFTRTY0X09WRVJIRUFEIiwiYnl0ZUxlbmd0aCIsInV0ZjhMZW5ndGgiLCJNYXRoIiwiY2VpbCIsInNpemUiLCJzdHIiLCJjIiwibGVuZ3RoMiIsImkyIiwibCIsImxlbmd0aCIsImNoYXJDb2RlQXQiLCJpbXBvcnRfZW5naW5lIiwicmVxdWlyZSIsImltcG9ydF9jb21wb25lbnRfZW1pdHRlciIsIlRyYW5zcG9ydEVycm9yIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciIsInJlYXNvbiIsImRlc2NyaXB0aW9uIiwiY29udGV4dCIsInR5cGUiLCJFbWl0dGVyIiwid3JpdGFibGUiLCJxdWVyeSIsInNvY2tldCIsIm9uRXJyb3IiLCJlbWl0UmVzZXJ2ZWQiLCJvcGVuIiwicmVhZHlTdGF0ZSIsImRvT3BlbiIsImNsb3NlIiwiZG9DbG9zZSIsIm9uQ2xvc2UiLCJzZW5kIiwicGFja2V0cyIsIndyaXRlIiwib25PcGVuIiwib25EYXRhIiwiZGF0YSIsInBhY2tldCIsImRlY29kZVBhY2tldCIsImJpbmFyeVR5cGUiLCJvblBhY2tldCIsImRldGFpbHMiLCJwYXVzZSIsIm9uUGF1c2UiLCJhbHBoYWJldCIsInNwbGl0IiwibWFwIiwic2VlZCIsImkiLCJwcmV2IiwiZW5jb2RlIiwibnVtIiwiZW5jb2RlZCIsImZsb29yIiwiZGVjb2RlIiwiZGVjb2RlZCIsImNoYXJBdCIsInllYXN0Iiwibm93IiwiRGF0ZSIsImVuY29kZTIiLCJlbmNvZGVVUklDb21wb25lbnQiLCJkZWNvZGUyIiwicXMiLCJxcnkiLCJwYWlycyIsInBhaXIiLCJkZWNvZGVVUklDb21wb25lbnQiLCJ2YWx1ZSIsIlhNTEh0dHBSZXF1ZXN0IiwiZXJyIiwiaGFzQ09SUyIsIlhIUiIsInhkb21haW4iLCJlIiwiY29uY2F0Iiwiam9pbiIsImltcG9ydF9lbmdpbmUyIiwiaW1wb3J0X2NvbXBvbmVudF9lbWl0dGVyMiIsImVtcHR5IiwiaGFzWEhSMiIsInhociIsInJlc3BvbnNlVHlwZSIsIlBvbGxpbmciLCJwb2xsaW5nIiwibG9jYXRpb24iLCJpc1NTTCIsInBvcnQiLCJ4ZCIsImhvc3RuYW1lIiwieHMiLCJzZWN1cmUiLCJmb3JjZUJhc2U2NCIsInN1cHBvcnRzQmluYXJ5IiwibmFtZSIsInBvbGwiLCJ0b3RhbCIsIm9uY2UiLCJkb1BvbGwiLCJjYWxsYmFjayIsImRlY29kZVBheWxvYWQiLCJmb3JFYWNoIiwiZW5jb2RlUGF5bG9hZCIsImRvV3JpdGUiLCJ1cmkiLCJzY2hlbWEiLCJ0aW1lc3RhbXBSZXF1ZXN0cyIsInRpbWVzdGFtcFBhcmFtIiwic2lkIiwiYjY0IiwiTnVtYmVyIiwiZW5jb2RlZFF1ZXJ5IiwiaXB2NiIsImluZGV4T2YiLCJwYXRoIiwicmVxdWVzdCIsIk9iamVjdCIsImFzc2lnbiIsIlJlcXVlc3QiLCJmbiIsInJlcSIsIm1ldGhvZCIsIm9uIiwieGhyU3RhdHVzIiwicG9sbFhociIsImFzeW5jIiwiY3JlYXRlIiwieHNjaGVtZSIsImV4dHJhSGVhZGVycyIsInNldERpc2FibGVIZWFkZXJDaGVjayIsInNldFJlcXVlc3RIZWFkZXIiLCJ3aXRoQ3JlZGVudGlhbHMiLCJyZXF1ZXN0VGltZW91dCIsInRpbWVvdXQiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJzdGF0dXMiLCJvbkxvYWQiLCJkb2N1bWVudCIsImluZGV4IiwicmVxdWVzdHNDb3VudCIsInJlcXVlc3RzIiwiY2xlYW51cCIsImZyb21FcnJvciIsImFib3J0IiwicmVzcG9uc2VUZXh0IiwiYXR0YWNoRXZlbnQiLCJ1bmxvYWRIYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsInRlcm1pbmF0aW9uRXZlbnQiLCJpc1Byb21pc2VBdmFpbGFibGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsImNiIiwidGhlbiIsIldlYlNvY2tldCIsIk1veldlYlNvY2tldCIsInVzaW5nQnJvd3NlcldlYlNvY2tldCIsImRlZmF1bHRCaW5hcnlUeXBlIiwiaW1wb3J0X2VuZ2luZTMiLCJpc1JlYWN0TmF0aXZlIiwibmF2aWdhdG9yIiwicHJvZHVjdCIsInRvTG93ZXJDYXNlIiwiV1MiLCJjaGVjayIsInByb3RvY29scyIsImhlYWRlcnMiLCJ3cyIsImFkZEV2ZW50TGlzdGVuZXJzIiwib25vcGVuIiwiYXV0b1VucmVmIiwiX3NvY2tldCIsInVucmVmIiwib25jbG9zZSIsImNsb3NlRXZlbnQiLCJvbm1lc3NhZ2UiLCJldiIsIm9uZXJyb3IiLCJsYXN0UGFja2V0IiwiZW5jb2RlUGFja2V0Iiwib3B0aW9ucyIsImNvbXByZXNzIiwicGVyTWVzc2FnZURlZmxhdGUiLCJsZW4iLCJCdWZmZXIiLCJ0aHJlc2hvbGQiLCJ3ZWJzb2NrZXQiLCJyZSIsInBhcnRzIiwic3JjIiwiYiIsInN1YnN0cmluZyIsInJlcGxhY2UiLCJtIiwiZXhlYyIsInNvdXJjZSIsImhvc3QiLCJhdXRob3JpdHkiLCJpcHY2dXJpIiwicGF0aE5hbWVzIiwicXVlcnlLZXkiLCJyZWd4IiwibmFtZXMiLCJzbGljZSIsInNwbGljZSIsIiQwIiwiJDEiLCIkMiIsImltcG9ydF9jb21wb25lbnRfZW1pdHRlcjMiLCJpbXBvcnRfZW5naW5lNCIsIndyaXRlQnVmZmVyIiwicHJldkJ1ZmZlckxlbiIsImFnZW50IiwidXBncmFkZSIsInJlbWVtYmVyVXBncmFkZSIsImFkZFRyYWlsaW5nU2xhc2giLCJyZWplY3RVbmF1dGhvcml6ZWQiLCJ0cmFuc3BvcnRPcHRpb25zIiwiY2xvc2VPbkJlZm9yZXVubG9hZCIsImlkIiwidXBncmFkZXMiLCJwaW5nSW50ZXJ2YWwiLCJwaW5nVGltZW91dCIsInBpbmdUaW1lb3V0VGltZXIiLCJiZWZvcmV1bmxvYWRFdmVudExpc3RlbmVyIiwidHJhbnNwb3J0IiwicmVtb3ZlQWxsTGlzdGVuZXJzIiwib2ZmbGluZUV2ZW50TGlzdGVuZXIiLCJjcmVhdGVUcmFuc3BvcnQiLCJFSU8iLCJwcmlvcldlYnNvY2tldFN1Y2Nlc3MiLCJzaGlmdCIsInNldFRyYW5zcG9ydCIsIm9uRHJhaW4iLCJwcm9iZSIsImZhaWxlZCIsIm9uVHJhbnNwb3J0T3BlbiIsIm1zZyIsInVwZ3JhZGluZyIsImZsdXNoIiwiZnJlZXplVHJhbnNwb3J0IiwiZXJyb3IiLCJvblRyYW5zcG9ydENsb3NlIiwib251cGdyYWRlIiwidG8iLCJyZW1vdmVMaXN0ZW5lciIsIm9mZiIsIm9uSGFuZHNoYWtlIiwiSlNPTiIsInJlc2V0UGluZ1RpbWVvdXQiLCJzZW5kUGFja2V0IiwiY29kZSIsImZpbHRlclVwZ3JhZGVzIiwibWF4UGF5bG9hZCIsImdldFdyaXRhYmxlUGFja2V0cyIsInNob3VsZENoZWNrUGF5bG9hZFNpemUiLCJwYXlsb2FkU2l6ZSIsInB1c2giLCJjbGVhbnVwQW5kQ2xvc2UiLCJ3YWl0Rm9yVXBncmFkZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJmaWx0ZXJlZFVwZ3JhZGVzIiwiaiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEs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QixLQUFLOU0sWUFBQSxDQUFhLFNBQVM4QyxHQUFHO0lBQzlCLEtBQUt4QyxPQUFBLENBQVEsbUJBQW1Cd0MsR0FBRztFQUN2QztFQU1BeEMsUUFBUWYsTUFBQSxFQUFRQyxXQUFBLEVBQWE7SUFDekIsSUFBSSxjQUFjLEtBQUtVLFVBQUEsSUFDbkIsV0FBVyxLQUFLQSxVQUFBLElBQ2hCLGNBQWMsS0FBS0EsVUFBQSxFQUFZO01BRS9CLEtBQUsvQixjQUFBLENBQWUsS0FBS29PLGdCQUFnQjtNQUV6QyxLQUFLRSxTQUFBLENBQVVDLGtCQUFBLENBQW1CLE9BQU87TUFFekMsS0FBS0QsU0FBQSxDQUFVck0sS0FBQSxFQUFNO01BRXJCLEtBQUtxTSxTQUFBLENBQVVDLGtCQUFBLEVBQW1CO01BQ2xDLElBQUksT0FBT2tDLG1CQUFBLEtBQXdCLFlBQVk7UUFDM0NBLG1CQUFBLENBQW9CLGdCQUFnQixLQUFLcEMseUJBQUEsRUFBMkIsS0FBSztRQUN6RW9DLG1CQUFBLENBQW9CLFdBQVcsS0FBS2pDLG9CQUFBLEVBQXNCLEtBQUs7TUFDbkU7TUFFQSxLQUFLek0sVUFBQSxHQUFhO01BRWxCLEtBQUtpTSxFQUFBLEdBQUs7TUFFVixLQUFLbk0sWUFBQSxDQUFhLFNBQVNULE1BQUEsRUFBUUMsV0FBVztNQUc5QyxLQUFLa00sV0FBQSxHQUFjLEVBQUM7TUFDcEIsS0FBS0MsYUFBQSxHQUFnQjtJQUN6QjtFQUNKO0VBT0F5QyxlQUFlaEMsUUFBQSxFQUFVO0lBQ3JCLE1BQU15QyxnQkFBQSxHQUFtQixFQUFDO0lBQzFCLElBQUloUSxFQUFBLEdBQUk7SUFDUixNQUFNaVEsQ0FBQSxHQUFJMUMsUUFBQSxDQUFTck4sTUFBQTtJQUNuQixPQUFPRixFQUFBLEdBQUlpUSxDQUFBLEVBQUdqUSxFQUFBLElBQUs7TUFDZixJQUFJLENBQUMsS0FBS2pDLFVBQUEsQ0FBVzZJLE9BQUEsQ0FBUTJHLFFBQUEsQ0FBU3ZOLEVBQUEsQ0FBRSxHQUNwQ2dRLGdCQUFBLENBQWlCSixJQUFBLENBQUtyQyxRQUFBLENBQVN2TixFQUFBLENBQUU7SUFDekM7SUFDQSxPQUFPZ1EsZ0JBQUE7RUFDWDtBQUNKO0FBQ0F4UyxNQUFBLENBQU9LLFFBQUEsR0FBVytPLGNBQUEsQ0FBQS9PLFFBQUE7OztBQzlqQlgsSUFBTUMsU0FBQSxHQUFXTixNQUFBLENBQU9LLFFBQUEiLCJmaWxlIjoiIiwic291cmNlUm9vdCI6Ii9yZWFjdGl2ZS1tb2RlbC9vdXQifQ==