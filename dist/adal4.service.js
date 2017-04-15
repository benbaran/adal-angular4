"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var adalLib = require("adal-angular");
var Adal4Service = (function () {
    function Adal4Service() {
        this.adal4User = {
            authenticated: false,
            username: '',
            error: '',
            token: '',
            profile: {}
        };
    }
    Adal4Service.prototype.init = function (configOptions) {
        if (!configOptions) {
            throw new Error('You must set config, when calling init.');
        }
        // redirect and logout_redirect are set to current location by default
        var existingHash = window.location.hash;
        var pathDefault = window.location.href;
        if (existingHash) {
            pathDefault = pathDefault.replace(existingHash, '');
        }
        configOptions.redirectUri = configOptions.redirectUri || pathDefault;
        configOptions.postLogoutRedirectUri = configOptions.postLogoutRedirectUri || pathDefault;
        // create instance with given config
        this.adalContext = adalLib.inject(configOptions);
        window.AuthenticationContext = this.adalContext.constructor;
        // loginresource is used to set authenticated status
        this.updateDataFromCache(this.adalContext.config.loginResource);
    };
    Object.defineProperty(Adal4Service.prototype, "config", {
        get: function () {
            return this.adalContext.config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Adal4Service.prototype, "userInfo", {
        get: function () {
            return this.adal4User;
        },
        enumerable: true,
        configurable: true
    });
    Adal4Service.prototype.login = function () {
        this.adalContext.login();
    };
    Adal4Service.prototype.loginInProgress = function () {
        return this.adalContext.loginInProgress();
    };
    Adal4Service.prototype.logOut = function () {
        this.adalContext.logOut();
    };
    Adal4Service.prototype.handleWindowCallback = function () {
        var hash = window.location.hash;
        if (this.adalContext.isCallback(hash)) {
            var requestInfo = this.adalContext.getRequestInfo(hash);
            this.adalContext.saveTokenFromHash(requestInfo);
            if (requestInfo.requestType === this.adalContext.REQUEST_TYPE.LOGIN) {
                this.updateDataFromCache(this.adalContext.config.loginResource);
            }
            else if (requestInfo.requestType === this.adalContext.REQUEST_TYPE.RENEW_TOKEN) {
                this.adalContext.callback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse];
            }
            if (requestInfo.stateMatch) {
                if (typeof this.adalContext.callback === 'function') {
                    if (requestInfo.requestType === this.adalContext.REQUEST_TYPE.RENEW_TOKEN) {
                        // Idtoken or Accestoken can be renewed
                        if (requestInfo.parameters['access_token']) {
                            this.adalContext.callback(this.adalContext._getItem(this.adalContext.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters['access_token']);
                        }
                        else if (requestInfo.parameters['error']) {
                            this.adalContext.callback(this.adalContext._getItem(this.adalContext.CONSTANTS.STORAGE.ERROR_DESCRIPTION), null);
                            this.adalContext._renewFailed = true;
                        }
                    }
                }
            }
        }
    };
    Adal4Service.prototype.getCachedToken = function (resource) {
        return this.adalContext.getCachedToken(resource);
    };
    Adal4Service.prototype.acquireToken = function (resource) {
        var _this = this; // save outer this for inner function
        var errorMessage;
        return rxjs_1.Observable.bindCallback(acquireTokenInternal, function (token) {
            if (!token && errorMessage) {
                throw (errorMessage);
            }
            return token;
        })();
        function acquireTokenInternal(cb) {
            var s = null;
            _this.adalContext.acquireToken(resource, function (error, tokenOut) {
                if (error) {
                    _this.adalContext.error('Error when acquiring token for resource: ' + resource, error);
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
    Adal4Service.prototype.getUser = function () {
        var _this = this;
        return rxjs_1.Observable.bindCallback(function (cb) {
            _this.adalContext.getUser(function (error, user) {
                if (error) {
                    this.adalContext.error('Error when getting user', error);
                    cb(null);
                }
                else {
                    cb(user);
                }
            });
        })();
    };
    Adal4Service.prototype.clearCache = function () {
        this.adalContext.clearCache();
    };
    Adal4Service.prototype.clearCacheForResource = function (resource) {
        this.adalContext.clearCacheForResource(resource);
    };
    Adal4Service.prototype.info = function (message) {
        this.adalContext.info(message);
    };
    Adal4Service.prototype.verbose = function (message) {
        this.adalContext.verbose(message);
    };
    Adal4Service.prototype.GetResourceForEndpoint = function (url) {
        return this.adalContext.getResourceForEndpoint(url);
    };
    Adal4Service.prototype.refreshDataFromCache = function () {
        this.updateDataFromCache(this.adalContext.config.loginResource);
    };
    Adal4Service.prototype.updateDataFromCache = function (resource) {
        var token = this.adalContext.getCachedToken(resource);
        this.adal4User.authenticated = token !== null && token.length > 0;
        var user = this.adalContext.getCachedUser() || { userName: '', profile: undefined };
        if (user) {
            this.adal4User.username = user.userName;
            this.adal4User.profile = user.profile;
            this.adal4User.token = token;
            this.adal4User.error = this.adalContext.getLoginError();
        }
        else {
            this.adal4User.username = '';
            this.adal4User.profile = {};
            this.adal4User.token = '';
            this.adal4User.error = '';
        }
    };
    ;
    return Adal4Service;
}());
Adal4Service = __decorate([
    core_1.Injectable()
], Adal4Service);
exports.Adal4Service = Adal4Service;
