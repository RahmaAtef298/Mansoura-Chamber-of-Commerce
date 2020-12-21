import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Administration/auth.service';

@Component({
  selector: 'app-main-home',
  templateUrl: './main-home.component.html',
  styleUrls: ['./main-home.component.scss']
})
export class MainHomeComponent implements OnInit {

  constructor( private authService : AuthService) { }

  ngOnInit() {
  }

  Logout(){
    this.authService.logout();
  }

}
