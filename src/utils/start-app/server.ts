import { Logger } from '../logger';
import { EnvType } from '../../config/builder';
import http from 'http';
import util from 'util';
import fs from 'fs';
import * as PATHS from '../../bin/utils/paths';
import ip from 'ip';
import url from 'url';

export type RouteHandler = (req:http.IncomingMessage, res:http.ServerResponse) => Promise<void>;
export type RouteHandlers = {[path:string]:RouteHandler};

export async function startServer(spec: {
    port:number;
    httpHandler:RouteHandler;
    start:(spec: {httpServer:http.Server}) => Promise<void>;
    development:boolean;
    env?:EnvType;
    logger:Logger;
}) {
    const logger = spec.logger;

    if (spec.development) {
        logger.log('!!!!!!!!!!!! DEVELOPMENT MODE !!!!!!!!!!!!!!!');
    } else {
        logger.log(`------ ${spec.env} mode ------`);
    }

    const httpServer = await createHttpServer({
        routeHandler: spec.httpHandler,
    });

    await spec.start({httpServer});

    httpServer.listen(spec.port);
    const address = ip.address();
    const serverURL = `http://${address}:${spec.port}`;
    logger.log(`server address: ${serverURL}`);
}

export async function createDefaultHttpHandler(spec:{
    routes:RouteHandlers,
    logger:Logger,
    development?:boolean,
    defaultRoute?:RouteHandler;
}) : Promise<RouteHandler> {
    let contentRouter;
    const { development, routes } = spec;
    const logger = spec.logger || console;
    return async (req:http.IncomingMessage, res:http.ServerResponse) => {
        res.setHeader('Access-Control-Allow-Origin', req.headers && req.headers.origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        if (!req.url) {
            res.writeHead(400);
            return res.end('url cannot be empty');
        }
        const { pathname } = url.parse(req.url);
        if (routes['/index.html'] && (!pathname || /^\/?(index\.html?)?$/.test(pathname))) {
            logger.debug('serving generated index');
            return await routes['/index.html'](req, res);
        }

        if (pathname) {
            let routeHandler = routes[pathname];
            if (!routeHandler) {
                const reg = pathname.match(/^\/[a-zA-Z0-9._]+/);
                if (reg) {
                    routeHandler = routes[reg[0]];
                }
            }
            if (routeHandler) {
                return await routeHandler(req, res);
            }
            if (pathname === '/healthCheck') {
                res.setHeader('Content-Type', 'application/json');
                res.end(`{status: "good"}`);
                return;
            }
            // if (!pathname.match(/\.(svg|png|jpe?g|js|css|html|bvh|ico|gif|skin|zip)$/) && spec.defaultRoute) {
            if (!pathname.match(/\.(js|css|html)$/) && spec.defaultRoute) {
                return await spec.defaultRoute(req, res);
            }
        }
        res.writeHead(400);
        res.end('resource not found');
    }
}

async function createHttpServer(spec:{routeHandler?:RouteHandler}) : Promise<http.Server> {
    return http.createServer(spec.routeHandler);
}