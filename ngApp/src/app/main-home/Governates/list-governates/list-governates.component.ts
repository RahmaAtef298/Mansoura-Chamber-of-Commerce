import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Governate } from '../Governate.model';
import { GovernatesService } from '../governates.service';

@Component({
  selector: 'app-list-governates',
  templateUrl: './list-governates.component.html',
  styleUrls: ['./list-governates.component.scss']
})
export class ListGovernatesComponent implements OnInit {

  private governates : Governate[];
  private governatesSubs : Subscription;
  isLoading = false;
  governateCode : number;
  governateName : string;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  GovId : string;
  governate : Governate;
  GovernateId : number;
  GovernateName : string;
  exist = false;
  nExist = false;
  router$ : Subscription;

  constructor( private governatesService: GovernatesService, private route : ActivatedRoute, private ModalService: BsModalService ) { }

  ngOnInit() {

    //Add
    this.isLoading = true;
    this.governatesService.getGovernates();
     this.governatesSubs = this.governatesService.getGovernatesUpdateListener()
    .subscribe(
      (Governates) => {
        this.governates = Governates
        console.log(Governates);
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
    this.governateCode = code;
    this.governateName = name;
  }

  onEdit(code){
    this.mode = "Edit";
    this.disable = "true";
    window.scrollTo(0,0)
    this.governate = this.governates.filter((item)=>{
         return item.GovernorateID == code;
        })[0]
       
        this.GovernateId = this.governate.GovernorateID;
        this.GovernateName = this.governate.GovernorateName;

  }
  
  onDelete(){
    this.governatesService.deleteGovernate(this.governateCode, this.governateName);
    this.ModalRef.hide();
  }

  onSubmit(form: NgForm) {
    
    if (this.mode === "Add") {         //add Governate
      const governate : Governate = {
        GovernorateID : form.value.GovernateId,
        GovernorateName : form.value.GovernateName
      }
        
      this.governatesService.addGovernate(governate);
    } else {                            //Edit Governate
        const updGovernate : Governate = {
          GovernorateID : this.GovernateId,
          GovernorateName : form.value.GovernateName
        }
        console.log(updGovernate);
      this.governatesService.updateGovernate(updGovernate);
    }

    this.mode = "Add";
    this.disable = "false";
    form.resetForm();
  }

  checkIfExist(code){
    console.log(code.value);
    this.exist = false;
    this.governates.filter( governate =>{
      if( governate.GovernorateID == code.value ){
        this.exist = true;
      }
    })
  }

  checkIfNameExist(name){
    console.log(name.value);
    this.nExist = false;
    this.governates.filter( governate =>{
      if( governate.GovernorateName == name.value ){
        this.nExist = true;
      }
    })
  }

  ngOnDestroy(){
    this.governatesSubs.unsubscribe();
  }

}
