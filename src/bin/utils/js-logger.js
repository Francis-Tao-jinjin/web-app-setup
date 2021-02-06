const beginTime = +process.argv[process.argv.length - 1] || Date.now();
module.exports = {
    log: function() {
        const args = Array.prototype.slice.apply(arguments);
        args.unshift(((Date.now() - beginTime) / 1000).toFixed(4));
        console.log.apply(console, args);
    },
    error: function() {
        const args = Array.prototype.slice.apply(arguments);
        args.unshift(((Date.now() - beginTime) / 1000).toFixed(4));
        console.error.apply(console, args);
    },
    beginTime: beginTime,
};