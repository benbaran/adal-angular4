"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var lib = require("adal-angular");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var adal4_parameters_enum_1 = require("./adal4-parameters.enum");
var ADAL4Service = (function () {
    function ADAL4Service() {
        // ADAL4User object to hold user info
        this.user = {
            authenticated: false,
            error: "",
            profile: [],
            userName: "",
        };
    }
    /**
     * Initializes the context with a configuration
     * @param {adal.Config} config - The configuration
     */
    ADAL4Service.prototype.init = function (config) {
        if (!config) {
            throw new Error("No configuration specified.");
        }
        // redirect and logout_redirect are set to current location by default
        var hash = window.location.hash;
        var path = window.location.href;
        if (hash) {
            path = path.replace(hash, "");
        }
        config.redirectUri = config.redirectUri || path;
        config.postLogoutRedirectUri = config.postLogoutRedirectUri || path;
        // create instance with given config
        this.context = lib.inject(config);
        window.AuthenticationContext = this.context.constructor;
        // loginresource is used to set authenticated status
        this.updateDataFromCache(this.context.config.loginResource);
    };
    Object.defineProperty(ADAL4Service.prototype, "config", {
        get: function () {
            return this.context.config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ADAL4Service.prototype, "userInfo", {
        get: function () {
            return this.user;
        },
        enumerable: true,
        configurable: true
    });
    ADAL4Service.prototype.login = function () {
        this.context.login();
    };
    ADAL4Service.prototype.loginInProgress = function () {
        return this.context.loginInProgress();
    };
    ADAL4Service.prototype.logOut = function () {
        this.context.logOut();
    };
    ADAL4Service.prototype.handleWindowCallback = function () {
        var hash = window.location.hash;
        if (this.context.isCallback(hash)) {
            var requestInfo = this.context.getRequestInfo(hash);
            this.context.saveTokenFromHash(requestInfo);
            if (requestInfo.requestType === this.context.REQUEST_TYPE.LOGIN) {
                this.updateDataFromCache(this.context.config.loginResource);
            }
            else if (requestInfo.requestType === this.context.REQUEST_TYPE.RENEW_TOKEN) {
                this.context.callback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse];
            }
            if (requestInfo.stateMatch) {
                if (typeof this.context.callback === "function") {
                    if (requestInfo.requestType === this.context.REQUEST_TYPE.RENEW_TOKEN) {
                        // Idtoken or Accestoken can be renewed
                        if (requestInfo.parameters[adal4_parameters_enum_1.ADAL4Parameters.access_token]) {
                            this.context.callback(this.context._getItem(this.context.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters[adal4_parameters_enum_1.ADAL4Parameters.access_token]);
                        }
                        else if (requestInfo.parameters[adal4_parameters_enum_1.ADAL4Parameters.error]) {
                            this.context.callback(this.context._getItem(this.context.CONSTANTS.STORAGE.ERROR_DESCRIPTION), null);
                            this.context._renewFailed = true;
                        }
                    }
                }
            }
        }
    };
    ADAL4Service.prototype.getCachedToken = function (resource) {
        return this.context.getCachedToken(resource);
    };
    ADAL4Service.prototype.acquireToken = function (resource) {
        var savedThis = this; // save outer this for inner function
        var errorMessage;
        return rxjs_1.Observable.bindCallback(acquireTokenInternal, function (token) {
            if (!token && errorMessage) {
                throw (errorMessage);
            }
            return token;
        })();
        function acquireTokenInternal(cb) {
            var s = null;
            savedThis.context.acquireToken(resource, function (error, tokenOut) {
                if (error) {
                    savedThis.context.error("Error when acquiring token for resource: " + resource, error);
                    errorMessage = error;
                    cb(null);
                }
                else {
                    cb(tokenOut);
                    s = tokenOut;
                }
            });
            return s;
        }
    };
    ADAL4Service.prototype.getUser = function () {
        var _this = this;
        return rxjs_1.Observable.bindCallback(function (cb) {
            _this.context.getUser(function (error, user) {
                if (error) {
                    this.context.error("Error when getting user", error);
                    cb(null);
                }
                else {
                    cb(user);
                }
            });
        })();
    };
    ADAL4Service.prototype.clearCache = function () {
        this.context.clearCache();
    };
    ADAL4Service.prototype.clearCacheForResource = function (resource) {
        this.context.clearCacheForResource(resource);
    };
    ADAL4Service.prototype.info = function (message) {
        this.context.info(message);
    };
    ADAL4Service.prototype.verbose = function (message) {
        this.context.verbose(message);
    };
    ADAL4Service.prototype.GetResourceForEndpoint = function (url) {
        return this.context.getResourceForEndpoint(url);
    };
    ADAL4Service.prototype.refreshDataFromCache = function () {
        this.updateDataFromCache(this.context.config.loginResource);
    };
    ADAL4Service.prototype.updateDataFromCache = function (resource) {
        var token = this.context.getCachedToken(resource);
        this.user.authenticated = token !== null && token.length > 0;
        var user = this.context.getCachedUser() || { userName: "", profile: undefined };
        if (user) {
            this.user.userName = user.userName;
            this.user.profile = user.profile;
        }
        else {
            this.user.userName = "";
            this.user.profile = {};
        }
    };
    return ADAL4Service;
}());
ADAL4Service = __decorate([
    core_1.Injectable()
], ADAL4Service);
exports.ADAL4Service = ADAL4Service;
