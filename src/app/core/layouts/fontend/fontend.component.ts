import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";

import swal from 'sweetalert';

/* Common Function */
import { CommonFunction } from '../../../core/class/common-function';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-fontend',
  templateUrl: './fontend.component.html',
  styleUrls: ['./fontend.component.css']
})
export class FontendComponent implements OnInit {

  public loginData: any;
  public onboardStep: boolean = false;
  public layout: any = {
    header: false,
    leftMenu: false
  };

  constructor(public router: Router, public commonFunction: CommonFunction, public activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      // code
    })
  }

  ngOnInit(): void {

    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.layout.header = false;
        this.layout.leftMenu = false;

        let link = event['url'];
        let linkArr = link.split('/');

        switch (linkArr[2]) {
          case 'onboarding':
          case 'onboarding':
            this.onboardStep = true;
            this.layout.header = false;
            this.layout.leftMenu = false;
            break;
          default:
            this.onboardStep = false;
            this.layout.header = true;
            this.layout.leftMenu = true;
            break;
        }
      }
    })

    this.loginData = this.commonFunction.getLoginData();
  }

}
