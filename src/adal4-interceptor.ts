import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { Adal4Service } from './adal4.service';

@Injectable()
export class Adal4Interceptor implements HttpInterceptor {
    constructor(public adal4Service: Adal4Service) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.adal4Service.userInfo.token}`
            }
        });
        return next.handle(request);
    }
}
