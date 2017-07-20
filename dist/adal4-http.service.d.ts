import { Http, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Adal4Service } from './adal4.service';
/**
 *
 *
 * @export
 * @class Adal4HTTPService
 */
export declare class Adal4HTTPService {
    private http;
    private service;
    /**
     *
     *
     * @static
     * @param {Http} http
     * @param {Adal4Service} service
     *
     * @memberOf Adal4HTTPService
     */
    static factory(http: Http, service: Adal4Service): Adal4HTTPService;
    /**
     * Creates an instance of Adal4HTTPService.
     * @param {Http} http
     * @param {Adal4Service} service
     *
     * @memberOf Adal4HTTPService
     */
    constructor(http: Http, service: Adal4Service);
    /**
     *
     *
     * @param {string} url
     * @param {RequestOptionsArgs} [options]
     * @returns {Observable<any>}
     *
     * @memberOf Adal4HTTPService
     */
    get(url: string, options?: RequestOptionsArgs): Observable<any>;
    /**
     *
     *
     * @param {string} url
     * @param {*} body
     * @param {RequestOptionsArgs} [options]
     * @returns {Observable<any>}
     *
     * @memberOf Adal4HTTPService
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any>;
    /**
     *
     *
     * @param {string} url
     * @param {RequestOptionsArgs} [options]
     * @returns {Observable<any>}
     *
     * @memberOf Adal4HTTPService
     */
    delete(url: string, options?: RequestOptionsArgs): Observable<any>;
    /**
     *
     *
     * @param {string} url
     * @param {*} body
     * @param {RequestOptionsArgs} [options]
     * @returns {Observable<any>}
     *
     * @memberOf Adal4HTTPService
     */
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any>;
    /**
     *
     *
     * @param {string} url
     * @param {*} body
     * @param {RequestOptionsArgs} [options]
     * @returns {Observable<any>}
     *
     * @memberOf Adal4HTTPService
     */
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<any>;
    /**
     *
     *
     * @param {string} url
     * @param {RequestOptionsArgs} [options]
     * @returns {Observable<any>}
     *
     * @memberOf Adal4HTTPService
     */
    head(url: string, options?: RequestOptionsArgs): Observable<any>;
    /**
     *
     *
     * @private
     * @param {string} url
     * @param {RequestOptionsArgs} options
     * @returns {Observable<string>}
     *
     * @memberOf Adal4HTTPService
     */
    private sendRequest(url, options);
    /**
     *
     *
     * @private
     * @param {Response} res
     * @returns
     *
     * @memberOf Adal4HTTPService
     */
    private extractData(res);
    /**
     *
     *
     * @private
     * @param {*} error
     * @returns
     *
     * @memberOf Adal4HTTPService
     */
    private handleError(error);
}
