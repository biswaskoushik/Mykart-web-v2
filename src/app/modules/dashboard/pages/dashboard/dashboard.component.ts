import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../core/service/api.service';
import { CommonFunction } from '../../../../core/class/common-function';
import { Router } from '@angular/router';
import { timer, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
}
)
export class DashboardComponent implements OnInit {
  
  @ViewChild('myReadyCreatLabels') myReadyCreatLabels;
  @ViewChild('myCreatLabels') myCreatLabels;

  public loggedInUserData: any;
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
  public step_flag: boolean = true;
  public loginData: any;

  public ordersData: any = [];

  constructor(public apiService: ApiService, public commonFunction: CommonFunction, public router: Router) {
    this.loginData = this.commonFunction.getLoginData();

    this.getOrderData();
  }

  getOrderData() {
    this.commonFunction.loader(true);
    let requestData: any = {
      "vendor_id": this.loginData.data.user.id
    }

    this.apiService.httpViaPostLaravel('vendor-orders/v1/get-orders', requestData).subscribe((next: any) => {
      this.commonFunction.loader(false);
      if (next.status_code == 200) {
        this.ordersData = next.data;
      }
    });
  }

  onReadyCreatLabelsOpen() {
    //  this.myReadyCreatLabels.nativeElement.className = 'modal show';
  }
  onReadyCreatLabelsClose() {
    //  this.myReadyCreatLabels.nativeElement.className = 'modal hide';
  }
  onReadyCreatLabelsSubmit() {
    //  this.myReadyCreatLabels.nativeElement.className = 'modal hide';
  }


  onCreatLabelsOpen() {
    //  this.myCreatLabels.nativeElement.className = 'modal show';
  }
  onCreatLabelsClose() {
    //  this.myCreatLabels.nativeElement.className = 'modal hide';
  }
  onCreatLabelsSubmit() {
    //  this.myCreatLabels.nativeElement.className = 'modal hide';
  }


  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.loggedInUserData = this.commonFunction.getLoginData();

    if (localStorage.getItem('step_stripe') != null &&
      localStorage.getItem('step_creadit_card_details') != null) {

      let step_stripe: any = localStorage.getItem('step_stripe');
      let step_creadit_card_details: any = localStorage.getItem('step_creadit_card_details');

      if (step_stripe == 0 && step_creadit_card_details == 0) {
        this.step_flag = false;
      }
    }

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

  componentToStripe() {
    window.location.href = environment['CONNECT_TO_STRIPE'] + this.loggedInUserData.data.user.id;
  }

}