'use strict';

DataView.prototype.setUint24 = function (e, i) {
    this.setUint8(e++, (i >> 16) & 255), this.setUint8(e++, (i >> 8) & 255), this.setUint8(e++, i & 255);
};
DataView.prototype.getUint24 = function (e) {
    return (this.getUint8(e++) << 16) | (this.getUint8(e++) << 8) | this.getUint8(e);
};
DataView.prototype.setInt24 = function (e, i) {
    this.setUint8(e++, ((i + 8388608) >> 16) & 255), this.setUint8(e++, ((i + 8388608) >> 8) & 255), this.setUint8(e++, (i + 8388608) & 255);
};
DataView.prototype.getInt24 = function (e) {
    return ((this.getUint8(e++) << 16) - 8388608) | (this.getUint8(e++) << 8) | this.getUint8(e);
};
DataView.prototype.setString = function (e, i) {
    if (i.length > 255) throw new RangeError(`The maximum string length is 255. String with length of ${i.length} is too large!`);
    this.setUint8(e++, i.length & 255);
    for (let o = 0; o < i.length; o++) this.setUint8(e++, i.charCodeAt(o) & 255);
};
DataView.prototype.getString = function (e) {
    let i = this.getUint8(e++),
        o = '';
    for (let r = 0; r < i; r++) o += String.fromCharCode(this.getUint8(e++));
    return o;
};
var n = 0,
    t = { Uint8: n++, Uint16: n++, Uint24: n++, Uint32: n++, Int8: n++, Int16: n++, Int24: n++, Int32: n++, BigInt64: n++, BigUint64: n++, Float32: n++, Float64: n++, String: n++ };
var a = { [t.Uint8]: DataView.prototype.setUint8, [t.Uint16]: DataView.prototype.setUint16, [t.Uint24]: DataView.prototype.setUint24, [t.Uint32]: DataView.prototype.setUint32, [t.Int8]: DataView.prototype.setInt8, [t.Int16]: DataView.prototype.setInt16, [t.Int24]: DataView.prototype.setInt24, [t.Int32]: DataView.prototype.setInt32, [t.BigInt64]: DataView.prototype.setBigInt64, [t.BigUint64]: DataView.prototype.setBigUint64, [t.Float32]: DataView.prototype.setFloat32, [t.Float64]: DataView.prototype.setFloat64, [t.String]: DataView.prototype.setString };
var p = { [t.Uint8]: DataView.prototype.getUint8, [t.Uint16]: DataView.prototype.getUint16, [t.Uint24]: DataView.prototype.getUint24, [t.Uint32]: DataView.prototype.getUint32, [t.Int8]: DataView.prototype.getInt8, [t.Int16]: DataView.prototype.getInt16, [t.Int24]: DataView.prototype.getInt24, [t.Int32]: DataView.prototype.getInt32, [t.BigInt64]: DataView.prototype.getBigInt64, [t.BigUint64]: DataView.prototype.getBigUint64, [t.Float32]: DataView.prototype.getFloat32, [t.Float64]: DataView.prototype.getFloat64, [t.String]: DataView.prototype.getString };
console.log(a);
console.log(p);
