import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AdalService } from './adal.service';
import 'rxjs/add/operator/mergeMap';

@Injectable()
export class AdalInterceptor implements HttpInterceptor {

    constructor(private adal: AdalService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // if the endpoint is not registered then pass
        // the request as it is to the next handler
        const resource = this.adal.GetResourceForEndpoint(req.url);
        if (!resource) {
            return next.handle(req.clone());
        }

        // is the endpoint is registered then acquire and inject token
        let headers = req.headers || new HttpHeaders();
        return this.adal.acquireToken(resource)
            .mergeMap((token: string) => {
                // is the user is not authenticated then drop the request
                if (!this.adal.userInfo.authenticated) {
                    throw new Error('Cannot send request to registered endpoint if the user is not authenticated.');
                }

                // inject the header
                headers = headers.append('Authorization', 'Bearer ' + token);
                return next.handle(req.clone({ headers: headers }));
            }
        );
    }
}