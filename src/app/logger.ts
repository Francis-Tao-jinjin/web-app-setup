import { Logger } from '../utils/logger';
import { filterSink } from '../utils/logger';
import { consoleSink } from '../utils/logger';

export function createLogger (spec:{
    logPrefixRegex:string,
    logLevel:number,
}) {
    return new Logger(
        filterSink(
            consoleSink,
            spec.logLevel,
            spec.logPrefixRegex,
        ),
        ['webapp'],
        '',
    );
}