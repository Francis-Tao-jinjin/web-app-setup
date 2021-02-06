import { ClientConfigCommon } from '../config/client-config-common';

export interface WebClientCfg extends ClientConfigCommon {
}

export interface WebDevClientCfg extends WebClientCfg {
    local:boolean;
    logLevel:number;
    logPrefixRegex:string;
    userInfo:undefined|any;
}

export const clientConfig:WebClientCfg =
    typeof window !== 'undefined'
    && (<any>window).CLIENT_CONFIG
    || {
        env: 'development',
    };
