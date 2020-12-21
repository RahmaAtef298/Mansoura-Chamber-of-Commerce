import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router, NavigationEnd, ActivationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Category } from '../Category.model';
import { CategoriesService } from '../categories.service';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-list-categories',
  templateUrl: './list-categories.component.html',
  styleUrls: ['./list-categories.component.scss']
})
export class ListCategoriesComponent implements OnInit, OnDestroy {

  categories : Category[];
  private categoriesSubs : Subscription ;
  categoryCode : number;
  categoryName : string;
  isLoading = false;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  catCode : string;
  category : Category;
  categorycode: number;
  categoryname: string;
  exist = false;
  nExist = false;
  router$:Subscription;

  constructor( private categoriesService: CategoriesService, private ModalService: BsModalService, private route : ActivatedRoute ) { }

  ngOnInit() {
    
    //add
    this.isLoading = true;
    this.categoriesService.getCategories();
     this.categoriesSubs = this.categoriesService.getCategoriesUpdateListener()
    .subscribe(
      (Categories) => {
        this.categories = Categories;
        console.log(Categories);
        this.isLoading = false;
      },
      (error) => 
        console.log(error)
    )

    //list

    this.mode = "Add";
    this.disable = "false";
    this.catCode = null;
  }

  openModal(template : TemplateRef<any> , code, name){
    this.ModalRef = this.ModalService.show(template);
    this.categoryCode = code;
    this.categoryName = name;
  }

  onEdit(code){
    this.mode = "Edit";
    this.disable = "true";
    window.scrollTo(0,0);
    this.category = this.categories.filter((item)=>{
         return item.CategoryCode == code;
        })[0]
        this.categorycode=this.category.CategoryCode;
        this.categoryname=this.category.CategoryName;
  }
  
  onDelete(){
    this.categoriesService.deleteCategory(this.categoryCode,this.categoryName);
    this.ModalRef.hide();
  }

  onSubmit(form: NgForm) {
    console.log(form);
    console.log(this.exist);
    
    if (this.mode === "Add") {         //add Category
        const Category : Category = {
          CategoryCode : form.value.categorycode,
          CategoryName : form.value.categoryname,
          oldCategoryCode : null
        }
      this.categoriesService.addCategory(Category);
    } else {                            //Edit Category
        const updCategory : Category = {
          CategoryCode : this.categorycode,
          CategoryName : form.value.categoryname,
          oldCategoryCode : this.categorycode
        }
        console.log(updCategory);
      this.categoriesService.updateCategory(updCategory);
    }

    this.mode = "Add";
    this.disable = "false";
    form.resetForm();
  }

  checkIfExist(code){
    console.log(code.value);
    this.exist = false;
    this.categories.filter( category =>{
      if( category.CategoryCode == code.value ){
        this.exist = true;
      }
    })
  }

  checkIfNameExist(name){
    console.log(name.value);
    this.nExist = false;
    this.categories.filter( category =>{
      if( category.CategoryName == name.value ){
        this.nExist = true;
      }
    })
  }

  ngOnDestroy(){
    this.categoriesSubs.unsubscribe();
    this.router$?this.router$.unsubscribe():null;
  }


}
