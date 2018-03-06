import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AdalService } from './adal.service';
import 'rxjs/add/operator/map';

@Injectable()
export class AdalInterceptor implements HttpInterceptor {

    constructor(private adal: AdalService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = req.url;
        const resource = this.adal.GetResourceForEndpoint(url);
        if (resource && this.adal.userInfo.authenticated) {
            let headers = req.headers || new HttpHeaders();
            this.adal.acquireToken(resource)
                .subscribe((token: string) => {
                    headers = headers.append('Authorization', 'Bearer ' + token);
                }
            );
            return next.handle(req.clone({ headers: headers }));        
        } else {
            return next.handle(req.clone());
        }
    }
}