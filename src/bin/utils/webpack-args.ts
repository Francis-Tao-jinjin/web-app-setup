export const WEBPACK_CONFIG = {
    'all': [
        {
            env: 'development',
            entryPoints: {
                polyfill: './src/polyfill.ts',
                app: './src/app/start-client.ts',
            },
        },
        {
            env: 'production',
            entryPoints: {
                polyfill: './src/polyfill.ts',
                app: './src/app/start-client.ts',
            },
        },
    ],
    'dev': [
        {
            env: 'development',
            entryPoints: {
                polyfill: './src/polyfill.ts',
                app: './src/app/start-client.ts',
            },
        },
    ],
    'prod': [
        {
            env: 'production',
            entryPoints: {
                polyfill: './src/polyfill.ts',
                app: './src/app/start-client.ts',
            },
        },
    ],
};