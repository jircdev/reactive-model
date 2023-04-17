System.register(["@socket.io/component-emitter@3.1.0"], (_exports, _context) => {

const bimport = specifier => {
	const dependencies = new Map([["@socket.io/component-emitter","3.1.0"],["socket.io-parser","4.2.2"]]);
	return globalThis.bimport(globalThis.bimport.resolve(specifier, dependencies));
};


var dependencies = new Map();
var require = dependency => dependencies.get(dependency);
return {
setters: [dep => dependencies.set('@socket.io/component-emitter@3.1.0', dep)],
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

// .beyond/uimport/temp/socket.io-parser.4.2.2.js
var socket_io_parser_4_2_2_exports = {};
__export(socket_io_parser_4_2_2_exports, {
  Decoder: () => Decoder,
  Encoder: () => Encoder,
  PacketType: () => PacketType,
  protocol: () => protocol
});
module.exports = __toCommonJS(socket_io_parser_4_2_2_exports);

// node_modules/socket.io-parser/build/esm/is-binary.js
var withNativeArrayBuffer = typeof ArrayBuffer === "function";
var isView = obj => {
  return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
};
var toString = Object.prototype.toString;
var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
var withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
function isBinary(obj) {
  return withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj)) || withNativeBlob && obj instanceof Blob || withNativeFile && obj instanceof File;
}
function hasBinary(obj, toJSON) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  if (Array.isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }
  if (isBinary(obj)) {
    return true;
  }
  if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }
  return false;
}

// node_modules/socket.io-parser/build/esm/binary.js
function deconstructPacket(packet) {
  const buffers = [];
  const packetData = packet.data;
  const pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length;
  return {
    packet: pack,
    buffers
  };
}
function _deconstructPacket(data, buffers) {
  if (!data) return data;
  if (isBinary(data)) {
    const placeholder = {
      _placeholder: true,
      num: buffers.length
    };
    buffers.push(data);
    return placeholder;
  } else if (Array.isArray(data)) {
    const newData = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if (typeof data === "object" && !(data instanceof Date)) {
    const newData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newData[key] = _deconstructPacket(data[key], buffers);
      }
    }
    return newData;
  }
  return data;
}
function reconstructPacket(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  delete packet.attachments;
  return packet;
}
function _reconstructPacket(data, buffers) {
  if (!data) return data;
  if (data && data._placeholder === true) {
    const isIndexValid = typeof data.num === "number" && data.num >= 0 && data.num < buffers.length;
    if (isIndexValid) {
      return buffers[data.num];
    } else {
      throw new Error("illegal attachments");
    }
  } else if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (typeof data === "object") {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = _reconstructPacket(data[key], buffers);
      }
    }
  }
  return data;
}

// node_modules/socket.io-parser/build/esm/index.js
var import_component_emitter = require("@socket.io/component-emitter@3.1.0");
var protocol = 5;
var PacketType;
(function (PacketType2) {
  PacketType2[PacketType2["CONNECT"] = 0] = "CONNECT";
  PacketType2[PacketType2["DISCONNECT"] = 1] = "DISCONNECT";
  PacketType2[PacketType2["EVENT"] = 2] = "EVENT";
  PacketType2[PacketType2["ACK"] = 3] = "ACK";
  PacketType2[PacketType2["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
  PacketType2[PacketType2["BINARY_EVENT"] = 5] = "BINARY_EVENT";
  PacketType2[PacketType2["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType || (PacketType = {}));
var Encoder = class {
  constructor(replacer) {
    this.replacer = replacer;
  }
  encode(obj) {
    if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
      if (hasBinary(obj)) {
        return this.encodeAsBinary({
          type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
          nsp: obj.nsp,
          data: obj.data,
          id: obj.id
        });
      }
    }
    return [this.encodeAsString(obj)];
  }
  encodeAsString(obj) {
    let str = "" + obj.type;
    if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
      str += obj.attachments + "-";
    }
    if (obj.nsp && "/" !== obj.nsp) {
      str += obj.nsp + ",";
    }
    if (null != obj.id) {
      str += obj.id;
    }
    if (null != obj.data) {
      str += JSON.stringify(obj.data, this.replacer);
    }
    return str;
  }
  encodeAsBinary(obj) {
    const deconstruction = deconstructPacket(obj);
    const pack = this.encodeAsString(deconstruction.packet);
    const buffers = deconstruction.buffers;
    buffers.unshift(pack);
    return buffers;
  }
};
var Decoder = class extends import_component_emitter.Emitter {
  constructor(reviver) {
    super();
    this.reviver = reviver;
  }
  add(obj) {
    let packet;
    if (typeof obj === "string") {
      if (this.reconstructor) {
        throw new Error("got plaintext data when reconstructing a packet");
      }
      packet = this.decodeString(obj);
      const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
      if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
        packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
        this.reconstructor = new BinaryReconstructor(packet);
        if (packet.attachments === 0) {
          super.emitReserved("decoded", packet);
        }
      } else {
        super.emitReserved("decoded", packet);
      }
    } else if (isBinary(obj) || obj.base64) {
      if (!this.reconstructor) {
        throw new Error("got binary data when not reconstructing a packet");
      } else {
        packet = this.reconstructor.takeBinaryData(obj);
        if (packet) {
          this.reconstructor = null;
          super.emitReserved("decoded", packet);
        }
      }
    } else {
      throw new Error("Unknown type: " + obj);
    }
  }
  decodeString(str) {
    let i = 0;
    const p = {
      type: Number(str.charAt(0))
    };
    if (PacketType[p.type] === void 0) {
      throw new Error("unknown packet type " + p.type);
    }
    if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
      const start = i + 1;
      while (str.charAt(++i) !== "-" && i != str.length) {}
      const buf = str.substring(start, i);
      if (buf != Number(buf) || str.charAt(i) !== "-") {
        throw new Error("Illegal attachments");
      }
      p.attachments = Number(buf);
    }
    if ("/" === str.charAt(i + 1)) {
      const start = i + 1;
      while (++i) {
        const c = str.charAt(i);
        if ("," === c) break;
        if (i === str.length) break;
      }
      p.nsp = str.substring(start, i);
    } else {
      p.nsp = "/";
    }
    const next = str.charAt(i + 1);
    if ("" !== next && Number(next) == next) {
      const start = i + 1;
      while (++i) {
        const c = str.charAt(i);
        if (null == c || Number(c) != c) {
          --i;
          break;
        }
        if (i === str.length) break;
      }
      p.id = Number(str.substring(start, i + 1));
    }
    if (str.charAt(++i)) {
      const payload = this.tryParse(str.substr(i));
      if (Decoder.isPayloadValid(p.type, payload)) {
        p.data = payload;
      } else {
        throw new Error("invalid payload");
      }
    }
    return p;
  }
  tryParse(str) {
    try {
      return JSON.parse(str, this.reviver);
    } catch (e) {
      return false;
    }
  }
  static isPayloadValid(type, payload) {
    switch (type) {
      case PacketType.CONNECT:
        return typeof payload === "object";
      case PacketType.DISCONNECT:
        return payload === void 0;
      case PacketType.CONNECT_ERROR:
        return typeof payload === "string" || typeof payload === "object";
      case PacketType.EVENT:
      case PacketType.BINARY_EVENT:
        return Array.isArray(payload) && payload.length > 0;
      case PacketType.ACK:
      case PacketType.BINARY_ACK:
        return Array.isArray(payload);
    }
  }
  destroy() {
    if (this.reconstructor) {
      this.reconstructor.finishedReconstruction();
      this.reconstructor = null;
    }
  }
};
var BinaryReconstructor = class {
  constructor(packet) {
    this.packet = packet;
    this.buffers = [];
    this.reconPack = packet;
  }
  takeBinaryData(binData) {
    this.buffers.push(binData);
    if (this.buffers.length === this.reconPack.attachments) {
      const packet = reconstructPacket(this.reconPack, this.buffers);
      this.finishedReconstruction();
      return packet;
    }
    return null;
  }
  finishedReconstruction() {
    this.reconPack = null;
    this.buffers = [];
  }
};
};

code(module, require);
_exports(module.exports);
}}});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy5iZXlvbmQvdWltcG9ydC90ZW1wL3NvY2tldC5pby1wYXJzZXIuNC4yLjIuanMiLCIuLi9ub2RlX21vZHVsZXMvc29ja2V0LmlvLXBhcnNlci9idWlsZC9lc20vaXMtYmluYXJ5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL3NvY2tldC5pby1wYXJzZXIvYnVpbGQvZXNtL2JpbmFyeS5qcyIsIi4uL25vZGVfbW9kdWxlcy9zb2NrZXQuaW8tcGFyc2VyL2J1aWxkL2VzbS9pbmRleC5qcyJdLCJuYW1lcyI6WyJzb2NrZXRfaW9fcGFyc2VyXzRfMl8yX2V4cG9ydHMiLCJfX2V4cG9ydCIsIkRlY29kZXIiLCJFbmNvZGVyIiwiUGFja2V0VHlwZSIsInByb3RvY29sIiwibW9kdWxlIiwiZXhwb3J0cyIsIl9fdG9Db21tb25KUyIsIndpdGhOYXRpdmVBcnJheUJ1ZmZlciIsIkFycmF5QnVmZmVyIiwiaXNWaWV3Iiwib2JqIiwiYnVmZmVyIiwidG9TdHJpbmciLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ3aXRoTmF0aXZlQmxvYiIsIkJsb2IiLCJjYWxsIiwid2l0aE5hdGl2ZUZpbGUiLCJGaWxlIiwiaXNCaW5hcnkiLCJoYXNCaW5hcnkiLCJ0b0pTT04iLCJBcnJheSIsImlzQXJyYXkiLCJpIiwibCIsImxlbmd0aCIsImFyZ3VtZW50cyIsImtleSIsImhhc093blByb3BlcnR5IiwiZGVjb25zdHJ1Y3RQYWNrZXQiLCJwYWNrZXQiLCJidWZmZXJzIiwicGFja2V0RGF0YSIsImRhdGEiLCJwYWNrIiwiX2RlY29uc3RydWN0UGFja2V0IiwiYXR0YWNobWVudHMiLCJwbGFjZWhvbGRlciIsIl9wbGFjZWhvbGRlciIsIm51bSIsInB1c2giLCJuZXdEYXRhIiwiRGF0ZSIsInJlY29uc3RydWN0UGFja2V0IiwiX3JlY29uc3RydWN0UGFja2V0IiwiaXNJbmRleFZhbGlkIiwiRXJyb3IiLCJpbXBvcnRfY29tcG9uZW50X2VtaXR0ZXIiLCJyZXF1aXJlIiwiUGFja2V0VHlwZTIiLCJjb25zdHJ1Y3RvciIsInJlcGxhY2VyIiwiZW5jb2RlIiwidHlwZSIsIkVWRU5UIiwiQUNLIiwiZW5jb2RlQXNCaW5hcnkiLCJCSU5BUllfRVZFTlQiLCJCSU5BUllfQUNLIiwibnNwIiwiaWQiLCJlbmNvZGVBc1N0cmluZyIsInN0ciIsIkpTT04iLCJzdHJpbmdpZnkiLCJkZWNvbnN0cnVjdGlvbiIsInVuc2hpZnQiLCJFbWl0dGVyIiwicmV2aXZlciIsImFkZCIsInJlY29uc3RydWN0b3IiLCJkZWNvZGVTdHJpbmciLCJpc0JpbmFyeUV2ZW50IiwiQmluYXJ5UmVjb25zdHJ1Y3RvciIsImVtaXRSZXNlcnZlZCIsImJhc2U2NCIsInRha2VCaW5hcnlEYXRhIiwicCIsIk51bWJlciIsImNoYXJBdCIsInN0YXJ0IiwiYnVmIiwic3Vic3RyaW5nIiwiYyIsIm5leHQiLCJwYXlsb2FkIiwidHJ5UGFyc2UiLCJzdWJzdHIiLCJpc1BheWxvYWRWYWxpZCIsInBhcnNlIiwiZSIsIkNPTk5FQ1QiLCJESVNDT05ORUNUIiwiQ09OTkVDVF9FUlJPUiIsImRlc3Ryb3kiLCJmaW5pc2hlZFJlY29uc3RydWN0aW9uIiwicmVjb25QYWNrIiwiYmluRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBQUEsOEJBQUE7QUFBQUMsUUFBQSxDQUFBRCw4QkFBQTtFQUFBRSxPQUFBLEVBQUFBLENBQUEsS0FBQUEsT0FBQTtFQUFBQyxPQUFBLEVBQUFBLENBQUEsS0FBQUEsT0FBQTtFQUFBQyxVQUFBLEVBQUFBLENBQUEsS0FBQUEsVUFBQTtFQUFBQyxRQUFBLEVBQUFBLENBQUEsS0FBQUE7QUFBQTtBQUFBQyxNQUFBLENBQUFDLE9BQUEsR0FBQUMsWUFBQSxDQUFBUiw4QkFBQTs7O0FDQUEsSUFBTVMscUJBQUEsR0FBd0IsT0FBT0MsV0FBQSxLQUFnQjtBQUNyRCxJQUFNQyxNQUFBLEdBQVVDLEdBQUEsSUFBUTtFQUNwQixPQUFPLE9BQU9GLFdBQUEs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Q0EsT0FBT0YsZUFBZW5DLElBQUEsRUFBTWdDLE9BQUEsRUFBUztJQUNqQyxRQUFRaEMsSUFBQTtNQUFBLEtBQ0NyRCxVQUFBLENBQVcyRixPQUFBO1FBQ1osT0FBTyxPQUFPTixPQUFBLEtBQVk7TUFBQSxLQUN6QnJGLFVBQUEsQ0FBVzRGLFVBQUE7UUFDWixPQUFPUCxPQUFBLEtBQVk7TUFBQSxLQUNsQnJGLFVBQUEsQ0FBVzZGLGFBQUE7UUFDWixPQUFPLE9BQU9SLE9BQUEsS0FBWSxZQUFZLE9BQU9BLE9BQUEsS0FBWTtNQUFBLEtBQ3hEckYsVUFBQSxDQUFXc0QsS0FBQTtNQUFBLEtBQ1h0RCxVQUFBLENBQVd5RCxZQUFBO1FBQ1osT0FBT3BDLEtBQUEsQ0FBTUMsT0FBQSxDQUFRK0QsT0FBTyxLQUFLQSxPQUFBLENBQVE1RCxNQUFBLEdBQVM7TUFBQSxLQUNqRHpCLFVBQUEsQ0FBV3VELEdBQUE7TUFBQSxLQUNYdkQsVUFBQSxDQUFXMEQsVUFBQTtRQUNaLE9BQU9yQyxLQUFBLENBQU1DLE9BQUEsQ0FBUStELE9BQU87SUFBQTtFQUV4QztFQUlBUyxRQUFBLEVBQVU7SUFDTixJQUFJLEtBQUt4QixhQUFBLEVBQWU7TUFDcEIsS0FBS0EsYUFBQSxDQUFjeUIsc0JBQUEsRUFBdUI7TUFDMUMsS0FBS3pCLGFBQUEsR0FBZ0I7SUFDekI7RUFDSjtBQUNKO0FBU0EsSUFBTUcsbUJBQUEsR0FBTixNQUEwQjtFQUN0QnZCLFlBQVlwQixNQUFBLEVBQVE7SUFDaEIsS0FBS0EsTUFBQSxHQUFTQSxNQUFBO0lBQ2QsS0FBS0MsT0FBQSxHQUFVLEVBQUM7SUFDaEIsS0FBS2lFLFNBQUEsR0FBWWxFLE1BQUE7RUFDckI7RUFTQThDLGVBQWVxQixPQUFBLEVBQVM7SUFDcEIsS0FBS2xFLE9BQUEsQ0FBUVMsSUFBQSxDQUFLeUQsT0FBTztJQUN6QixJQUFJLEtBQUtsRSxPQUFBLENBQVFOLE1BQUEsS0FBVyxLQUFLdUUsU0FBQSxDQUFVNUQsV0FBQSxFQUFhO01BRXBELE1BQU1OLE1BQUEsR0FBU2EsaUJBQUEsQ0FBa0IsS0FBS3FELFNBQUEsRUFBVyxLQUFLakUsT0FBTztNQUM3RCxLQUFLZ0Usc0JBQUEsRUFBdUI7TUFDNUIsT0FBT2pFLE1BQUE7SUFDWDtJQUNBLE9BQU87RUFDWDtFQUlBaUUsdUJBQUEsRUFBeUI7SUFDckIsS0FBS0MsU0FBQSxHQUFZO0lBQ2pCLEtBQUtqRSxPQUFBLEdBQVUsRUFBQztFQUNwQjtBQUNKIiwiZmlsZSI6IiIsInNvdXJjZVJvb3QiOiIvcmVhY3RpdmUtbW9kZWwvb3V0In0=