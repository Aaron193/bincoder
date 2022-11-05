import { BYTES } from './bin/bytes';
import { BitPacketDecoder } from './bin/decoder';
import { Schema } from './Schema';
import { BincoderTypes } from './types/binaryTypes';
import { TData } from './types/TSchema';

export class Decoder {
    private readonly schema: Schema;
    constructor(schema: Schema) {
        this.schema = schema;
    }
    public decode(arraybuffer: ArrayBuffer) {
        const dataView = new DataView(arraybuffer);
        let offset = 0;
        const id = dataView.getUint8(offset++);
        const name = this.schema.getName(id);
        //sList { code: 1, message: 12, nest: { a: 0, b: 0 } }
        const { sList } = this.schema.get(name);
        const deocded = this.parseBinary(dataView, sList, offset, {});
        console.log(deocded);
    }
    private parseBinary(dataView: DataView<ArrayBuffer>, sList: TData, offset: number, dObject: any): any {
        for (const propName in sList) {
            const value = sList[propName];
            // console.log('value', value);
            if (typeof value === 'object') {
                // pass this inner value (inner nested object) and set empty {}
                dObject[propName] = this.parseBinary(dataView, value, offset, {});
            } else {
                // value is the binary type
                const encodeMethod = BitPacketDecoder[value] as Function;
                const bytes = BYTES[value];
                if (bytes === -1) {
                    // parse string
                    const length = (BitPacketDecoder[BincoderTypes.Uint8] as Function).bind(dataView)(offset);
                    const decoded = (BitPacketDecoder[value] as Function).bind(dataView)(offset);
                    offset += 1 + (length & 0xff);
                    dObject[propName] = decoded;
                } else {
                    // parse number
                    const decoded = encodeMethod.bind(dataView)(offset);
                    dObject[propName] = decoded;
                    offset += bytes;
                }
            }
        }
        return dObject;
    }
}
