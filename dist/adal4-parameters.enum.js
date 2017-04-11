System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var ADAL4Parameters;
    return {
        setters: [],
        execute: function () {
            (function (ADAL4Parameters) {
                ADAL4Parameters[ADAL4Parameters["access_token"] = 0] = "access_token";
                ADAL4Parameters[ADAL4Parameters["error"] = 1] = "error";
            })(ADAL4Parameters || (ADAL4Parameters = {}));
            exports_1("ADAL4Parameters", ADAL4Parameters);
        }
    };
});
