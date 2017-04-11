import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptionsArgs, RequestOptions, RequestMethod, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs';
import {AdalService} from './adal.service';

@Injectable()
export class AuthHttp {
    constructor(private http: Http
        , private adalService: AdalService
    ) { }

    get(url: string, options?: RequestOptionsArgs): Observable<any> {
        let options1 = new RequestOptions({ method: RequestMethod.Get });
        options1 = options1.merge(options);
        return this.sendRequest(url, options1);
    }

    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        let options1 = new RequestOptions({ method: RequestMethod.Post, body: body });
        options1 = options1.merge(options);
        return this.sendRequest(url, options1);
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<any> {
        let options1 = new RequestOptions({ method: RequestMethod.Delete });
        options1 = options1.merge(options);
        return this.sendRequest(url, options1);
    }


    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        let options1 = new RequestOptions({ method: RequestMethod.Patch, body: body });
        options1 = options1.merge(options);
        return this.sendRequest(url, options1);
    }

    put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        let options1 = new RequestOptions({ method: RequestMethod.Put, body: body });
        options1 = options1.merge(options);
        return this.sendRequest(url, options1);
    }

    head(url: string, options?: RequestOptionsArgs): Observable<any> {
        let options1 = new RequestOptions({ method: RequestMethod.Put });
        options1 = options1.merge(options);
        return this.sendRequest(url, options1);
    }

    private sendRequest(url: string, options: RequestOptionsArgs): Observable<string> {
        //make a copy
        let options1 = new RequestOptions();
        options1.method = options.method;
        options1 = options1.merge(options);
        
        let resource = this.adalService.GetResourceForEndpoint(url);
        let authenticatedCall: Observable<string>;
        if (resource) {
            if (this.adalService.userInfo.isAuthenticated) {
                authenticatedCall = this.adalService.acquireToken(resource)
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
                authenticatedCall = Observable.throw(new Error("User Not Authenticated."));
            }
        }
        else {
            authenticatedCall = this.http.request(url, options).map(this.extractData).catch(this.handleError);
        }

        return authenticatedCall;
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        var body = {};
        //if there is some content, parse it
        if (res.status != 204) {
            body = res.json();
        }

        return body || {};
    }

    private handleError(error: any) {
        // In a real world app, we might send the error to remote logging infrastructure
        let errMsg = error.message || 'Server error';
        console.error(JSON.stringify(error)); // log to console instead

        return Observable.throw(error);
    }
}
