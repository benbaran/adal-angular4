import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdalService } from './adal.service';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AdalInterceptor implements HttpInterceptor {

  constructor(private adal: AdalService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // if the endpoint is not registered
    // or if the header 'skip-adal' is set
    // then pass the request as it is to the next handler
    const resource = this.adal.getResourceForEndpoint(request.url);
    const skipAdal = request.headers.get('skip-adal');
    if (!resource || skipAdal) {
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
