import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AdalService } from './adal.service';


@Injectable()
export class AdalInterceptor implements HttpInterceptor {

    constructor(private adalService: AdalService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const authReq = req.clone({ headers: req.headers.set('Authorization', `Bearer ${this.adalService.userInfo.token}`) });

        return next.handle(authReq);
    }
}