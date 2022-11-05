import { TData, TSchema } from './types/TSchema';

export class Schema {
    schemas: TSchema[];
    sMap: Map<string, any>;
    constructor(schemas: TSchema[]) {
        this.schemas = schemas;
        this.init();
        this.sMap = new Map();
    }
    private init(): void {
        for (const { name, data } of this.schemas) {
            this.addSchema(name, data);
        }
    }
    private addSchema(name: string, data: TData) {
        for (const propName in data) {
            // here we have the property name which could contain a binary-type value,
            // or it can be an object containing more values
            const value = data[propName];
            if (typeof value == 'number') {
            } else if (typeof value == 'object') {
            } else throw new Error(`A schema Property name was not set to a binary-type or an object! Property: ${propName} Value: ${value}`);
        }
    }
    private parseData(data: TData) {}
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
