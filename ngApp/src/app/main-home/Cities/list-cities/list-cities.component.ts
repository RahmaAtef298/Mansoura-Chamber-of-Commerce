import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subscription, Subject, Observable, merge } from 'rxjs';
import { City } from '../City.model';
import { CitiesService } from '../cities.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgForm } from '@angular/forms';
import { CommericalRegistersService } from '../../Commerical-Registers/commerical-registers.service';
import { CommericalRegister } from '../../Commerical-Registers/CommericalRegister.model';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';


@Component({
  selector: 'app-list-cities',
  templateUrl: './list-cities.component.html',
  styleUrls: ['./list-cities.component.scss']
})
export class ListCitiesComponent implements OnInit, OnDestroy {

  cities : City[];
  private citiesSubs : Subscription ;
  cityCode : number;
  cityName : string;
  isLoading = false;
  ModalRef: BsModalRef;

  mode = "Add";
  disable = "false"
  citCode : string;
  city : City;
  citycode: number;
  cityname: string;
  CommercialRegister: number;
  exist = false;
  nExist = false;
  commericalIDs : string[] = [];
  private commericalRegisters : CommericalRegister[];
  private commericalRegistersSubs : Subscription ;
  router$:Subscription;

  constructor( private citiesService: CitiesService, private ModalService: BsModalService, private commericalRegistersService: CommericalRegistersService, private route : ActivatedRoute ) { }

  ngOnInit() {

    //Add
    this.isLoading = true;
    this.citiesService.getCities();
     this.citiesSubs = this.citiesService.getCitiesUpdateListener()
    .subscribe(
      (Cities) => {
        this.cities = Cities
        console.log(Cities);
        this.isLoading = false;
      },
      (error) => console.log(error)
    );

    //List

    console.log(this.mode);
    //Get Commerical Register ID Drop Down List
    this.commericalRegistersService.getCommericalRegs();
    this.commericalRegistersSubs = this.commericalRegistersService.getCommericalRegsUpdateListener()
    .subscribe(
      (CommericalRegisters) => {
        this.commericalRegisters = CommericalRegisters;
        for (let i = 0; i < CommericalRegisters.length; i++) {
          let id = CommericalRegisters[i].CommercialRegisterId.toString();
          this.commericalIDs.push(id)
        }
        console.log(CommericalRegisters);
      },
      (error) => 
        console.log(error)
    )

    this.mode = "Add";
    this.disable = "false";

  }

  openModal(template : TemplateRef<any> , code, name){
    this.ModalRef = this.ModalService.show(template);
    this.cityCode = code;
    this.cityName = name;
  }
  
  formatter = (result: string) => result.toUpperCase();

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term === '' ? []
        : this.commericalIDs.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10)
        )
    )

  onEdit(code){
    this.mode = "Edit";
    this.disable = "true";
    window.scrollTo(0,0);
    this.city = this.cities.filter((item)=>{
          return item.CityCode == code;
         })[0]
           
         this.citycode = this.city.CityCode;
         this.cityname = this.city.CityName;
         this.CommercialRegister = this.city.CommercialRegister

  }
  
  onDelete(){
    this.citiesService.deleteCity(this.cityCode, this.cityName);
    this.ModalRef.hide();
  }

  searchCityCode(code){
    this.citiesService.searchCityCode(code);
  }

  searchCommericalRegister(cRegister){
    this.citiesService.searchCommericalRegister(cRegister);
  }

  onSubmit(form: NgForm) {
    
    if (this.mode === "Add") {         //add City
        const city : City = {
          CityCode : form.value.citycode,
          CityName : form.value.cityname,
          CommercialRegister : this.CommercialRegister
        }
      this.citiesService.addCity(city);
    } else {                            //Edit City
        const updCity : City = {
          CityCode : this.citycode,
          CityName : form.value.cityname,
          CommercialRegister : this.CommercialRegister
        }
      this.citiesService.updateCity(updCity);
    }

    
    this.mode = "Add";
    this.disable = "false";
    form.resetForm();
  }

  checkIfExist(code){
    console.log(code.value);
    this.exist = false;
    this.cities.filter( city =>{
      if( city.CityCode == code.value ){
        this.exist = true;
      }
    })
  }

  checkIfNameExist(name){
    console.log(name.value);
    this.nExist = false;
    this.cities.filter( city =>{
      if( city.CityName == name.value ){
        this.nExist = true;
      }
    })
  }

  ngOnDestroy(){
    this.citiesSubs.unsubscribe();
    this.router$?this.router$.unsubscribe():null;
  }

}
