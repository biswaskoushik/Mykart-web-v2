import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { CommonFunction } from '../class/common-function';
// import {MatSnackBar} from '@angular/material';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  public apiBaseUrl: string = environment.API_URL;
  public apiBaseUrlLaravel:string = environment.API_URL_LARAVEL;

  public token: any = '';
  public uuid: any = ''

  constructor(private router: Router, private commonFunction: CommonFunction, private http: HttpClient, public CookieService: CookieService,
    // public _snackBar: MatSnackBar
  ) {

    // this.token = localStorage.getItem("token");
    this.uuid = localStorage.getItem("uuid");
  }

  /* call api via post method */
  login(endpoint: any, jsonData: any, user_id): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'uuid': user_id
      })
    };
    return this.http.post(this.apiBaseUrl + endpoint, jsonData, httpOptions).pipe(map(res => res));
  }

  /* call api via post method */
  forgotPassword(endpoint: any, jsonData: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'uuid': this.uuid
      })
    };
    return this.http.post(this.apiBaseUrl + endpoint, jsonData, httpOptions).pipe(map(res => res));
  }

  /* call api via post method */
  signup(endpoint: any, jsonData: any, uuid): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'uuid': uuid
      })
    };
    return this.http.post(this.apiBaseUrl + endpoint, jsonData, httpOptions).pipe(map(res => res));
  }

  /* call api via get method */
  httpViaGet(endpoint: any, jsonData: any): Observable<any> {
    return this.http.get(this.apiBaseUrl + endpoint, jsonData);
  }

  /* call api via post method */
  httpViaPost(endpoint: any, jsonData: any, login = true): Observable<any> {
    let loginUserData: any = this.commonFunction.getLoginData();
    /* set common header */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'access_token': loginUserData.data.access_token,
        'uuid': this.uuid
      })
    };
    return this.http.post(this.apiBaseUrl + endpoint, jsonData, httpOptions).pipe(map(res => res));
  }

  /* call api via post method */
  updateProfile(data: FormData): Observable<any> {
    let loginUserData: any = this.commonFunction.getLoginData();
    // console.log(loginUserData,'loginUserData++')
    /* set common header */
    const httpOptions = {
      headers: new HttpHeaders({
        'access_token': loginUserData.data.access_token,
        'uuid': this.uuid
      })
    };
    return this.http.post(this.apiBaseUrlLaravel + 'services/user/v1/profile/update', data, httpOptions).pipe(map(res => res));
  }


  getJsonObject(path: any) {
    var result = this.http.get(path).pipe(map(res => res));
    return result;
  }

  saveProduct(data: FormData) {
    let loginUserData: any = this.commonFunction.getLoginData();
    /* set common header */
    const httpOptions = {
      headers: new HttpHeaders({
        'access_token': loginUserData.data.access_token,
        'uuid': this.uuid
      })
    };
    return this.http.post(this.apiBaseUrl + 'services/vendor/v1/product/update', data, httpOptions).pipe(map(res => res));
  }

  /* call api via post method */
  onBoardingSteps(endpoint: any, jsonData: any, uuid): Observable<any> {
    let loginUserData: any = this.commonFunction.getLoginData();
    /* set common header */
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'access_token': loginUserData.data.access_token,
        'uuid': uuid
      })
    };
    return this.http.post(this.apiBaseUrl + endpoint, jsonData, httpOptions).pipe(map(res => res));
  }


  /* call api via get method */
  getShipCarrierData(endpoint: any): Observable<any> {
    let api_url = 'http://18.222.168.203:8080/mykartapp-kian/';
    let loginUserData: any = this.commonFunction.getLoginData();
    const httpOptions = {
      headers: new HttpHeaders({
        'access_token': loginUserData.data.access_token,
        'uuid': this.uuid
      })
    };
    return this.http.get(api_url + endpoint, httpOptions);
  }


  // ******************************API_URL_LARAVEL************************ //
  
    /* call api via post method */
    httpViaPostLaravel(endpoint: any, jsonData: any): Observable<any> {
      let loginUserData: any = this.commonFunction.getLoginData();
      /* set common header */
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          'access_token': loginUserData.data.access_token,
          'uuid': this.uuid
        })
      };
      return this.http.post(this.apiBaseUrlLaravel + endpoint, jsonData, httpOptions).pipe(map(res => res));
    }

}
