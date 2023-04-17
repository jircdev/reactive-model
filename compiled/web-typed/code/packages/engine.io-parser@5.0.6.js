System.register([], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["engine.io-parser","5.0.6"]]);
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

// .beyond/uimport/temp/engine.io-parser.5.0.6.js
var engine_io_parser_5_0_6_exports = {};
__export(engine_io_parser_5_0_6_exports, {
  decodePacket: () => decodePacket_browser_default,
  decodePayload: () => decodePayload,
  encodePacket: () => encodePacket_browser_default,
  encodePayload: () => encodePayload,
  protocol: () => protocol
});
module.exports = __toCommonJS(engine_io_parser_5_0_6_exports);

// node_modules/engine.io-parser/build/esm/commons.js
var PACKET_TYPES = /* @__PURE__ */Object.create(null);
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
var PACKET_TYPES_REVERSE = /* @__PURE__ */Object.create(null);
Object.keys(PACKET_TYPES).forEach(key => {
  PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
var ERROR_PACKET = {
  type: "error",
  data: "parser error"
};

// node_modules/engine.io-parser/build/esm/encodePacket.browser.js
var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
var withNativeArrayBuffer = typeof ArrayBuffer === "function";
var isView = obj => {
  return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
};
var encodePacket = ({
  type,
  data
}, supportsBinary, callback) => {
  if (withNativeBlob && data instanceof Blob) {
    if (supportsBinary) {
      return callback(data);
    } else {
      return encodeBlobAsBase64(data, callback);
    }
  } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
    if (supportsBinary) {
      return callback(data);
    } else {
      return encodeBlobAsBase64(new Blob([data]), callback);
    }
  }
  return callback(PACKET_TYPES[type] + (data || ""));
};
var encodeBlobAsBase64 = (data, callback) => {
  const fileReader = new FileReader();
  fileReader.onload = function () {
    const content = fileReader.result.split(",")[1];
    callback("b" + (content || ""));
  };
  return fileReader.readAsDataURL(data);
};
var encodePacket_browser_default = encodePacket;

// node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}
var encode = arraybuffer => {
  let bytes = new Uint8Array(arraybuffer),
    i,
    len = bytes.length,
    base64 = "";
  for (i = 0; i < len; i += 3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[(bytes[i] & 3) << 4 | bytes[i + 1] >> 4];
    base64 += chars[(bytes[i + 1] & 15) << 2 | bytes[i + 2] >> 6];
    base64 += chars[bytes[i + 2] & 63];
  }
  if (len % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1) + "=";
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + "==";
  }
  return base64;
};
var decode = base64 => {
  let bufferLength = base64.length * 0.75,
    len = base64.length,
    i,
    p = 0,
    encoded1,
    encoded2,
    encoded3,
    encoded4;
  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }
  const arraybuffer = new ArrayBuffer(bufferLength),
    bytes = new Uint8Array(arraybuffer);
  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];
    bytes[p++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return arraybuffer;
};

// node_modules/engine.io-parser/build/esm/decodePacket.browser.js
var withNativeArrayBuffer2 = typeof ArrayBuffer === "function";
var decodePacket = (encodedPacket, binaryType) => {
  if (typeof encodedPacket !== "string") {
    return {
      type: "message",
      data: mapBinary(encodedPacket, binaryType)
    };
  }
  const type = encodedPacket.charAt(0);
  if (type === "b") {
    return {
      type: "message",
      data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
    };
  }
  const packetType = PACKET_TYPES_REVERSE[type];
  if (!packetType) {
    return ERROR_PACKET;
  }
  return encodedPacket.length > 1 ? {
    type: PACKET_TYPES_REVERSE[type],
    data: encodedPacket.substring(1)
  } : {
    type: PACKET_TYPES_REVERSE[type]
  };
};
var decodeBase64Packet = (data, binaryType) => {
  if (withNativeArrayBuffer2) {
    const decoded = decode(data);
    return mapBinary(decoded, binaryType);
  } else {
    return {
      base64: true,
      data
    };
  }
};
var mapBinary = (data, binaryType) => {
  switch (binaryType) {
    case "blob":
      return data instanceof ArrayBuffer ? new Blob([data]) : data;
    case "arraybuffer":
    default:
      return data;
  }
};
var decodePacket_browser_default = decodePacket;

// node_modules/engine.io-parser/build/esm/index.js
var SEPARATOR = String.fromCharCode(30);
var encodePayload = (packets, callback) => {
  const length = packets.length;
  const encodedPackets = new Array(length);
  let count = 0;
  packets.forEach((packet, i) => {
    encodePacket_browser_default(packet, false, encodedPacket => {
      encodedPackets[i] = encodedPacket;
      if (++count === length) {
        callback(encodedPackets.join(SEPARATOR));
      }
    });
  });
};
var decodePayload = (encodedPayload, binaryType) => {
  const encodedPackets = encodedPayload.split(SEPARATOR);
  const packets = [];
  for (let i = 0; i < encodedPackets.length; i++) {
    const decodedPacket = decodePacket_browser_default(encodedPackets[i], binaryType);
    packets.push(decodedPacket);
    if (decodedPacket.type === "error") {
      break;
    }
  }
  return packets;
};
var protocol = 4;
};

code(module, require);
_exports(module.exports);
}}});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL2VuZ2luZS5pby1wYXJzZXIuNS4wLjYuanMiLCIuLi9ub2RlX21vZHVsZXMvZW5naW5lLmlvLXBhcnNlci9idWlsZC9lc20vY29tbW9ucy5qcyIsIi4uL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8tcGFyc2VyL2J1aWxkL2VzbS9lbmNvZGVQYWNrZXQuYnJvd3Nlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8tcGFyc2VyL2J1aWxkL2VzbS9jb250cmliL2Jhc2U2NC1hcnJheWJ1ZmZlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8tcGFyc2VyL2J1aWxkL2VzbS9kZWNvZGVQYWNrZXQuYnJvd3Nlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9lbmdpbmUuaW8tcGFyc2VyL2J1aWxkL2VzbS9pbmRleC5qcyJdLCJuYW1lcyI6WyJlbmdpbmVfaW9fcGFyc2VyXzVfMF82X2V4cG9ydHMiLCJfX2V4cG9ydCIsImRlY29kZVBhY2tldCIsImRlY29kZVBhY2tldF9icm93c2VyX2RlZmF1bHQiLCJkZWNvZGVQYXlsb2FkIiwiZW5jb2RlUGFja2V0IiwiZW5jb2RlUGFja2V0X2Jyb3dzZXJfZGVmYXVsdCIsImVuY29kZVBheWxvYWQiLCJwcm90b2NvbCIsIm1vZHVsZSIsImV4cG9ydHMiLCJfX3RvQ29tbW9uSlMiLCJQQUNLRVRfVFlQRVMiLCJPYmplY3QiLCJjcmVhdGUiLCJQQUNLRVRfVFlQRVNfUkVWRVJTRSIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiRVJST1JfUEFDS0VUIiwidHlwZSIsImRhdGEiLCJ3aXRoTmF0aXZlQmxvYiIsIkJsb2IiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImNhbGwiLCJ3aXRoTmF0aXZlQXJyYXlCdWZmZXIiLCJBcnJheUJ1ZmZlciIsImlzVmlldyIsIm9iaiIsImJ1ZmZlciIsInN1cHBvcnRzQmluYXJ5IiwiY2FsbGJhY2siLCJlbmNvZGVCbG9iQXNCYXNlNjQiLCJmaWxlUmVhZGVyIiwiRmlsZVJlYWRlciIsIm9ubG9hZCIsImNvbnRlbnQiLCJyZXN1bHQiLCJzcGxpdCIsInJlYWRBc0RhdGFVUkwiLCJjaGFycyIsImxvb2t1cCIsIlVpbnQ4QXJyYXkiLCJpIiwibGVuZ3RoIiwiY2hhckNvZGVBdCIsImVuY29kZSIsImFycmF5YnVmZmVyIiwiYnl0ZXMiLCJsZW4iLCJiYXNlNjQiLCJzdWJzdHJpbmciLCJkZWNvZGUiLCJidWZmZXJMZW5ndGgiLCJwIiwiZW5jb2RlZDEiLCJlbmNvZGVkMiIsImVuY29kZWQzIiwiZW5jb2RlZDQiLCJ3aXRoTmF0aXZlQXJyYXlCdWZmZXIyIiwiZW5jb2RlZFBhY2tldCIsImJpbmFyeVR5cGUiLCJtYXBCaW5hcnkiLCJjaGFyQXQiLCJkZWNvZGVCYXNlNjRQYWNrZXQiLCJwYWNrZXRUeXBlIiwiZGVjb2RlZCIsIlNFUEFSQVRPUiIsIlN0cmluZyIsImZyb21DaGFyQ29kZSIsInBhY2tldHMiLCJlbmNvZGVkUGFja2V0cyIsIkFycmF5IiwiY291bnQiLCJwYWNrZXQiLCJqb2luIiwiZW5jb2RlZFBheWxvYWQiLCJkZWNvZGVkUGFja2V0IiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsOEJBQUE7QUFBQUMsUUFBQSxDQUFBRCw4QkFBQTtFQUFBRSxZQUFBLEVBQUFBLENBQUEsS0FBQUMsNEJBQUE7RUFBQUMsYUFBQSxFQUFBQSxDQUFBLEtBQUFBLGFBQUE7RUFBQUMsWUFBQSxFQUFBQSxDQUFBLEtBQUFDLDRCQUFBO0VBQUFDLGFBQUEsRUFBQUEsQ0FBQSxLQUFBQSxhQUFBO0VBQUFDLFFBQUEsRUFBQUEsQ0FBQSxLQUFBQTtBQUFBO0FBQUFDLE1BQUEsQ0FBQUMsT0FBQSxHQUFBQyxZQUFBLENBQUFYLDhCQUFBOzs7QUNBQSxJQUFNWSxZQUFBLEdBQWUsZUFBQUMsTUFBQSxDQUFPQyxNQUFBLENBQU8sSUFBSTtBQUN2Q0YsWUFBQSxDQUFhLFVBQVU7QUFD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