import { Component, OnInit } from '@angular/core';
import { AdalService } from '../adal/adal.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private adalService: AdalService) { }

  ngOnInit() {
    this.adalService.handleWindowCallback();
  }

  login() {
    this.adalService.login();
  }

  logout() {
    this.adalService.logOut();
  }

  get authenticated(): boolean {
    return this.adalService.userInfo.authenticated;
  }
}
