import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription, Subject, Observable, merge } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SubCategory } from '../SubCategory.model';
import { SubCategoriesService } from '../sub-categories.service';
import { NgForm } from '@angular/forms';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Category } from '../../Categories/Category.model';
import { CategoriesService } from '../../Categories/categories.service';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-list-sub-categories',
  templateUrl: './list-sub-categories.component.html',
  styleUrls: ['./list-sub-categories.component.scss']
})
export class ListSubCategoriesComponent implements OnInit {

  subcategories : SubCategory[];
  private subCategoriesSubs : Subscription ;
  isLoading = false;
  subCategoryCode : number;
  subCategoryName : string;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  subCatCode : string;
  subcategory : SubCategory;
  category : Category;
  categoryCode: number;
  categoryName: string;
  subcategoryCode: number;
  subcategoryName: string;
  nExist = false;
  categories : Category[] ;
  cactegoriesNames : string[] = [];
  categoriesSubs : Subscription ;
  router$:Subscription;


  @ViewChild('instance', {static: true}) instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();
  
  constructor(private SubCategoriesService: SubCategoriesService, private categoriesService: CategoriesService, private route : ActivatedRoute, private ModalService: BsModalService) { }

  ngOnInit() {

    //Add
    this.isLoading = true;
    this.SubCategoriesService.getSubCategories();
    this.subCategoriesSubs = this.SubCategoriesService.getSubCategoriesUpdateListener()
    .subscribe(
      (subCategories) => {
        this.subcategories = subCategories
        console.log(subCategories);
        this.isLoading = false;
      },
      (error) => console.log(error)
    );

    //List
    console.log(this.mode);
    //Get Gategories Drop Down List
    this.categoriesService.getCategories();
    this.categoriesSubs = this.categoriesService.getCategoriesUpdateListener()
    .subscribe(
      (Categories) => {
        this.categories = Categories;
        console.log(Categories);
        for (let i = 0; i < Categories.length; i++) {
            this.cactegoriesNames.push(Categories[i].CategoryName)
        }
        console.log(this.cactegoriesNames);
      },
      (error) => 
        console.log(error)
    )

    this.mode = "Add";
    this.disable = "false";
  }

  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.cactegoriesNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  openModal(template : TemplateRef<any> , code, name){
    this.ModalRef = this.ModalService.show(template);
    this.subCategoryCode = code;
    this.subCategoryName = name;
  }

  onEdit(code){
    this.mode = "Edit";
    this.disable = "true";
    window.scrollTo(0,0)
    this.subcategory = this.subcategories.filter((item)=>{
         return item.SubCategoryCode == code;
        })[0]
       
        this.categoryCode = this.subcategory.CategoryCode;
        this.categoryName = this.subcategory.categoryName;
        this.subcategoryCode = this.subcategory.SubCategoryCode;
        this.subcategoryName = this.subcategory.SubCategoryName;

  }
  
  onDelete(){
    this.SubCategoriesService.deleteSubCategory(this.subCategoryCode, this.subCategoryName);
    this.ModalRef.hide();
  }

  onSubmit(form: NgForm) {

    if (this.mode === "Add") {         //add SubCategory
      const subCategory : SubCategory = {
        CategoryCode : this.categoryCode,
        categoryName : this.categoryName,
        SubCategoryCode :  null,
        SubCategoryName : form.value.subcategoryName
      }

      this.SubCategoriesService.addSubCategory(subCategory);
    } else {                            //Edit SubCategory
      console.log(form.value.categoryName);
      const updSubCategory : SubCategory = {
        CategoryCode : this.categoryCode,
        categoryName : this.categoryName,
        SubCategoryCode :  this.subcategoryCode,
        SubCategoryName : form.value.subcategoryName
      }

      this.SubCategoriesService.updateSubCategory(updSubCategory);
    }
    
    this.mode = "Add";
    this.disable = "false";
    form.resetForm();
  }
  
  checkIfNameExist(name){
    console.log(name.value);
    this.nExist = false;
    this.subcategories.filter( subCategory =>{
      if( subCategory.SubCategoryName == name.value ){
        this.nExist = true;
      }
     });
  }

  getCatName(name){
    console.log(name.value);
    this.category = this.categories.filter((item)=>{
         return item.CategoryName == name.value;
        })[0]
          
        this.categoryCode = this.category.CategoryCode;
        this.categoryName = this.category.CategoryName;

  }

  ngOnDestroy(){
    this.subCategoriesSubs.unsubscribe();
    this.router$?this.router$.unsubscribe():null;
  }

}
