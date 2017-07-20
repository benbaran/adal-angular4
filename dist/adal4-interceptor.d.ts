import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Adal4Service } from './adal4.service';
export declare class Adal4Interceptor implements HttpInterceptor {
    adal4Service: Adal4Service;
    constructor(adal4Service: Adal4Service);
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
