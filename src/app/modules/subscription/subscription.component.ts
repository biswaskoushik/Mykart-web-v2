import { Component, OnInit } from '@angular/core';
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
import { AddNewCardComponent } from './add-new-card/add-new-card.component';
import { MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  vendorCode: string = "sagar7995";
  userData: any;
  acInfo: any;
  isLoading = false;
  cardDetails: any = [];

  constructor(public apiService: ApiService, public formBuilder: FormBuilder, public commonFunction: CommonFunction, public router: Router, public staticDataSource: StaticDataSource, public dialog: MatDialog) { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.userData = this.commonFunction.getLoginData();
    this.getCardDetails();
  }

  unsubscribe() {
    swal("Sorry!", 'Comming Soon', "warning");
  }

  openPaymentDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "62%";
    dialogConfig.hasBackdrop = true;

    dialogConfig.data = {
      header: 'Add New Card',
      data: [],
      
    }
    let dialogRef = this.dialog.open(      
      AddNewCardComponent,
      dialogConfig
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result != null && typeof (result) != 'undefined') {
        this.getCardDetails();
      }
    })
  }

  getCardDetails() {
    this.commonFunction.loader(true);
    this.apiService.httpViaPostLaravel('services/user/v1/customer/card/list',
      { email: this.userData.data.user.email }).subscribe(next => {
        this.commonFunction.loader(false);
        this.cardDetails = next.response.status.data;
      })
  }


  deleteCardDetails(value, i) {
    let defaultCardFlag = false;
    var config: any = {
      "title": "Do you want to delete Card?",
      "buttons": ["No", "Yes"]
    };
    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        // console.log(value)
        this.commonFunction.loader(true);

        if (value.is_default == 1) {
          defaultCardFlag = true;
        }

        this.apiService.httpViaPostLaravel('services/user/v1/customer/card/delete',
          { email: this.userData.data.user.email, cardId: value.id }).subscribe(next => {
            this.commonFunction.loader(false);
            if (next.response != null && next.response.status != null && typeof (next.response.status.status_code) != 'undefined' && next.response.status.status_code == 200) {
              swal("Thank You!", 'Card Delete successfully', "success");
              this.cardDetails.splice(i, 1);

              // id default card is delete
              if (defaultCardFlag == true && this.cardDetails.length > 0) {
                this.apiService.httpViaPostLaravel('services/user/v1/customer/card/make-default',
                  { email: this.userData.data.user.email, cardId: this.cardDetails[0].id }).subscribe(next => {
                    if (next.response != null && next.response.status != null && typeof (next.response.status.status_code) != 'undefined' && next.response.status.status_code == 200) {
                      this.apiService.httpViaPostLaravel('services/user/v1/customer/card/list',
                        { email: this.userData.data.user.email }).subscribe(next => {
                          this.cardDetails = next.response.status.data;
                        })
                    } else {
                      swal("Sorry!", 'Somethings went wrong!', "warning");
                    }
                  })
              }
            } else {
              swal("Sorry!", 'Somethings went wrong!', "warning");
            }
          })
      }
    })
  }

  makeDefaultCard(value, i) {
    // console.log(value, i)
    this.cardDetails[i].is_default = 1;
    var config: any = {
      "title": "Do you want to change your default card?",
      "buttons": ["No", "Yes"]
    };
    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        this.commonFunction.loader(true);
        this.apiService.httpViaPostLaravel('services/user/v1/customer/card/make-default',
          { email: this.userData.data.user.email, cardId: value.id }).subscribe(next => {
            // this.commonFunction.loader(false);
            if (next.response != null && next.response.status != null && typeof (next.response.status.status_code) != 'undefined' && next.response.status.status_code == 200) {
              this.getCardDetails();
            } else {
              swal("Sorry!", 'Somethings went wrong!', "warning");
            }
          })
      } else {
        this.cardDetails[i].is_default = 0;
      }
    })
  }

}
