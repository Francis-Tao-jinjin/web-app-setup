import { RPCClient } from "../../rpc/client";
import { RPCHttpClientTransport } from "../../rpc/http/client-browser";
import { CaculatorAPI, CaculatorRPCSchema } from "./calculator-protocol";

export class WebAppRPCClient {

    public caculator:CaculatorAPI;

    constructor (backendURL:string) {
        const transport = new RPCHttpClientTransport({
            url: backendURL + '/api',
            timeout: Infinity,
        });

        this.caculator = new RPCClient(CaculatorRPCSchema, transport);
    }
}