import { RPCHttpServerTransport } from "../../rpc/http/server";
import { createCaculatorAPI } from "./calculator-server";

export const RPC_ROUTE = '/api';

export function getTransport () {
    const transport = new RPCHttpServerTransport({
        route: RPC_ROUTE,
        byteLimit: 1 << 20,
        cookie: 'auth',
    });
    createCaculatorAPI(transport);
    return transport;
}