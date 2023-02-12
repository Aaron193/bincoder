import './bin/DataView';
import { BitPacketEncoder } from './bin/encoder';
import { BitPacketDecoder } from './bin/decoder';
import { BincoderTypes } from './types/binaryTypes';
import { Schema } from './Schema';
import { Encoder } from './Encoder';
import { Decoder } from './Decoder';

const getProcessMs = () => {
    //@ts-ignore
    const hrTime = process.hrtime();
    return (hrTime[0] * 1e9 + hrTime[1]) / 1e6;
};

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
const t1 = getProcessMs();
const message = encoder.encode('myMessageName', {
    code: 1111,
    message: 'this is a string',
    nest: {
        a: 3,
        b: 5,
    },
});
const t2 = getProcessMs();
console.log('encoding took ' + (t2 - t1) + 'ms');

console.log(message);

const decoder = new Decoder(schema);
const t3 = getProcessMs();
decoder.decode(message.buffer);
const t4 = getProcessMs();
console.log('decoding took ' + (t4 - t3) + 'ms');
