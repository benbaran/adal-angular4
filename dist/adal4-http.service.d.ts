import { Http, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs';
import { Adal4Service } from './adal4.service';
export declare class Adal4HTTPService {
    private http;
    private service;
    static factory(http: Http, service: Adal4Service): void;
    constructor(http: Http, service: Adal4Service);
    get(url: string, options?: RequestOptionsArgs): Observable<any>;
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any>;
    delete(url: string, options?: RequestOptionsArgs): Observable<any>;
    patch(url: string, body: any, options?: RequestOptionsArgs): Observable<any>;
    put(url: string, body: any, options?: RequestOptionsArgs): Observable<any>;
    head(url: string, options?: RequestOptionsArgs): Observable<any>;
    private sendRequest(url, options);
    private extractData(res);
    private handleError(error);
}
