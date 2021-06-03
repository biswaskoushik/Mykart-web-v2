import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';

import swal from 'sweetalert';

/* Api Service */
import { ApiService } from '../../core/service/api.service';

/* Common Function */
import { CommonFunction } from '../../core/class/common-function';

import { timer, Subscription } from 'rxjs';

import { Constants } from '../../core/util/Constants';
import { Delete } from '@material-ui/icons';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  old_password: string = "";
  new_password: string = "";
  confirm_password: string = "";

  isStatusLoading;
  isNotificationLoading;
  isLoading: boolean = false;

  setting: any = {
    is_offline: false,
    is_notification: false
  };

  public environment: any = environment;
  public changePassordForm: any;
  public userLoginData: any;

  constructor(public apiService: ApiService, public formBuilder: FormBuilder, public commonFunction: CommonFunction, public router: Router) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.changePassordForm = FormGroup;
    this.generateForm();
  }

  generateForm() {
    var validateRule: any = {
      old_password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]],
      new_password: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(6)]]
    };
    var passwordRule: any = { validators: this.matchpassword('new_password', 'confirm_password') };

    this.changePassordForm = this.formBuilder.group(validateRule, passwordRule);
  }

  matchpassword(passwordkye: string, confirmpasswordkye: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordkye],
        confirmpasswordInput = group.controls[confirmpasswordkye];
      if (passwordInput.value !== confirmpasswordInput.value) {
        return confirmpasswordInput.setErrors({ notEquivalent: true });
      } else {
        return confirmpasswordInput.setErrors(null);
      }
    };
  }

  changePassword() {
    for (let x in this.changePassordForm.controls) {
      this.changePassordForm.controls[x].markAsTouched();
    }

    if (this.changePassordForm.valid) {

      this.commonFunction.loader(true);
      this.changePassordForm.value.is_vendor = true,

      delete this.changePassordForm.value.confirm_password;

      this.apiService.httpViaPost("services/user/v1/password/change", this.changePassordForm.value).subscribe((next: any) => {
        this.commonFunction.loader(false);

        if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_message == 'SUCCESS') {
          this.changePassordForm.reset();
          swal("Thank You!", 'You’ve successfully changed password.', "success");

          for (let x in this.changePassordForm.controls) {
            this.changePassordForm.controls[x].markAsUntouched();
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

  setNotification() {
    this.commonFunction.loader(true);
    this.setting.is_notification = !this.setting.is_notification;
    
    this.apiService.httpViaPost("services/user/v1/notification/status/update", { status: this.setting.is_notification }).subscribe((next: any) => {
      this.commonFunction.loader(false);
      if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_message == 'SUCCESS') {
        swal("Thank You!", 'You’ve successfully updated setting.', "success");

      } else {
        if (next.response.fault != null && typeof (next.response.fault) != 'undefined') {
          swal("Sorry!", next.response.fault.fault_message, "warning");

        } else {
          swal("Sorry!", 'Somethings went wrong!', "warning");
        }
      }
    })
  }


  setStatus() {
    this.commonFunction.loader(true);
    this.setting.is_offline = !this.setting.is_offline;
    this.apiService.httpViaPost("services/vendor/v1/offline/status/update", { status: this.setting.is_offline }).subscribe((next: any) => {
      this.commonFunction.loader(false);
      if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_message == 'SUCCESS') {
        swal("Thank You!", 'You’ve successfully updated setting.', "success");

      } else {
        if (next.response.fault != null && typeof (next.response.fault) != 'undefined') {
          swal("Sorry!", next.response.fault.fault_message, "warning");

        } else {
          swal("Sorry!", 'Somethings went wrong!', "warning");
        }
      }
    })
  }

}
