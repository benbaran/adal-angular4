System.register(["@angular/common", "@angular/core", "./adal4.service"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var common_1, core_1, adal4_service_1, ADAL4Module;
    return {
        setters: [
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (adal4_service_1_1) {
                adal4_service_1 = adal4_service_1_1;
            }
        ],
        execute: function () {
            ADAL4Module = (function () {
                function ADAL4Module() {
                }
                return ADAL4Module;
            }());
            ADAL4Module = __decorate([
                core_1.NgModule({
                    imports: [
                        common_1.CommonModule,
                    ],
                    providers: [adal4_service_1.ADAL4Service],
                })
            ], ADAL4Module);
            exports_1("ADAL4Module", ADAL4Module);
        }
    };
});
