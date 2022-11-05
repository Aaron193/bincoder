import { BincoderTypes } from '../types/binaryTypes';

export const BYTES = {
    [BincoderTypes.Uint8]: 1,
    [BincoderTypes.Uint16]: 2,
    [BincoderTypes.Uint24]: 3,
    [BincoderTypes.Uint32]: 4,
    [BincoderTypes.Int8]: 1,
    [BincoderTypes.Int16]: 2,
    [BincoderTypes.Int24]: 3,
    [BincoderTypes.Int32]: 4,
    [BincoderTypes.BigInt64]: 8,
    [BincoderTypes.BigUint64]: 8,
    [BincoderTypes.Float32]: 4,
    [BincoderTypes.Float64]: 8,
    [BincoderTypes.String]: -1,
};
