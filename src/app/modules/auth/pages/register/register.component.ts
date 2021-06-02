import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import swal from 'sweetalert';

/* Api Service */
import { ApiService } from '../../../../core/service/api.service';

/* environment */
import { environment } from '../../../../../environments/environment';

/* Common Function */
import { CommonFunction } from '../../../../core/class/common-function';

import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  public environment: any = environment;
  public registerForm: any;

  constructor(public apiService: ApiService, public formBuilder: FormBuilder, public commonFunction: CommonFunction, public router: Router) { }

  ngOnInit(): void {
    this.registerForm = FormGroup;
    this.generateRegisterForm();
  }

  generateRegisterForm() {
    var validateRule: any = {
      // firstname: ['', [Validators.required, Validators.maxLength(50)]],
      // lastname: ['', [Validators.required, Validators.maxLength(50)]],
      business_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      password: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(6)]],
      confirmpassword: ['', [Validators.required]]
    };
    var passwordRule: any = { validators: this.matchpassword('password', 'confirmpassword') };
    this.registerForm = this.formBuilder.group(validateRule, passwordRule);
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

  inputUntouch(form: any, val: any) {
    form.controls[val].markAsUntouched();
  }

  registerFormSubmit() {
    for (let x in this.registerForm.controls) {
      this.registerForm.controls[x].markAsTouched();
    }

    if (this.registerForm.valid) {
      this.commonFunction.loader(true);

      this.registerForm.value.email = this.registerForm.value.email.toLowerCase();

      localStorage.setItem('uuid', 'web-' + this.registerForm.value.email);
      this.registerForm.value.is_vendor_login = true,

        this.apiService.signup("user/v1/signup", { user: this.registerForm.value },
          'web-' + this.registerForm.value.email).subscribe((next: any) => {
            this.commonFunction.loader(false);
            //console.log(next, 'next++ sign up')
            if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_message == 'SUCCESS') {
              this.registerForm.reset();
              swal("Thank You!", 'Check your Inbox Verify email to finish signing up.', "success");
              setTimeout(() => {
                this.router.navigate(['/auth/login']);
              }, 2000);
              for (let x in this.registerForm.controls) {
                this.registerForm.controls[x].markAsUntouched();
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
