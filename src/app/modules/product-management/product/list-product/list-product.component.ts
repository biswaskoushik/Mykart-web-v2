import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import swal from 'sweetalert';

/* Api Service */
import { ApiService } from '../../../../core/service/api.service';

/* Common Function */
import { CommonFunction } from '../../../../core/class/common-function';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.css']
})
export class ListProductComponent implements OnInit {

  public categoryList = [];
  public productList = [];
  isLoading = false;
  newCateogryList = [];
  color = "accent";
  hide: any = {};
  public loginUserData: any = {};
  public selectedCategory: any = '';
  public button_text: any = 'Add Product';
  public inactiveCategoryFlag :boolean = false;
  public categoryNotification: boolean = true ;

  constructor(public activatedRoute: ActivatedRoute, public apiService: ApiService, public commonFunction: CommonFunction, public router: Router) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.loginUserData = this.commonFunction.getLoginData()
    this.activatedRoute.data.forEach(resp => {
      this.categoryList = resp.categoryList.response.category;
      //console.log(resp, 'resp++++', this.categoryList)
      if (this.categoryList.length > 0) {
        this.categoryNotification = false;
        this.getProductList(this.categoryList[0])
        this.inactiveCategoryFlag  = false;
        if(!this.categoryList[0].is_active){
          this.inactiveCategoryFlag  = true;
          }
      }
    })
  }

  getProductList(value) {
    //console.log(value, 'value++++')
    this.commonFunction.loader(true);

    this.selectedCategory = this.selectedCategory || this.categoryList[0].code;

    let vendor_data: any = {
      category_code: value.code,
      email: this.loginUserData.data.user.email
    }

    this.apiService.httpViaPostLaravel('product/v1/get/by-category', vendor_data).subscribe((next) => {
      this.commonFunction.loader(false);
      if (next != null && next.status_code == 200) {
        this.productList = next.data.product;
        // console.log(this.productList, '++ p')
        this.inactiveCategoryFlag  = false;
        if(!value.is_active){
        this.inactiveCategoryFlag  = true;
        }
      }
    })
  }

  updateProduct(data) {
    var config: any = {
      "title": `Are you sure you want to ${data.is_active ? "inactive" : "active"
        } this product?`,
      "buttons": ["No", "Yes"]
    };
    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        this.commonFunction.loader(true);
        data.is_active = data.is_active ? false : true;
        let product_data = {
          "email": this.loginUserData.data.user.email,
          "product_id":data.id,
          "is_active": data.is_active
        };

        console.log(data.is_active, '+++++++')
        this.apiService
          .httpViaPostLaravel('product/v1/update/status', product_data)
          .subscribe((next) => {
            this.commonFunction.loader(false);
            if (next != null  && typeof (next.status) != 'undefined' && next.status_code == 200) {
              swal("Thank You!", `Product ${data.is_active ? "activated" : "inactivated"
                } successfully`, "success");
            } else {
              if (next != null && typeof (next.message) != 'undefined') {
                swal("Sorry!", next.message, "warning");
              } else {
                swal("Sorry!", 'Somethings went wrong!', "warning");
              }
            }
          })
      }
    })
  }

  editProduct(data) {
    this.router.navigateByUrl('/seller/products/edit/' + data.id);
  }

  close() {
    this.categoryNotification = ! this.categoryNotification;
  }

  deleteProduct(data, i) {
    console.log(data, i)
    var config: any = {
      "title": "Do you want to delete product?",
      "buttons": ["No", "Yes"]
    };
    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        this.commonFunction.loader(true);
        this.isLoading = true;
        let vendor_data: any = {
          product_id: data.id,
          email: this.loginUserData.data.user.email
        }
        this.apiService
          .httpViaPostLaravel('product/v1/delete', vendor_data)
          .subscribe((next) => {
            this.commonFunction.loader(false);
            if (next != null && typeof (next.status_code) != 'undefined' && next.status_code == 200) {
              swal("Thank You!", 'You’ve successfully deleted product.', "success");
              this.productList.splice(i, 1);
            } else {
              if (next != null && typeof (next.message) != 'undefined') {
                swal("Sorry!", next.message, "warning");
              } else {
                swal("Sorry!", 'Somethings went wrong!', "warning");
              }
            }
          })
      }
    })
  }

}
