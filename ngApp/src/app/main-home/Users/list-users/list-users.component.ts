import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subscription, Subject, Observable, merge } from 'rxjs';
import { User } from '../../../Administration/User.model';
import { UsersService } from '../users.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit {

  private users : User[];
  private usersSubs : Subscription ;
  username : string;
  userid : string;
  isLoading = false;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  citCode : string;
  user : User;
  userId: string;
  Password: string;
  Username: string;
  Cashier: boolean;
  Inactive: boolean;

  exist = false;
  nExist = false;
  router$:Subscription;

  constructor( private usersService: UsersService, private ModalService: BsModalService, private route : ActivatedRoute ) { }

  ngOnInit() {

    //Add
    this.isLoading = true;
    this.usersService.getUsers();
     this.usersSubs = this.usersService.getUsersUpdateListener()
    .subscribe(
      (Users) => {
        this.users = Users
        this.isLoading = false;
      },
      (error) => console.log(error)
    );

    // //List

    // console.log(this.mode);

    // this.mode = "Add";
    // this.disable = "false";

  }

  openModal(template : TemplateRef<any> , id, name){
    console.log(id);
    this.ModalRef = this.ModalService.show(template);
    this.userid = id;
    this.username = name;
  }

  // onEdit(id){
  //   this.mode = "Edit";
  //   this.disable = "true";
  //   window.scrollTo(0,0);
  //   this.user = this.users.filter((item)=>{
  //         return item.UserID == id;
  //        })[0]
           
  //        this.userId = this.user.UserID;
  //        this.Username = this.user.UserName;
  //        this.Password = this.user.Password;
  //        this.Cashier = this.user.Cashier;
  //        this.Inactive = this.user.Inactive;

  // }
  
  onDelete(){
    console.log(this.userid);
    this.usersService.deleteUser(this.userid, this.username);
    this.ModalRef.hide();
  }

  searchUserId(id){
    this.usersService.searchUserId(id);
  }

  // onSubmit(form: NgForm) {
    
  //   if (this.mode === "Add") {         //add City
  //       const user : User = {
  //         UserID : null,
  //         UserName : form.value.Username,
  //         Password : form.value.Password,
  //         Cashier : true,
  //         Inactive : true
  //       }
  //     this.usersService.addUser(user);
  //   } else {                            //Edit City
  //       const updUser : User = {
  //         UserID : this.userId,
  //         UserName : form.value.Username,
  //         Password : form.value.Password,
  //         Cashier : true,
  //         Inactive : true
  //       }
  //     this.usersService.updateUser(updUser);
  //   }

    
  //   this.mode = "Add";
  //   this.disable = "false";
  //   form.resetForm();
  // }

  // checkIfExist(password){
  //   console.log(password.value);
  //   this.exist = false;
  //   this.users.filter( user =>{
  //     if( user.Password == password.value ){
  //       this.exist = true;
  //     }
  //   })
  // }

  // checkIfNameExist(name){
  //   console.log(name.value);
  //   this.nExist = false;
  //   this.users.filter( user =>{
  //     if( user.UserName == name.value ){
  //       this.nExist = true;
  //     }
  //   })
  // }

  ngOnDestroy(){
    this.usersSubs.unsubscribe();
  }

}
