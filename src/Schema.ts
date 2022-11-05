import { BincoderTypes, TBincoderTypes } from './types/binaryTypes';
import { TsData, TData, TSchema } from './types/TSchema';

export class Schema {
    sList: TData;
    sData: TsData;
    NAME_ID_MAP: Map<number | String, number | string>;
    sid: number;
    constructor(schemas: TSchema[]) {
        this.sList = {};
        this.sData = {};
        this.NAME_ID_MAP = new Map();
        this.sid = 0;
        this.init(schemas);
    }
    private init(schemas: TSchema[]): void {
        for (const { name, data } of schemas) {
            this.addSchema(name, data);
        }
    }
    /**
     *
     * @param name string
     * @param data {x: 1, y: 2, r: {a:6,b:3}}
     * Links name and id
     * links full data to id
     * links types[] to id
     */
    private addSchema(name: string, data: TData) {
        if (this.sList[name]) {
            throw new Error(`A schema with this name: ${name} already exists!`);
        }
        const id = this.sid++;
        if (id >= 256) {
            throw new Error(`You have created too many schemas!, there's only support for 256 unique message schemas!`);
        }
        // Link id -> name and name -> id
        this.NAME_ID_MAP.set(id, name);
        this.NAME_ID_MAP.set(name, id);
        // add master list
        this.sList[id] = data;
        // add binary types to flat array (for fast iteration later)
        this.sData[id] = this.getTypesArray(data);
    }
    /**
     *
     * @param data
     * @returns flat Array of all binary-types within TData
     * {x: 1, y: 2, r: {a:6,b:3}} -> [1,2,6,3]
     */
    private getTypesArray(data: TData): BincoderTypes[] {
        let arr: BincoderTypes[] = [];

        for (const propName in data) {
            const value = data[propName];
            if (typeof value == 'number') {
                arr.push(value);
            } else if (typeof value == 'object') {
                arr = arr.concat(this.getTypesArray(value));
            } else throw new Error(`A schema Property name was not set to a binary-type or an object! Property: ${propName} Value: ${value}`);
        }
        return arr;
    }
    public get(name: string) {
        if (!this.NAME_ID_MAP.has(name)) {
            throw new Error(`You are trying to encode a schema that was not created. Please include ${name} in the schemas`);
        }
        const id = this.NAME_ID_MAP.get(name) as number;
        const binTypesArr = this.sData[id];
        const sList = this.sList[id] as TData;
        return { binTypesArr, sList };
    }
    public getID(name: string): number {
        return this.NAME_ID_MAP.get(name) as number;
    }
    public getName(id: number): string {
        return this.NAME_ID_MAP.get(id) as string;
    }
}
/*
data: {
        x: 1,
        y: 3,
        z: 4,
        h: {
            q: 3,
            r: 7,
            c: {
                l: 6,
            },
        },
    },
*/
/**
^^
 getTypesArray -> 
 [1,3,4,3,7,6]
 ]
 */
