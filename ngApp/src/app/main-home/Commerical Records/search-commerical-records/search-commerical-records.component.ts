import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { CitiesService } from '../../Cities/cities.service';
import { RegionsService } from '../../Regions/regions.service';
import { CategoriesService } from '../../Categories/categories.service';
import { SubCategoriesService } from '../../SubCategories/sub-categories.service';
import { City } from '../../Cities/City.model';
import { SubCategory } from '../../SubCategories/SubCategory.model';
import { Category } from '../../Categories/Category.model';
import { Region } from '../../Regions/Region.model';
import { CommericalRecord } from '../CommericalRecord.model';
import { CommericalRecordsService } from '../commerical-records.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-commerical-records',
  templateUrl: './search-commerical-records.component.html',
  styleUrls: ['./search-commerical-records.component.scss']
})
export class SearchCommericalRecordsComponent implements OnInit {

  flag = 0;
  loadRecordsList ;
  commericalRecords: CommericalRecord[] = [];
  commericalRecordsUpdated = new Subject<CommericalRecord[]>();

  recordNumber : string;
  ownerName : string;
  organization : string;
  city : string;
  region : string;
  category : string
  subcategory : string
  dateFrom : Date;
  dateTo : Date;
  paidYearOne : number;
  paidYearTwo : number;
  isLoading = false;
  bankruptedCheck = false;
  voidedCheck = false;
  cardCheck = false;
  doublicatedCheck = false;
  bandarCheck = false;

  private cities : City[];
  private citiesSubs : Subscription ;
  citiesNames : string[] = [];
  cityName : string;
  cityCode : number;
  City : City;

  private regions : Region[];
  private regionsSubs : Subscription ;
  regionsNames : string[] = [];
  regionName : string;
  regionCode : number;
  Region : Region;

  private categories : Category[];
  private categoriesSubs : Subscription ;
  categoriesNames : string[] = [];
  categoryName : string;
  categoryCode : number;
  Category : Category;

  private subCategories : SubCategory[];
  private subCategoriesSubs : Subscription ;
  subCategoriesNames : string[] = [];
  subCategoryCode : number;
  subCategoryName : string;
  SubCategory : SubCategory;

  organizationsNames : string[] = [];
  Organization ;
  organizationType : number;
  organizationName : string;
  organizations = [{type:1,name:"فردى"},
                   {type:2,name:"شركه"},
                   {type:3,name:"شركه مساهمه"},
                   {type:4,name:"شركة توصيه بسيطه"},
                   {type:5,name:"شركه ذات مسؤليه محدوده"},
                   {type:6,name:"جمعيه تعاونيه"}];

  constructor(private citiesService: CitiesService, private regionsService : RegionsService, private categoriesService : CategoriesService, private SubCategoriesService : SubCategoriesService, private commericalRecordsService : CommericalRecordsService, private toaster: ToastrService) { }

  ngOnInit() {
    this.isLoading = true;
    this.loadRecordsList = false;

    // Get Cities
    this.citiesService.getCities();
    this.citiesSubs = this.citiesService.getCitiesUpdateListener()
    .subscribe(
      (Cities) => {
        this.cities = Cities;
        console.log(Cities);
        for (let i = 0; i < Cities.length; i++) {
          let name = Cities[i].CityName;
          this.citiesNames.push(name)
        }
        console.log(this.citiesNames);
        this.flag = this.flag + 1;
        if (this.flag == 4) {
          this.isLoading = false;
        }else{
          this.isLoading = true;
        }
      },
      (error) => 
        console.log(error)
    )

    // Get Regions
    this.isLoading = true;
    this.regionsService.getRegions();
     this.regionsSubs = this.regionsService.getRegionsUpdateListener()
    .subscribe(
      (Regions) => {
        this.regions = Regions
        console.log(Regions);
        for (let i = 0; i < Regions.length; i++) {
          let name = Regions[i].RegionName;
          this.regionsNames.push(name)
        }
        console.log(this.regionsNames);
        this.flag = this.flag + 1;
        if (this.flag == 4) {
          this.isLoading = false;
        }else{
          this.isLoading = true;
        }
      },
      (error) => console.log(error)
    );

    // Get Categories
    this.categoriesService.getCategories();
    this.categoriesSubs = this.categoriesService.getCategoriesUpdateListener()
    .subscribe(
      (Categories) => {
        this.categories = Categories;
        console.log(Categories);
        for (let i = 0; i < Categories.length; i++) {
            this.categoriesNames.push(Categories[i].CategoryName)
        }
        console.log(this.categoriesNames);
        this.flag = this.flag + 1;
        if (this.flag == 4) {
          this.isLoading = false;
        }else{
          this.isLoading = true;
        }
      },
      (error) => 
        console.log(error)
    )

    // Get SubCategories
    this.isLoading = true;
    this.SubCategoriesService.getSubCategories();
    this.subCategoriesSubs = this.SubCategoriesService.getSubCategoriesUpdateListener()
    .subscribe(
      (subCategories) => {
        this.subCategories = subCategories
        console.log(subCategories);
        for (let i = 0; i < subCategories.length; i++) {
            this.subCategoriesNames.push(subCategories[i].SubCategoryName)
        }
        console.log(this.subCategoriesNames);
        this.flag = this.flag + 1;
        if (this.flag == 4) {
          this.isLoading = false;
        }else{
          this.isLoading = true;
        }
      },
      (error) => console.log(error)
    );

    //Get Organizations
    for (let i = 0; i < this.organizations.length; i++) {
            this.organizationsNames.push(this.organizations[i].name)
        }
    console.log(this.organizationsNames);
  }

  formatter = (result: string) => result.toUpperCase();

  searchCities = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.citiesNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchRegions = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.regionsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchCategories = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.categoriesNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchSubCategories = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.subCategoriesNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchOrganizations = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.organizationsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  getCity(cityname){
    this.City = this.cities.filter((item)=>{
      return item.CityName == cityname.value;
     })[0]
       
     this.cityCode = this.City.CityCode;
     this.cityName = this.City.CityName;
    console.log(this.cityCode);
    console.log(this.cityName);
    
    this.regionsNames =[];
    for (let regionIndex = 0; regionIndex < this.regions.length; regionIndex++) {
      if (this.regions[regionIndex].CityCode == this.cityCode) {
        this.regionsNames.push(this.regions[regionIndex].RegionName);
      }
    }
    console.log(this.regionsNames);
  }

  getRegion(regionname){
    console.log(regionname);
    this.Region = this.regions.filter((item)=>{
      return item.RegionName == regionname.value;
     })[0]
       
     this.regionCode = this.Region.RegionCode;
     this.regionName = this.Region.RegionName;
    console.log(this.regionCode);
    console.log(this.regionName);
  }

  getCategory(categoryname){
    this.Category = this.categories.filter((item)=>{
      return item.CategoryName == categoryname.value;
     })[0]
       
     this.categoryCode = this.Category.CategoryCode;
     this.categoryName = this.Category.CategoryName;
    console.log(this.categoryName);
    console.log(this.categoryCode);

    this.subCategoriesNames = [];
    console.log(this.subCategoriesNames);
    for (let subCatIndex = 0; subCatIndex < this.subCategories.length; subCatIndex++) {
      if (this.subCategories[subCatIndex].CategoryCode == this.categoryCode) {
        this.subCategoriesNames.push(this.subCategories[subCatIndex].SubCategoryName);
      }
    }
    console.log(this.subCategoriesNames);
  }

  getSubCategory(subcategoryname){
    this.SubCategory = this.subCategories.filter((item)=>{
      return item.SubCategoryName == subcategoryname.value;
     })[0]
       
     this.subCategoryCode = this.SubCategory.SubCategoryCode;
     this.subCategoryName = this.SubCategory.SubCategoryName;
    console.log(this.categoryName);
    console.log(this.categoryCode);
  }

  getOrganization(orgName){
    this.Organization = this.organizations.filter((item)=>{
      return item.name == orgName.value;
     })[0]
       
     this.organizationType = this.Organization.type;
     this.organizationName = this.Organization.name;
    console.log(this.organizationType);
    console.log(this.organizationName);
  }
  
  onSubmit(form :NgForm){
    const commericalRecord : any = {
      RecordNumber: form.value.recordNumber,
      OwnerName: form.value.ownerName,
      CityCode: this.cityCode,
      RegionCode: this.regionCode,
      OrganizationType: this.organizationType,
      CategoryCode: this.categoryCode,
      SubCategoryCode: this.subCategoryCode,
      StartDateFrom: form.value.dateFrom,
      StartDateTo: form.value.dateTo,
      Bandar: form.value.IsBandar
  }
  this.commericalRecordsService.searchCommericalRecord(commericalRecord).subscribe((response) => {
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
        case 150:
          this.toaster.error("Invalid Document Type Id !! ");
          break;
        case 151:
          this.toaster.error("Invalid Employee Id !! ");
          break;
        case 152:
          this.toaster.error("Record Serial Not Found !! ");
          break;
        case 153:
          this.toaster.error("Document Not Found !! ");
          break;
      
        default:
          this.toaster.error("Something not Correct !! ");
          break;
      }
    }else{
      this.loadRecordsList = true;
      this.commericalRecords = response.Data;
      console.log(response.Data);
      this.commericalRecordsUpdated.next([...this.commericalRecords]);
      this.commericalRecordsUpdated.subscribe(
        (CommericalRecords) => {
          this.commericalRecords = CommericalRecords
        },
        (error) => console.log(error)
      );
      this.toaster.success("Get Commerical Records Successfully .. ")
    }
   },
  (error) => {
    console.log(error)
  });
  }

  ngOnDestroy(){
    this.commericalRecordsUpdated.unsubscribe();
  }
}
