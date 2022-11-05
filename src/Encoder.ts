import { BYTES } from './bin/bytes';
import { BitPacketEncoder } from './bin/encoder';
import { Schema } from './Schema';
import { TSchema, TsData, TUData, TUserData } from './types/TSchema';

export class Encoder {
    private readonly schema: Schema;
    constructor(schema: Schema) {
        this.schema = schema;
    }
    public encode(name: string, data: TUData, space: number = 0xffff) {
        console.log('name', name);
        console.log('data', data);

        const dataView = new DataView(new ArrayBuffer(space));
        let offset = 0;
        const { binTypesArr, sList } = this.schema.get(name);
        // set message header
        dataView.setUint8(offset++, this.schema.getID(name));

        const dataValArr = this.getValues(data);
        console.log('typesarr', binTypesArr);
        console.log('valuesArr', dataValArr);
        // array of binary types
        for (let i = 0; i < binTypesArr.length; i++) {
            const bType = binTypesArr[i];
            const encodeMethod = BitPacketEncoder[bType] as Function;
            const valToEncode = dataValArr[i];
            encodeMethod.bind(dataView)(offset, valToEncode);
            const bytes = BYTES[bType];
            // if string, length digit + whole string length else bytes size
            offset += bytes === -1 ? 1 + ((valToEncode as string).length & 0xff) : BYTES[bType];
        }
        return new Uint8Array(dataView.buffer, 0, offset).slice();
    }
    private getValues(data: TUData) {
        let arr: (string | number)[] = [];
        for (const propName in data) {
            const value = data[propName];
            if (typeof value == 'object') {
                arr = arr.concat(this.getValues(value));
            } else {
                arr.push(value);
            }
        }
        return arr;
    }
}
