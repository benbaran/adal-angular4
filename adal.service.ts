/// <reference path="adal-angular.d.ts" />

import { Injectable } from '@angular/core';
import { Observable, bindCallback} from 'rxjs';
import * as lib from 'adal-angular';

@Injectable()
export class AdalService {

    private context: adal.AuthenticationContext = <any>null;

    private user: adal.User = {
        authenticated: false,
        userName: '',
        error: '',
        token: '',
        profile: {}
    };

    constructor() { }

    public init(configOptions: adal.Config) {
        if (!configOptions) {
            throw new Error('You must set config, when calling init.');
        }

        // redirect and logout_redirect are set to current location by default
        const existingHash = window.location.hash;

        let pathDefault = window.location.href;
        if (existingHash) {
            pathDefault = pathDefault.replace(existingHash, '');
        }

        configOptions.redirectUri = configOptions.redirectUri || pathDefault;
        configOptions.postLogoutRedirectUri = configOptions.postLogoutRedirectUri || pathDefault;

        // create instance with given config
        this.context = lib.inject(configOptions);

        window.AuthenticationContext = this.context.constructor;

        // loginresource is used to set authenticated status
        this.updateDataFromCache(<any>this.context.config.loginResource);
    }

    public get config(): adal.Config {
        return this.context.config;
    }

    public get userInfo(): adal.User {
        return this.user;
    }

    public login(): void {
        this.context.login();
    }

    public loginInProgress(): boolean {
        return this.context.loginInProgress();
    }

    public logOut(): void {
        this.context.logOut();
    }

    public handleWindowCallback(): void {
        const hash = window.location.hash;
        if (this.context.isCallback(hash)) {
            const requestInfo = this.context.getRequestInfo(hash);
            this.context.saveTokenFromHash(requestInfo);
            if (requestInfo.requestType === this.context.REQUEST_TYPE.LOGIN) {
                this.updateDataFromCache(<any>this.context.config.loginResource);

            } else if (requestInfo.requestType === this.context.REQUEST_TYPE.RENEW_TOKEN) {
                this.context.callback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse];
            }

            if (requestInfo.stateMatch) {
                if (typeof this.context.callback === 'function') {
                    if (requestInfo.requestType === this.context.REQUEST_TYPE.RENEW_TOKEN) {
                        // Idtoken or Accestoken can be renewed
                        if (requestInfo.parameters['access_token']) {
                            this.context.callback(this.context._getItem(this.context.CONSTANTS.STORAGE.ERROR_DESCRIPTION)
                                , requestInfo.parameters['access_token']);
                        } else if (requestInfo.parameters['id_token']) {
                            this.context.callback(this.context._getItem(this.context.CONSTANTS.STORAGE.ERROR_DESCRIPTION)
                                , requestInfo.parameters['id_token']);
                        } else if (requestInfo.parameters['error']) {
                            this.context.callback(this.context._getItem(this.context.CONSTANTS.STORAGE.ERROR_DESCRIPTION), null);
                            this.context._renewFailed = true;
                        }
                    }
                }
            }
        }

        // Remove hash from url
        if (window.location.hash) {
            if (window.history.replaceState) {
                window.history.replaceState('', '/', window.location.pathname)
            } else {
                window.location.hash = '';
            }
        }
    }

    public getCachedToken(resource: string): string {
        return this.context.getCachedToken(resource);
    }

    public acquireToken(resource: string) {
        const _this = this;   // save outer this for inner function

        let errorMessage: string;
        return bindCallback(acquireTokenInternal, function (token: string) {
            if (!token && errorMessage) {
                throw (errorMessage);
            }
            return token;
        })();

        function acquireTokenInternal(cb: any) {
            let s: any = null;

            _this.context.acquireToken(resource, (error: string, tokenOut: string) => {
                if (error) {
                    _this.context.error('Error when acquiring token for resource: ' + resource, error);
                    errorMessage = error;
                    cb(<any>null);
                } else {
                    cb(tokenOut);
                    s = tokenOut;
                }
            });
            return s;
        }
    }

    public getUser(): Observable<any> {
        const __this = this;   // save outer this for inner function

        return bindCallback((cb: any) => {
            this.context.getUser(function (error: string, user: any) {
                if (error) {
                    __this.context.error('Error when getting user', error);
                    cb(null);
                } else {
                    cb(user);
                }
            });
        })();
    }

    public clearCache(): void {
        this.context.clearCache();
    }

    public clearCacheForResource(resource: string): void {
        this.context.clearCacheForResource(resource);
    }

    public info(message: string): void {
        this.context.info(message);
    }

    public verbose(message: string): void {
        this.context.verbose(message);
    }

    public GetResourceForEndpoint(url: string): string {
        return this.context.getResourceForEndpoint(url);
    }

    public refreshDataFromCache() {
        this.updateDataFromCache(<any>this.context.config.loginResource);
    }

    private updateDataFromCache(resource: string): void {
        const token = this.context.getCachedToken(resource);
        this.user.authenticated = token !== null && token.length > 0;
        const user = this.context.getCachedUser() || { userName: '', profile: <any>undefined };
        if (user) {
            this.user.userName = user.userName;
            this.user.profile = user.profile;
            this.user.token = token;
            this.user.error = this.context.getLoginError();
        } else {
            this.user.userName = '';
            this.user.profile = {};
            this.user.token = '';
            this.user.error = '';
        }
    }
}
