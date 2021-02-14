import { RPCHttpServerTransport } from '../../rpc/http/server';
import { RPCServer } from '../../rpc/server';
import { CaculatorRPCSchema } from './calculator-protocol';

export function createCaculatorAPI (transport:RPCHttpServerTransport) {
    return new RPCServer({
        protocol: CaculatorRPCSchema,
        transport,
        authorize: async() => {
            return true;
        },
        handlers: {
            hello: async (conn) => {
                return 'Thanks for using caculator';
            },
            add: async (conn, arg) => {
                const a = arg.a;
                const b = arg.b;
                return a + b;
            },
            sub: async (conn, arg) => {
                const a = arg.a;
                const b = arg.b;
                return a - b;
            },
            mul: async (conn, arg) => {
                const a = arg.a;
                const b = arg.b;
                return a * b;
            },
            mod: async (conn, arg) => {
                const a = arg.a;
                const b = arg.b;
                return a % b;
            },
        },
    });
}