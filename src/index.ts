import './bin/DataView';
import { BitPacketEncoder } from './bin/encoder';
import { BitPacketDecoder } from './bin/decoder';
import { BincoderTypes } from './types/binaryTypes';
import { Schema } from './Schema';

const schema = new Schema([{ name: 'keyboard', data: { code: BincoderTypes.Uint8 } }]);
