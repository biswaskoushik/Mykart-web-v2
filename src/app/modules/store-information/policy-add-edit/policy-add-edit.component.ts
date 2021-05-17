import { Component, OnInit } from '@angular/core';
import { CommonFunction } from '../../../core/class/common-function';
import { ActivatedRoute, Router } from '@angular/router';


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


  constructor(public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (this.activatedRoute.snapshot.params.type) {
      case 'shipping':
        this.data.header = 'Shipping & handling';
        this.data.flag = 'shipping';
        break;
      case 'return':
        this.data.header = 'Return Policy';
        this.data.flag = 'return';
        break;
      case 'contact':
        this.data.header = 'Contact Us';
        this.data.flag = 'contact';
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

  updateDialogData(flag) {
    if (flag == 'shipping') {
      // this.dialogRef.close(this.shippingCarriers);
    }

    if (flag == 'return') {
      // this.dialogRef.close(this.returnPolicy);
    }

    if (flag == 'contact') {
      // this.dialogRef.close(this.contactUs);
    }

    if (flag == 'custom') {
      let isValid = this.customPolicyValidation();
      //console.log(isValid, 'isValid')
      if (isValid) {
        // this.dialogRef.close(this.customPolicy);
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
