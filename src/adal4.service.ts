
import * as lib from "adal-angular";

import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class ADAL4Service {

    public authenticated: boolean;

    private context: adal.AuthenticationContext;
    private user: adal.User;

    /**
     * Initializes the context with a configuration
     * @param {adal.Config} config - The configuration
     */
    public init(config: adal.Config) {
        if (!config) {
            throw new Error("No configuration specified.");
        }

        // redirect and logout_redirect are set to current location by default
        const hash = window.location.hash;

        let path = window.location.href;

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
    }

    public get config(): adal.Config {
        return this.context.config;
    }

    public get userInfo(): adal.User{
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
                this.updateDataFromCache(this.context.config.loginResource);

            } else if (requestInfo.requestType === this.context.REQUEST_TYPE.RENEW_TOKEN) {
                this.context.callback = window.parent.callBackMappedToRenewStates[requestInfo.stateResponse];
            }

            if (requestInfo.stateMatch) {
                if (typeof this.context.callback === "function") {
                    if (requestInfo.requestType === this.context.REQUEST_TYPE.RENEW_TOKEN) {
                        // Idtoken or Accestoken can be renewed
                        if (requestInfo.parameters["access_token"]) {
                            this.context.callback(
                                this.context._getItem(this.context.CONSTANTS.STORAGE.ERROR_DESCRIPTION),
                                requestInfo.parameters["access_token"]);
                        } else if (requestInfo.parameters["error"]) {
                            this.context.callback(
                                this.context._getItem(this.context.CONSTANTS.STORAGE.ERROR_DESCRIPTION),
                                null);
                            this.context._renewFailed = true;
                        }
                    }
                }
            }
        }
    }

    public getCachedToken(resource: string): string {
        return this.context.getCachedToken(resource);
    }

    public acquireToken(resource: string) {
        const savedThis = this;   // save outer this for inner function

        let errorMessage: string;
        return Observable.bindCallback(acquireTokenInternal, (token: string) => {
            if (!token && errorMessage) {
                throw (errorMessage);
            }
            return token;
        })();

        function acquireTokenInternal(cb: any) {
            let s: string = null;

            savedThis.context.acquireToken(resource, (error: string, tokenOut: string) => {
                if (error) {
                    savedThis.context.error("Error when acquiring token for resource: " + resource, error);
                    errorMessage = error;
                    cb(null as string);
                } else {
                    cb(tokenOut);
                    s = tokenOut;
                }
            });
            return s;
        }
    }

    public getUser(): Observable<adal.User> {
        return Observable.bindCallback((cb: (u: adal.User) => adal.User) => {
            this.context.getUser(function(error: string, user: adal.User) {
                if (error) {
                    this.context.error("Error when getting user", error);
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
        this.updateDataFromCache(this.context.config.loginResource);
    }

    private updateDataFromCache(resource: string): void {
        const token = this.context.getCachedToken(resource);
        this.authenticated = token !== null && token.length > 0;
        const user = this.context.getCachedUser() || { userName: "", profile: undefined };
        if (user) {
            this.user.userName = user.userName;
            this.user.profile = user.profile;
        } else {
            this.user.userName = "";
            this.user.profile = {};
        }

    }
}
