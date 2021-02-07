import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
import * as fsext from 'fs-extra';
import * as PATHS from './utils/paths';
import { WEBPACK_CONFIG } from './utils/webpack-args';
import { Logger, LogLevel } from '../utils/logger';

const startTime = +process.argv[process.argv.length - 1] || Date.now();
const startDate = new Date(startTime);

const logger = new Logger(
    (message) => {
        const str = `${((<any>message.timestamp - <any>startDate) / 1000).toFixed(4)} ${message.message}`;
        switch (message.level) {
            case LogLevel.ERROR:
                console.error(str);
                break;
            case LogLevel.WARN:
                console.warn(str);
                break;
            default:
                console.log(str);
                break;
        }
    }, [], '');

const procs:child_process.ChildProcess[] = [];
function cleanup () {
    for (let i = 0; i < procs.length; ++i) {
        procs[i].kill();
    }
}

process.on('exit', cleanup);
process.on('SIGINT', cleanup);
process.on('SIGUSR1', cleanup);
process.on('SIGUSR2', cleanup);
process.on('uncaughtException', cleanup);

function forkWatch(modulePath:string, heapSize:number, useTS:boolean, jsonArgs:any) {
    return new Promise((resolve, reject) => {
        const args:string[] = [];
        if (useTS) {
            args.push('-r', 'ts-node/register');
        }
        if (heapSize) {
            args.push(`--max-old-space-size=${heapSize}`);
        }
        args.push(path.resolve(path.join(__dirname, modulePath)));
        if (jsonArgs) {
            args.push(JSON.stringify(jsonArgs));
        }
        args.push('' + startTime);
        const proc = child_process.spawn('node', args, { stdio: 'inherit' });
        console.log('Proc create');
        procs.push(proc);
        proc.on('error', (err) => {
            reject(err);
        });
        proc.on('exit', () => {
            resolve('');
        });
    });
}

async function mkdirp(dir:string) {
    try {
        await fsext.mkdirp(dir);
    } catch (e) { }
}

async function touch(filename:string) {
    await (await fs.promises.open(filename, 'w+')).close();
}

async function run() {
    await Promise.all([
        mkdirp(PATHS.BUILD),
        mkdirp(PATHS.STATICS),
    ]);
    await Promise.all([
        touch(PATHS.FRONTEND_CSS),
    ]);
    logger.log('starting watch scripts...');
    const webpackConfig = (WEBPACK_CONFIG as any)[process.argv[process.argv.length - 1]] || WEBPACK_CONFIG.all;

    if (webpackConfig.length > 0) {
        await forkWatch('utils/watch-webpack', 4096, false, webpackConfig);
        logger.error('something went wrong in watch script');
        process.exit(1);
    }
}

run().then(() => {}).catch((err) => {
    logger.error(err);
    process.exit(1);
});