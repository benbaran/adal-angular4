import { Observable } from 'rxjs/Observable';
import { Adal4User } from './adal4-user';
/**
 *
 *
 * @export
 * @class Adal4Service
 */
export declare class Adal4Service {
    /**
     *
     *
     * @private
     * @type {adal.AuthenticationContext}
     * @memberOf Adal4Service
     */
    private adalContext;
    /**
     *
     *
     * @private
     * @type {Adal4User}
     * @memberOf Adal4Service
     */
    private adal4User;
    /**
     * Creates an instance of Adal4Service.
     *
     * @memberOf Adal4Service
     */
    constructor();
    /**
     *
     *
     * @param {adal.Config} configOptions
     *
     * @memberOf Adal4Service
     */
    init(configOptions: adal.Config): void;
    /**
     *
     *
     * @readonly
     * @type {adal.Config}
     * @memberOf Adal4Service
     */
    readonly config: adal.Config;
    /**
     *
     *
     * @readonly
     * @type {Adal4User}
     * @memberOf Adal4Service
     */
    readonly userInfo: Adal4User;
    /**
     *
     *
     *
     * @memberOf Adal4Service
     */
    login(): void;
    /**
     *
     *
     * @returns {boolean}
     *
     * @memberOf Adal4Service
     */
    loginInProgress(): boolean;
    /**
     *
     *
     *
     * @memberOf Adal4Service
     */
    logOut(): void;
    /**
     *
     *
     *
     * @memberOf Adal4Service
     */
    handleWindowCallback(): void;
    /**
     *
     *
     * @param {string} resource
     * @returns {string}
     *
     * @memberOf Adal4Service
     */
    getCachedToken(resource: string): string;
    /**
     *
     *
     * @param {string} resource
     * @returns
     *
     * @memberOf Adal4Service
     */
    acquireToken(resource: string): any;
    /**
     *
     *
     * @returns {Observable<adal.User>}
     *
     * @memberOf Adal4Service
     */
    getUser(): Observable<any>;
    /**
     *
     *
     *
     * @memberOf Adal4Service
     */
    clearCache(): void;
    /**
     *
     *
     * @param {string} resource
     *
     * @memberOf Adal4Service
     */
    clearCacheForResource(resource: string): void;
    /**
     *
     *
     * @param {string} message
     *
     * @memberOf Adal4Service
     */
    info(message: string): void;
    /**
     *
     *
     * @param {string} message
     *
     * @memberOf Adal4Service
     */
    verbose(message: string): void;
    /**
     *
     *
     * @param {string} url
     * @returns {string}
     *
     * @memberOf Adal4Service
     */
    GetResourceForEndpoint(url: string): string;
    /**
     *
     *
     *
     * @memberOf Adal4Service
     */
    refreshDataFromCache(): void;
    /**
     *
     *
     * @private
     * @param {string} resource
     *
     * @memberOf Adal4Service
     */
    private updateDataFromCache(resource);
}
