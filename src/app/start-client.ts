import { FrontendClient } from './client';
import { clientConfig, WebDevClientCfg } from './client-config';
import { LogLevel } from '../utils/logger';
import { createLogger } from './logger';

async function go(spec:WebDevClientCfg) {
    const logger = createLogger({
        logLevel: LogLevel.DEBUG,
        logPrefixRegex: '',
    });
    const client = new FrontendClient({
        logger,
    });

    client.start();
}

go(clientConfig as WebDevClientCfg).catch((e) => {
    console.error('frontend client start error');
    console.error(e);
});