import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Adal4Service } from './adal4.service';

/**
 *
 *
 * @export
 * @class Adal4HTTPService
 */
@Injectable()
export class Adal4HTTPService {

  /**
   *
   *
   * @static
   * @param {Http} http
   * @param {Adal4Service} service
   *
   * @memberOf Adal4HTTPService
   */
  static factory(http: Http, service: Adal4Service) {
    return new Adal4HTTPService(http, service);
  }

  /**
   * Creates an instance of Adal4HTTPService.
   * @param {Http} http
   * @param {Adal4Service} service
   *
   * @memberOf Adal4HTTPService
   */
  constructor(
    private http: Http,
    private service: Adal4Service
  ) { }

  /**
   *
   *
   * @param {string} url
   * @param {RequestOptionsArgs} [options]
   * @returns {Observable<any>}
   *
   * @memberOf Adal4HTTPService
   */
  get(url: string, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Get });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

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
  post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Post, body: body });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

  /**
   *
   *
   * @param {string} url
   * @param {RequestOptionsArgs} [options]
   * @returns {Observable<any>}
   *
   * @memberOf Adal4HTTPService
   */
  delete(url: string, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Delete });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

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
  patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Patch, body: body });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

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
  put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Put, body: body });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

  /**
   *
   *
   * @param {string} url
   * @param {RequestOptionsArgs} [options]
   * @returns {Observable<any>}
   *
   * @memberOf Adal4HTTPService
   */
  head(url: string, options?: RequestOptionsArgs): Observable<any> {
    let options1 = new RequestOptions({ method: RequestMethod.Put });
    options1 = options1.merge(options);
    return this.sendRequest(url, options1);
  }

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
  private sendRequest(url: string, options: RequestOptionsArgs): Observable<string> {
    // make a copy
    let options1 = new RequestOptions();
    options1.method = options.method;
    options1 = options1.merge(options);

    const resource = this.service.GetResourceForEndpoint(url);
    let authenticatedCall: Observable<string>;
    if (resource) {
      if (this.service.userInfo.authenticated) {
        authenticatedCall = this.service.acquireToken(resource)
          .flatMap((token: string) => {
            if (options1.headers == null) {
              options1.headers = new Headers();
            }
            options1.headers.append('Authorization', 'Bearer ' + token);
            return this.http.request(url, options1)
              .catch(this.handleError);
          });
      }
      else {
        authenticatedCall = Observable.throw(new Error('User Not Authenticated.'));
      }
    }
    else { authenticatedCall = this.http.request(url, options).map(this.extractData).catch(this.handleError); }

    return authenticatedCall;
  }

  /**
   *
   *
   * @private
   * @param {Response} res
   * @returns
   *
   * @memberOf Adal4HTTPService
   */
  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }

    let body = {};
    // if there is some content, parse it
    if (res.status !== 204) {
      body = res.json();
    }

    return body || {};
  }

  /**
   *
   *
   * @private
   * @param {*} error
   * @returns
   *
   * @memberOf Adal4HTTPService
   */
  private handleError(error: any) {
    // In a real world app, we might send the error to remote logging infrastructure
    const errMsg = error.message || 'Server error';
    console.error(JSON.stringify(error)); // log to console instead

    return Observable.throw(error);
  }
}
