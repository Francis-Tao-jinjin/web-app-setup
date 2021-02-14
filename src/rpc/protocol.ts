import { MuInt8, MuSchema } from '../mudb/src/schema';
import { MuUnion, MuVarint, MuUTF8 } from '../mudb/src/schema';

export type RPCTableEntry<ArgsSchema extends MuSchema<any>, ReturnSchema extends MuSchema<any>> = {
    arg:ArgsSchema;
    reg:ReturnSchema;
};

export type RPCTable = {
    [method:string]:RPCTableEntry<any, any>;
};

export type RPCProtocol<AnyRPCTable extends RPCTable> = {
    name:string;
    api:AnyRPCTable;
};

export class RPCSchemas<Protocol extends RPCProtocol<any>> {
    public errorSchema = new MuUTF8();
    public tokenSchema = new MuVarint();

    public argSchema:MuUnion<{
        [key in keyof Protocol['api']]:Protocol['api']['arg'];
    }>;

    public retSchema:MuUnion<{
        [key in keyof Protocol['api']]:Protocol['api']['ret'];
    }>;

    public responseSchema:MuUnion<{
        success:RPCSchemas<Protocol>['retSchema'];
        error:RPCSchemas<Protocol>['errorSchema'];
    }>;

    constructor(
        public protocol:Protocol,
    ) {
        const argTable:any = {};
        const retTable:any = {};
        const methods = Object.keys(protocol.api);
        for (let i = 0; i < methods.length; i++) {
            const m = methods[i];
            const s = protocol.api[m];
            argTable[m] = s.arg;
            retTable[m] = s.ret;
        }
        this.argSchema = new MuUnion(argTable);
        this.retSchema = new MuUnion(retTable);

        this.responseSchema = new MuUnion({
            success: this.retSchema,
            error: this.errorSchema,
        });
    }
}

export interface RPCClientTransport<Protocol extends RPCProtocol<any>> {
    send:(
        schema:RPCSchemas<Protocol>,
        rpc:RPCSchemas<Protocol>['argSchema']['identity'],
        ) => 
        Promise<RPCSchemas<Protocol>['responseSchema']['identity']>;
}

export interface RPCConnection {
    auth:string;
    setAuth:(auth:string) => void;
}

export interface RPCServerTransport<Protocol extends RPCProtocol<any>, Connection extends RPCConnection> {
    listen:(
        schema:RPCSchemas<Protocol>,
        authorize:(connection:Connection) => Promise<boolean>,
        recv:(
            connection:Connection,
            rpc:RPCSchemas<Protocol>['argSchema']['identity'],
            response:RPCSchemas<Protocol>['responseSchema']['identity']
        ) => Promise<void>
    ) => void;
}