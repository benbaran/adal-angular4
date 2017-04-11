import { Injectable } from "@angular/core";

import {
    Headers, Http, RequestMethod, RequestOptions,
    RequestOptionsArgs, Response, URLSearchParams,
} from "@angular/http";

import { Observable } from "rxjs";

import { ADAL4Service } from "./adal4.service";

@Injectable()
export class ADAL4HTTPService {

    constructor(private http: Http, private service: ADAL4Service,
    ) { }

    public get(url: string, options?: RequestOptionsArgs): Observable<any> {
        let newOptions = new RequestOptions({ method: RequestMethod.Get });
        newOptions = newOptions.merge(options);
        return this.sendRequest(url, newOptions);
    }

    public post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        let newOptions = new RequestOptions({ method: RequestMethod.Post, body });
        newOptions = newOptions.merge(options);
        return this.sendRequest(url, newOptions);
    }

    public delete(url: string, options?: RequestOptionsArgs): Observable<any> {
        let newOptions = new RequestOptions({ method: RequestMethod.Delete });
        newOptions = newOptions.merge(options);
        return this.sendRequest(url, newOptions);
    }

    public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        let newOptions = new RequestOptions({ method: RequestMethod.Patch, body });
        newOptions = newOptions.merge(options);
        return this.sendRequest(url, newOptions);
    }

    public put(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        let newOptions = new RequestOptions({ method: RequestMethod.Put, body });
        newOptions = newOptions.merge(options);
        return this.sendRequest(url, newOptions);
    }

    public head(url: string, options?: RequestOptionsArgs): Observable<any> {
        let newOptions = new RequestOptions({ method: RequestMethod.Put });
        newOptions = newOptions.merge(options);
        return this.sendRequest(url, newOptions);
    }

    private sendRequest(url: string, options: RequestOptionsArgs): Observable<string> {
        // make a copy
        let newOptions = new RequestOptions();
        newOptions.method = options.method;
        newOptions = newOptions.merge(options);

        const resource = this.service.GetResourceForEndpoint(url);

        let authenticatedCall: Observable<string>;

        if (resource) {
            if (this.service.userInfo.authenticated) {
                authenticatedCall = this.service.acquireToken(resource)
                    .flatMap((token: string) => {
                        if (newOptions.headers == null) {
                            newOptions.headers = new Headers();
                        }
                        newOptions.headers.append("Authorization", "Bearer " + token);
                        return this.http.request(url, newOptions)
                            .catch(this.handleError);
                    });
            } else {
                authenticatedCall = Observable.throw(new Error("User Not Authenticated."));
            }
        } else {
            authenticatedCall = this.http.request(url, options).map(this.extractData).catch(this.handleError);
        }

        return authenticatedCall;
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error("Bad response status: " + res.status);
        }

        let body = {};
        // if there is some content, parse it
        if (res.status !== 204) {
            body = res.json();
        }

        return body || {};
    }

    private handleError(error: any) {
        const errMsg = error.message || "Server error";

        console.error(JSON.stringify(error));

        return Observable.throw(error);
    }
}
