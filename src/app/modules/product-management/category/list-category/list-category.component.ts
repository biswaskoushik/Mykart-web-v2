import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import swal from 'sweetalert';

/* Api Service */
import { ApiService } from '../../../../core/service/api.service';

/* Common Function */
import { CommonFunction } from '../../../../core/class/common-function';

@Component({
  selector: 'app-list-category',
  templateUrl: './list-category.component.html',
  styleUrls: ['./list-category.component.css']
})
export class ListCategoryComponent implements OnInit {

  public loginUserData: any = {};
  public categoryList = [];
  isLoading = false;
  newCateogryList = [];
  color = "accent";
  hide: any = {};
  public categoryNameError: any = '';

  constructor(public activatedRoute: ActivatedRoute, public apiService: ApiService, public commonFunction: CommonFunction) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.loginUserData = this.commonFunction.getLoginData()
    this.activatedRoute.data.forEach(resp => {
      this.categoryList = resp.categoryList.response.category;
    })
  }

  addMore() {
    if (this.newCateogryList.length === 0) {
      this.newCateogryList = [{ name: "", is_active: true }];
      return;
    }
    if (this.newCateogryList.length >= 1) {
      // this.toastService.showError("Please enter category");
      return;
    }
    this.newCateogryList.push({ name: "", is_active: true });
  }

  editCategory(category, i) {
    category.isEdit = true;
  }

  deleteCategory(category, i) {
    if(this.categoryList[i].is_product_avilable == 0) {
      var config: any = {
        "title": "Do you want to delete category?",
        "buttons": ["No", "Yes"]
      };

      this.commonFunction.confirmBox(config).then((action) => {
        if (action == true) {
          this.isLoading = true;
          this.apiService
            .httpViaPostLaravel('product/v1/delete/category', { category_id: category.id })
            .subscribe((next) => {
              if (next.status_code == 200) {
                this.getCategoryList();
                this.categoryList.splice(i, 1);
              }
            })
        }
      })
    } else {
      var config: any = {
        "title": "You must remove all products assigned to this category before you can delete.",
        "buttons": "Got it"
      };

      this.commonFunction.confirmBox(config).then((action) => {
      });
    }
  }

  statusUpdate(category, i) {
    var config: any = {
      "title": "Do you want to update status?",
      "buttons": ["No", "Yes"]
    };
    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        this.isLoading = true;
        category._name = category.name
        this.apiService
          .httpViaPost('services/vendor/v1/category/update', { category: category })
          .subscribe((next) => {
            if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_code == 200) {
              swal("Thank You!", 'You???ve successfully updated status.', "success");
              this.getCategoryList();
            }
          })
      } else {
        this.getCategoryList();
      }
    })
  }

  saveCategory(category) {
    this.categoryNameError = '';
    if (category.name != null && category.name != '') {
      this.commonFunction.loader(true);
      category.isError = false;
      this.isLoading = true;
      this.apiService
        .httpViaPost('services/vendor/v1/category/update', { category: category })
        .subscribe((next) => {
          this.isLoading = false;
          this.commonFunction.loader(false);
          if (next.response != null && next.response.status != null && typeof (next.response.status.status_message) != 'undefined' && next.response.status.status_message == 'SUCCESS') {
            this.newCateogryList.splice(
              this.newCateogryList.indexOf(category),
              1
            );
            this.getCategoryList();
            swal("Thank You!", 'You???ve successfully added category.', "success");
          } else {
            if (next.response.fault != null && typeof (next.response.fault) != 'undefined') {
              swal("Sorry!", next.response.fault.fault_message, "warning");
            } else {
              swal("Sorry!", 'Somethings went wrong!', "warning");
            }
          }
        });
    } else {
      this.categoryNameError = 'Category name required';
    }
  }

  getCategoryList() {
    this.commonFunction.loader(true);
    let vendor_data: any = {
      source: "",
      email: this.loginUserData.data.user.email
    }
    this.apiService.httpViaPostLaravel('product/v1/get/category', vendor_data).subscribe((data) => {
      this.commonFunction.loader(false);
      if (data != null && data.response != null) {
        this.categoryList = data.response.category;
      }
    });
  }

}
