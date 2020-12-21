import { Component, OnInit, TemplateRef } from '@angular/core';
import { Subscription, Subject, Observable, merge } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Region } from '../Region.model';
import { RegionsService } from '../regions.service';
import { NgForm } from '@angular/forms';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { CitiesService } from '../../Cities/cities.service';
import { City } from '../../Cities/City.model';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-list-regions',
  templateUrl: './list-regions.component.html',
  styleUrls: ['./list-regions.component.scss']
})
export class ListRegionsComponent implements OnInit {

  regions : Region[];
  private regionsSubs : Subscription ;
  isLoading = false;
  regionCode : number;
  regionName : string;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  region : Region;
  CityCode: number;
  RegionName: string;
  RegionCode: number;
  Bandar: boolean;
  exist = false;
  nExist = false;
  private cities : City[];
  citiesCodes : string[] = [];
  private citiesSubs : Subscription ;
  router$:Subscription;

  constructor( private regionsService: RegionsService, private citiesService: CitiesService, private route : ActivatedRoute, private ModalService: BsModalService ) { }

  ngOnInit() {

    //Add
    this.isLoading = true;
    this.regionsService.getRegions();
     this.regionsSubs = this.regionsService.getRegionsUpdateListener()
    .subscribe(
      (Regions) => {
        this.regions = Regions
        console.log(Regions);
        this.isLoading = false;
      },
      (error) => console.log(error)
    );

    //List
    this.citiesService.getCities();
    this.citiesSubs = this.citiesService.getCitiesUpdateListener()
    .subscribe(
      (Cities) => {
        this.cities = Cities;
        console.log(Cities);
        for (let i = 0; i < Cities.length; i++) {
          let code = Cities[i].CityCode.toString();
          this.citiesCodes.push(code)
        }
        console.log(this.citiesCodes);
      },
      (error) => 
        console.log(error)
    )

    this.mode = "Add";
    this.disable = "false";
    
  }

  openModal(template : TemplateRef<any> , code, name){
    this.ModalRef = this.ModalService.show(template);
    this.regionCode = code;
    this.regionName = name;
  }

  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.citiesCodes.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  onEdit(code){
    this.mode = "Edit";
    this.disable = "true";
    window.scrollTo(0,400)
    this.region = this.regions.filter((item)=>{
         return item.RegionCode == code;
        })[0]
       
        this.RegionCode = this.region.RegionCode;
        this.RegionName = this.region.RegionName;
        this.CityCode = this.region.CityCode;
        this.Bandar = this.region.Bandar;

  }
  
  onDelete(){
    this.regionsService.deleteRegion(this.regionCode, this.regionName);
    this.ModalRef.hide();
  }

  searchCityCode(code){
    this.regionsService.searchCityCode(code);
  }

  searchcityCodeBandar(cityCode, bandar){
    this.regionsService.searchCityCodeBandar(cityCode, bandar);
    console.log(bandar)
  }

  onSubmit(form: NgForm) {

    console.log(form);
    
    if (this.mode === "Add") {          //add Region
        const Region : Region = {
          RegionCode : form.value.RegionCode,
          RegionName : form.value.RegionName,
          CityCode : form.value.CityCode,
          Bandar : form.value.Bandar
        }
      this.regionsService.addRegion(Region);
    } else {                            //Edit Region
        const updRegion : Region = {
          RegionCode : this.RegionCode,
          RegionName : form.value.RegionName,
          CityCode : form.value.CityName,
          Bandar : form.value.Bandar
        }
      this.regionsService.updateRegion(updRegion);
    }

    this.Bandar = false;
    this.mode = "Add";
    this.disable = "false";
    form.resetForm();
  }

  checkIfExist(code){
    console.log(code.value);
    this.exist = false;
    this.regions.filter( region =>{
      if( region.RegionCode == code.value ){
        this.exist = true;
      }
    })
  }

  checkIfNameExist(name){
    console.log(name.value);
    this.nExist = false;
    this.regions.filter( region =>{
      if( region.RegionName == name.value ){
        this.nExist = true;
      }
    })
  }

  ngOnDestroy(){
    this.regionsSubs.unsubscribe();
    this.router$?this.router$.unsubscribe():null;
  }

}
