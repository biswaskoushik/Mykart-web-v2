import { Component, OnInit } from '@angular/core';

/* Common Function */
import { CommonFunction } from '../../../../core/class/common-function';

import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../core/service/api.service';



@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})


export class LeftMenuComponent implements OnInit {

  public loginData: any = {};
  public environment: any = environment;
  public step_flag: boolean = true;
  public prodNotification: boolean = true ;
  public productList :any= [];
  public categoryList:any=[];

  constructor(public commonFunction: CommonFunction, public activatedRoute: ActivatedRoute, public router: Router,public apiService:ApiService) { }

  ngOnInit(): void {
    let loginData: any = this.commonFunction.getLoginData();
    if (loginData.status == true) {
      this.loginData = loginData.data;

    }

    console.log(this.loginData,'+++>>>>>>>>>>>>>>>> this.loginData')

    if (localStorage.getItem('step_stripe') != null &&
      localStorage.getItem('step_creadit_card_details') != null) {
      //console.log(this.step_flag, '+==============')

      let step_stripe: any = localStorage.getItem('step_stripe');
      let step_creadit_card_details: any = localStorage.getItem('step_creadit_card_details');

      if (step_stripe == 0 && step_creadit_card_details == 0) {
        this.step_flag = false;
      }
    }

    this.apiService.httpViaPostLaravel('services/user/v1/get-onboarding', { vendor_id: this.loginData.user.id }).subscribe((next) => {
      if(next.data.step_stripe == 0 && next.data.step_creadit_card_details == 0) {
        this.step_flag = false;
      } else {
        this.step_flag = true;
      }
    })
    this.getCategoryList();
  }

  getCategoryList() {
    let vendor_data: any = 
      {"source":"","Vendor_detail":{"email": this.loginData.user.email}}
  
    this.apiService.httpViaPost('services/vendor/v1/category/list', vendor_data).subscribe((next) => {
        this.categoryList = next.response.category;
        if (this.categoryList.length > 0) {
          this.getProductList(this.categoryList[0])
        }
    })
  }

  getProductList(value) {
    let vendor_data: any = {
      category_code: value.code,
      email: this.loginData.user.email
    }
    this.apiService.httpViaPostLaravel('product/v1/get/by-category', vendor_data).subscribe((next) => {
      if (next != null && next.status_code == 200) {
        this.productList = next.data.product;
        if(this.productList.length>0){
          this.prodNotification = false;
        }
      }
    })
  }

  componentToStripe() {
    window.open(environment['CONNECT_TO_STRIPE'] + this.loginData.user.id, '_blank');
  }

  close() {
    this.prodNotification = ! this.prodNotification;
  }

  stripeDashboard() {
    let j = confirm("Do you want to redirect to Stripe dashboard ?");
    if(j) {
      window.open("http://18.222.168.203/api-mykart/stripe/onboarding/get-dashboard-link/" + this.loginData.user.id, '_blank');
    }
  }

  // logout() {
  //   var config: any = {
  //     "title": "Do you want to logout ?",
  //     "buttons": ["No", "Yes"]
  //   };
  //   this.commonFunction.confirmBox(config).then((action) => {
  //     if (action == true) {
  //       this.commonFunction.destroyLoginData();
  //       setTimeout(() => {
  //         location.reload();
  //       }, 100);
  //     }
  //   });
  // }

}
