Object.assign||Object.defineProperty(Object,"assign",{enumerable:!1,configurable:!0,writable:!0,value:function(e){if(null==e)throw new TypeError("Cannot convert first argument to object");const t=Object(e);for(let e=1;e<arguments.length;e++){let n=arguments[e];if(null==n)continue;n=Object(n);const r=Object.keys(Object(n));for(let e=0,o=r.length;e<o;e++){const o=r[e],i=Object.getOwnPropertyDescriptor(n,o);void 0!==i&&i.enumerable&&(t[o]=n[o])}}return t}}),String.prototype.includes||Object.defineProperty(String.prototype,"includes",{enumerable:!1,configurable:!0,writable:!0,value:function(e,t){"use strict";return"number"!=typeof t&&(t=0),!(t+e.length>this.length)&&-1!==this.indexOf(e,t)}});