import { MuUTF8, MuStruct, MuFloat64, MuVoid } from '../../mudb/src/schema';
import { RPCClient } from '../../rpc/client';

export const CaculatorRPCSchema = {
    name: 'caculator-service',
    api: {
        hello: {
            arg: new MuVoid(),
            ret: new MuUTF8(),
        },
        add: {
            arg: new MuStruct({
                a: new MuFloat64(),
                b: new MuFloat64(),
            }),
            ret: new MuFloat64(),
        },
        sub: {
            arg: new MuStruct({
                a: new MuFloat64(),
                b: new MuFloat64(),
            }),
            ret: new MuFloat64(),
        },
        mul: {
            arg: new MuStruct({
                a: new MuFloat64(),
                b: new MuFloat64(),
            }),
            ret: new MuFloat64(),
        },
        mod: {
            arg: new MuStruct({
                a: new MuFloat64(),
                b: new MuFloat64(),
            }),
            ret: new MuFloat64(),
        },
    }
}

export type CaculatorAPI = RPCClient<typeof CaculatorRPCSchema>;