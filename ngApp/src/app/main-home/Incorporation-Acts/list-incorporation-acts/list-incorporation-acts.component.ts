import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IncorporationAct } from '../IncorporationAct.model';
import { IncorporationActsService } from '../incorporation-acts.service';

@Component({
  selector: 'app-list-incorporation-acts',
  templateUrl: './list-incorporation-acts.component.html',
  styleUrls: ['./list-incorporation-acts.component.scss']
})
export class ListIncorporationActsComponent implements OnInit {

  private incorporationActs : IncorporationAct[];
  private incorporationActsSubs : Subscription ;
  isLoading = false;
  IActCode : number;
  IActName : string;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  InActId : string;
  incorporationAct : IncorporationAct;
  IncorporationActId : number;
  IncorporationActName : string;
  exist = false;
  nExist = false;
  router$ : Subscription;

  constructor( private incorporationActsService: IncorporationActsService, private route : ActivatedRoute, private ModalService: BsModalService ) { }

  ngOnInit() {

    //Add
    this.isLoading = true;
    this.incorporationActsService.getIncorporationActs();
     this.incorporationActsSubs = this.incorporationActsService.getIncorporationActsUpdateListener()
    .subscribe(
      ( IncorporationActs) => {
        this.incorporationActs = IncorporationActs
        console.log(IncorporationActs);
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
    this.IActCode = code;
    this.IActName = name;
  }

  onEdit(code){
    this.mode = "Edit";
    this.disable = "true";
    window.scrollTo(0,0)
    this.incorporationAct = this.incorporationActs.filter((item)=>{
         return item.IncorporationActId == code;
        })[0]
       
        this.IncorporationActId = this.incorporationAct.IncorporationActId;
        this.IncorporationActName = this.incorporationAct.IncorporationActName;

  }
  
  onDelete(){
    this.incorporationActsService.deleteIncorporationAct(this.IActCode, this.IActName);
    this.ModalRef.hide();
  }

  onSubmit(form: NgForm) {
    
    if (this.mode === "Add") {         //add IncorporationActI
      const incorporationAct : IncorporationAct = {
        IncorporationActId : form.value.IncorporationActId,
        IncorporationActName : form.value.IncorporationActName
      }
        
      this.incorporationActsService.addIncorporationAct(incorporationAct);
    } else {                            //Edit IncorporationActI
        const updIncorporationAct : IncorporationAct = {
          IncorporationActId : this.IncorporationActId,
          IncorporationActName : form.value.IncorporationActName
        }
        console.log(updIncorporationAct);
      this.incorporationActsService.updateIncorporationAct(updIncorporationAct);
    }

    this.mode = "Add";
    this.disable = "false";
    form.resetForm();
  }

  checkIfExist(code){
    console.log(code.value);
    this.exist = false;
    this.incorporationActs.filter( incorporationAct =>{
      if( incorporationAct.IncorporationActId == code.value ){
        this.exist = true;
      }
    })
  }

  checkIfNameExist(name){
    console.log(name.value);
    this.nExist = false;
    this.incorporationActs.filter( incorporationAct =>{
      if( incorporationAct.IncorporationActName == name.value ){
        this.nExist = true;
      }
    })
  }

  ngOnDestroy(){
    this.incorporationActsSubs.unsubscribe();
    this.router$?this.router$.unsubscribe():null;
  }


}
