import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MetaService } from '@ngx-meta/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    AbstractControl
} from '@angular/forms';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert';

@Injectable()

export class CommonFunction {

    public USER_AUTH = {
        "token": "UgCgBQABSpFcPwPJVgWvNDOgVFGhSyCbQaLQSjHhAlGiYRFqDRJs",
        "isSuperAdmin": "GbSxLXNBHgNhIoMXKfVkBGToHAXkObSaLiEXSiDcSyEcMUJhXQGb",
        "uuid": "TXgNthpAKGsfRlwPjILoghrfbagncrvtBkTXeuYlybOkVmMUXqaSHYsjqilt",
        "loggedInUserData": "TbWVjSRKbSaOafmMOGwVukiFnzfoNIzBrVbIkpHGarCCsAXpxTRfCutVLcOh",
        "last_category" : "bPqtrcSKiTFwVaQLuvhOYDDvJsbpdIeexWZPYSbgnGeijwUDSDTs"
      };

    constructor(private spinner: NgxSpinnerService, public cookie: CookieService, public router: Router, public activeRoute: ActivatedRoute) { }

    setTitleMetaTags(): any {

    }

    titleCase(str: any) {
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
        }
        return splitStr.join(' ');
    }

    randomNumber(length: any): any {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    getYoutubeEmbedUrl(url: any) {
        if (typeof (url) == 'string') {
            var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            var match = url.match(regExp);

            if (match && match[2].length == 11) {
                return { status: true, url: 'https://www.youtube.com/embed/' + match[2] };
            } else {
                return { status: false, url: '' }
            }
        } else {
            return { status: false, url: '' };
        }
    }

    matchpassword(passwordkye: string, confirmpasswordkye: string) {
        return (group: FormGroup) => {
            let passwordInput = group.controls[passwordkye],
                confirmpasswordInput = group.controls[confirmpasswordkye];
            if (passwordInput.value !== confirmpasswordInput.value) {
                return confirmpasswordInput.setErrors({ notEquivalent: true });
            }
            else {
                return confirmpasswordInput.setErrors(null);
            }
        };
    }

    setLoginData(data: any) {
        localStorage.setItem('login_data', JSON.stringify(data));
        return { status: true, data: data };
    }

    getLoginData() {
        var loginData: any = localStorage.getItem('login_data');
        if (typeof loginData != "undefined" && loginData != null) {
            return { status: true, data: JSON.parse(loginData) };
        } else {
            return { status: false, data: {} };
        }
    }

    destroyLoginData() {
        localStorage.removeItem('login_data');
        localStorage.clear();
        return { status: true, data: {} };
    }

    loader(action: any, configData = {}) {
        switch (action) {
            case true:
                this.spinner.show();
                break;
            case false:
                this.spinner.hide();
                break;
        }
    }

    alertBox(status: any, text: any) {
        switch(status) {
            case 'success':
                swal("Success!", text, "success");
                break;
            case 'warning':
                swal("Sorry!", text, "warning");
                break;
        }
    }

    confirmBox(configData: any) {
        let promise = new Promise((resolve, reject) => {
            swal(configData.title, {
                buttons: configData.buttons,
            }).then((action) => {
                resolve(action);
            });
        });
        return promise;
    }

}
