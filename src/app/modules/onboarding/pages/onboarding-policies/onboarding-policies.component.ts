import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import swal from 'sweetalert';

/* Api Service */
import { ApiService } from '../../../../core/service/api.service';

/* environment */
import { environment } from '../../../../../environments/environment';

/* Common Function */
import { CommonFunction } from '../../../../core/class/common-function';

import { Router } from '@angular/router';

import * as zipcode from 'zipcodes';

import { StateTaxes } from '../../../../core/data/stateTaxes.model';

import { StaticDataSource } from '../../../../core/data/staticDataSource';

@Component({
  selector: 'app-onboarding-policies',
  templateUrl: './onboarding-policies.component.html',
  styleUrls: ['./onboarding-policies.component.css']
})
export class OnboardingPoliciesComponent implements OnInit {

  countVal = 1;
  public SubmitPoliciesFlag: boolean = true;
  public carriersData: any = [];
  public serviceData: any = [];
  public policiesForm: any;
  public isChecked: boolean = true;
  public disable_return_policies: boolean = false;

  public returnPolicy: any = [
    { "text": "15 days after delivery", "value": "15" },
    { "text": "30 days after delivery", "value": "30" },
    { "text": "50 days after delivery", "value": "50" },
    { "text": "60 days after delivery", "value": "60" },
    { "text": "90 days after delivery", "value": "90" }
  ];

  @Output() policiesListener = new EventEmitter<any>();

  constructor(public apiService: ApiService, public formBuilder: FormBuilder, public commonFunction: CommonFunction) { }


  ngOnInit(): void {
    this.getCarrierData();
    this.generatePoliciesForm();
  }

  generatePoliciesForm() {
    var validateRule: any = {
      carrier_service: ['', Validators.required],
      shipping_carrier: ['', Validators.required],
      accepting_returns: [true],
      // custom_return_address: [''],
      handling_time: [1],
      id: [0],
      // is_custom_return_address: [true],
      processing_time: [1],
      // return_additional_info: [''],
      return_window: ['15'],
      // shipping_additional_info: [''],
      vendor_id: [0]
    };
    this.policiesForm = this.formBuilder.group(validateRule);
  }

  // decrement or decrement value for handling time and processing
  decrement(countVal: number, flag) {
    if (countVal <= 1) {
      return;
    }
    //console.log("decrement===", countVal)
    if (flag == 'handling_time') {
      this.policiesForm.controls['handling_time'].value = countVal - 1;
      this.policiesForm.controls['handling_time'].setValue(this.policiesForm.controls['handling_time'].value);
    }
    if (flag == 'processing_time') {
      this.policiesForm.controls['processing_time'].value = countVal - 1;
      this.policiesForm.controls['processing_time'].setValue(this.policiesForm.controls['processing_time'].value);
    }

  }

  increment(countVal: number, flag) {
    if (countVal >= 3) {
      return
    }

    if (flag == 'handling_time') {
      //console.log("increment", countVal)
      this.policiesForm.controls['handling_time'].value = countVal + 1;
      this.policiesForm.controls['handling_time'].setValue(this.policiesForm.controls['handling_time'].value);
    }
    if (flag == 'processing_time') {
      this.policiesForm.controls['processing_time'].value = countVal + 1;
      this.policiesForm.controls['processing_time'].setValue(this.policiesForm.controls['processing_time'].value);
    }

  }

  // skip Submit Policies
  // skipSubmitPolicies() {
  //   this.SubmitPoliciesFlag = false;
  //   //console.log(this.SubmitPoliciesFlag, 'SubmitPoliciesFlag')
  //   this.policiesListener.emit({ action: 'policies', flag: 'update-policies', SubmitPoliciesFlag: this.SubmitPoliciesFlag, value: 0 })
  // }

  // getCarrierData() {
  //   this.apiService.getJsonObject('assets/data/carriers.json').subscribe((next: any) => {
  //     //console.log(next, 'next++++')
  //     this.carriersData = next.carriers;
  //   })
  // }


  getServiceData(value) {
    for (let i in this.carriersData) {
      if (this.carriersData[i].friendly_name == value) {
        this.serviceData = this.carriersData[i].services;
      }
    }
  }

  submitPolicies() {
    for (let x in this.policiesForm.controls) {
      this.policiesForm.controls[x].markAsTouched();
    }
    if (this.policiesForm.valid) {
      this.commonFunction.loader(true);

      //console.log(this.policiesForm.value)

      this.apiService.httpViaPost("services/vendor/v1/policy/details/update", this.policiesForm.value).subscribe((next: any) => {
        this.commonFunction.loader(false);

        //console.log(next, 'next++ sign up')

        if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_message == 'SUCCESS') {
          this.policiesForm.reset();
          swal("Thank You!", 'You’ve successfully Added Policies.', "success");

          this.SubmitPoliciesFlag = false;
          this.policiesListener.emit({ action: 'policies', flag: 'update-policies', policiesFormFlag: this.SubmitPoliciesFlag, value: 1 })

          for (let x in this.policiesForm.controls) {
            this.policiesForm.controls[x].markAsUntouched();
          }
        } else {
          if (next.response.fault != null && typeof (next.response.fault) != 'undefined') {
            swal("Sorry!", next.response.fault.fault_message, "warning");

          } else {
            swal("Sorry!", 'Somethings went wrong!', "warning");
          }
        }
      });
    }
  }

  getAcceptValue(value) {
    this.policiesForm.controls['accepting_returns'].setValue(value);
    if (value == false) {
      this.disable_return_policies = false;
      this.policiesForm.controls['return_window'].setValue('15');
      this.policiesForm.controls['processing_time'].setValue(1);
    } else {
      this.disable_return_policies = true;
      this.policiesForm.controls['processing_time'].setValue(0);
      this.policiesForm.controls['return_window'].setValue('');
    }
    //console.log(value, '=++++++++++', this.policiesForm.controls['accepting_returns'].value)
  }

  // getCarrierData() {
  //   this.apiService.getShipCarrierData('services/vendor/v1/shipengine/carriers').subscribe((next: any) => {
  //     this.carriersData = next.carriers;
  //     console.log(next, 'next++++', this.carriersData)
  //   })
  // }

  getCarrierData() {
    this.apiService.getJsonObject('assets/data/carriers.json').subscribe((next: any) => {
      //console.log(next, 'next++++')
      this.carriersData = next.carriers;
    })
  }
  

}
