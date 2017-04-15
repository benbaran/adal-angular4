import { Observable } from 'rxjs';
import { Adal4User } from './adal4-user';
export declare class Adal4Service {
    private adalContext;
    private adal4User;
    constructor();
    init(configOptions: adal.Config): void;
    readonly config: adal.Config;
    readonly userInfo: Adal4User;
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
