Object.assign || Object.defineProperty(Object, 'assign',
{
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (target:any) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert first argument to object');
        }

        const to = Object(target);
        for (let i = 1; i < arguments.length; i++) {
            let nextSource = arguments[i];
            if (nextSource === undefined || nextSource === null) {
                continue;
            }
            nextSource = Object(nextSource);

            const keysArray = Object.keys(Object(nextSource));
            for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
                const nextKey = keysArray[nextIndex];
                const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
                if (desc !== undefined && desc.enumerable) {
                to[nextKey] = nextSource[nextKey];
                }
            }
        }
        return to;
    },
});

String.prototype.includes || Object.defineProperty(String.prototype, 'includes',
{
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (search:any, start:any) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    },
});
