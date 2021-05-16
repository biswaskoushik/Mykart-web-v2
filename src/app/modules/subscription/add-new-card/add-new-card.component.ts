import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { ApiService } from '../../../core/service/api.service';

/* environment */
import { environment } from '../../../../environments/environment';

/* Common Function */
import { CommonFunction } from '../../../core/class/common-function';

import { AngularStripeService } from '@fireflysemantics/angular-stripe-service';

@Component({
  selector: 'app-add-new-card',
  templateUrl: './add-new-card.component.html',
  styleUrls: ['./add-new-card.component.css']
})
export class AddNewCardComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddNewCardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public formBuilder: FormBuilder, public apiService: ApiService, public commonFunction: CommonFunction,
    private cd: ChangeDetectorRef,
    private stripeService: AngularStripeService) { }


  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  @Output() subscriptionListener = new EventEmitter<any>();

  stripe;
  loading = false;
  confirmation;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  stateUpdate: string
  static stripe;
  static elements;
  static style = {}
  subscription: any = {}
  public subscriptionForm: any;
  public loginData: any;


  ngOnInit(): void {
    this.subscriptionForm = FormGroup;
    this.loginData = this.commonFunction.getLoginData();
    this.generateScriptionForm();
  }

  generateScriptionForm() {
    var validateRule: any = {
      is_default: [false],
      source: [''],
      email: ['']
    };
    this.subscriptionForm = this.formBuilder.group(validateRule);
  }


  async subscribe() {
    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      //console.log('Error:', error);
    } else {
      this.subscriptionForm.value.source = token.id;
      this.subscriptionForm.value.email = this.loginData.data.user.email;
      // this.subscriptionForm.value.card_id = token.card.id;

      //console.log(this.subscriptionForm.value, 'Success!', token);
      //console.log(this.subscriptionForm.value, '+++++++++ val')

      this.commonFunction.loader(true);

      this.apiService.httpViaPostLaravel("services/user/v1/customer/card/create", this.subscriptionForm.value).subscribe((next: any) => {
        this.commonFunction.loader(false);
        //console.log(next, 'next++ sign up')

        if (next.response != null && next.response.status != null && typeof (next.response.status.status_code) != 'undefined' && next.response.status.status_code == 200) {
          this.subscriptionForm.reset();
          swal("Thank You!", 'Card Added successfully', "success");
          this.dialogRef.close(next.response);
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

  onItemChange(event: any) {
    this.subscriptionForm.value.is_default = true;
    //console.log(this.subscriptionForm.value.is_default, " Value is : ", event.target.value);
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  ngAfterViewInit() {
    this.stripeService.setPublishableKey(environment['STRIPE_PUB_KEY']).then(
      stripe => {
        this.stripe = stripe;
        const elements = stripe.elements();
        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
      });
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }
  closeModal() {
    this.dialogRef.close();
  }
}
