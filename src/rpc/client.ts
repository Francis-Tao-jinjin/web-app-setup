import { MuInt8, MuStruct, MuSchema, MuUnion } from '../mudb/src/schema';
import { RPCProtocol, RPCSchemas, RPCClientTransport } from './protocol';

export class RPCClient<Protocol extends RPCProtocol<any>> {
    public api:{
        [method in keyof Protocol['api']]:
            (arg:Protocol['api'][method]['arg']['identity']) =>
                Promise<Protocol['api'][method]['ret']['identity']>;
    };

    public schemas:RPCSchemas<Protocol>;
    public transport:RPCClientTransport<Protocol>;

    private _handleResponse = (response:any) => {
        const { type, data } = response;
        response.type = 'error';
        response.data = '';
        this.schemas.responseSchema.free(response);
        if (type === 'success') {
            return data.data;
        } else {
            console.error('RPCClient error', data);
            throw data;
        }
    }

    private _createRPC (method:keyof Protocol['api']) {
        return (arg:MuSchema<any>) => {
            const rpc = this.schemas.argSchema.alloc();
            rpc.type = method;
            rpc.data = arg;
            console.log('method:', method);
            return this.transport.send(this.schemas, rpc).then(
                this._handleResponse,
                (reason) => {
                    console.error('RPCClient error', reason);
                },
            );
        };
    }

    constructor (
        protocol:Protocol,
        transport:RPCClientTransport<Protocol>,
    ) {
        this.schemas = new RPCSchemas(protocol);
        this.transport = transport;
        const api = this.api = <any>{};
        const methods = Object.keys(protocol.api);
        for (let i = 0; i < methods.length; i++) {
            const method = methods[i];
            api[method] = this._createRPC(method);
        }
        console.log('client api', api);
    }
}