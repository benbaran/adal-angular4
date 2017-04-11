System.register(["@angular/core", "@angular/http", "rxjs"], function (exports_1, context_1) {
    "use strict";
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __moduleName = context_1 && context_1.id;
    var core_1, http_1, rxjs_1, ADAL4HTTPService;
    return {
        setters: [
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (rxjs_1_1) {
                rxjs_1 = rxjs_1_1;
            }
        ],
        execute: function () {
            ADAL4HTTPService = (function () {
                function ADAL4HTTPService(http, service) {
                    this.http = http;
                    this.service = service;
                }
                ADAL4HTTPService.prototype.get = function (url, options) {
                    var newOptions = new http_1.RequestOptions({ method: http_1.RequestMethod.Get });
                    newOptions = newOptions.merge(options);
                    return this.sendRequest(url, newOptions);
                };
                ADAL4HTTPService.prototype.post = function (url, body, options) {
                    var newOptions = new http_1.RequestOptions({ method: http_1.RequestMethod.Post, body: body });
                    newOptions = newOptions.merge(options);
                    return this.sendRequest(url, newOptions);
                };
                ADAL4HTTPService.prototype.delete = function (url, options) {
                    var newOptions = new http_1.RequestOptions({ method: http_1.RequestMethod.Delete });
                    newOptions = newOptions.merge(options);
                    return this.sendRequest(url, newOptions);
                };
                ADAL4HTTPService.prototype.patch = function (url, body, options) {
                    var newOptions = new http_1.RequestOptions({ method: http_1.RequestMethod.Patch, body: body });
                    newOptions = newOptions.merge(options);
                    return this.sendRequest(url, newOptions);
                };
                ADAL4HTTPService.prototype.put = function (url, body, options) {
                    var newOptions = new http_1.RequestOptions({ method: http_1.RequestMethod.Put, body: body });
                    newOptions = newOptions.merge(options);
                    return this.sendRequest(url, newOptions);
                };
                ADAL4HTTPService.prototype.head = function (url, options) {
                    var newOptions = new http_1.RequestOptions({ method: http_1.RequestMethod.Put });
                    newOptions = newOptions.merge(options);
                    return this.sendRequest(url, newOptions);
                };
                ADAL4HTTPService.prototype.sendRequest = function (url, options) {
                    var _this = this;
                    // make a copy
                    var newOptions = new http_1.RequestOptions();
                    newOptions.method = options.method;
                    newOptions = newOptions.merge(options);
                    var resource = this.service.GetResourceForEndpoint(url);
                    var authenticatedCall;
                    if (resource) {
                        if (this.service.userInfo.authenticated) {
                            authenticatedCall = this.service.acquireToken(resource)
                                .flatMap(function (token) {
                                if (newOptions.headers == null) {
                                    newOptions.headers = new http_1.Headers();
                                }
                                newOptions.headers.append("Authorization", "Bearer " + token);
                                return _this.http.request(url, newOptions)
                                    .catch(_this.handleError);
                            });
                        }
                        else {
                            authenticatedCall = rxjs_1.Observable.throw(new Error("User Not Authenticated."));
                        }
                    }
                    else {
                        authenticatedCall = this.http.request(url, options).map(this.extractData).catch(this.handleError);
                    }
                    return authenticatedCall;
                };
                ADAL4HTTPService.prototype.extractData = function (res) {
                    if (res.status < 200 || res.status >= 300) {
                        throw new Error("Bad response status: " + res.status);
                    }
                    var body = {};
                    // if there is some content, parse it
                    if (res.status !== 204) {
                        body = res.json();
                    }
                    return body || {};
                };
                ADAL4HTTPService.prototype.handleError = function (error) {
                    var errMsg = error.message || "Server error";
                    console.error(JSON.stringify(error));
                    return rxjs_1.Observable.throw(error);
                };
                return ADAL4HTTPService;
            }());
            ADAL4HTTPService = __decorate([
                core_1.Injectable()
            ], ADAL4HTTPService);
            exports_1("ADAL4HTTPService", ADAL4HTTPService);
        }
    };
});
