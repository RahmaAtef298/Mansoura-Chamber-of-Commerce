import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { ShahrAqary } from '../ShahrAqary.model';
import { ShahrAqaryService } from '../shahr-aqary.service';

@Component({
  selector: 'app-list-shahr-aqary',
  templateUrl: './list-shahr-aqary.component.html',
  styleUrls: ['./list-shahr-aqary.component.scss']
})
export class ListShahrAqaryComponent implements OnInit {

  private shahrAqaryS : ShahrAqary[];
  private shahrAqarySubs : Subscription;
  isLoading = false;
  SACode : number;
  SAName : string;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  ShahrId : string;
  shahrAqary : ShahrAqary;
  ShahrAqaryId : number;
  ShahrAqaryName : string;
  exist = false;
  nExist = false;
  router$ : Subscription;

  constructor( private shahrAqaryService: ShahrAqaryService, private route : ActivatedRoute, private ModalService: BsModalService ) { }

  ngOnInit() {

    //Add
    this.isLoading = true
    this.shahrAqaryService.getShahrAqaryS();
     this.shahrAqarySubs = this.shahrAqaryService.getShahrAqaryUpdateListener()
    .subscribe(
      ( ShahrAqaryS) => {
        this.shahrAqaryS = ShahrAqaryS
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
    this.SACode = code;
    this.SAName = name;
  }

  onEdit(code){
    this.mode = "Edit";
    this.disable = "true";
    window.scrollTo(0,0);
    this.shahrAqary = this.shahrAqaryS.filter((item)=>{
         return item.ShahrAqaryID == code;
        })[0]
       
        this.ShahrAqaryId = this.shahrAqary.ShahrAqaryID;
        this.ShahrAqaryName = this.shahrAqary.ShahrAqaryName;

  }
  
  onDelete(){
    this.shahrAqaryService.deleteShahrAqary(this.SACode, this.SAName);
    this.ModalRef.hide();
  }

  searchShahrAqaryId(id){
    this.shahrAqaryService.searchShahrAqaryId(id);
  }

  onSubmit(form: NgForm) {
    
    if (this.mode === "Add") {         //add ShahrAqary
      const shahrAqary : ShahrAqary = {
        ShahrAqaryID : form.value.ShahrAqaryId,
        ShahrAqaryName : form.value.ShahrAqaryId
      }
        
      this.shahrAqaryService.addShahrAqary(shahrAqary);

    } else {                            //Edit ShahrAqary
        const updShahrAqary : ShahrAqary = {
          ShahrAqaryID : this.ShahrAqaryId,
          ShahrAqaryName : form.value.ShahrAqaryName
        }
        console.log(updShahrAqary);
      this.shahrAqaryService.updateShahrAqary(updShahrAqary);
    }

    this.mode = "Add";
    this.disable = "false";
    form.resetForm();
  }

  checkIfExist(code){
    console.log(code.value);
    this.exist = false;
    this.shahrAqaryS.filter( shahrAqary =>{
      if( shahrAqary.ShahrAqaryID == code.value ){
        this.exist = true;
      }
    })
  }

  checkIfNameExist(name){
    console.log(name.value);
    this.nExist = false;
    this.shahrAqaryS.filter( shahrAqary =>{
      if( shahrAqary.ShahrAqaryName == name.value ){
        this.nExist = true;
      }
    })
  }

  ngOnDestroy(){
    this.shahrAqarySubs.unsubscribe();
    this.router$?this.router$.unsubscribe():null;
  }

}
