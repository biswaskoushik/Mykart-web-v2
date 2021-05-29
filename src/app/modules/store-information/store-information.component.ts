import { Component, OnInit } from '@angular/core';
import { CustomerPolicyComponent } from './customer-policy/customer-policy.component'
import { MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/service/api.service';

import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import swal from 'sweetalert';

/* environment */
import { environment } from '../../../environments/environment';

/* Common Function */
import { CommonFunction } from '../../core/class/common-function';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-store-information',
  templateUrl: './store-information.component.html',
  styleUrls: ['./store-information.component.css']
})
export class StoreInformationComponent implements OnInit {
  isLoading = false;

  new_terms_condition = {
    title: "",
    detail: "",
    web_url: "",
    type: "",
    shipping_carrier: "",
  };

  customPolicyData: Array<any> = [];

  vendor_policy_custom: "";
  vendor_static_terms = {
    title: "",
    detail: "",
    type: "",
    shipping_carrier: "",
  };
  public policy_details: any = {};
  public carriersData: any = [];
  public contactUsData: any = [];
  public loginData: any;
  public orderMessage: any = '';
  public orderMsgStatus: any = '';
  public timer: any = null;

  constructor(public dialog: MatDialog, public apiService: ApiService, public commonFunction: CommonFunction, public activatedRoute: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {

    this.activatedRoute.data.forEach(resp => {
      if (resp.otherPolicyData.response)
        this.customPolicyData = resp.otherPolicyData.response.vendor_policy_other;
    })

    window.scrollTo({ top: 0, behavior: 'smooth' });
    // this.getPolicyDetails();
    // this.getShippingCarrierData()

    this.loginData = this.commonFunction.getLoginData();

    this.getOrderMsg();
  }

  openPage(text, flag) {
    this.router.navigate(['/seller/store-information/edit/' + flag])
  }

  AddCustomPolicy(text, flag) {
    this.router.navigate(['/seller/store-information/add/' + flag])
  }

  editCustomPolicy(text, flag, data, i) {
    this.router.navigate(['/seller/store-information/edit/' + flag + '/' + data.code])
  }

  updateShippingCarrierReturn(result) {
    this.commonFunction.loader(true);
    this.apiService.httpViaPost("services/vendor/v1/policy/details/update", result).subscribe((next: any) => {
      this.commonFunction.loader(false);
      if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_code == 200) {
        swal("Thank You!", 'Policies update successfully', "success");
        this.getPolicyDetails()
      } else {
        swal("Sorry!", 'Somethings went wrong!', "warning");
      }
    });
  }

  updateCustomPolicy(result) {
    if (result.code == null || result.code == '') {
      delete result.code;
    }
    this.commonFunction.loader(true);
    this.apiService.httpViaPost("services/vendor/v1/policy/custom/update",
      {
        vendor_policy_custom: result
      }).subscribe((next: any) => {
        this.commonFunction.loader(false);
        if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_code == 200) {
          swal("Thank You!", 'Policies update successfully', "success");
          this.getPolicyDetails();
          this.getCustomPolicyDetails();
          // this.customPolicyData.push(result);
        } else {
          swal("Sorry!", 'Somethings went wrong!', "warning");
        }
      });
  }

  saveTermsCondition() {
  }


  deleteCustomPolicy(value, i) {
    var config: any = {
      "title": "Do you want to delete Policy?",
      "buttons": ["No", "Yes"]
    };
    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        this.commonFunction.loader(true);
        this.customPolicyData.splice(i, 1);
        this.apiService
          .httpViaPost('services/vendor/v1/policy/other/delete', { policy_code: value.code })
          .subscribe((next) => {
            this.commonFunction.loader(false);
            if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_code == 200) {
              swal("Thank You!", 'Policies delete successfully', "success");
              this.getPolicyDetails()
            } else {
              swal("Sorry!", 'Somethings went wrong!', "warning");
            }
          })
      }
    })
  }

  getPolicyDetails() {
    this.apiService.httpViaPost('services/vendor/v1/policy/details/get', {}).subscribe(next => {
      this.policy_details = next.response.policy_details;
    })
  }

  getCustomPolicyDetails() {
    this.apiService.httpViaPost('services/vendor/v1/policy/other/list',
      { "vendor": { "email": this.loginData.data.user.email } }).subscribe(next => {
        this.customPolicyData = next.response.vendor_policy_other;
      })
  }

  getShippingCarrierData() {
    // this.apiService.getShipCarrierData('services/vendor/v1/shipengine/carriers').subscribe((next: any) => {
    //   this.carriersData = next.carriers;
    //   //console.log(next, 'next++++', this.carriersData)
    // })
    this.apiService.getJsonObject('assets/data/carriers.json').subscribe((next: any) => {
      //console.log(next, 'next++++')
      this.carriersData = next.carriers;
    })
  }

  updateContactUs(result) {
    this.commonFunction.loader(true);
    this.apiService.httpViaPost("services/vendor/v1/policy/contactus/update", { vendor_policy_contactus: result }).subscribe((next: any) => {
      this.commonFunction.loader(false);
      if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_code == 200) {
        swal("Thank You!", 'Contact update successfully', "success");
      } else {
        swal("Sorry!", 'Somethings went wrong!', "warning");
      }
    });
  }

  getContactUsData() {
    this.apiService.httpViaPost('services/vendor/v1/policy/contactus/get',
      {
        "vendor": {
          "email": this.loginData.data.user.email
        }
      }).subscribe((next: any) => {
        this.contactUsData = next;
      })
  }

  updateOrderMsg(event) {
    this.orderMsgStatus = 'Typing...';

    clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.orderMsgStatus = 'Saving...';

      this.apiService.httpViaPostLaravel('services/user/v1/profile/update/order-message',
        {
          "email": this.loginData.data.user.email,
          "orderMsg": event.target.value
        }).subscribe((next: any) => {
          this.orderMsgStatus = 'Saved.';

          if (next != null && typeof (next.status_code) != 'undefined' && next.status_code == 200) {
            if (next.status == true) {
              this.orderMessage = event.target.value;
            } else {
              this.orderMessage = 'Thank you for your order!';
            }
          }

          setTimeout(() => {
            this.orderMsgStatus = '';
          }, 1500);
        })
    }, 1000);
  }

  getOrderMsg() {
    this.apiService.httpViaPostLaravel('services/user/v1/profile/get/order-message',
      {
        "email": this.loginData.data.user.email
      }).subscribe((next: any) => {
        if (next != null && typeof (next.status_code) != 'undefined' && next.status_code == 200) {
          if (next.data.order_msg != null) {
            this.orderMessage = next.data.order_msg;
          } else {
            this.orderMessage = 'Thank you for your order!';
          }
        }
      })
  }
}
