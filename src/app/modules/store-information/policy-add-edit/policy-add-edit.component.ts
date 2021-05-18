import { Component, OnInit } from '@angular/core';
import { CommonFunction } from '../../../core/class/common-function';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/service/api.service';
import swal from 'sweetalert';


@Component({
  selector: 'app-policy-add-edit',
  templateUrl: './policy-add-edit.component.html',
  styleUrls: ['./policy-add-edit.component.css']
})
export class PolicyAddEditComponent implements OnInit {

  public data: any = {
    header: '',
    flag: ''
  }

  public loginData: any;
  public serviceData: any = [];
  public carriersData: any = [];
  public returnPolicyData: any = [
    { "text": "15 days after delivery", "value": "15" },
    { "text": "30 days after delivery", "value": "30" },
    { "text": "50 days after delivery", "value": "50" },
    { "text": "60 days after delivery", "value": "60" },
    { "text": "90 days after delivery", "value": "90" }
  ];

  public shippingCarriers: any = {
    carrier_service: '',
    shipping_carrier: '',
    handling_time: 1,
    id: 0,
    shipping_additional_info: '',
    shipping_additional_details: '',
    vendor_id: 0
  }

  public returnPolicy: any = {
    accepting_returns: true,
    processing_time: 1,
    id: 0,
    return_additional_info: '',
    return_additional_details: '',
    vendor_id: 0,
    return_window: '15'
  }

  public contactUs: any = {
    email: '',
    address: '',
    phone_number: '',
    code: '',
    id: 0,
    vendor_id: 0
  }

  public customPolicy: any = {
    title: '',
    detail: '',
    code: '',
    type: 'Other'
  }

  public customPolicyErr: any = {
    titleerr: '',
    detailerr: ''
  }

  public policy_details: any = {};
  public contactUsData: any = [];
  customPolicyData: Array<any> = [];

  constructor(public activatedRoute: ActivatedRoute, public apiService: ApiService, public commonFunction: CommonFunction, public router: Router) { }

  ngOnInit(): void {
    this.loginData = this.commonFunction.getLoginData();

    console.log(this.loginData, ' this.loginData')
    this.getPolicyDetails();

    this.getCustomPolicyDetails();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (this.activatedRoute.snapshot.params.type) {
      case 'shipping':
        this.data.header = 'Shipping & handling';
        this.data.flag = 'shipping';

        this.getShippingCarrierData();
        break;
      case 'return':
        this.data.header = 'Return Policy';
        this.data.flag = 'return';
        break;
      case 'contact':
        this.data.header = 'Contact Us';
        this.data.flag = 'contact';

        this.contactUs.email = this.loginData.data.user.email;
        this.contactUs.address = this.loginData.data.user.address;
        this.contactUs.vendor_id = this.loginData.data.user.id;

        break;
      case 'custom':
        this.data.header = 'New Policy';
        this.data.flag = 'custom';
        break;
    }
  }


  getServiceData(value) {
    for (let i in this.carriersData) {
      if (this.carriersData[i].friendly_name == value) {
        this.serviceData = this.carriersData[i].services;
      }
    }
  }


  // decrement or decrement value for handling time and processing
  decrement(countVal: number, flag) {
    if (countVal <= 1) {
      return;
    }
    ////console.log("decrement===", countVal)
    if (flag == 'handling_time') {
      this.shippingCarriers.handling_time = countVal - 1;
    }
    if (flag == 'processing_time') {
      this.returnPolicy.processing_time = countVal - 1;
    }
  }

  increment(countVal: number, flag) {
    if (countVal >= 3) {
      return
    }

    if (flag == 'handling_time') {
      ////console.log("increment", countVal)
      this.shippingCarriers.handling_time = countVal + 1;
    }
    if (flag == 'processing_time') {
      this.returnPolicy.processing_time = countVal + 1;
    }
  }

  updateData(flag) {
    if (flag == 'shipping') {
      this.updateShippingCarrierReturn(this.shippingCarriers)
    }

    if (flag == 'return') {
      this.updateShippingCarrierReturn(this.returnPolicy)
    }

    if (flag == 'contact') {
      this.updateContactUs(this.contactUs);
    }

    if (flag == 'custom') {
      let isValid = this.customPolicyValidation();
      //console.log(isValid, 'isValid')
      if (isValid) {

        this.updateCustomPolicy(this.customPolicy);

      }
    }
  }

  customPolicyValidation() {
    let isValid = true;

    if (this.customPolicy.title == null || this.customPolicy.title == '') {
      this.customPolicyErr.titleerr = 'Title Required';
      isValid = false;
    }

    if (this.customPolicy.detail == null || this.customPolicy.detail == '') {
      this.customPolicyErr.detailerr = 'Details Required';
      isValid = false;
    }
    return isValid;
  }

  getAcceptValue(value) {
    this.returnPolicy.accepting_returns = value ? false : true;
    // console.log(value, '+++flag', this.returnPolicy.accepting_returns)
    if (this.returnPolicy.accepting_returns == false) {
      this.returnPolicy.return_window = '15';
      this.returnPolicy.processing_time = 1;
    }
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

  getPolicyDetails() {
    this.apiService.httpViaPost('services/vendor/v1/policy/details/get', {}).subscribe(next => {
      this.policy_details = next.response.policy_details;


      if (this.activatedRoute.snapshot.params.type == "shipping") {
        this.shippingCarriers = {
          carrier_service: 'Stamps.com',
          shipping_carrier: this.policy_details.shipping_carrier,
          handling_time: this.policy_details.handling_time,
          id: this.policy_details.id,
          shipping_additional_info: this.policy_details.shipping_additional_info,
          vendor_id: this.policy_details.vendor_id
        }
        this.getServiceData(this.shippingCarriers.carrier_service)
      }

      if (this.activatedRoute.snapshot.params.type == "return") {
        this.returnPolicy = {
          accepting_returns: this.policy_details.accepting_returns,
          processing_time: this.policy_details.processing_time,
          id: this.policy_details.id,
          return_additional_info: this.policy_details.return_additional_info,
          return_additional_details: '',
          vendor_id: this.policy_details.vendor_id,
          return_window: this.policy_details.return_window
        }
      }

    })
  }

  getCustomPolicyDetails() {
    this.apiService.httpViaPost('services/vendor/v1/policy/other/list',
      { "vendor": { "email": this.loginData.data.user.email } }).subscribe(next => {
        this.customPolicyData = next.response.vendor_policy_other;


        if (this.activatedRoute.snapshot.params.code != null && this.activatedRoute.snapshot.params.code != '') {

          for (let i in this.customPolicyData) {
            if (this.customPolicyData[i].code == this.activatedRoute.snapshot.params.code) {
              this.customPolicy = {
                title: this.customPolicyData[i].title,
                detail: this.customPolicyData[i].detail,
                code: this.customPolicyData[i].code,
                type: 'Other'
              }
            }
          }

        }
      })
  }


  updateShippingCarrierReturn(result) {
    this.commonFunction.loader(true);
    this.apiService.httpViaPost("services/vendor/v1/policy/details/update", result).subscribe((next: any) => {
      this.commonFunction.loader(false);
      if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_code == 200) {
        swal("Thank You!", 'Policies update successfully', "success");
        setTimeout(() => {
          this.router.navigateByUrl('/seller/store-information')
        }, 1000);
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
          setTimeout(() => {
            this.router.navigateByUrl('/seller/store-information')
          }, 1000);
        } else {
          swal("Sorry!", 'Somethings went wrong!', "warning");
        }
      });
  }

  updateContactUs(result) {
    this.commonFunction.loader(true);
    this.apiService.httpViaPost("services/vendor/v1/policy/contactus/update", { vendor_policy_contactus: result }).subscribe((next: any) => {
      this.commonFunction.loader(false);
      if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_code == 200) {
        swal("Thank You!", 'Contact update successfully', "success");
        setTimeout(() => {
          this.router.navigateByUrl('/seller/store-information')
        }, 1000);
      } else {
        swal("Sorry!", 'Somethings went wrong!', "warning");
      }
    });
  }

}
