import { MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {
  Component, OnInit, Output, EventEmitter, AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Inject
} from '@angular/core';

import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import swal from 'sweetalert';

import { NgForm } from "@angular/forms"

/* Api Service */
import { ApiService } from '../../../../core/service/api.service';

/* environment */
import { environment } from '../../../../../environments/environment';

/* Common Function */
import { CommonFunction } from '../../../../core/class/common-function';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-variant',
  templateUrl: './manage-variant.component.html',
  styleUrls: ['./manage-variant.component.css']
})
export class ManageVariantComponent implements OnInit {

  public imagesData: any = [];

  public is_percentage: boolean = false;
  public is_flat_amount: boolean = false;
  public none_flag: boolean = true;

  public fielderror: any = {
    imageerr: '',
    priceerr: '',
    qtyerr: '',
    skuerr: ''
  }

  public variant: any = {
    "media_links": [],
    "price": 0.0,
    "qty": 0,
    "sku": "",
    "discount_type": 0,
    "discount_value": 0.0,
    "is_active": true,
    "delete_img": []
  }

  constructor(public dialogRef: MatDialogRef<ManageVariantComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public formBuilder: FormBuilder, public apiService: ApiService, public commonFunction: CommonFunction) {
    console.log(data.data, '++++++++++data')


    this.variant.price = data.data.price,
      this.variant.qty = data.data.quantity,
      this.variant.sku = data.data.sku,
      this.variant.product_id = data.data.product_id,
      this.variant.combinationId = data.data.combinationId,
      this.variant.email = data.email

    this.variant.is_active = false;

    if (data.data.is_active == 1) {
      this.variant.is_active = true;
    }

    if (data.data.media_links != null) {
      this.variant.media_links = data.data.media_links;
    }

    this.none_flag = false;
    this.is_percentage = false;
    this.is_flat_amount = false;

    switch (data.data.discount_type) {
      case 0:
        this.variant.discount_type = data.data.discount_type;
        this.variant.discount_value = data.data.discount_value;
        this.none_flag = true;
        break;
      case 1:
        this.variant.discount_type = data.data.discount_type;
        this.variant.discount_value = data.data.discount_value;
        this.is_percentage = true;
        break;
      case 2:
        this.variant.discount_type = data.data.discount_type;
        this.variant.discount_value = data.data.discount_value;
        this.is_flat_amount = true;
        break;
    }
  }

  ngOnInit(): void {

  }

  closeModal() {
    this.dialogRef.close();
  }


  handleFileInputChange(event: any) {
    if (event != null && event.target.files != null) {
      let imageArray = [];
      for (let i = 0; i < event.target.files.length; i++) {
        imageArray.push({ img: event.target.files[i] })
      }
      // console.log(imageArray, 'imageArray')
      this.readAllFiles(imageArray)
    }
  }

  //use promise to read all files
  async readAllFiles(AllFiles) {
    // console.log(AllFiles, 'AllFiles')
    const results = await Promise.all(AllFiles.map(async (file) => {
      const fileContents = await this.handleFileChosen(file);
      return fileContents;
    }));
    // console.log(results, '++++++++++');
    return results;
  }

  //resolve all files with base64
  async handleFileChosen(file) {
    return new Promise((resolve, reject) => {
      let fileReader = new FileReader();
      fileReader.onload = () => {
        if (this.imagesData.length < 5) {
          resolve({ img: fileReader.result });
          this.imagesData.push({ img: fileReader.result });
          this.fielderror.imageerr = '';
        } else {
          swal("Sorry!", 'You can only add 5 images!', "warning");
        }
      };
      fileReader.onerror = reject;
      fileReader.readAsDataURL(file.img);
    });
  }

  clearImage(val, i, flag) {
    var config: any = {
      "title": "Do you want to delete image?",
      "buttons": ["No", "Yes"]
    };
    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        if (flag == 'edit') {
          console.log(this.variant.media_links[i], i)
          this.variant.delete_img.push(this.variant.media_links[i]);
          this.variant.media_links.splice(i, 1);
        }
        if (flag == 'add') {
          this.imagesData.splice(i, 1);
        }
        console.log(this.imagesData)
      }
    })
  }

  changeDiscount(flag) {
    console.log(flag)
    this.is_percentage = false;
    this.is_flat_amount = false;
    this.none_flag = false;

    switch (flag) {
      case 0:
        this.variant.discount_type = 0;
        this.variant.discount_value = 0.0;
        this.is_percentage = false;
        this.none_flag = true;
        break;
      case 1:
        this.variant.discount_type = 1;
        this.variant.discount_value = 0.0;
        this.is_percentage = true;
        break;
      case 2:
        this.variant.discount_type = 2;
        this.variant.discount_value = 0.0;
        this.is_flat_amount = true;
        break;
    }
  }


  updateVariant() {

    let isValid = this.formValidation();

    if (isValid) {
      this.commonFunction.loader(true);

      this.variant.images = this.imagesData;
      console.log(this.variant)

      let endpoint = 'variant/v1/create';

      if (this.variant.product_id != null) {
        endpoint = 'product/v1/get/combination/update';
      }

      this.apiService.httpViaPostLaravel(endpoint, this.variant).subscribe(next => {
        this.commonFunction.loader(false);
        if (next.status_code != null && next.status_code == 200) {
          let data={
            variant:this.variant,
            flag:'update'
          }
          this.dialogRef.close(data);
        }
      })
    }
  }

  removeVariant() {
    let data={
      variant:this.variant,
      flag:'remove'
    }
    this.dialogRef.close(data);
  }

  formValidation() {
    let flagVal = true;

    if (this.variant.price == null || typeof (this.variant.price) == 'undefined' ||
      this.variant.price == '') {
      this.fielderror.priceerr = 'Price required';
      flagVal = false;
    }

    if (this.variant.qty == null || typeof (this.variant.qty) == 'undefined' ||
      this.variant.qty == '') {
      this.fielderror.qtyerr = 'Quantity required';
      flagVal = false;
    }

    if (this.variant.sku == null || typeof (this.variant.sku) == 'undefined' ||
      this.variant.sku == '') {
      this.fielderror.skuerr = 'SKU required';
      flagVal = false;
    }

    return flagVal;
  }

}
