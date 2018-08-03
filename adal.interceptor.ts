import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { AdalService } from './adal.service';

@Injectable()
export class AdalInterceptor implements HttpInterceptor {

    constructor(private adal: AdalService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // if the endpoint is not registered then pass
        // the request as it is to the next handler
        const resource = this.adal.getResourceForEndpoint(request.url);
        if (!resource) {
            return next.handle(request);
        }

        // if the user is not authenticated then drop the request
        if (!this.adal.userInfo.authenticated) {
            throw new Error('Cannot send request to registered endpoint if the user is not authenticated.');
        }

        // if the endpoint is registered then acquire and inject token
        return this.adal.acquireToken(resource)
            .pipe(
                mergeMap((token: string) => {
                    // clone the request and replace the original headers with
                    // cloned headers, updated with the authorization
                    const authorizedRequest = request.clone({
                        headers: request.headers.set('Authorization', 'Bearer ' + token),
                    });

                    return next.handle(authorizedRequest);
                }
            )
        )
    }
}