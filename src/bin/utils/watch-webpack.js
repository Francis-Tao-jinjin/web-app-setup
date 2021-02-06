const watchWebpack = require('./webpack').watchWebpack;
const logger = require('./js-logger');

const args = JSON.parse(process.argv[process.argv.length - 2]);

logger.log('webpack watch started');
logger.log(JSON.stringify(args, null, '  '));
watchWebpack(args).then(() => {
    logger.log('-----------------------------------------');
    logger.log('build ready!');
}).catch((err) => {
    logger.error(err);
});
