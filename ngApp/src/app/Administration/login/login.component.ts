import { Component, OnInit } from '@angular/core';
import { User } from '../User.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  password ;
  username ;
  isLoading = false;
  flipped = false;
  passError : string;
  errorExit = false;
  constructor(private authService :AuthService) { }

  ngOnInit() {
  }

  Login(){
    this.isLoading = true ;
    const user = {
      UserID: null,
      UserName: this.username, 
      Password: this.password ,
      Cashier: true,
      Inactive: true
     };
    console.log( user );
    this.authService.login(user);
  }

  Signup(){
    console.log(this.username);
    console.log(this.password);
    const user = {
      UserID: null,
      UserName: this.username, 
      Password: this.password ,
      Cashier: true,
      Inactive: true
     };
     console.log(user);
  }

  flipIt() {
    this.flipped = !this.flipped;
  }

  confirmPassword(confirmedPass){
    if (confirmedPass.value == this.password) {
      this.errorExit = false;
      this.passError = "";
    }else{
      this.errorExit = true;
      this.passError = "The Two Passwords dose not Match .";
    }
  }
}
