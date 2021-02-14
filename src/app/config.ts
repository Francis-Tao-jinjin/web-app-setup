import { configBuilder, EnvType } from '../config/builder';
const { argv, build, defaultEnv, B, N, S } = configBuilder();

const config = build({
    port: N('PORT', 9920),
    backendURL: S('BACKEND_SERVER_URL', ''),
    // ERROR, WARN, INFO, DEBUG
    // 0      1     2     3
    logLevel: N('LOGLEVEL', 3),
    logPrefixRegex: S('LOG_PREFIX', ''),
    env: S('NODE_ENV', 'development') as EnvType,
    live: B('LIVE', false),
    offline: B('OFFLINE', false),
    local: B('LOCAL', false),
    cdnPath: S('CDN_PATH', ''),
    useProdBundle: B('WEBSITE_USE_PROD_BUNDLES', false),
});

export { defaultEnv, argv, config };