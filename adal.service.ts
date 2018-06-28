/// <reference path="adal-angular.d.ts" />

import { Injectable } from '@angular/core';
import { Observable, bindCallback } from 'rxjs';
import { map } from 'rxjs/operators';
import * as lib from 'adal-angular';

@Injectable()
export class AdalService {

    private context: adal.AuthenticationContext = null as any;

    private user: adal.User = {
        authenticated: false,
        userName: '',
        error: '',
        token: '',
        profile: {}
    };

    constructor() { }

    public init(configOptions: adal.Config): void {
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
        this.updateDataFromCache(this.context.config.loginResource as string);
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
                this.updateDataFromCache(this.context.config.loginResource as string);

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

    public getCachedToken(resource: string): string | null {
        return this.context.getCachedToken(resource);
    }

    public acquireToken(resource: string): Observable<string | null> {
        return bindCallback<string | null, string | null>((callback) => {
            this.context.acquireToken(resource, (error: string, tokenOut: string) => {
                if (error) {
                    this.context.error('Error when acquiring token for resource: ' + resource, error);
                    callback(null, error);
                } else {
                    callback(tokenOut, null);
                }
            });
        })()
            .pipe<string | null>(
                map((result) => {
                    if (!result[0] && result[1]) {
                        throw (result[1]);
                    }

                    return result[0];
                })
            );
    }

    public getUser(): Observable<adal.User | null> {
        return bindCallback<adal.User | null>((callback) => {
            this.context.getUser( (error: string, user?: adal.User) => {
                if (error) {
                    this.context.error('Error when getting user', error);
                    callback(null);
                } else {
                    callback(user || null);
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

    public getResourceForEndpoint(url: string): string | null {
        return this.context.getResourceForEndpoint(url);
    }

    public refreshDataFromCache(): void {
        this.updateDataFromCache(this.context.config.loginResource as string);
    }

    private updateDataFromCache(resource: string): void {
        const token = this.context.getCachedToken(resource);
        this.user.authenticated = token !== null && token.length > 0;
        const user = this.context.getCachedUser() || { userName: '', profile: undefined };
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
