import { BincoderTypes, TBincoderTypes } from './binaryTypes';

export type TData = {
    [key: string]: TBincoderTypes | TData;
};

export interface TSchema {
    name: string;
    data: TData;
}
export type TUData = {
    [key: string]: number | string | TUData;
};
export interface TUserData {
    name: string;
    data: TUData;
}

export type TsData = {
    [key: string]: BincoderTypes[];
};

// const schema: TSchema = {
//     name: 'hello',
//     data: {
//         x: 11,
//         y: 3,
//         z: 4,
//         h: {
//             q: 3,
//             r: 7,
//             c: {
//                 l: 6,
//             },
//         },
//     },
// };
