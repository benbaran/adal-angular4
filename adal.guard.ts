import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AdalService } from './adal.service';

@Injectable()
export class AdalGuard implements CanActivate {

  constructor(private adalService: AdalService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.adalService.userInfo.authenticated;
  }
}