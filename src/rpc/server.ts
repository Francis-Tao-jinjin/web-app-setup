import { RPCProtocol, RPCSchemas, RPCServerTransport, RPCConnection } from './protocol';

export class RPCServer<Protocol extends RPCProtocol<any>, Connection extends RPCConnection> {
    public schemas:RPCSchemas<Protocol>;
    public transport:RPCServerTransport<Protocol, Connection>;

    constructor (spec:{
        protocol:Protocol,
        transport:RPCServerTransport<Protocol, Connection>,
        authorize:(conn:Connection) => Promise<boolean>,
        handlers: {
            [method in keyof Protocol['api']]:
                (conn:Connection, arg:Protocol['api'][method]['arg']['identity'], ret:Protocol['api'][method]['ret']['identity']) => 
                    Promise<Protocol['api'][method]['ret']['identity']>;
        },
    }) {
        const schemas = this.schemas = new RPCSchemas(spec.protocol);
        this.transport = spec.transport;
        this.transport.listen(
            schemas,
            spec.authorize,
            async (conn, arg, response) => {
                try {
                    const method = <any>arg.type;
                    const handler = spec.handlers[method];
                    if (!handler) {
                        console.error(`invalid rpc method: ${method}`);
                        response.type = 'error';
                        response.data = `invalid rpc method: ${method}`;
                    } else {
                        const retSchema = schemas.protocol.api[method].ret;
                        if (handler.length === 3) {
                            const ret = retSchema.alloc();
                            const actualRet = await handler(conn, arg.data, ret);
                            response.type = 'success';
                            const retInfo = response.data = schemas.retSchema.alloc();
                            retInfo.type = method;
                            if (ret === actualRet) {
                                retInfo.data = ret;
                            } else {
                                console.log(`warning, handler for ${method} did not use storage for return type`);
                                retSchema.free(ret);
                                retInfo.data = actualRet;
                            }
                        } else {
                            // if user doesn't take storage as an argument, then we just leak the response reference
                            const ret = await handler(conn, arg.data, <any>undefined);
                            response.type = 'success';
                            const retInfo = response.data = schemas.retSchema.alloc();
                            retInfo.type = method;
                            retInfo.data = retSchema.clone(ret);
                        }
                    }
                } catch (e) {
                    response.type = 'error';
                    if (e instanceof Error && e.message) {
                        response.data = e.message;
                    } else {
                        response.data = e;
                    }
                }
            }
        );
    }
}
