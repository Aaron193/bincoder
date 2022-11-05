//@ts-nocheck
import '../types/binaryTypes';

declare global {
    interface DataView<T> {
        setUint24(pos: number, val: number): void;
        getUint24(pos: number): number;
        setInt24(pos: number, val: number): void;
        getInt24(pos: number): number;
        setString(pos: number, val: string): void;
        getString(pos: number): string;
    }
}

DataView.prototype.setUint24 = function (pos: number, val: number) {
    this.setUint8(pos++, (val >> 16) & 0xff);
    this.setUint8(pos++, (val >> 8) & 0xff);
    this.setUint8(pos++, val & 0xff);
};
DataView.prototype.getUint24 = function (pos: number) {
    return (this.getUint8(pos++) << 16) | (this.getUint8(pos++) << 8) | this.getUint8(pos);
};
DataView.prototype.setInt24 = function (pos: number, val: number) {
    this.setUint8(pos++, ((val + 0x800000) >> 16) & 0xff);
    this.setUint8(pos++, ((val + 0x800000) >> 8) & 0xff);
    this.setUint8(pos++, (val + 0x800000) & 0xff);
};
DataView.prototype.getInt24 = function (pos: number) {
    return ((this.getUint8(pos++) << 16) - 0x800000) | (this.getUint8(pos++) << 8) | this.getUint8(pos);
};
DataView.prototype.setString = function (pos: number, string: string) {
    if (string.length > 0xff) throw new RangeError(`The maximum string length is 255. String with length of ${string.length} is too large!`);
    this.setUint8(pos++, string.length & 0xff);
    for (let i = 0; i < string.length; i++) {
        this.setUint8(pos++, string.charCodeAt(i) & 0xff);
    }
};
DataView.prototype.getString = function (pos: number) {
    const length = this.getUint8(pos++);
    let string = '';
    for (let i = 0; i < length; i++) {
        string += String.fromCharCode(this.getUint8(pos++));
    }
    return string;
};
