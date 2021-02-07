import fs from 'fs';
import http from 'http';
import { argv, config } from './config';
import { startServer, createDefaultHttpHandler, RouteHandlers } from '../utils/start-app/server';
import { createLogger } from './logger';
import { htmlEntry } from '../utils/start-app/html-entry';
import * as PATHS from '../bin/utils/paths';
import url from 'url';
import util from 'util';

const title = 'web app setup stage 1';
const description = 'setup an web application in your own, without webpack cli or create react app';

async function go() {
    function getHtml(res:http.ServerResponse, htmlSpec?:object) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
            'Expire': '-1',
            'Pragma': 'no-cache',
        });
        res.end(Buffer.from(htmlEntry({
            title: title,
            description: description,
            cssBundle: '/bundle.css',
            jsBundle: '/bundle.js',
            manifest: true,
            viewPort: '',
            bodyHtml: '',
            headHtml: '',
        }), 'utf8'));
    }

    const routes:RouteHandlers = {
        '/bundle.js': async (req:http.IncomingMessage, res:http.ServerResponse) => {
            res.writeHead(200, {
                'Content-Type': 'text/javascript',
                'Cache-Control': 'private, no-cache, no-store, must-revalidate',
                'Expire': '-1',
                'Pragma': 'no-cache',
            });
            fs.createReadStream(PATHS.FRONTEND_JS).pipe(res);
            return;
        },
        '/bundle.css': async (req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/css',
                'Cache-Control': 'private, no-cache, no-store, must-revalidate',
                'Expire': '-1',
                'Pragma': 'no-cache',
            });
            fs.createReadStream(PATHS.FRONTEND_CSS).pipe(res);
            return;
        },
        '/index.html': async (req, res) => getHtml(res),
    };

    const isDev = config.env === 'development';
    const logger = createLogger({
        logLevel: config.logLevel,
        logPrefixRegex: config.logPrefixRegex,
    });

    await startServer({
        port: config.port,
        env: config.env,
        development: config.env === 'development',
        logger,
        httpHandler: await createDefaultHttpHandler({
            development: config.env === 'development',
            routes,
            logger,
            defaultRoute: async (req:http.IncomingMessage, res:http.ServerResponse) => {
                if (!req.url) {
                    res.writeHead(400);
                    return res.end('url cannot be empty');
                }
                const { pathname } = url.parse(req.url);
                const publicStaticFile = PATHS.PUBLIC + pathname;
                const stats = await util.promisify(fs.stat)(publicStaticFile).catch((error) => {
                    logger.error(error);
                    res.writeHead(400);
                    res.end('resource not found');
                    return;
                });

                if (stats && stats.isFile()) {
                    fs.createReadStream(publicStaticFile).pipe(res);
                    return;
                }
                return;
            },
        }),
        start: async () => {
        },
    });
}

go().catch((e) => {
    console.error('start frontend server error');
    console.error(e);
});
