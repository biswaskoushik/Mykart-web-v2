import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonFunction } from '../../../core/class/common-function';



@Component({
  selector: 'app-customer-policy',
  templateUrl: './customer-policy.component.html',
  styleUrls: ['./customer-policy.component.css']
})
export class CustomerPolicyComponent implements OnInit {
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

  constructor(public dialogRef: MatDialogRef<CustomerPolicyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public commonFunction: CommonFunction) {
    this.loginData = this.commonFunction.getLoginData();

    //console.log(data, 'data++++')

    if (data.flag == "shipping") {
      this.carriersData = data.carriersData;
      this.shippingCarriers = {
        carrier_service: 'Stamps.com',
        shipping_carrier: data.data.shipping_carrier,
        handling_time: data.data.handling_time,
        id: data.data.id,
        shipping_additional_info: data.data.shipping_additional_info,
        vendor_id: data.data.vendor_id
      }
      this.getServiceData(this.shippingCarriers.carrier_service)
    }

    if (data.flag == "return") {
      this.returnPolicy = {
        accepting_returns: data.data.accepting_returns,
        processing_time: data.data.processing_time,
        id: data.data.id,
        return_additional_info: data.data.return_additional_info,
        return_additional_details: '',
        vendor_id: data.data.vendor_id,
        return_window: data.data.return_window
      }
    }

    if (data.flag == 'contact') {
      this.contactUs.email = this.loginData.data.user.email
      this.contactUs.address = this.loginData.data.user.address
    }

    if (data.flag == 'custom') {
      if (data.data != null) {
        this.customPolicy.title = data.data.title;
        this.customPolicy.detail = data.data.detail;
        this.customPolicy.code = data.data.code;
      }
    }

  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeModal() {
    this.dialogRef.close();
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

  updateDialogData(flag) {
    if (flag == 'shipping') {
      this.dialogRef.close(this.shippingCarriers);
    }

    if (flag == 'return') {
      this.dialogRef.close(this.returnPolicy);
    }

    if (flag == 'contact') {
      this.dialogRef.close(this.contactUs);
    }

    if (flag == 'custom') {
      let isValid = this.customPolicyValidation();
      //console.log(isValid, 'isValid')
      if (isValid) {
        this.dialogRef.close(this.customPolicy);
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

}
