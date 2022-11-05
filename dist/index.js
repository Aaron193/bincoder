'use strict';

// src/bin/DataView.ts
DataView.prototype.setUint24 = function(pos, val) {
  this.setUint8(pos++, val >> 16 & 255);
  this.setUint8(pos++, val >> 8 & 255);
  this.setUint8(pos++, val & 255);
};
DataView.prototype.getUint24 = function(pos) {
  return this.getUint8(pos++) << 16 | this.getUint8(pos++) << 8 | this.getUint8(pos);
};
DataView.prototype.setInt24 = function(pos, val) {
  this.setUint8(pos++, val + 8388608 >> 16 & 255);
  this.setUint8(pos++, val + 8388608 >> 8 & 255);
  this.setUint8(pos++, val + 8388608 & 255);
};
DataView.prototype.getInt24 = function(pos) {
  return (this.getUint8(pos++) << 16) - 8388608 | this.getUint8(pos++) << 8 | this.getUint8(pos);
};
DataView.prototype.setString = function(pos, string) {
  if (string.length > 255)
    throw new RangeError(`The maximum string length is 255. String with length of ${string.length} is too large!`);
  this.setUint8(pos++, string.length & 255);
  for (let i = 0; i < string.length; i++) {
    this.setUint8(pos++, string.charCodeAt(i) & 255);
  }
};
DataView.prototype.getString = function(pos) {
  const length = this.getUint8(pos++);
  let string = "";
  for (let i = 0; i < length; i++) {
    string += String.fromCharCode(this.getUint8(pos++));
  }
  return string;
};

// src/Schema.ts
var Schema = class {
  constructor(schemas) {
    this.sList = {};
    this.sData = {};
    this.NAME_ID_MAP = /* @__PURE__ */ new Map();
    this.sid = 0;
    this.init(schemas);
  }
  init(schemas) {
    for (const { name, data } of schemas) {
      this.addSchema(name, data);
    }
  }
  addSchema(name, data) {
    if (this.sList[name]) {
      throw new Error(`A schema with this name: ${name} already exists!`);
    }
    const id = this.sid++;
    if (id >= 256) {
      throw new Error(`You have created too many schemas!, there's only support for 256 unique message schemas!`);
    }
    this.NAME_ID_MAP.set(id, name);
    this.NAME_ID_MAP.set(name, id);
    this.sList[id] = data;
    this.sData[id] = this.getTypesArray(data);
  }
  getTypesArray(data) {
    let arr = [];
    for (const propName in data) {
      const value = data[propName];
      if (typeof value == "number") {
        arr.push(value);
      } else if (typeof value == "object") {
        arr = arr.concat(this.getTypesArray(value));
      } else
        throw new Error(`A schema Property name was not set to a binary-type or an object! Property: ${propName} Value: ${value}`);
    }
    return arr;
  }
  get(name) {
    if (!this.NAME_ID_MAP.has(name)) {
      throw new Error(`You are trying to encode a schema that was not created. Please include ${name} in the schemas`);
    }
    const id = this.NAME_ID_MAP.get(name);
    const binTypesArr = this.sData[id];
    const sList = this.sList[id];
    return { binTypesArr, sList };
  }
  getID(name) {
    return this.NAME_ID_MAP.get(name);
  }
  getName(id) {
    return this.NAME_ID_MAP.get(id);
  }
};

// src/bin/bytes.ts
var BYTES = {
  [0 /* Uint8 */]: 1,
  [1 /* Uint16 */]: 2,
  [2 /* Uint24 */]: 3,
  [3 /* Uint32 */]: 4,
  [4 /* Int8 */]: 1,
  [5 /* Int16 */]: 2,
  [6 /* Int24 */]: 3,
  [7 /* Int32 */]: 4,
  [8 /* BigInt64 */]: 8,
  [9 /* BigUint64 */]: 8,
  [10 /* Float32 */]: 4,
  [11 /* Float64 */]: 8,
  [12 /* String */]: -1
};

// src/bin/encoder.ts
var BitPacketEncoder = {
  [0 /* Uint8 */]: DataView.prototype.setUint8,
  [1 /* Uint16 */]: DataView.prototype.setUint16,
  [2 /* Uint24 */]: DataView.prototype.setUint24,
  [3 /* Uint32 */]: DataView.prototype.setUint32,
  [4 /* Int8 */]: DataView.prototype.setInt8,
  [5 /* Int16 */]: DataView.prototype.setInt16,
  [6 /* Int24 */]: DataView.prototype.setInt24,
  [7 /* Int32 */]: DataView.prototype.setInt32,
  [8 /* BigInt64 */]: DataView.prototype.setBigInt64,
  [9 /* BigUint64 */]: DataView.prototype.setBigUint64,
  [10 /* Float32 */]: DataView.prototype.setFloat32,
  [11 /* Float64 */]: DataView.prototype.setFloat64,
  [12 /* String */]: DataView.prototype.setString
};

// src/Encoder.ts
var Encoder = class {
  constructor(schema2) {
    this.schema = schema2;
  }
  encode(name, data, space = 65535) {
    const dataView = new DataView(new ArrayBuffer(space));
    let offset = 0;
    const { binTypesArr, sList } = this.schema.get(name);
    dataView.setUint8(offset++, this.schema.getID(name));
    const dataValArr = this.getValues(data);
    for (let i = 0; i < binTypesArr.length; i++) {
      const bType = binTypesArr[i];
      const encodeMethod = BitPacketEncoder[bType];
      const valToEncode = dataValArr[i];
      encodeMethod.bind(dataView)(offset, valToEncode);
      const bytes = BYTES[bType];
      offset += bytes === -1 ? 1 + (valToEncode.length & 255) : BYTES[bType];
    }
    return new Uint8Array(dataView.buffer, 0, offset).slice();
  }
  getValues(data) {
    let arr = [];
    for (const propName in data) {
      const value = data[propName];
      if (typeof value == "object") {
        arr = arr.concat(this.getValues(value));
      } else {
        arr.push(value);
      }
    }
    return arr;
  }
};

// src/bin/decoder.ts
var BitPacketDecoder = {
  [0 /* Uint8 */]: DataView.prototype.getUint8,
  [1 /* Uint16 */]: DataView.prototype.getUint16,
  [2 /* Uint24 */]: DataView.prototype.getUint24,
  [3 /* Uint32 */]: DataView.prototype.getUint32,
  [4 /* Int8 */]: DataView.prototype.getInt8,
  [5 /* Int16 */]: DataView.prototype.getInt16,
  [6 /* Int24 */]: DataView.prototype.getInt24,
  [7 /* Int32 */]: DataView.prototype.getInt32,
  [8 /* BigInt64 */]: DataView.prototype.getBigInt64,
  [9 /* BigUint64 */]: DataView.prototype.getBigUint64,
  [10 /* Float32 */]: DataView.prototype.getFloat32,
  [11 /* Float64 */]: DataView.prototype.getFloat64,
  [12 /* String */]: DataView.prototype.getString
};

// src/Decoder.ts
var Decoder = class {
  constructor(schema2) {
    this.schema = schema2;
  }
  decode(arraybuffer) {
    const dataView = new DataView(arraybuffer);
    let offset = 0;
    const id = dataView.getUint8(offset++);
    const name = this.schema.getName(id);
    const { sList } = this.schema.get(name);
    const deocded = this.parseBinary(dataView, sList, offset, {});
    console.log(deocded);
  }
  parseBinary(dataView, sList, offset, dObject) {
    for (const propName in sList) {
      const value = sList[propName];
      if (typeof value === "object") {
        dObject[propName] = this.parseBinary(dataView, value, offset, {});
      } else {
        const encodeMethod = BitPacketDecoder[value];
        const bytes = BYTES[value];
        if (bytes === -1) {
          const length = BitPacketDecoder[0 /* Uint8 */].bind(dataView)(offset);
          const decoded = BitPacketDecoder[value].bind(dataView)(offset);
          offset += 1 + (length & 255);
          dObject[propName] = decoded;
        } else {
          const decoded = encodeMethod.bind(dataView)(offset);
          dObject[propName] = decoded;
          offset += bytes;
        }
      }
    }
    return dObject;
  }
};

// src/index.ts
var schema = new Schema([
  {
    name: "myMessageName",
    data: {
      code: 1 /* Uint16 */,
      message: 12 /* String */,
      nest: { a: 0 /* Uint8 */, b: 0 /* Uint8 */ }
    }
  }
]);
var encoder = new Encoder(schema);
var message = encoder.encode("myMessageName", {
  code: 1111,
  message: "this is a string",
  nest: {
    a: 3,
    b: 5
  }
});
console.log(message);
var decoder = new Decoder(schema);
decoder.decode(message.buffer);
