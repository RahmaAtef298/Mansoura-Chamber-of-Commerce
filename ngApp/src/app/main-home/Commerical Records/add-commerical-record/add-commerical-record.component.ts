import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { City } from '../../Cities/City.model';
import { Region } from '../../Regions/Region.model';
import { Category } from '../../Categories/Category.model';
import { SubCategory } from '../../SubCategories/SubCategory.model';
import { Subscription, Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommericalRecordsService } from '../commerical-records.service';
import { SubCategoriesService } from '../../SubCategories/sub-categories.service';
import { CategoriesService } from '../../Categories/categories.service';
import { RegionsService } from '../../Regions/regions.service';
import { CitiesService } from '../../Cities/cities.service';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ShahrAqary } from '../../ShahrAqary/ShahrAqary.model';
import { ShahrAqaryService } from '../../ShahrAqary/shahr-aqary.service';
import { GovernatesService } from '../../Governates/governates.service';
import { Governate } from '../../Governates/Governate.model';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Nationalities } from '../Nationalities';
import { CommericalRecord } from '../CommericalRecord.model';
import { CommericalData } from '../CommericalData.model';

@Component({
  selector: 'app-add-commerical-record',
  templateUrl: './add-commerical-record.component.html',
  styleUrls: ['./add-commerical-record.component.scss']
})
export class AddCommericalRecordComponent implements OnInit {

  
  flag = 0;
  isLoading = false;
  ModalRef: BsModalRef;
  commericalAll:CommericalData = new CommericalData();

  //General Data Variable 
  // recordNumber: number = null;
  // ownerName : string = "";
  // organization : string = "";
  // city : string = "";
  // region : string = "";
  // category : string = "";
  // subcategory : string = "";
  // dateFrom : number = null;
  // dateTo : number = null;
  // paidYearOne : number = null;
  // paidYearTwo : number = null;
  // bankruptedCheck = false;
  // voidedCheck = false;
  // cardCheck = false;
  // doublicatedCheck = false;
  // bandarCheck = false;
  // realStartDateCheck = false;
  // address : string = "";
  // phone : string = "";
  // capital1 : number = null;
  // capital2 : number = null;
  // amount1 : number = null;
  // amount2 : number = null;
  // unpaid : number = null;
  // startDate : string = '0000-00-00';
  // notes : string = "";
  selectedData : string[];

  //Low Data Variables
  // licenseApplicant: string = "";
   adjective: string = "";
   mandateType: string = "";
   MandateType: string[] =["عام","خاص"];
  // mandateNumber: number = null;
  // commericalFeature: string = "";
  // commericalName: string = "";
   shahrAqary: string = "";
   compositionBy: string = "";
   compositionSide: string = "";
  // compositionNum: number = null;
  // compositionDate: number = null;
   companyName: string = "";
  // traderNickName: string = "";
  // orgType: string = "";
   organizationState: string = "";
  // incorporationAct: string = "";
  // commericalRegister: string = "";
   governate: string = "";

  //Partner Data
  jop: string = "";
  id: number = null;
  nationality: string = "";
  birthDate: number = null;
  nationalities ;

  //Acitivity Data
  // errandCode: number = null;
  // feesDate: number = null;
  // BetaqaDarebya: string = "";
  // MalafDareby: string = "";
  // cityDivision: string = "";
  // regionDivision: string = "";
  // belongTo: string = "";
  // workDate: number = null;
  // docNumber: number = null;
  // realEstateNumber: string = "";
  // flatNumber: number = null;
  // floor: number = null;
  // endOfLease: number = null;
  // office: string = "";

  //Manger Data
   name: string = "";
   gender: string = "";
   Gender: string[] = ["ذكر","أنثى"];
   achievementType: string = "";
   AchievementType: string[] =["قومى","شخصى"];
  // mangerBirthDate: number = null;
   mangerAdjective: string = "";
   MangerAdjective: string[] = ["له كامل الصلاحيات"];
   powers: string = "";
  // mangerPhone: string = "";
   mangerFax: string = "";
   mangerEmail: string = "";
   website: string = "";

  //Additional Data
  // comName: string = "";
  // telephone1: string = "";
  // telephone2: string = "";
  // mobile: string = "";
  // fax: string = "";
  // email: string = "";
  // corAddress: string = "";
  // jobHistory: string = "";
   traderPhoto: string = "";
   traderPhotoPreview: string = "";
   commericalSign: string = "";
   commericalSignPreview: string = "";

  private cities : City[];
  private citiesSubs : Subscription ;
  citiesNames : string[] = [];
  cityName : string;
  cityCode : number = null;
  City : City;

  private regions : Region[];
  private regionsSubs : Subscription ;
  regionsNames : string[] = [];
  regionName : string;
  regionCode : number = null;
  Region : Region;

  private categories : Category[];
  private categoriesSubs : Subscription ;
  categoriesNames : string[] = [];
  categoryName : string;
  categoryCode : number = null;
  Category : Category;

  subCategories : SubCategory[];
  private subCategoriesSubs : Subscription ;
  subCategoriesNames : string[] = [];
  subCategoryCode : number;
  subCategoryName : string;
  SubCategory : SubCategory;

  shahrAqaryS : ShahrAqary[];
  private shahrAqarySubs : Subscription ;
  shahrAqaryNames : string[] = [];
  shahrAqaryId : number = null;
  shahrAqaryName : string;
  ShahrAqary : ShahrAqary;

  governates : Governate[];
  private governatesSubs : Subscription ;
  governatesNames : string[] = [];
  governateId : number = null;
  governateName : string;
  Governate : Governate;

  organizationsNames : string[] = [];
  Organization ;
  organizationType : number = null;
  organizationName : string;
  organizations = [{type:1,name:"فردى"},
                   {type:2,name:"شركه"},
                   {type:3,name:"شركه مساهمه"},
                   {type:4,name:"شركة توصيه بسيطه"},
                   {type:5,name:"شركه ذات مسؤليه محدوده"},
                   {type:6,name:"جمعيه تعاونيه"}];

  adjectivesNames: string[] = [];
  Adjective;
  adjectiveId: number = null;
  adjectiveName: string;
  adjectives = [{id:1,name:"صاحب منشأه"},
                {id:2,name:"وكيل رسمى"}];

  compositionsNames: string[] = [];
  Composition;
  compositionId: string = "";
  compositionName: string;
  compositions = [{id:1,name:"عقد مسجل ومشهر"},
                {id:2,name:"عقد ثابت التاريخ"},
                {id:3,name:"عقد عرفى"},
                {id:4,name:"جمعيه عموميه عاديه"},
                {id:5,name:"جمعيه عموميه غير عاديه"},
                {id:6,name:"محضر مجلس ادارة"},
                {id:7,name:"قرار مدير الشركه"},
                {id:8,name:"عقد تعديل"}];

  companyTypesNames: string[] = [];
  CompanyType;
  companyTypeId: string = "";
  companyTypeName: string;
  companyTypes = [{id:1,name:"فرع جديد نفس المحافظه"},
                  {id:2,name:"فرع جديد محافظه أخرى"},
                  {id:3,name:"رئيسى آخر"},
                  {id:4,name:"رئيسى آخر محافظه أخرى"}];

  orgTypesNames: string[] = [];
  OrgType;
  orgTypeId: number = null;
  orgTypeName: string;
  orgTypes = [{id:1,name:"فردى"},
              {id:2,name:"شركات اشخاص "},
              {id:3,name:"شركات اموال"}];

  organizationStatusNames: string[] = [];
  OrgnaizationState;
  organizationStateId: string = "";
  organizationStateName: string;
  organizationStatus = [{id:1,name:"مساهمه"},
                      {id:2,name:"تضامن"},
                      {id:3,name:"توصيه"}];

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  constructor(private citiesService: CitiesService, private regionsService : RegionsService, private categoriesService : CategoriesService, private SubCategoriesService : SubCategoriesService, private commericalRecordsService : CommericalRecordsService, private shahrAqaryService : ShahrAqaryService, private governateService : GovernatesService, private toaster: ToastrService, private ModalService: BsModalService) { }

  ngOnInit() {
    this.isLoading = true;
    this.adjectiveId = 1;
    this.orgTypeId = 1;
    this.nationalities = Nationalities;

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
        if (this.flag == 6) {
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
        if (this.flag == 6) {
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
        if (this.flag == 6) {
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
        this.subCategories = subCategories;
        this.flag = this.flag + 1;
        if (this.flag == 6) {
          this.isLoading = false;
        }else{
          this.isLoading = true;
        }
      },
      (error) => console.log(error)
    );

    // Get ShahrAqary
    this.isLoading = true;
    this.shahrAqaryService.getShahrAqaryS();
     this.shahrAqarySubs = this.shahrAqaryService.getShahrAqaryUpdateListener()
    .subscribe(
      (ShahrAqaryS) => {
        this.shahrAqaryS = ShahrAqaryS
        console.log(ShahrAqaryS);
        for (let i = 0; i < ShahrAqaryS.length; i++) {
          let name = ShahrAqaryS[i].ShahrAqaryName;
          this.shahrAqaryNames.push(name)
        }
        console.log(this.shahrAqaryNames);
        this.flag = this.flag + 1;
        if (this.flag == 6) {
          this.isLoading = false;
        }else{
          this.isLoading = true;
        }
      },
      (error) => console.log(error)
    );

    // Get Governates
    this.isLoading = true;
    this.governateService.getGovernates();
     this.governatesSubs = this.governateService.getGovernatesUpdateListener()
    .subscribe(
      (Governates) => {
        this.governates = Governates
        console.log(Governates);
        for (let i = 0; i < Governates.length; i++) {
          let name = Governates[i].GovernorateName;
          this.governatesNames.push(name)
        }
        console.log(this.governatesNames);
        this.flag = this.flag + 1;
        if (this.flag == 6) {
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
    
    
    //Get Adjectives
    for (let i = 0; i < this.adjectives.length; i++) {
             this.adjectivesNames.push(this.adjectives[i].name)
    }

    //Get Compositions
    for (let i = 0; i < this.compositions.length; i++) {
             this.compositionsNames.push(this.compositions[i].name)
    }

    //Get Compant Types
    for (let i = 0; i < this.companyTypes.length; i++) {
             this.companyTypesNames.push(this.companyTypes[i].name)
    }

    //Get Org Types
    for (let i = 0; i < this.orgTypes.length; i++) {
             this.orgTypesNames.push(this.orgTypes[i].name)
    }

    //Get Organization Status
    for (let i = 0; i < this.organizationStatus.length; i++) {
             this.organizationStatusNames.push(this.organizationStatus[i].name)
    }

    //DropDown Setting
    this.dropdownList = this.subCategories;
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'SubCategoryCode',
      textField: 'SubCategoryName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
  }

  readData(data){
    console.log(data);
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
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

  searchOrganizations = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.organizationsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchShahrAqary = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.shahrAqaryNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchGovernates = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.governatesNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchAdjectives = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.adjectivesNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchCompositions = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.compositionsNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchCompanyTypes = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.companyTypesNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchOrgTypes = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.orgTypesNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchNationalities = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.nationalities.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchOrgStatus = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.organizationStatusNames.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchGender = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.Gender.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchAchievementTypes = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.AchievementType.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchMangerAdjective = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.MangerAdjective.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  searchMandate = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.MandateType.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
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

    let subcategories = this.subCategories;
    this.subCategories =[];
    console.log(subcategories);
    console.log(this.subCategories);
    for (let subCatIndex = 0; subCatIndex < subcategories.length; subCatIndex++) {
      if (subcategories[subCatIndex].CategoryCode == this.categoryCode) {
        this.subCategories.push(subcategories[subCatIndex]);
      }
    }
    console.log(this.subCategories);
  }

  getSubCategory(subcategoryName){
    this.SubCategory = this.subCategories.filter((item)=>{
      return item.SubCategoryName == subcategoryName.value;
     })[0]
       
     this.subCategoryCode = this.SubCategory.SubCategoryCode;
     this.subCategoryName = this.SubCategory.SubCategoryName;
    console.log(this.categoryName);
    console.log(this.categoryCode);
  }

  getShahrAqary(shahrAqaryName){
    this.ShahrAqary = this.shahrAqaryS.filter((item)=>{
      return item.ShahrAqaryName == shahrAqaryName.value;
     })[0]
       
     this.shahrAqaryId = this.ShahrAqary.ShahrAqaryID;
     this.shahrAqaryName = this.ShahrAqary.ShahrAqaryName;
  }

  getGovernate(governateName){
    this.Governate = this.governates.filter((item)=>{
      return item.GovernorateName == governateName.value;
     })[0]
       
     this.governateId = this.Governate.GovernorateID;
     this.governateName = this.Governate.GovernorateName;
  }

  getOrganization(orgName){
    this.Organization = this.organizations.filter((item)=>{
      return item.name == orgName.value;
     })[0]
       
     this.organizationType = this.Organization.type;
     this.organizationName = this.Organization.name;
  }

  getAdjective(adjName){
    this.Adjective = this.adjectives.filter((item)=>{
      return item.name == adjName.value;
     })[0] 
     this.adjectiveId = this.Adjective.id;
     this.adjectiveName = this.Adjective.name;
  }

  getComposition(comName){
    this.Composition = this.compositions.filter((item)=>{
      return item.name == comName.value;
     })[0] 
     this.compositionId = this.Composition.id;
     this.compositionName = this.Composition.name;
  }

  getCompanyType(comTypeName){
    this.CompanyType = this.companyTypes.filter((item)=>{
      return item.name == comTypeName.value;
     })[0] 
     this.companyTypeId = this.CompanyType.id;
     this.companyTypeName = this.CompanyType.name;
  }

  getOrgType(orgTypeName){
    this.OrgType = this.orgTypes.filter((item)=>{
      return item.name == orgTypeName.value;
     })[0] 
     this.orgTypeId = this.OrgType.id;
     this.orgTypeName = this.OrgType.name;
  }

  getOrgState(orgStateName){
    this.OrgnaizationState = this.organizationStatus.filter((item)=>{
      return item.name == orgStateName.value;
     })[0] 
     this.organizationStateId = this.OrgnaizationState.id;
     this.organizationStateName = this.OrgnaizationState.name;
  }

  getNationality(Nationality){
    this.nationality = Nationality.value;
    console.log(this.nationality);
  }

  getMandate(mandate){
    this.mandateType = mandate.value;
    console.log(this.mandateType);
  }

  getGender(gend){
    this.gender = gend.value;
    console.log(this.gender);
  }

  getAchievementType(type){
    this.achievementType = type.value;
    console.log(this.achievementType);
  }

  getMangerAdjective(adj){
    this.mangerAdjective = adj.value;
    console.log(this.mangerAdjective);
  }

  openPartnerModal(template: TemplateRef<any>){
    this.ModalRef = this.ModalService.show(template);
  }

  onTraderPhotoPicked(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.toaster.error('Maximum size allowed is ' + max_size / 1000 + 'Mb');

            return false;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                console.log(img_height, img_width);


                if (img_height > max_height && img_width > max_width) {
                    this.toaster.error(
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px');
                    return false;
                } else {
                    const image = e.target.result;
                    this.traderPhotoPreview = image;
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onCommericalSignPicked(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0]) {
        // Size Filter Bytes
        const max_size = 20971520;
        const allowed_types = ['image/png', 'image/jpeg'];
        const max_height = 15200;
        const max_width = 25600;

        if (fileInput.target.files[0].size > max_size) {
            this.toaster.error('Maximum size allowed is ' + max_size / 1000 + 'Mb');

            return false;
        }

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = rs => {
                const img_height = rs.currentTarget['height'];
                const img_width = rs.currentTarget['width'];

                console.log(img_height, img_width);


                if (img_height > max_height && img_width > max_width) {
                    this.toaster.error(
                        'Maximum dimentions allowed ' +
                        max_height +
                        '*' +
                        max_width +
                        'px');
                    return false;
                } else {
                    const image = e.target.result;
                    this.commericalSignPreview = image;
                }
            };
        };

        reader.readAsDataURL(fileInput.target.files[0]);
    }
  }

  onSubmitPartnerData(form:NgForm){
    console.log(form);
    this.id = form.value.id;
    this.jop = form.value.jop;
    this.birthDate = form.value.birthDate;
    this.ModalRef.hide();
  }

  onSubmit(form:NgForm){
    console.log(form);
    let cats = form.value.selectedData;
    for (let index = 0; index < cats.length; index++) {
      this.subCategoriesNames.push(cats[index].SubCategoryName)
    }
    console.log(this.subCategoriesNames);

    //let CommericalRecordData = JSON.parse(JSON.stringify(this.commericalAll));

    this.commericalAll.CommercialRecordsDto.CityCode = this.cityCode;
    this.commericalAll.CommercialRecordsDto.RegionCode = this.regionCode;
    this.commericalAll.CommercialRecordsDto.OrganizationType = this.organizationType;
    this.commericalAll.CommercialRecordsDto.CategoryCode = this.categoryCode;
    this.commericalAll.CommercialRecordsDto.CategoriedList = this.subCategoriesNames;

    this.commericalAll.RecordLawDto.Sefa = this.adjectiveId;
    this.commericalAll.RecordLawDto.TawkeelKind = this.mandateType;
    this.commericalAll.RecordLawDto.CompositionBy = this.compositionId;
    this.commericalAll.RecordLawDto.CompanyType = this.companyTypeId;
    this.commericalAll.RecordLawDto.OrganizationDetailedType = this.orgTypeId;
    this.commericalAll.RecordLawDto.OrganizationStatus = this.organizationStateId;
    this.commericalAll.RecordLawDto.GovernorateID = this.governateId;

    this.commericalAll.RecordManagementDto.Sex = this.gender;
    this.commericalAll.RecordManagementDto.TahqeekShakhsia = this.achievementType;
    this.commericalAll.RecordManagementDto.SefatAlmodeer = this.mangerAdjective;

    this.commericalAll.AdditionalDataDto.MerchantImage = this.traderPhotoPreview;
    this.commericalAll.AdditionalDataDto.CommercialMark = this.commericalSignPreview;

    this.commericalAll.PartnerDto[0].Nationality = this.nationality;

    console.log(this.commericalAll);

    this.commericalRecordsService.addCommericalRecord(this.commericalAll).subscribe((response) => {
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
        console.log(response.Data);
        this.toaster.success("Add Commerical Records Successfully .. ")
      }
     },
    (error) => {
      console.log(error)
    });

    form.reset();
  }

}
