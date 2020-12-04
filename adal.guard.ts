import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdalService } from './adal.service';

@Injectable()
export class AdalGuard implements CanActivate, CanActivateChild {

  constructor(private adalService: AdalService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {

    const expectedRole = route.data.expectedRole;

    if(expectedRole){
      return (this.adalService.userInfo.authenticated && this.adalService.userInfo.profile.roles.includes(expectedRole));
    } else {
      return this.adalService.userInfo.authenticated;
    }
    
  }

    public canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.canActivate(childRoute, state);
    }
}