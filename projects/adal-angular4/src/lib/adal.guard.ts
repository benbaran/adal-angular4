import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AdalService } from './adal.service';

@Injectable({
  providedIn: 'root'
})
export class AdalGuard implements CanActivate {

  constructor(private service: AdalService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.service.userInfo.authenticated;
  }
}
