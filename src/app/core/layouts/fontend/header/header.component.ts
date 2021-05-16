import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import swal from 'sweetalert';

/* Common Function */
import { CommonFunction } from '../../../../core/class/common-function';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public loginData: any;
  public userData: any = {};

  headerData: Subject<string>

  constructor(public router: Router, public commonFunction: CommonFunction) {
    this.headerData = new Subject<string>()
  }


  ngOnInit(): void {
    this.loginData = this.commonFunction.getLoginData();
    this.userData.image_url = localStorage.getItem('image_url');
    this.userData.full_name = localStorage.getItem('first_name') + ' ' + localStorage.getItem('last_name');
    // console.log(this.userData, 'this.userData++')
  }

  logout() {
    var config: any = {
      "title": "Do you want to logout ?",
      "buttons": ["No", "Yes"]
    };
    this.commonFunction.confirmBox(config).then((action) => {
      if (action == true) {
        this.commonFunction.loader(true);
        this.commonFunction.destroyLoginData();
        window.location.reload();
        // this.router.navigateByUrl('auth/login').then(() => {
        //   window.location.reload();
        // });
      }
    });
  }

  setHeaderData(data: any) {
    // this.userData = data;

    if (data.image_url != null && typeof (data.image_url) != 'undefined' && data.image_url != '') {
      localStorage.setItem('image_url', data.image_url);
      this.userData.image_url = data.image_url;

      let img: any = document.getElementById('profile_image');
      img.src = data.image_url;
    }

    if (data.first_name != null && typeof (data.first_name) != 'undefined' && data.first_name != '' && data.last_name != null && typeof (data.last_name) != 'undefined' && data.last_name != '') {
      localStorage.setItem('first_name', data.first_name);
      localStorage.setItem('last_name', data.last_name);

      document.getElementById('full_name').innerHTML = data.first_name + ' ' + data.last_name;
    }
  }

}
