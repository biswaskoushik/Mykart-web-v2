import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ApiService } from '../service/api.service';
import { CommonFunction } from '../class/common-function';

@Injectable({
  providedIn: 'root'
})

export class RouteResolveService implements Resolve<any> {

  constructor(private apiService: ApiService, private router: Router, public commonFunction: CommonFunction) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    /* will come into play while editing otherwise no effect */
    let activatedRoute: any = activatedRouteSnapshot.data;
    let params: any = activatedRouteSnapshot.params;
    let loginUserData = this.commonFunction.getLoginData()
    let flag: any = "spring";


    //console.log(activatedRoute, 'activatedRoute++')
    if (activatedRoute.endpoint == 'services/vendor/v1/category/list') {
      activatedRoute.requestcondition.Vendor_detail.email = loginUserData.data.user.email;
    }

    if (activatedRoute.endpoint == 'product/v1/get/category') {
      activatedRoute.requestcondition.email = loginUserData.data.user.email;
      flag = "laravel"
    }

    if (activatedRoute.endpoint == 'services/vendor/v1/product/get') {
      activatedRoute.requestcondition.product_code = params.product_code;
    }

    if (activatedRoute.endpoint == 'services/vendor/v1/policy/other/list') {
      activatedRoute.requestcondition.vendor.email = loginUserData.data.user.email;
    }


    if(flag == "spring") {
      return new Promise((resolve) => {
        var data: any = activatedRoute.requestcondition;

        this.apiService.httpViaPost(activatedRoute.endpoint, data).subscribe(response => {
          if (response) {
            return resolve(response);
          } else {
            return true;
          }
        });
      });
    } else {
      return new Promise((resolve) => {
        var data: any = activatedRoute.requestcondition;
  
        this.apiService.httpViaPostLaravel(activatedRoute.endpoint, data).subscribe(response => {
          if (response) {
            return resolve(response);
          } else {
            return true;
          }
        });
      });
    }
  }

}
