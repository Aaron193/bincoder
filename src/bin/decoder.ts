import { BincoderTypes } from '../types/binaryTypes';

export const BitPacketDecoder = {
    [BincoderTypes.Uint8]: DataView.prototype.getUint8,
    [BincoderTypes.Uint16]: DataView.prototype.getUint16,
    [BincoderTypes.Uint24]: DataView.prototype.getUint24,
    [BincoderTypes.Uint32]: DataView.prototype.getUint32,
    [BincoderTypes.Int8]: DataView.prototype.getInt8,
    [BincoderTypes.Int16]: DataView.prototype.getInt16,
    [BincoderTypes.Int24]: DataView.prototype.getInt24,
    [BincoderTypes.Int32]: DataView.prototype.getInt32,
    [BincoderTypes.BigInt64]: DataView.prototype.getBigInt64,
    [BincoderTypes.BigUint64]: DataView.prototype.getBigUint64,
    [BincoderTypes.Float32]: DataView.prototype.getFloat32,
    [BincoderTypes.Float64]: DataView.prototype.getFloat64,
    [BincoderTypes.String]: DataView.prototype.getString,
};
