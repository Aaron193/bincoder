import './bin/DataView';
import { BitPacketEncoder } from './bin/encoder';
import { BitPacketDecoder } from './bin/decoder';
import { BincoderTypes } from './types/binaryTypes';
import { Schema } from './Schema';
import { Encoder } from './Encoder';
import { Decoder } from './Decoder';

const schema = new Schema([
    {
        name: 'myMessageName',
        data: {
            code: BincoderTypes.Uint16,
            message: BincoderTypes.String,
            nest: { a: BincoderTypes.Uint8, b: BincoderTypes.Uint8 },
        },
    },
]);

const encoder = new Encoder(schema);

const message = encoder.encode('myMessageName', {
    code: 1111,
    message: 'this is a string',
    nest: {
        a: 3,
        b: 5,
    },
});

console.log(message);
// Uint8Array(22) [
//     0,   4,  87,  16, 116, 104, 105,
//   115,  32, 105, 115,  32,  97,  32,
//   115, 116, 114, 105, 110, 103,   3,
//     5
// ]

const decoder = new Decoder(schema);
decoder.decode(message.buffer);
// { code: 1111, message: 'this is a string', nest: { a: 3, b: 5 } }
