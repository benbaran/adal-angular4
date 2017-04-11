/// <reference types="adal" />
import { Observable } from "rxjs";
import { ADAL4User } from "./adal4-user";
export declare class ADAL4Service {
    private user;
    private context;
    /**
     * Initializes the context with a configuration
     * @param {adal.Config} config - The configuration
     */
    init(config: adal.Config): void;
    readonly config: adal.Config;
    readonly userInfo: ADAL4User;
    login(): void;
    loginInProgress(): boolean;
    logOut(): void;
    handleWindowCallback(): void;
    getCachedToken(resource: string): string;
    acquireToken(resource: string): Observable<string>;
    getUser(): Observable<adal.User>;
    clearCache(): void;
    clearCacheForResource(resource: string): void;
    info(message: string): void;
    verbose(message: string): void;
    GetResourceForEndpoint(url: string): string;
    refreshDataFromCache(): void;
    private updateDataFromCache(resource);
}
