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
import { ActivatedRoute,Router } from '@angular/router';

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

  constructor(public dialog: MatDialog, public apiService: ApiService, public commonFunction: CommonFunction, public activatedRoute: ActivatedRoute,public router:Router) { }

  ngOnInit(): void {

    this.activatedRoute.data.forEach(resp => {
      if (resp.otherPolicyData.response)
        this.customPolicyData = resp.otherPolicyData.response.vendor_policy_other;
    })

    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.getPolicyDetails();
    this.getShippingCarrierData()

    this.loginData = this.commonFunction.getLoginData();
  }

  openDialog(text, flag) {

    this.router.navigate(['/seller/store-information/edit/'+flag])

    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // // dialogConfig.width = "62%";
    // dialogConfig.hasBackdrop = true;

    // dialogConfig.data = {
    //   header: text,
    //   flag: flag
    // }

    // if (flag == 'shipping' || flag == 'return') {
    //   dialogConfig.data.carriersData = this.carriersData;
    //   dialogConfig.data.data = this.policy_details;
    // }

    // //console.log(text, '++++++')
    // let dialogRef = this.dialog.open(
    //   CustomerPolicyComponent,
    //   dialogConfig
    // );

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   //console.log(result, 'result+++')
    //   if (result != null && typeof (result) != 'undefined') {

    //     if (flag == 'shipping' || flag == 'return') {
    //       this.updateShippingCarrierReturn(result);
    //     }

    //     if (flag == 'contact') {
    //       this.updateContactUs(result);
    //     }

    //     if (flag == 'custom') {
    //       this.updateCustomPolicy(result)
    //     }
    //   }
    // })
  }

  editCustomPolicy(text, flag, data, i) {
    this.router.navigate(['/seller/store-information/edit/'+flag])

    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;
    // dialogConfig.width = "62%";
    // dialogConfig.hasBackdrop = true;

    // dialogConfig.data = {
    //   header: text,
    //   flag: flag,
    //   data: data
    // }

    // let dialogRef = this.dialog.open(
    //   CustomerPolicyComponent,
    //   dialogConfig
    // );

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   //console.log(result, 'result+++')
    //   if (result != null && typeof (result) != 'undefined') {
    //     if (flag == 'custom') {
    //       this.updateCustomPolicy(result)
    //     }
    //   }
    // })
  }

  updateShippingCarrierReturn(result) {
    this.commonFunction.loader(true);
    this.apiService.httpViaPost("services/vendor/v1/policy/details/update", result).subscribe((next: any) => {
      this.commonFunction.loader(false);
      if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_code == 200) {
        swal("Thank You!", 'Policies ppdate successfully', "success");
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
}
