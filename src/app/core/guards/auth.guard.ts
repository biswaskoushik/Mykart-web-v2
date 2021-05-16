import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

/* Common Function */
import { CommonFunction } from '../../core/class/common-function';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router, public commonFunction: CommonFunction) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      var loginData: any = this.commonFunction.getLoginData();
      if(loginData.status == true) {
        return true;
      } else {
        this.router.navigate(['auth/login']);
        return false;
      }
  }
  
}
