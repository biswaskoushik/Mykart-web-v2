import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove("hold-transition");
    body.classList.remove("sidebar-mini");
    body.classList.remove("layout-fixed");
    body.classList.remove("layout-navbar-fixed");
    body.classList.remove("layout-footer-fixed");
    
    body.classList.add("hold-transition");
    body.classList.add("login-page");
  }

}
