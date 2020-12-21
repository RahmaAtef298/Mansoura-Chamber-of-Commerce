import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { User } from '../../Administration/User.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private users: User[] = [];
  private searchUserswithId: User[] = [];
  private usersUpdated = new Subject<User[]>();
  userId : number;

  constructor(private http: HttpClient , private router : Router, private toaster: ToastrService) { }

  addUser(user: any) {
    return this.http.post<{ StatusCode: number; Data: any }>('http://10.0.0.10:7777/api/User/AddUser', user)
    .subscribe(
      (response) => {
        if (response.StatusCode == 204) {
          switch (response.Data ) {
            case 0:
              this.toaster.error("Problem in Server !! ");
              break;
            case 1:
              this.toaster.error("There is no Data to show !! ");
              break;
            case 2:
              this.toaster.error("Wrong Data !! ");
              break;
            case 4:
              this.toaster.error("Duplicated User Data !! ");
              break;
            case 5:
              this.toaster.error("No Update yet !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
        this.users.push(user);
        this.usersUpdated.next([...this.users]);
        this.toaster.success("User Added Successfully .. ");
        this.userId = response.Data;
        console.log("Added User "+ response.Data);
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getUsers() {
   return this.http.get<{ StatusCode: number; Data: any }>('http://10.0.0.10:7777/api/User/GetUsers' )
      .pipe( map( usersData => {
        if (usersData.StatusCode == 204) {
          switch (usersData.Data ) {
            case 0:
              this.toaster.error("Problem in Server !! ");
              break;
            case 1:
              this.toaster.error("There is no Data to show !! ");
              break;
            case 2:
              this.toaster.error("Wrong Data !! ");
              break;
            case 4:
              this.toaster.error("Duplicated Username !! ");
              break;
            case 5:
              this.toaster.error("No Update yet !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
          return usersData.Data.map( usersData => {
            return {
              UserID : usersData.UserID,
              UserName : usersData.UserName,
              Password : usersData.Password,
              Cashier : usersData.Cashier,
              Inactive : usersData.Inactive,
              RolesDto : usersData.RolesDto
            }
          } )
        }
        })
      )
      .subscribe(transformedUsers => {
        this.users = transformedUsers;
        this.usersUpdated.next([...this.users]);
      });
  }

  getUsersUpdateListener() {
    return this.usersUpdated.asObservable();
  }

  getUser(){
    return this.http.get<{ StatusCode: number; Data: any }>('http://10.0.0.10:7777/api/User/GetUsers')
  }

  deleteUser(userId: string, username: string){
    //const headers = new HttpHeaders({'Content-Type': 'application/json' , 'Authorization': 'basic MTE4fHx8MTEzOjo6YWRtaW46OjoxMDh8fHwxMi8xNi8yMDE5IDk6MDE6MDcgUE18fHwzLzI0LzIwMjAgOTowMTowNyBQTXx8fDIxfHx8MTIvMTcvMjAxOSAxOjAxOjA3IEFNfHx8MTY2fHx8MTgwfHx8bSFubUB4'});
    console.log(userId)
    return this.http.post<{ StatusCode: number; Data: any }>(` http://10.0.0.10:7777/api/User/DeleteUser?userId=${userId}`,{})
    .subscribe(( response ) => {
      if ( response.StatusCode == 204) {
        this.toaster.warning("There is an Error !!");
      } else {
      const updatedUsers = this.users.filter
      ( user => 
         user.UserID !== userId
        );
      this.users = updatedUsers;
      this.usersUpdated.next([...this.users]);
      this.toaster.success(`${username} Deleted Successfully .. `)
      }
    })
  }

  updateUser(updUser: User){
    return this.http.post<{ StatusCode: number; Data: any }>('http://10.0.0.10:7777/api/User/EditUser',updUser )
    .subscribe((response) => {
      if (response.StatusCode == 204) {
        switch (response.Data ) {
          case 0:
            this.toaster.error("Problem in Server !! ");
            break;
          case 1:
            this.toaster.error("There is no Data to show !! ");
            break;
          case 2:
            this.toaster.error("Wrong Data !! ");
            break;
          case 4:
            this.toaster.error("Duplicated Username !! ");
            break;
          case 5:
            this.toaster.error("No Update yet !! ");
            break;
          
        
          default:
            this.toaster.error("Something not Correct !! ");
            break;
        }
      }else{
      const updatedUsers = this.users;
      const oldUserIndex = updatedUsers.findIndex(f => f.UserID === updUser.UserID);
      const user: User = {
        UserID : updUser.UserID,
        Password : updUser.Password,
        UserName : updUser.UserName,
        Cashier : updUser.Cashier,
        Inactive : updUser.Inactive,
        RolesDto : updUser.RolesDto
      };
      updatedUsers[oldUserIndex] = user;
      this.users = updatedUsers;
      this.usersUpdated.next([...this.users]);
      this.userId = response.Data;
      this.toaster.success("User Updated Successfully .. ");
    }
    });
  }

  getUserId(){
    return this.userId;
  }

  searchUserId(userId : number){
    console.log(userId);
    if (userId) {
      this.searchUserswithId = [];
      return this.http.get<{ StatusCode: number; Data: any }>(` http://10.0.0.10:7777/api/User/GetUserById?userId=${userId}` )
      .subscribe(transformedUser => {
        this.searchUserswithId.push(transformedUser.Data)
        this.usersUpdated.next([...this.searchUserswithId]);
      });
    } else {
      this.getUsers();
    }
  }

  AssigenUserToRoles(checkedRoles){
    return this.http.post<{ StatusCode: number; Data: any }>('http://10.0.0.10:7777/api/User/AssigenUserToRoles', checkedRoles)
    .subscribe(
      (response) => {
        if (response.StatusCode == 204) {
          switch (response.Data ) {
            case 0:
              this.toaster.error("Problem in Server !! ");
              break;
            case 1:
              this.toaster.error("There is no Data to show !! ");
              break;
            case 2:
              this.toaster.error("Wrong Data !! ");
              break;
            case 4:
              this.toaster.error("Duplicated User Data !! ");
              break;
            case 5:
              this.toaster.error("No Update yet !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
          this.router.navigate(["/list/ListUsers"]);
          this.toaster.success("User Roles Added Successfully .. ");
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  //Roles

  getRoles(){
    return this.http.get<{ StatusCode: number; Data: any }>('http://10.0.0.10:7777/api/Role/GetRoles');
  }

  
}
