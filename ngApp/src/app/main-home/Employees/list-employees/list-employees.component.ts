import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Employee } from '../Employee.model';
import { EmployeesService } from '../employees.service';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.scss']
})
export class ListEmployeesComponent implements OnInit {

  private employees : Employee[];
  private employeesSubs : Subscription ;
  isLoading = false;
  employeeCode : number;
  employeeName : string;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  EmId : string;
  employee : Employee;
  EmployeeId : number;
  EmployeeName : string;
  exist = false;
  nExist = false;
  router$ : Subscription;

  constructor( private employeesService: EmployeesService, private route : ActivatedRoute, private ModalService: BsModalService ) { }

  ngOnInit() {

    //Add
    this.isLoading = true;
    this.employeesService.getEmployees();
     this.employeesSubs = this.employeesService.getEmployeesUpdateListener()
    .subscribe(
      (Employees) => {
        this.employees = Employees
        console.log(Employees);
        this.isLoading = false;
      },
      (error) => console.log(error)
    );

    //list
    this.mode = "Add";
    this.disable = "false";
  }

  openModal(template : TemplateRef<any> , code, name){
    this.ModalRef = this.ModalService.show(template);
    this.employeeCode = code;
    this.employeeName = name;
  }

  onEdit(code){
    this.mode = "Edit";
    this.disable = "true";
    window.scrollTo(0,0);
    this.employee = this.employees.filter((item)=>{
         return item.EmployeeID == code;
        })[0]
       
        this.EmployeeId = this.employee.EmployeeID;
        this.EmployeeName = this.employee.EmployeeName;

  }
  
  onDelete(){
    this.employeesService.deleteEmployee(this.employeeCode, this.employeeName);
    this.ModalRef.hide();
  }

  onSubmit(form: NgForm) {
    console.log(form);
    
    if (this.mode === "Add") {         //add Employee
      const employee : Employee = {
        EmployeeID : form.value.EmployeeID,
        EmployeeName : form.value.EmployeeName
      }
        
      this.employeesService.addEmployee(employee);
    } else {                            //Edit Employee
        const updEmployee : Employee = {
          EmployeeID : this.EmployeeId,
          EmployeeName : form.value.EmployeeName
        }
        console.log(updEmployee);
      this.employeesService.updateEmployee(updEmployee);
    }

    this.mode = "Add";
    this.disable = "false";
    form.resetForm();
  }

  checkIfExist(code){
    console.log(code.value);
    this.exist = false;
    this.employees.filter( employee =>{
      if( employee.EmployeeID == code.value ){
        this.exist = true;
      }
    })
  }

  checkIfNameExist(name){
    console.log(name.value);
    this.nExist = false;
    this.employees.filter( employee =>{
      if( employee.EmployeeName == name.value ){
        this.nExist = true;
      }
    })
  }

  ngOnDestroy(){
    this.employeesSubs.unsubscribe();
    this.router$?this.router$.unsubscribe():null;
  }

}
