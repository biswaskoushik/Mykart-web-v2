import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';

import swal from 'sweetalert';

/* Api Service */
import { ApiService } from '../../../../core/service/api.service';

/* environment */
import { environment } from '../../../../../environments/environment';

/* Common Function */
import { CommonFunction } from '../../../../core/class/common-function';

import { timer, Subscription } from 'rxjs';

import { Constants } from '../../../../core/util/Constants';


declare var $: any;
declare var FB: any;
declare var gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public environment: any = environment;
  public loginForm: any;
  public userLoginData: any;

  public onBoarding: any = {
    "step_profile": 2,
    "step_policy": 2,
    "step_creadit_card_details": 2,
    "step_stripe": 2
  };

  profileFormFlag: boolean = true;
  policiesFormFlag: boolean = true;
  stripFormFlag: boolean = true;
  ActiveFormFlag: boolean = true;

  constructor(public apiService: ApiService, public router: Router, public formBuilder: FormBuilder, public commonFunction: CommonFunction) { }

  ngOnInit(): void {

    var loginData: any = this.commonFunction.getLoginData();
    if (loginData.status == true) {
      this.router.navigate(['seller/onboarding']);
    }
    this.loginForm = FormGroup;
    this.generateLoginForm();
  }

  generateLoginForm() {
    var validateRule: any = {
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(6)]]
    };
    this.loginForm = this.formBuilder.group(validateRule);
  }

  inputUntouch(form: any, val: any) {
    form.controls[val].markAsUntouched();
  }

  loginFormSubmit() {
    for (let x in this.loginForm.controls) {
      this.loginForm.controls[x].markAsTouched();
    }

    if (this.loginForm.valid) {
      this.commonFunction.loader(true);
      if (this.loginForm.valid) {

        this.loginForm.value.email = this.loginForm.value.email.toLowerCase();
        

        localStorage.setItem('uuid', 'web-' + this.loginForm.value.email);
        this.loginForm.value.is_vendor_login = true,
          this.loginForm.value.device_os_type = Constants.DEVICE_OS_TYPE

        this.apiService.login("user/v1/login", this.loginForm.value, localStorage.getItem('uuid')).subscribe((next: any) => {
          this.commonFunction.loader(false);

          if (next.response != null && typeof (next.response.access_token) != 'undefined') {
            if(next.response.is_email_verified == true){
            this.loginForm.reset();
            for (let x in this.loginForm.controls) {
              this.loginForm.controls[x].markAsUntouched();
            }
            this.userLoginData = next.response;
            this.commonFunction.setLoginData(this.userLoginData);
            localStorage.setItem('uuid', 'web-' + this.userLoginData.user.email);

            if (this.userLoginData.user.image_url != null && typeof (this.userLoginData.user.image_url) != 'undefined' && this.userLoginData.user.image_url != '') {
              localStorage.setItem('image_url', this.userLoginData.user.image_url);
            }

            if (this.userLoginData.user.first_name != null && typeof (this.userLoginData.user.first_name) != 'undefined' && this.userLoginData.user.first_name != '') {
              localStorage.setItem('first_name', this.userLoginData.user.first_name);
            }

            if (this.userLoginData.user.last_name != null && typeof (this.userLoginData.user.last_name) != 'undefined' && this.userLoginData.user.last_name != '') {
              localStorage.setItem('last_name', this.userLoginData.user.last_name);
            }
            this.onBoardingSteps();
          }else{
            swal("Sorry!", 'This is inactive user', "warning");
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
  }

  onBoardingSteps() {
    this.commonFunction.loader(true);

    let uuid = 'web-' + this.userLoginData.user.emai;
    this.apiService.onBoardingSteps('services/vendor/v1/appdata/onboarding-steps/get', {}, uuid).subscribe((next: any) => {

      if (next.status != null && next.status.status_code == 200) {
        this.onBoarding.step_profile = next.onboardingStepsDataJson.stepProfile;
        this.onBoarding.step_policy = next.onboardingStepsDataJson.stepPolicy;
        this.onBoarding.step_creadit_card_details = next.onboardingStepsDataJson.stepCreaditCardDetails;
        this.onBoarding.step_stripe = next.onboardingStepsDataJson.stepStripe;

        
        if (this.onBoarding.step_creadit_card_details != null && typeof (this.onBoarding.step_creadit_card_details) != 'undefined' && this.onBoarding.step_creadit_card_details != 2) {
          this.ActiveFormFlag = false;
          localStorage.setItem('step_creadit_card_details', this.onBoarding.step_creadit_card_details);
        }

        if (this.onBoarding.step_policy != null && typeof (this.onBoarding.step_policy) != 'undefined' && this.onBoarding.step_policy != 2) {
          this.policiesFormFlag = false;
          localStorage.setItem('step_policy', this.onBoarding.step_policy);
        }

        if (this.onBoarding.step_profile != null && typeof (this.onBoarding.step_profile) != 'undefined' && this.onBoarding.step_profile != 2) {
          this.profileFormFlag = false;
          localStorage.setItem('step_profile', this.onBoarding.step_profile);
        }

        if (this.onBoarding.step_stripe != null && typeof (this.onBoarding.step_stripe) != 'undefined' && this.onBoarding.step_stripe != 2) {
          this.stripFormFlag = false;
          localStorage.setItem('step_stripe', this.onBoarding.step_stripe);
        }

        if (this.stripFormFlag == false && this.ActiveFormFlag == false && this.profileFormFlag == false && this.policiesFormFlag == false) {
          this.commonFunction.loader(true);
          // this.commonFunction.loader(false);
          this.router.navigateByUrl('seller/dashboard').then(() => {
            window.location.reload();
          });
        } else {
          this.router.navigate(['seller/onboarding']);
        }
      }
    })
  }
}

