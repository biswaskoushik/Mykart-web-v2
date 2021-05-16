import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunction } from '../../../../core/class/common-function';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import swal from 'sweetalert';
import { ApiService } from '../../../../core/service/api.service';
import { LeftMenuComponent } from '../../../../core/layouts/fontend/left-menu/left-menu.component';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.css']
})
export class OnboardingComponent implements OnInit {

  componentActive = false;
  componentProfile = false;
  componentPolicies = false;
  componentStrip = false;

  profileFormFlag: boolean = true;
  policiesFormFlag: boolean = true;
  stripFormFlag: boolean = true;
  ActiveFormFlag: boolean = true;

  profileActiveFlag: boolean = false;
  policiesActiveFlag: boolean = true;
  stripActiveFlag: boolean = true;
  connectActiveFlag: boolean = true;

  dashboard_falg = false;

  public onBoarding: any = {
    "step_profile": 2,
    "step_policy": 2,
    "step_creadit_card_details": 2,
    "step_stripe": 2
  };

  public loginData: any;
  public image_url: any = '';

  constructor(public router: Router, public commonFunction: CommonFunction, public apiService: ApiService, public activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.onboardingStepsCond();
    // this.commonFunction.loader(true);
    this.loginData = this.commonFunction.getLoginData();
    this.image_url = localStorage.getItem('image_url');

    console.log(this.image_url, 'image_url++')

    if (this.router.url == '/seller/onboarding/stripe') {
      this.getConnectStripeData(1);
    }
  }

  openComponents(component: string) {
    switch (component) {
      case 'subscription':
        this.componentActive = true;
        break;
      case 'profile':
        this.componentProfile = true;
        break;
      case 'policies':
        this.componentPolicies = true;
        break;
    }
  }

  // profile Listener from profile component
  profileListener(event: any) {
    //console.log(event, 'event')
    this.updateOnboardingSteps(event);
  }

  // policies Listener from policies component
  policiesListener(event: any) {
    //console.log(event, 'event')
    this.policiesFormFlag = false;
    this.updateOnboardingSteps(event);

  }

  // subscription Listener from subscription component
  subscriptionListener(event) {
    //console.log(event, 'event')
    this.ActiveFormFlag = false;
    this.updateOnboardingSteps(event);
  }

  logout() {
    var config: any = {
      "title": "Do you want to logout ?",
      "buttons": ["No", "Yes"]
    };

    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        this.commonFunction.loader(true);
        this.commonFunction.destroyLoginData();
        window.location.reload();
        // setTimeout(() => {
        //   this.router.navigateByUrl('auth/login').then(() => {
        //     window.location.reload();
        //   });
        // }, 5);
      }
    });
  }

  componentToStripe() {
    window.location.href = environment['CONNECT_TO_STRIPE'] + 17;
  }

  SkipConnectToStripe() {
    this.componentStrip = true;
    this.stripFormFlag = false;
    let connectStripData = { action: 'strip', flag: 'skip-connect', stripFormFlag: this.stripFormFlag, value: 0 }
    this.updateOnboardingSteps(connectStripData);
  }

  onboardingStepsCond() {
    if (localStorage.getItem('step_stripe') != null && typeof (localStorage.getItem('step_stripe')) != 'undefined') {
      this.stripFormFlag = false;
    }

    if (localStorage.getItem('step_creadit_card_details') != null && typeof (localStorage.getItem('step_creadit_card_details')) != 'undefined') {
      this.ActiveFormFlag = false;
    }

    if (localStorage.getItem('step_profile') != null && typeof (localStorage.getItem('step_profile')) != 'undefined') {
      this.profileFormFlag = false;
    }

    if (localStorage.getItem('step_policy') != null && typeof (localStorage.getItem('step_policy')) != 'undefined') {
      this.policiesFormFlag = false;
    }

    if (this.stripFormFlag == false && this.ActiveFormFlag == false && this.profileFormFlag == false && this.policiesFormFlag == false) {
      this.dashboard_falg = true;
      this.commonFunction.loader(true);
      // this.router.navigateByUrl('seller/dashboard').then(() => {
      // window.location.reload();
      // });
    }

    this.apiService.httpViaPost('services/vendor/v1/appdata/onboarding-steps/get', {}).subscribe((next: any) => {

      if (next.status != null && next.status.status_code == 200) {

        this.onBoarding.step_profile = next.onboardingStepsDataJson.stepProfile;
        this.onBoarding.step_policy = next.onboardingStepsDataJson.stepPolicy;
        this.onBoarding.step_creadit_card_details = next.onboardingStepsDataJson.stepCreaditCardDetails;
        this.onBoarding.step_stripe = next.onboardingStepsDataJson.stepStripe;

        //console.log(this.onBoarding, 'this.onBoarding==??')

        if (this.onBoarding.step_creadit_card_details != null && typeof (this.onBoarding.step_creadit_card_details) != 'undefined' && this.onBoarding.step_creadit_card_details != 2) {
          this.ActiveFormFlag = false;
          this.connectActiveFlag = false;
          localStorage.setItem('step_creadit_card_details', this.onBoarding.step_creadit_card_details);
        }

        if (this.onBoarding.step_policy != null && typeof (this.onBoarding.step_policy) != 'undefined' && this.onBoarding.step_policy != 2) {
          this.policiesFormFlag = false;
          this.stripActiveFlag = false;
          localStorage.setItem('step_policy', this.onBoarding.step_policy);
        }

        if (this.onBoarding.step_profile != null && typeof (this.onBoarding.step_profile) != 'undefined' && this.onBoarding.step_profile != 2) {
          this.profileFormFlag = false;
          this.policiesActiveFlag = false;
          localStorage.setItem('step_profile', this.onBoarding.step_profile);
        }

        if (this.onBoarding.step_stripe != null && typeof (this.onBoarding.step_stripe) != 'undefined' && this.onBoarding.step_stripe != 2) {
          this.stripFormFlag = false;
          localStorage.setItem('step_stripe', this.onBoarding.step_stripe);
        }

        if (this.stripFormFlag == false && this.ActiveFormFlag == false && this.profileFormFlag == false && this.policiesFormFlag == false) {
          this.dashboard_falg = true;
          this.commonFunction.loader(true);
          // window.location.reload();
          this.router.navigateByUrl('seller/dashboard').then(() => {
            // /+++++++++++++++++
            window.location.reload();
          });
        }
      }
    })
  }

  updateOnboardingSteps(val) {
    this.commonFunction.loader(true);

    //console.log(val, '>>>>>>>>.???????????')
    // let cond: any = {};
    // cond = this.onBoarding;

    if (val.action != null) {
      switch (val.action) {
        case 'profile':
          this.onBoarding.step_profile = val.value;
          break;
        case 'policies':
          this.onBoarding.step_policy = val.value;
          break;
        case 'subscription':
          this.onBoarding.step_creadit_card_details = val.value;
          break;
        case 'strip':
          this.onBoarding.step_stripe = val.value;
          break;
      }
    }

    this.apiService.httpViaPost('services/vendor/v1/appdata/onboarding-steps/update', this.onBoarding).subscribe((next: any) => {
      this.commonFunction.loader(false);
      // //console.log(cond, 'cond+++')
      if (next.status != null && next.status.status_code == 200) {
        this.onboardingStepsCond();

        switch (val.action) {
          case 'profile':
            this.profileFormFlag = false;
            localStorage.setItem('step_profile', val.value);
            break;
          case 'policies':
            this.policiesFormFlag = false;
            localStorage.setItem('step_policy', val.value);
            break;
          case 'subscription':
            this.ActiveFormFlag = false;
            localStorage.setItem('step_creadit_card_details', val.value);
            break;
          case 'strip':
            this.stripFormFlag = false;
            localStorage.setItem('step_stripe', val.value);
            break;
        }
      } else {
        if (next.response.fault != null && typeof (next.response.fault) != 'undefined') {
          swal("Sorry!", next.response.fault.fault_message, "warning");
        } else {
          swal("Sorry!", 'Somethings went wrong!', "warning");
        }
      }
    })
  }

  getConnectStripeData(value) {
    console.log(value, '+++++++++ val')
    this.apiService.httpViaPost('services/vendor/v1/get-onboarding-data', {}).subscribe((next: any) => {
      // console.log(next, '+++++')
      if (next != null && next.OnboardingDataJson != null && typeof (next.OnboardingDataJson) != 'undefined' && next.OnboardingDataJson.stripeUserId != null && typeof (next.OnboardingDataJson.stripeUserId) != 'undefined' && next.OnboardingDataJson.stripeUserId != '') {
        console.log(next.OnboardingDataJson.stripeUserId, '++===========')
        this.componentStrip = true;
        this.stripFormFlag = false;
        let connectStripData = { action: 'strip', flag: 'skip-connect', stripFormFlag: this.stripFormFlag, value: 1 }
        this.updateOnboardingSteps(connectStripData);
      } else {
        swal("Sorry!", 'Stripe is not connected!', "warning");
      }
    })
  }

}