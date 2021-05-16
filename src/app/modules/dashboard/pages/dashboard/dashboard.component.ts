import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/service/api.service';
import { CommonFunction } from '../../../../core/class/common-function';
import { Router } from '@angular/router';
import { timer ,  Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public loggedInUserData:any;
  keywordDebounce: Subscription;

  showMyList: boolean = false;

  subscription: Subscription;
  isLoading: boolean = false;

  orderCount: any = {
    "total_count": 0,
    "pending_order_count": 0,
    "completed_order_count": 0,
    "canceled_order_count": 0
  };

  orderListRequest = {
    filter_info: {
      keyword: '',
      screen_name: '',
    },
    pagination: {
      start: 0,
      limit: 10
    }
  }

  orderList: Array<any> = [];

  pageNo: number = 1;
  count: number = 0;

  constructor(public apiService: ApiService, public commonFunction: CommonFunction, public router: Router) {
  }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.loggedInUserData = this.commonFunction.getLoginData();
    // console.log(this.loggedInUserData,'loggedInUserData++')

  }

  refreshTable(screen_name): void {
    this.orderListRequest.filter_info.screen_name = screen_name

  }

  debounce(): void {
    if (this.keywordDebounce) {
      this.keywordDebounce.unsubscribe();
    }
    this.keywordDebounce = timer(500).subscribe(() => {
      this.pageNo = 1;
      this.refreshTable(this.orderListRequest.filter_info.screen_name);
    });
  }

  logout() {
    this.commonFunction.loader(true);
    this.commonFunction.destroyLoginData();

    setTimeout(() => {
      this.commonFunction.loader(false);
      this.router.navigate(['/auth/login']);
    }, 2000);
  }

}
