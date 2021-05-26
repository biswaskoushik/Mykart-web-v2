import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {

  @ViewChild('myRejectModal') myRejectModal;

  constructor() {}

    onRejectModalOpen() {
    //  this.myRejectModal.nativeElement.className = 'modal show';
    }
    onRejectModalClose() {
    //  this.myRejectModal.nativeElement.className = 'modal hide';
    }
    onRejectModalSubmit() {
    //  this.myRejectModal.nativeElement.className = 'modal hide';
    }


  ngOnInit(): void {
  }

}
