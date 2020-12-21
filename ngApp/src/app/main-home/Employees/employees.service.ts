import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Employee } from './Employee.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {

  
  private employees: Employee[] = [];
  private employeesUpdated = new Subject<Employee[]>();

  constructor(private http: HttpClient , private router : Router, private toaster: ToastrService) { }

  addEmployee(employee : Employee) {
    
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Employee/add', employee )
    .subscribe(
      (response) => {
        if (response.statusCode == 204) {
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
            case 3:
              this.toaster.error("Duplicated Employee Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated Employee Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
          console.log(employee);
          console.log(response);
          const Employee : Employee = {
            EmployeeID : response.Data,
            EmployeeName : employee.EmployeeName
          }
          this.employees.push(Employee);
          this.employeesUpdated.next([...this.employees]);
          this.toaster.success("Employee Added Successfully .. ")
          console.log(this.employees);
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getEmployees() {
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Employee/list')
      .pipe(
        map( employeesData => {
          if (employeesData.statusCode == 204) {
            switch (employeesData.Data ) {
              case 0:
              this.toaster.error("Problem in Server !! ");
              break;
            case 1:
              this.toaster.error("There is no Data to show !! ");
              break;
            case 2:
              this.toaster.error("Wrong Data !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
            }
          }else{
          console.log(employeesData)
          return employeesData.Data.Data.map(employee => {
            return {
              EmployeeID: employee.EmployeeID,
              EmployeeName: employee.EmployeeName
            };
          });
        }
        })
      )
      .subscribe(transformedEmployees => {
        this.employees = transformedEmployees;
        this.employeesUpdated.next([...this.employees]);
      });
  }

  getEmployeesUpdateListener() {
    return this.employeesUpdated.asObservable();
  }

  getEmployee(){
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Employee/list')

  }

  deleteEmployee(EmCode: number, EmName: string){
    console.log(EmCode)
    return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/Employee/Delete?employeeId=${EmCode}`,{})
    .subscribe(( response ) => {
      if ( response.statusCode == 204) {
        switch (response.Data ) {
          case 51:
            this.toaster.warning("Delete SubCategories First !! ");
            break;
          case 52:
            this.toaster.warning("Delete Regions First !! ");
            break;
          case 53:
            this.toaster.warning("Delete Commerical First !! ");
            break;
          case 54:
            this.toaster.warning("Delete Cities First !! ");
            break;
          case 55:
            this.toaster.warning("Delete Certificates First !! ");
            break;
          case 56:
            this.toaster.warning("Delete Commerical Register First !! ");
            break;
        
          default:
            this.toaster.warning("There is no update in this Data !! ");
            break;
        }
      } else {
      const updatedEmployees = this.employees.filter
      (employee => 
         employee.EmployeeID !== EmCode
        );
      this.employees = updatedEmployees;
      this.employeesUpdated.next([...this.employees]);
      this.toaster.success(`${EmName} Deleted Successfully .. `)
      }
    })

  }

  updateEmployee(updEmployee: Employee){
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Employee/edit',updEmployee )
    .subscribe((response) => {
      if (response.statusCode == 204) {
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
            case 3:
              this.toaster.error("Duplicated Employee Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated Employee Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
        }
      }else{
      const updatedEmployees = this.employees;
      const oldEmployeeIndex = updatedEmployees.findIndex(f => f.EmployeeID === updEmployee.EmployeeID);
      const employee: Employee = {
        EmployeeID: updEmployee.EmployeeID,
        EmployeeName: updEmployee.EmployeeName
      };
      updatedEmployees[oldEmployeeIndex] = employee;
      this.employees = updatedEmployees;
      this.employeesUpdated.next([...this.employees]);
      this.toaster.success("Employee Updated Successfully .. ")
    }
    });
  }
}
