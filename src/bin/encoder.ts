import { BincoderTypes } from '../types/binaryTypes';

export const BitPacketEncoder = {
    [BincoderTypes.Uint8]: DataView.prototype.setUint8,
    [BincoderTypes.Uint16]: DataView.prototype.setUint16,
    [BincoderTypes.Uint24]: DataView.prototype.setUint24,
    [BincoderTypes.Uint32]: DataView.prototype.setUint32,
    [BincoderTypes.Int8]: DataView.prototype.setInt8,
    [BincoderTypes.Int16]: DataView.prototype.setInt16,
    [BincoderTypes.Int24]: DataView.prototype.setInt24,
    [BincoderTypes.Int32]: DataView.prototype.setInt32,
    [BincoderTypes.BigInt64]: DataView.prototype.setBigInt64,
    [BincoderTypes.BigUint64]: DataView.prototype.setBigUint64,
    [BincoderTypes.Float32]: DataView.prototype.setFloat32,
    [BincoderTypes.Float64]: DataView.prototype.setFloat64,
    [BincoderTypes.String]: DataView.prototype.setString,
};
