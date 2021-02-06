import { LogLevel } from '../utils/logger';

export type EnvType = 'development'|'production';

const string_to_boolean:{[k:string]:boolean} = {
    TRUE: true,
    1: true,
    true: true,
    True: true,
    T: true,
    t: true,
    FALSE: false,
    0: false,
    false: false,
    False: false,
    F: false,
    f: false,
    null: false,
};

// overload config for special boolean
const boolArgMap = {
    local: 'method',
    web: 'method',
    production: 'env',
    development: 'env',
    staging: 'env',
    preprod: 'env',
};

export function getEnv() {
    const e = process.env;
    // load dotenv
    const dotenv = require('dotenv').config({ path: e.ENV_PATH });
    if (!dotenv.error) {
        const { parsed } = dotenv;
        for (const key in parsed) {
            if (!e[key] && parsed[key]) {
                e[key] = parsed[key];
            }
        }
    }
    return e;
}

export function configBuilder() {
    const argv = require('minimist')(process.argv.slice(2));
    const e = getEnv();
    const defaultEnv = {} as {[name:string]:string};

    function B (envVarName:string, defaultValue = false) {
        defaultEnv[envVarName] = defaultValue.toString();
        return e[envVarName]! in string_to_boolean ? string_to_boolean[e[envVarName]!] : defaultValue;
    }

    function N <T extends number>(envVarName:string, defaultValue:T) {
        defaultEnv[envVarName] = defaultValue.toString();
        const n = parseFloat(e[envVarName]!);
        return isNaN(n) ? defaultValue : n;
    }

    function S <T extends string>(envVarName:string, defaultValue:T) {
        defaultEnv[envVarName] = defaultValue;
        return typeof e[envVarName] === 'string' ? e[envVarName]! : defaultValue;
    }

    function build<T>(config:T) : T {
        for (const name in argv) {
            const val = argv[name];
            const tv = typeof val;
            const tc = typeof (config as any)[name];
            if (tv === tc) {
                (config as any)[name] = val;
            } else if (tv === 'string' && tc === 'number' && name.toLowerCase() == 'loglevel') {
                (config as any)[name] = LogLevel[val];
            } else if (tv === 'string' && tc === 'boolean' && val in string_to_boolean) {
                (config as any)[name] = string_to_boolean[val];
            } else if (tv === 'string' && tc === 'boolean') {
                throw new Error(`String to boolean conversion error in config: "${val}" not valid for option "${name}"`);
            } else if (tv === 'string' && tc === 'number') {
                const n = Number(val);
                if (!isNaN(n)) {
                    (config as any)[name] = n;
                }
            }
        }
        for (const name in boolArgMap) {
            if (argv[name] === true) {
                (config as any)[(boolArgMap as any)[name]] = name;
            }
        }
        return config;
    }

    return {
        argv,
        defaultEnv,
        B,
        N,
        S,
        build,
    };
}