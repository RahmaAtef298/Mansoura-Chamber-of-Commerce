import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subscription, Subject, Observable, merge } from 'rxjs';
import { User } from '../../../Administration/User.model';
import { UsersService } from '../users.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Role } from '../Roles.Model';


@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  users : User[];
  usersSubs : Subscription ;
  isLoading = false;
  loadingFlag = 0;
  ID : string;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  citCode : string;
  user : User;
  userId: string;
  Password: string;
  Username: string;
  Cashier = false;
  Inactive = false;
  RolesDto: Role[];

  exist = false;
  nExist = false;
  router$:Subscription;

  //Roles Model Parameters
  rolesForm: NgForm;
  cashier;
  inactive;

  //Roles Variables
  Roles :Role[]= new Array<Role>();
  RulesGroup ;
  mainSelect :boolean = false;
  flag : number = 1;
  title : string;
  selectMode ="Select All";

  constructor( private usersService: UsersService, private ModalService: BsModalService, private route : ActivatedRoute ) { }

  ngOnInit() {
    this.isLoading = true;
    //Get Roles
    this.usersService.getRoles().subscribe( (rolesData:any)=>{
      this.Roles = rolesData.Data.map( userRole =>{
       return{
         ObjectId: userRole.ObjectId,
         ObjectName: userRole.ObjectName,
         ObjectName_AR: userRole.ObjectName_AR,
         GroupRole: userRole.GroupRole,
         ObjectGroup_Id: userRole.ObjectGroup_Id,
         isChecked: false
       }
     });
       console.log(this.Roles);
       this.RulesGroup = [...new Set(this.Roles.map( (role) => role.GroupRole))]
       console.log(this.RulesGroup);
       this.loadingFlag = this.loadingFlag + 1;
       if (this.loadingFlag == 3) {
         this.isLoading = false;
       }else{
         this.isLoading = true;
       }
     });
    
    //Get Users
    this.usersService.getUsers();
    this.usersSubs = this.usersService.getUsersUpdateListener()
    .subscribe(
      (Users) => {
        this.isLoading = false;
        this.users = Users;
        console.log(Users);
        this.loadingFlag = this.loadingFlag + 1;
          if (this.loadingFlag == 3) {
            this.isLoading = false;
          }else{
            this.isLoading = true;
          }
      },
      (error) => console.log(error)
    );

    //Edit
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("ID")) {
        this.mode = "Edit";
        this.disable = "true";
        this.ID = paramMap.get("ID");

        this.usersService.getUser().subscribe((usersData:any) => {
          if(usersData.StatusCode==200)
          {
           this.user = usersData.Data.filter((item)=>{
            return item.UserID == this.ID;
           })[0]
           this.userId = this.user.UserID;
           this.Username = this.user.UserName;
           this.Password = this.user.Password;
           this.Cashier = this.user.Cashier;
           this.Inactive = this.user.Inactive;
           this.RolesDto = this.user.RolesDto;
          };
          this.RolesDto.forEach(chosenRole => {
            this.Roles.filter( role =>{
              if (chosenRole.ObjectId == role.ObjectId) {
                role.isChecked = true;
              }
            })
          });
          console.log(this.RolesDto);
          console.log(this.Roles);
          this.loadingFlag = this.loadingFlag + 1;
          if (this.loadingFlag == 3) {
            this.isLoading = false;
          }else{
            this.isLoading = true;
          }
         },
         (error) => console.log(error));
      } else {
        this.mode = "Add";
        this.disable = "false";
        this.ID = null;
        this.loadingFlag = this.loadingFlag + 1;
        if (this.loadingFlag == 3) {
          this.isLoading = false;
        }else{
          this.isLoading = true;
        }
      }
    });
  }

  openRolesModal(template: TemplateRef<any>, form: NgForm, Cashier, Inactive){
    console.log(this.Roles);
    let groupName = "عام"
    this.checkIfAllSelected(groupName);
    
    this.rolesForm = form;
    this.cashier = Cashier;
    this.inactive = Inactive;
    this.onSubmit()
    this.ModalRef = this.ModalService.show(template);
  }

  onSubmit() {
    if (this.mode === "Add") {         //add User
        const user = {
          UserName : this.rolesForm.value.Username,
          Password : this.rolesForm.value.Password,
          Cashier : this.cashier.checked,
          Inactive : this.inactive.checked
        }
      this.usersService.addUser(user);
    } else {                            //Edit User
        const updUser : User = {
          UserID : this.userId,
          UserName : this.rolesForm.value.Username,
          Password : this.rolesForm.value.Password,
          Cashier : this.cashier.checked,
          Inactive : this.inactive.checked,
          RolesDto : this.RolesDto
        }
      this.usersService.updateUser(updUser);
    }
    this.mode = "Add";
    this.disable = "false";
    this.rolesForm.resetForm();
  }

  checkAll(groupName,event){
    console.log(event);
    this.mainSelect = !this.mainSelect;
    if (this.mainSelect) {
      for (let index = 0; index < this.Roles.length; index++) {
        if (this.Roles[index].GroupRole == groupName) {
          this.Roles[index].isChecked = true;
        }
      }
    } else{
      for (let index = 0; index < this.Roles.length; index++) {
        if (this.Roles[index].GroupRole == groupName) {
          this.Roles[index].isChecked = false;
        }
      }
    }
  }

  checkItem(ruleId,groupName,ruleSelected){
    console.log(ruleSelected);
    for (let index = 0; index < this.Roles.length; index++) {
      if (this.Roles[index].ObjectId == ruleId) {
        this.Roles[index].isChecked == ruleSelected
      }
    }
    this.checkIfAllSelected(groupName);
  }

  sendRoles(){
    const checkedRoles = this.Roles.filter( role => role.isChecked == true);
    console.log(this.Roles)
    console.log(checkedRoles);
    const UserID = this.usersService.getUserId();
    const MappedCheckedRoles = checkedRoles.map( userRole =>{
      return{
        userID: UserID,
        ObjectId: userRole.ObjectId
      }
    })
    this.usersService.AssigenUserToRoles(MappedCheckedRoles);
    this.ModalRef.hide();
  }

  checkIfAllSelected(groupName){
    this.flag = 1;
    this.mainSelect = false;
    console.log(groupName);
    for (let index = 0; index < this.Roles.length; index++) {
      if (this.Roles[index].GroupRole == groupName) {
        if (this.Roles[index].isChecked == true) {
          this.flag = this.flag * 1 ;
        }else{
          this.flag = this.flag * 0 ;
        }
      }
    }
    console.log(this.flag);
    if (this.flag == 1) {
      this.mainSelect = true;
      this.selectMode = "Unselect All"
    } else{
      this.mainSelect = false;
      this.selectMode = "Select All"
    }
    console.log(this.mainSelect);
  }

  checkIfExist(password){
    console.log(password.value);
    this.exist = false;
    this.users.filter( user =>{
      if( user.Password == password.value ){
        this.exist = true;
      }
    })
  }

  checkIfNameExist(name){
    console.log(name.value);
    this.nExist = false;
    this.users.filter( user =>{
      if( user.UserName == name.value ){
        this.nExist = true;
      }
    })
  }

  ngOnDestroy(){
    this.router$?this.router$.unsubscribe():null;
  }

}
