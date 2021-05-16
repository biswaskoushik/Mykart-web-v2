import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.css']
})
export class PaymentHistoryComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
