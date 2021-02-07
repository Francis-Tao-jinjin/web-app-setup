import { EnvType, configBuilder } from './builder';

const { argv, defaultEnv, B, N, S, build } = configBuilder();

export const config = build({
    env: S('NODE_ENV', 'development') as EnvType,
    useProdBundle: B('USE_PROD_BUNDLE', false),

    // application code
    application: S('WEBAPP', 'WebApp'),

    // ERROR, WARN, INFO, DEBUG
    // 0      1     2     3
    logLevel: N('LOGLEVEL', 3),
    logPrefixRegex: S('LOGPREFIXREGEX', ''),

    // website configuration
    websiteURL: S('WEBSITE_URL', 'http://xxx.webapp.io:9920'),

    // domain for cookie
    domain: S('DOMAIN', '.webapp.io'),
    rootPath: S('ROOT_PATH', ''),
});

if (typeof window !== 'undefined') {
    alert(`Big time error. 'src/config/index.ts' should never be bundled in the client`);
}
