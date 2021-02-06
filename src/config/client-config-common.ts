// this config is used for website

export interface ClientConfigCommon {
    env:'development'|'staging'|'production'|'preprod'|'test';
    // CDN
    cdnPath:string;
    // backend services
    backendURL:string;
}
