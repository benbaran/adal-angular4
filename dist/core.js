System.register(["./adal4-user", "./adal4.module", "./adal4-http.module", "./adal4.service", "./adal4-http.service"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (adal4_user_1_1) {
                exports_1({
                    "ADAL4User": adal4_user_1_1["ADAL4User"]
                });
            },
            function (adal4_module_1_1) {
                exports_1({
                    "ADAL4Module": adal4_module_1_1["ADAL4Module"]
                });
            },
            function (adal4_http_module_1_1) {
                exports_1({
                    "ADAL4HTTPModule": adal4_http_module_1_1["ADAL4HTTPModule"]
                });
            },
            function (adal4_service_1_1) {
                exports_1({
                    "ADAL4Service": adal4_service_1_1["ADAL4Service"]
                });
            },
            function (adal4_http_service_1_1) {
                exports_1({
                    "ADAL4HTTPService": adal4_http_service_1_1["ADAL4HTTPService"]
                });
            }
        ],
        execute: function () {
        }
    };
});
