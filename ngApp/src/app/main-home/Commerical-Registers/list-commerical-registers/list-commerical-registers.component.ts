import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { CommericalRegister } from '../CommericalRegister.model';
import { CommericalRegistersService } from '../commerical-registers.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-list-commerical-registers',
  templateUrl: './list-commerical-registers.component.html',
  styleUrls: ['./list-commerical-registers.component.scss']
})
export class ListCommericalRegistersComponent implements OnInit {

  private commericalRegisters : CommericalRegister[];
  private commericalRegistersSubs : Subscription ;
  isLoading = false;
  CRCode : number;
  CRName : string;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  CRId : string;
  commericalRegister : CommericalRegister;
  commericalRegisterId : number;
  commericalRegisterName : string;
  exist = false;
  nExist = false;
  router$ : Subscription;

  constructor( private commericalRegistersService: CommericalRegistersService, private route : ActivatedRoute, private ModalService: BsModalService ) { }

  ngOnInit() {

    //Add
    this.isLoading = true;
    this.commericalRegistersService.getCommericalRegs();
     this.commericalRegistersSubs = this.commericalRegistersService.getCommericalRegsUpdateListener()
    .subscribe(
      (CommericalRegisters) => {
        this.commericalRegisters = CommericalRegisters
        console.log(CommericalRegisters);
        this.isLoading = false;
      },
      (error) => console.log(error)
    );

    //List
    this.mode = "Add";
    this.disable = "false";
    
  }

  openModal(template : TemplateRef<any> , code, name){
    this.ModalRef = this.ModalService.show(template);
    this.CRCode = code;
    this.CRName = name;
  }

  onEdit(code){
    this.mode = "Edit";
    this.disable = "true";
    window.scrollTo(0,0);
    console.log(this.CRId);
    this.commericalRegister = this.commericalRegisters.filter((item)=>{
         return item.CommercialRegisterId == code;
        })[0]
       
        this.commericalRegisterId = this.commericalRegister.CommercialRegisterId;
        this.commericalRegisterName = this.commericalRegister.RegisterCommercialName;

  }
  
  onDelete(){
    this.commericalRegistersService.deleteCommericalReg(this.CRCode, this.CRName);
    this.ModalRef.hide();
  }

  onSubmit(form: NgForm) {
    
    if (this.mode === "Add") {         //add CommericalRegister
      const commericalReg : CommericalRegister = {
        CommercialRegisterId : form.value.commericalRegisterId,
        RegisterCommercialName : form.value.commericalRegisterName
      }
        
      this.commericalRegistersService.addCommericalReg(commericalReg);
    } else {                            //Edit CommericalRegister
        const updCommericalRegister : CommericalRegister = {
          CommercialRegisterId : this.commericalRegisterId,
          RegisterCommercialName : form.value.commericalRegisterName
        }
        console.log(updCommericalRegister);
      this.commericalRegistersService.updateCommericalReg(updCommericalRegister);
    }

    this.mode = "Add";
    this.disable = "false";
    form.resetForm();
  }

  checkIfExist(code){
    console.log(code.value);
    this.exist = false;
    this.commericalRegisters.filter( commericalRegister =>{
      if( commericalRegister.CommercialRegisterId == code.value ){
        this.exist = true;
      }
    })
  }

  checkIfNameExist(name){
    console.log(name.value);
    this.nExist = false;
    this.commericalRegisters.filter( commericalRegister =>{
      if( commericalRegister.RegisterCommercialName == name.value ){
        this.nExist = true;
      }
    })
  }

  ngOnDestroy(){
    this.commericalRegistersSubs.unsubscribe();
    this.router$?this.router$.unsubscribe():null;
  }

}
