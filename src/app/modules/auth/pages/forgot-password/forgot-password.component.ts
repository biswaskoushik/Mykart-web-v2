import { environment } from '../../../../../environments/environment';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import swal from 'sweetalert';

/* Api Service */
import { ApiService } from '../../../../core/service/api.service';

/* Common Function */
import { CommonFunction } from '../../../../core/class/common-function';

import { timer, Subscription } from 'rxjs';

import { Constants } from '../../../../core/util/Constants';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public environment: any = environment;
  public forgetPasswordForm: any;

  constructor(public apiService: ApiService, public router: Router, public formBuilder: FormBuilder, public commonFunction: CommonFunction) { }

  ngOnInit(): void {
    this.forgetPasswordForm = FormGroup;
    this.generateforgetPasswordForm();

  }

  generateforgetPasswordForm() {
    var validateRule: any = {
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]]
    };
    this.forgetPasswordForm = this.formBuilder.group(validateRule);
  }
  inputUntouch(form: any, val: any) {
    form.controls[val].markAsUntouched();
  }


  formSubmit() {
    for (let x in this.forgetPasswordForm.controls) {
      this.forgetPasswordForm.controls[x].markAsTouched();
    }

    if (this.forgetPasswordForm.valid) {
      this.commonFunction.loader(true);
      if (this.forgetPasswordForm.valid) {

        localStorage.setItem('uuid', 'web-' + this.forgetPasswordForm.value.email);

        this.forgetPasswordForm.value.is_vendor_login = true,
          this.forgetPasswordForm.value.device_os_type = Constants.DEVICE_OS_TYPE

        this.apiService.forgotPassword("user/v1/password/forgot", this.forgetPasswordForm.value).subscribe((next: any) => {
          this.commonFunction.loader(false);

          if (next.response != null && next.response.status != null && next.response.status.status_code == 200) {
            this.forgetPasswordForm.reset();
            for (let x in this.forgetPasswordForm.controls) {
              this.forgetPasswordForm.controls[x].markAsUntouched();
            }
            swal("Thank You!", 'Email has been sent.Please check mails', "success");
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 2000);
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

}
