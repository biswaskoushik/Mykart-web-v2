import { Component } from '@angular/core';
import {
  Event,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

/* Common Function */
import { CommonFunction } from './core/class/common-function';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'adminlte';
  auth: boolean = false;
  loading = false;

  constructor(private router: Router, public commonFunction: CommonFunction) {

    

    var loginData: any = this.commonFunction.getLoginData();
    if(loginData.status == true) {
      this.auth = true;
    } else {
      this.auth = false;
    }

    this.router.events.subscribe((event: Event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.loading = true;
          this.commonFunction.loader(true);
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.commonFunction.loader(false);
          break;
        }
        default: {
          break;
        }
      }
    });
  }

}
