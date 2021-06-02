import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunction } from '../../../../core/class/common-function';
import { ApiService } from '../../../../core/service/api.service';
import swal from 'sweetalert';
import { ManageVariantComponent } from '../manage-variant/manage-variant.component';

import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatDialogConfig, MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  public media_url: any;
  imageUrl = '';
  public imagesData: any = [];
  public variantData: any = [];

  product: any = {
    "category": {
      "code": "",
      "name": "",
    },
    "media_links": [],
    'title': '',
    'subtitle': '',
    'description': '',
    "price": 0.0,
    "qty": 0,
    "sku": "",

    "discount_type": 0,
    "discount_value": 0.0,
    "height": 0.0,
    "is_free_shipping": true,
    "is_post": true,
    "is_active": true,

    "percentage": 0.0,
    "flat_amount": 0.0,
    'is_percentage': false,
    "is_flat_amount": false,
    "none": true,

    "length": 0.0,
    "weight": 0.0,
    "width": 0.0,
    'variant': [],
    "vendor": { "id": 0 },
    "email": '',
    "delete_img": []
  }

  temp: any;
  public productImage: any;
  public imgErrorMsg: any;
  public loginUserData: any = {};
  public categoryList = [];

  public fielderror: any = {
    imageerr: '',
    categoryerr: '',
    titleerr: '',
    subtitleerr: '',
    descriptionerr: '',
    priceerr: '',
    qtyerr: '',
    skuerr: '',
    weighterr: '',
    widtherr: '',
    lengtherr: '',
    heighterr: ''
  }

  public selectable = true;
  public removable = true;
  public addOnBlur = true;
  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public button_text: any = 'Save Product';

  public variantFilter:any = {
    is_active: true,
    product_id: 0,
    email: '',
    filter_val: 'all'
  }

  public filterVariantArray:any=[];

  constructor(public activatedRoute: ActivatedRoute, public apiService: ApiService, public commonFunction: CommonFunction, public router: Router, public dialog: MatDialog) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.loginUserData = this.commonFunction.getLoginData();

    this.product.vendor.id = this.loginUserData.data.user.id;
    this.variantFilter.email = this.loginUserData.data.user.email;

    console.log(this.product.vendor, this.loginUserData.data.user)

    this.getCategoryList();

    if (this.activatedRoute.snapshot.params.product_id != null) {
      this.variantFilter.product_id = this.activatedRoute.snapshot.params.product_id;
      this.getProductData();
    }

    if (this.activatedRoute.snapshot.params.product_id != null) {
      this.getVariantData(this.activatedRoute.snapshot.params.product_id);
      this.button_text = 'Update Product';

    }
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
    // console.log(file, 'file')
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



  clearImage(value, i, flag) {
    var config: any = {
      "title": "Do you want to delete image?",
      "buttons": ["No", "Yes"]
    };
    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        if (flag == 'edit') {
          this.product.delete_img.push(this.product.media_links[i]);
          this.product.media_links.splice(i, 1);
        }
        if (flag == 'add') {
          this.imagesData.splice(i, 1);
        }
        console.log(this.imagesData)
      }
    })
  }


  getCategoryList() {
    this.commonFunction.loader(true);
    let vendor_data: any = {
      source: "",
      Vendor_detail: { email: this.loginUserData.data.user.email }
    }

    this.apiService.httpViaPost('services/vendor/v1/category/list', vendor_data).subscribe((data) => {
      this.commonFunction.loader(false);
      //console.log(" component getCategoryList", data);
      if (data != null && data.response != null) {
        this.categoryList = data.response.category;
      }
    });
  }

  getProductData() {
    this.commonFunction.loader(true);
    let product_data: any = {
      product_id: this.activatedRoute.snapshot.params.product_id,
      email: this.loginUserData.data.user.email
    }

    this.apiService.httpViaPostLaravel('product/v1/get', product_data).subscribe((data) => {
      this.commonFunction.loader(false);
      //console.log(" component getCategoryList", data);
      if (data != null && data.status_code != null) {
        let productData = data.data.product;
        console.log(productData, '++productData')
        // this.product.code = productData.code;
        this.product.category = productData.category;
        this.product.title = productData.title;
        this.product.subtitle = productData.subtitle;
        this.product.description = productData.description;
        this.product.price = productData.price;
        this.product.qty = productData.qty;
        this.product.sku = productData.sku;
        this.product.discount_type = productData.discount_type;
        this.product.discount_value = productData.discount_value;
        this.product.height = productData.height;
        this.product.is_free_shipping = productData.is_free_shipping;
        this.product.is_post = productData.is_post;
        this.product.is_active = productData.is_active;
        this.product.length = productData.length;
        this.product.weight = productData.weight;
        this.product.width = productData.width;
        this.product.vendor = productData.vendor;
        this.product.variant = productData.variant;
        this.product.media_links = productData.media_links;
        this.product.none = false;
        this.product.productId = this.activatedRoute.snapshot.params.product_id;

        switch (productData.discount_type) {
          case 0:
            this.product.none = true;
            break;
          case 1:
            this.product.percentage = productData.discount_value;
            this.product.is_percentage = true;
            break;
          case 2:
            this.product.flat_amount = productData.discount_value;
            this.product.is_flat_amount = true;
            break;
        }
      }
    });
  }

  getVariantData(id, deleteFlag:boolean = false) {
    let combination_data: any = {
      product_id: id,
      email: this.loginUserData.data.user.email,
      delete: deleteFlag
    }

    this.apiService.httpViaPostLaravel('product/v1/get/combination', combination_data).subscribe((data) => {
      if (data.status_code == 200) {
        for (let i in data.data.productCombination) {
          data.data.productCombination[i].label = (data.data.productCombination[i].combination).split('-').join(' | ');
          data.data.productCombination[i].name = (data.data.productCombination[i].combination).split('-')[0];
        }
        this.variantData = data.data.productCombination;
      }
    });

    this.apiService.httpViaPostLaravel('product/v1/get/product-variant-options', combination_data).subscribe((data) => {
      if (data.status_code == 200) {
        this.filterVariantArray = data.data.options;
      }
    });
  }


  changeTimeLineStatus(value, flag) {
    console.log(value, flag, '=============')
    switch (flag) {
      case 'none':
        this.product.percentage = 0.0;
        this.product.flat_amount = 0.0;
        this.product.is_percentage = false;
        this.product.is_flat_amount = false;
        this.product.discount_type = 0;
        this.product.discount_value = 0;
        break;
      case 'flat_amount':
        this.product.percentage = 0.0;
        this.product.is_percentage = false;
        this.product.none = false;
        break;
      case 'percentage':
        this.product.flat_amount = 0.0;
        this.product.is_flat_amount = false;
        this.product.none = false;
        break;
    }
  }

  changeCategory(value) {
    if (value != null && value != '') {
      for (let i in this.categoryList) {
        if (this.categoryList[i].code == value) {
          this.product.category.name = this.categoryList[i].name;
        }
      }
    }
  }

  saveProduct() {
    let isFormValid = this.formValidation();
    //console.log(isFormValid, '+++ formValid')
    if (isFormValid) {

      if (this.product.is_percentage == true) {
        this.product.discount_type = 1;
        this.product.discount_value = this.product.percentage;
      }

      if (this.product.is_flat_amount == true) {
        this.product.discount_type = 2;
        this.product.discount_value = this.product.flat_amount;
      }

      // delete this.product.variant;
      delete this.product.percentage;
      delete this.product.is_percentage;
      delete this.product.is_flat_amount;
      delete this.product.flat_amount;
      delete this.product.none;

      this.commonFunction.loader(true);
      let fd = new FormData()

      // let imageArray: any = [];
      // imageArray.push(this.productImage)
      // fd.append('image', imageArray);
      // fd.append('product_update', JSON.stringify(this.product))

      this.product.email = this.loginUserData.data.user.email;
      if (this.imagesData.length > 0) {
        this.product.images = this.imagesData;
      } else {
        this.product.images = [];
      }

      let endpoint = 'product/v1/create';

      if (this.product.productId != null) {
        endpoint = 'product/v1/update';
      }

      this.apiService.httpViaPostLaravel(endpoint, this.product).subscribe((next: any) => {
        this.commonFunction.loader(false);
        if (next != null && typeof (next.status_code) != 'undefined' && next.status_code == 200) {
          this.button_text = 'Update Product';
          console.log(next, '+++++++++++++')

          if (this.product.productId == null) {
            swal("Thank You!", 'You’ve successfully added product.', "success");
          } else {
            swal("Thank You!", 'You’ve successfully updated product.', "success");
          }
          this.product.productId = next.data.productId;
          this.getVariantData(next.data.productId);
          // this.router.navigateByUrl('/seller/products');
        } else {
          if (next.message != null && typeof (next.message) != 'undefined') {
            swal("Sorry!", next.message, "warning");
          } else {
            swal("Sorry!", 'Somethings went wrong!', "warning");
          }
        }
      })
    }
  }


  formValidation() {
    let flagVal = true;

    if ((this.imagesData.length < 1) && (this.activatedRoute.snapshot.params.product_id == null)) {
      this.fielderror.imageerr = 'Product image required';
      flagVal = false;
    }

    if (this.product.category == null || typeof (this.product.category.code) == 'undefined' ||
      this.product.category.code == '') {
      this.fielderror.categoryerr = 'Category name required';
      flagVal = false;
    }

    if (this.product.title == null || typeof (this.product.title) == 'undefined' ||
      this.product.title == '') {
      this.fielderror.titleerr = 'Product title required';
      flagVal = false;
    }

    if (this.product.subtitle == null || typeof (this.product.subtitle) == 'undefined' ||
      this.product.subtitle == '') {
      this.fielderror.subtitleerr = 'Product subtitle required';
      flagVal = false;
    }

    if (this.product.description == null || typeof (this.product.description) == 'undefined' ||
      this.product.description == '') {
      this.fielderror.descriptionerr = 'Product description required';
      flagVal = false;
    }

    if (this.product.price == null || typeof (this.product.price) == 'undefined' ||
      this.product.price == '') {
      this.fielderror.priceerr = 'Price required';
      flagVal = false;
    }

    if (this.product.qty == null || typeof (this.product.qty) == 'undefined' ||
      this.product.qty == '') {
      this.fielderror.qtyerr = 'Quantity required';
      flagVal = false;
    }

    if (this.product.sku == null || typeof (this.product.sku) == 'undefined' ||
      this.product.sku == '') {
      this.fielderror.skuerr = 'SKU required';
      flagVal = false;
    }

    if (this.product.weight == null || typeof (this.product.weight) == 'undefined' ||
      this.product.weight == '') {
      this.fielderror.weighterr = 'Weight required';
      flagVal = false;
    }

    if (this.product.length == null || typeof (this.product.length) == 'undefined' ||
      this.product.length == '') {
      this.fielderror.lengtherr = 'Length required';
      flagVal = false;
    }

    if (this.product.width == null || typeof (this.product.width) == 'undefined' ||
      this.product.width == '') {
      this.fielderror.widtherr = 'Width required';
      flagVal = false;
    }

    if (this.product.height == null || typeof (this.product.height) == 'undefined' ||
      this.product.height == '') {
      this.fielderror.heighterr = 'Height required';
      flagVal = false;
    }

    return flagVal;
  }


  //************************  variants manage ************************//


  addMoreVariant() {
    if (this.product.variant.length < 3) {
      this.product.variant.push({ name: '', options: [] });
    } else {
      swal("Sorry!", 'You can only add up to 3 variants', "warning");
    }
    console.log(this.product.variant)
  }

  addVariantOptions(event: MatChipInputEvent, i) {
    let input = event.input;
    let value = event.value.toLowerCase();
    
    if (!event.value) {
      return;
    }

    if ((value || '').trim()) {
      let index =   this.product.variant[i].options.indexOf(value.trim())
      if(index == -1) {
        this.product.variant[i].options.push(value);
      }
    }

    if (input) {
      input.value = '';
    }
  }

  clearChip(i, j) {
    //console.log(i, j)
    this.product.variant[i].options.splice(j, 1)
  }

  deleteVariant(i) {
    var config: any = {
      "title": "Do you want to delete variant?",
      "buttons": ["No", "Yes"]
    };
    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        this.product.variant.splice(i, 1)
      }
    })
  }

  openVariantsDialog(value, i) {
    console.log(value, i)
    // swal("Sorry!", 'Comming soon', "warning");
    // ManageVariantComponent
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "62%";
    dialogConfig.hasBackdrop = true;

    let header = (value.combination).split('-').join(' | ')

    dialogConfig.data = {
      header: header,
      data: value,
      email:this.loginUserData.data.user.email
    }

    let dialogRef = this.dialog.open(
      ManageVariantComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && typeof (result) != 'undefined') {
        console.log(result,'+++++++++')

        if(result.flag != null && result.flag =='update'){
          swal("Thank You!", 'You’ve successfully updated variant.', "success");
         this.getVariantData(this.product.productId);
        }else{
          this.removeVariant(result);
        }
      }
    })
  }

  removeVariant(data){
    this.commonFunction.loader(true);
    this.apiService.httpViaPostLaravel('product/v1/delete/combination', {combination_id:data.variant.combinationId}).subscribe((next: any) => {
      this.commonFunction.loader(false);
      if(next != null && typeof (next.status_code) != 'undefined' && next.status_code == 200){
        swal("Thank You!", 'You’ve successfully deleted variant.', "success");
        this.getVariantData(this.product.productId);
      }
    })
  }

  restoreVariant(data, i){
    this.commonFunction.loader(true);
    this.apiService.httpViaPostLaravel('product/v1/restore/combination', {combination_id:data.combinationId}).subscribe((next: any) => {
      this.commonFunction.loader(false);
      if(next != null && typeof (next.status_code) != 'undefined' && next.status_code == 200){
        swal("Thank You!", 'You’ve successfully restore variant.', "success");
        this.getVariantData(this.product.productId);
      }
    })
  }

  getVariantFilterData() {
    this.commonFunction.loader(true);
    setTimeout(() => {
      this.apiService.httpViaPostLaravel('product/v1/filter/combination', this.variantFilter).subscribe((data) => {
        if (data.status_code == 200) {
          this.commonFunction.loader(false);
          for (let i in data.data.productCombination) {
            data.data.productCombination[i].label = (data.data.productCombination[i].combination).split('-').join(' | ');
            data.data.productCombination[i].name = (data.data.productCombination[i].combination).split('-')[0];
          }
          this.variantData = data.data.productCombination;
          // console.log(this.variantData, 'this.variantData',this.filterVariantArray,productCombinationArr)
        }
      })
    }, 500);
  }
}
