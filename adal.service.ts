/// <reference path="adal-angular.d.ts" />

import { Injectable, NgZone } from '@angular/core';

import { Observable, bindCallback, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import * as lib from 'adal-angular';

@Injectable()
export class AdalService {


    private context: adal.AuthenticationContext = <any>null;
    private loginRefreshTimer = <any>null;


    private user: adal.User = {
        authenticated: false,
        userName: '',
        error: '',
        token: '',
        profile: {},
        loginCached: false
    };

    constructor(private ngZone: NgZone) { }

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

        this.updateDataFromCache();

        if (this.user.loginCached && !this.user.authenticated && window.self == window.top && !this.isInCallbackRedirectMode) {
            this.refreshLoginToken();
        } else if (this.user.loginCached && this.user.authenticated && !this.loginRefreshTimer && window.self == window.top) {
            this.setupLoginTokenRefreshTimer();
        }

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

    public handleWindowCallback(removeHash: boolean = true): void {
        const hash = window.location.hash;
        if (this.context.isCallback(hash)) {
            const requestInfo = this.context.getRequestInfo(hash);
            this.context.saveTokenFromHash(requestInfo);
            if (requestInfo.requestType === this.context.REQUEST_TYPE.LOGIN) {
                this.updateDataFromCache();
                this.setupLoginTokenRefreshTimer();
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
        if (removeHash) {
            if (window.location.hash) {
                if (window.history.replaceState) {
                    window.history.replaceState('', '/', window.location.pathname)
                } else {
                    window.location.hash = '';
                }
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


    public refreshDataFromCache() {
        this.updateDataFromCache();

    }

    private updateDataFromCache(): void {
        const token = this.context.getCachedToken(<any>this.context.config.loginResource);
        this.user.authenticated = token !== null && token.length > 0;

        const user = this.context.getCachedUser();

        if (user) {
            this.user.userName = user.userName;
            this.user.profile = user.profile;
            this.user.token = token;
            this.user.error = this.context.getLoginError();
            this.user.loginCached = true;
        } else {
            this.user.userName = '';
            this.user.profile = {};
            this.user.token = '';
            this.user.error = this.context.getLoginError();
            this.user.loginCached = false;
        }
    }

    private refreshLoginToken(): void {
        if (!this.user.loginCached) throw ("User not logged in");
        this.acquireToken(<any>this.context.config.loginResource).subscribe((token: string) => {
            this.user.token = token;
            if (this.user.authenticated == false) {
                this.user.authenticated = true;
                this.user.error = '';
                window.location.reload();
            } else {
                this.setupLoginTokenRefreshTimer();
            }
        }, (error: string) => {
            this.user.authenticated = false;
            this.user.error = this.context.getLoginError();
        });
    }

    private now(): number {
        return Math.round(new Date().getTime() / 1000.0);
    }

    private get isInCallbackRedirectMode(): boolean {
      return window.location.href.indexOf("#access_token") !== -1 || window.location.href.indexOf("#id_token") !== -1;
    };

    private setupLoginTokenRefreshTimer(): void {
        // Get expiration of login token
        let exp = this.context._getItem(this.context.CONSTANTS.STORAGE.EXPIRATION_KEY + <any>this.context.config.loginResource);

        // Either wait until the refresh window is valid or refresh in 1 second (measured in seconds)
        let timerDelay = exp - this.now() - (this.context.config.expireOffsetSeconds || 300) > 0 ? exp - this.now() - (this.context.config.expireOffsetSeconds || 300) : 1;
        if (this.loginRefreshTimer) this.loginRefreshTimer.unsubscribe();

        this.ngZone.runOutsideAngular(() => {
            this.loginRefreshTimer = timer(timerDelay * 1000).subscribe((x) => {
                this.refreshLoginToken()
            });
        });
    }
}
