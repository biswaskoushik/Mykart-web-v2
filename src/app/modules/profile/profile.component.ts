import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../core/service/api.service';

import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import swal from 'sweetalert';


/* environment */
import { environment } from '../../../environments/environment';

/* Common Function */
import { CommonFunction } from '../../core/class/common-function';

import { Router } from '@angular/router';

import * as zipcode from 'zipcodes';

import { StateTaxes } from '../../core/data/stateTaxes.model';

import { StaticDataSource } from '../../core/data/staticDataSource';

import { HeaderComponent } from '../../core/layouts/fontend/header/header.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  @Output() profileListener = new EventEmitter<any>();

  public profileFormFlag: boolean = true;
  public isError: any;

  public environment: any = environment;
  public profileForm: any;
  public userData: any;
  public zipCode: any = {}
  public temp: any;
  public imageUrl: any;
  public profileImage: any;
  public salesStateTaxes: StateTaxes[] = [];
  public imgErrorMsg: any = '';
  public isvalid: boolean = false;

  constructor(public apiService: ApiService, public formBuilder: FormBuilder, public commonFunction: CommonFunction, public router: Router, public staticDataSource: StaticDataSource, public headerComponent: HeaderComponent) {

    staticDataSource.getStateTaxes().subscribe(data => {
      this.salesStateTaxes = data
    })
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.profileForm = FormGroup;
    this.generateProfileForm();
    this.getProfileData();
  }

  generateProfileForm() {
    var validateRule: any = {
      first_name: ['', [Validators.required, Validators.maxLength(50)]],
      last_name: ['', [Validators.required, Validators.maxLength(50)]],
      business_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      website: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: [''],
      zip: ['', Validators.required],
      country: [''],
      about_us: ['', Validators.required],
      tax_value: ['']
    };
    this.profileForm = this.formBuilder.group(validateRule);
  }

  //skip update
  // skipUpdateProfile() {
  //   this.profileFormFlag = false;
  //   this.profileListener.emit({ action: 'profile', flag: 'skip-profile', profileFormFlag: this.profileFormFlag, value: 0 })
  // }

  updateProfile() {
    for (let x in this.profileForm.controls) {
      this.profileForm.controls[x].markAsTouched();
    }

    if (this.imageUrl == null || typeof (this.imageUrl) == 'undefined' || this.imageUrl == '') {
      this.imgErrorMsg = 'Profile Image required';
      return;
    }

    if (this.profileForm.valid) {

      // if (this.imageUrl != null && typeof (this.imageUrl) != 'undefined') {
      this.commonFunction.loader(true);
      let data: any = {
        "address_line1": this.profileForm.controls['address'].value,
        "city_locality": this.profileForm.controls['city'].value,
        "state_province": this.profileForm.controls['state'].value,
        "postal_code": this.profileForm.controls['zip'].value,
        "country_code": this.profileForm.controls['country'].value
      }
      console.log(data, 'data')
      this.apiService.httpViaPostLaravel('services/user/v1/profile/address-tax-validate', data).subscribe((next: any) => {
        if (next.data != null && next.data.address_status.length > 0 && next.data.address_status[0].status != null && next.data.address_status[0].status == 'verified') {
          console.log(next.data.address_status[0])
          this.profileForm.controls['tax_value'].setValue(next.data.tax_rate);

          this.profileForm.value.is_vendor_login = true;
          let formData = new FormData();
          formData.append('profile_json', JSON.stringify({ "user": this.profileForm.value }));
          if (this.profileImage != null && typeof (this.profileImage) != "undefined") {
            formData.append('image', this.profileImage);
          }
          this.updateProfileData(formData)
        } else {
          this.commonFunction.loader(false);
          swal("Sorry!", 'Address is not valid', "warning");
        }
      });
    }
  }

  getProfileData() {
    this.commonFunction.loader(true);
    this.userData = this.commonFunction.getLoginData();
    //console.log(this.userData, 'userData========>>')

    this.profileForm.controls['email'].setValue(this.userData.data.user.email);
    this.profileForm.controls['business_name'].setValue(this.userData.data.user.business_name);

    this.apiService.httpViaPost('services/user/v1/profile/get', {}).subscribe((next: any) => {
      let profileData = next.response.user;
      // console.log(profileData, 'next+++')
      this.commonFunction.loader(false);

      if (profileData != null && profileData.first_name != null && typeof (profileData.first_name) != 'undefined' && profileData.first_name != '') {
        this.profileForm.controls['first_name'].setValue(profileData.first_name);
      }

      if (profileData != null && profileData.last_name != null && typeof (profileData.last_name) != 'undefined' && profileData.last_name != '') {
        this.profileForm.controls['last_name'].setValue(profileData.last_name);
      }

      if (profileData != null && profileData.website != null && typeof (profileData.website) != 'undefined' && profileData.website != '') {
        this.profileForm.controls['website'].setValue(profileData.website);
      }

      if (profileData != null && profileData.about_us != null && typeof (profileData.about_us) != 'undefined' && profileData.about_us != '') {
        this.profileForm.controls['about_us'].setValue(profileData.about_us);
      }

      if (profileData != null && profileData.address != null && typeof (profileData.address) != 'undefined' && profileData.address != '') {
        this.profileForm.controls['address'].setValue(profileData.address);
      }

      if (profileData != null && profileData.postal_address != null && typeof (profileData.postal_address) != 'undefined' && profileData.postal_address != '') {
        this.profileForm.controls['zip'].setValue(profileData.postal_address);
      }

      if (profileData != null && profileData.city != null && typeof (profileData.city) != 'undefined' && profileData.city != '') {
        this.profileForm.controls['city'].setValue(profileData.city);
      }

      if (profileData != null && profileData.state != null && typeof (profileData.state) != 'undefined' && profileData.state != '') {
        this.profileForm.controls['state'].setValue(profileData.state);
      }

      if (profileData != null && profileData.country != null && typeof (profileData.country) != 'undefined' && profileData.country != '') {
        this.profileForm.controls['country'].setValue(profileData.country);
      }

      if (profileData != null && profileData.tax_value != null) {
        this.profileForm.controls['tax_value'].setValue(profileData.tax_value);
        // console.log(profileData.tax_value, 'profileData.tax_value++++++++=')
      }

      if (profileData != null && profileData.image_url != null && typeof (profileData.image_url) != 'undefined' && profileData.image_url != '') {
        this.imageUrl = profileData.image_url;
      }
    })
  }

  changeImage(event: any) {
    //console.log(this.temp, '+++', event.target.files[0])
    this.profileImage = event.target.files[0];
    //console.log("profileImage == ", this.profileImage)
    var reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.imgErrorMsg = '';
    }
    reader.readAsDataURL(this.profileImage);
  }

  getZipCodeInf() {
    this.zipCode = zipcode.lookup(this.profileForm.value.zip);
    console.log(this.zipCode, '++++++++++=  this.zipCode', this.profileForm.value.zip)

    if (typeof (this.zipCode) == 'undefined') {
      swal("Sorry!", 'Zip Code is not valid', "warning");
    } else {
      // let sell_tax_value = this.getSaleTaxes(this.zipCode.state).sell_state_taxes;
      // this.profileForm.controls['tax_value'].setValue(sell_tax_value);
      this.profileForm.controls['country'].setValue(this.zipCode.country);
      this.profileForm.controls['state'].setValue(this.zipCode.state);
      // this.profileForm.controls['city'].setValue(this.zipCode.city);
    }
  }

  // getSaleTaxes(stateName2: any): StateTaxes {
  //   return this.salesStateTaxes.find(s => s.stateName2 == stateName2)
  // }

  // getAddressVaildInf() {
  //   console.log('address++++++++++++', this.profileForm.value.address)
  //   this.commonFunction.loader(true);
  //   let data: any = {
  //     "address_line1": this.profileForm.controls['address'].value,
  //     "city_locality": this.profileForm.controls['city'].value,
  //     "state_province": this.profileForm.controls['state'].value,
  //     "postal_code": this.profileForm.controls['zip'].value,
  //     "country_code": this.profileForm.controls['country'].value
  //   }
  //   console.log(data, 'data')
  //   this.apiService.httpViaPostLaravel('services/user/v1/profile/address-tax-validate', data).subscribe((next: any) => {
  //     this.commonFunction.loader(false);
  //     if (next.data != null && next.data.address_status.length > 0 && next.data.address_status[0].status != null && next.data.address_status[0].status == 'verified') {
  //       console.log(next.data.address_status[0])
  //       this.profileForm.controls['tax_value'].setValue(next.data.tax_rate);
  //     } else {
  //       swal("Sorry!", 'Address is not valid', "warning");
  //     }
  //   });
  // }

  updateProfileData(formData) {
    this.commonFunction.loader(true);

    this.apiService.updateProfile(formData).subscribe((next: any) => {
      this.commonFunction.loader(false);

      if (next.status == true) {
        swal("Thank You!", 'Profile update successfully', "success");
        let headerData: any = {};
        if (this.profileImage != null && typeof (this.profileImage) != "undefined") {
          headerData.image_url = next.data.vendor.image_url;
        }

        headerData.first_name = this.profileForm.controls['first_name'].value;
        headerData.last_name = this.profileForm.controls['last_name'].value;
        this.headerComponent.setHeaderData(headerData);
        // console.log(headerData, 'headerData ======= ')

        for (let x in this.profileForm.controls) {
          this.profileForm.controls[x].markAsUntouched();
        }
      } else {
        swal("Sorry!", next.message, "warning");
      }
    });
  }
}
