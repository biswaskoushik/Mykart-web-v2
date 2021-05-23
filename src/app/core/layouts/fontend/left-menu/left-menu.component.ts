import { Component, OnInit } from '@angular/core';

/* Common Function */
import { CommonFunction } from '../../../../core/class/common-function';

import { environment } from '../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})


export class LeftMenuComponent implements OnInit {

  public loginData: any = {};
  public environment: any = environment;
  public step_flag: boolean = true;
  public prodNotification: boolean = true ;


  constructor(public commonFunction: CommonFunction, public activatedRoute: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
    let loginData: any = this.commonFunction.getLoginData();
    if (loginData.status == true) {
      this.loginData = loginData.data;
    }

    if (localStorage.getItem('step_stripe') != null &&
      localStorage.getItem('step_creadit_card_details') != null) {
      //console.log(this.step_flag, '+==============')

      let step_stripe: any = localStorage.getItem('step_stripe');
      let step_creadit_card_details: any = localStorage.getItem('step_creadit_card_details');

      if (step_stripe == 0 && step_creadit_card_details == 0) {
        this.step_flag = false;
      }
    }
  }

  componentToStripe() {
    window.location.href = environment['CONNECT_TO_STRIPE'] + 17;
  }

  close() {
    this.prodNotification = ! this.prodNotification;
  }

  
  // logout() {
  //   var config: any = {
  //     "title": "Do you want to logout ?",
  //     "buttons": ["No", "Yes"]
  //   };
  //   this.commonFunction.confirmBox(config).then((action) => {
  //     if (action == true) {
  //       this.commonFunction.destroyLoginData();
  //       setTimeout(() => {
  //         location.reload();
  //       }, 100);
  //     }
  //   });
  // }

}
