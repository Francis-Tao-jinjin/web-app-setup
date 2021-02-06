import { MuStruct, MuASCII, MuUint8, MuSchema, MuArray, MuDate, MuUTF8 } from '../mudb/src/schema';
import { messagify } from '../mudb/src/socket/net/util';

export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
}

export const LogMessageSchema = new MuStruct({
    uuid: new MuASCII(),
    level: <MuSchema<LogLevel>>new MuUint8(LogLevel.INFO),
    timestamp: new MuDate(new Date(0)),
    prefix: new MuArray(new MuASCII(), Infinity),
    message: new MuUTF8(),
});
export type LogMessage = typeof LogMessageSchema.identity;

export type LogSink = (mesg:LogMessage) => void;

export class Logger {
    constructor(
        public sink:LogSink,
        public prefix:string[],
        public uuid:string,
    ) {
    }

    private _log(level:LogLevel, message:string) {
        this.sink({
            level,
            timestamp: new Date(),
            prefix: this.prefix,
            uuid: this.uuid,
            message,
        });
    }

    public create = (prefix:string) => {
        const p = this.prefix.slice();
        p.push(prefix);
        return new Logger(this.sink, p, this.uuid);
    }

    public error = <E extends Error>(mesg:string|E) => {
        if (typeof mesg === 'string') {
            return this._log(LogLevel.ERROR, mesg);
        }
        if (mesg && mesg.stack !== undefined && mesg.stack !== '') {
            return this._log(LogLevel.ERROR, mesg.stack);
        }
        return this._log(LogLevel.ERROR, '' + mesg);
    }

    public warn = (mesg:string) => {
        return this._log(LogLevel.WARN, mesg);
    }

    public log = (mesg:string) => {
        return this._log(LogLevel.INFO, mesg);
    }

    public debug = (mesg:string) => {
        return this._log(LogLevel.DEBUG, mesg);
    }
}

export function filterSink(
    filteredSink: LogSink,
    logLevel: LogLevel,
    unfilterPrefexRegex?:string,
) {
    if (unfilterPrefexRegex === undefined || unfilterPrefexRegex) {
        return ((mesg:LogMessage) => {
            if (logLevel < mesg.level) {
                return;
            }
            filteredSink(mesg);
        });
    }

    const logPrefixRegex = new RegExp(unfilterPrefexRegex);

    return ((mesg:LogMessage) => {
        const prefix = mesg.prefix.join('/');
        const matchesPrefix = logPrefixRegex.test(prefix);
        if (!matchesPrefix && logLevel < mesg.level) {
            return;
        }
        filteredSink(mesg);
    });
}

function padToLength(mesg:string, length:number) {
    let result = mesg;
    while (result.length < length) {
        result += ' ';
    }
    return result;
}

export function consolePrefix(mesg:LogMessage) {
    return `(${mesg.timestamp.toISOString()} ${padToLength(mesg.uuid, 16)} ${padToLength(mesg.prefix.join('/'), 16)})`;
}

export function consoleSink(mesg:LogMessage) {
    const str = consolePrefix(mesg) + mesg.message;
    switch (mesg.level) {
        case LogLevel.ERROR:
            return console.error(str);
        case LogLevel.WARN:
            return console.warn(str);
        case LogLevel.DEBUG:
            return console.debug(str);
        default:
            return console.log(str);
    }
}