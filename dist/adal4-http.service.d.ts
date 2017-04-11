import { Http, RequestOptionsArgs } from "@angular/http";
import { Observable } from "rxjs";
import { ADAL4Service } from "./adal4.service";
export declare class ADAL4HTTPService {
    private http;
    private service;
    constructor(http: Http, service: ADAL4Service);
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
