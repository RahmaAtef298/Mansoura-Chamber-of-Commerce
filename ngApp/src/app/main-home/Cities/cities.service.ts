import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { City } from './City.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  private cities: City[] = [];
  private searchCitieswithCode: City[] = [];
  private searchCitieswithCR: City[] = [];
  private citiesUpdated = new Subject<City[]>();

  constructor(private http: HttpClient , private router : Router, private toaster: ToastrService) { }

  addCity(city: City) {
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/city/add', city, )
    .subscribe(
      (response) => {
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
            case 3:
              this.toaster.error("Duplicated City Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated City Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
        this.cities.push(city);
        this.citiesUpdated.next([...this.cities]);
        this.toaster.success("City Added Successfully .. ");
        console.log(this.cities);
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getCities() {
   return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/city/list' )
      .pipe( map( citiessData => {
        if (citiessData.statusCode == 204) {
          switch (citiessData.Data ) {
            case 0:
              this.toaster.error("Problem in Server !! ");
              break;
            case 1:
              this.toaster.error("There is no Data to show !! ");
              break;
            case 2:
              this.toaster.error("Wrong Data !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
          return citiessData.Data.map( city => {
            return {
              CityCode : city.CityCode,
              CityName : city.CityName,
              CommercialRegister : city.CommercialRegister
            }
          } )
        }
        })
      )
      .subscribe(transformedCities => {
        this.cities = transformedCities;
        this.citiesUpdated.next([...this.cities]);
      });
  }

  getCitiesUpdateListener() {
    return this.citiesUpdated.asObservable();
  }

  getCity(){
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/city/list', )

  }

  deleteCity(cityCode: number, cityName: string){
    const headers = new HttpHeaders({'Content-Type': 'application/json' , 'Authorization': 'basic MTE4fHx8MTEzOjo6YWRtaW46OjoxMDh8fHwxMi8xNi8yMDE5IDk6MDE6MDcgUE18fHwzLzI0LzIwMjAgOTowMTowNyBQTXx8fDIxfHx8MTIvMTcvMjAxOSAxOjAxOjA3IEFNfHx8MTY2fHx8MTgwfHx8bSFubUB4'});
    console.log(cityCode)
    return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/city/Delete?cityCode=${cityCode}`,{},{headers: headers})
    .subscribe(( response ) => {
      if ( response.statusCode == 204) {
        if (response.Data == 52) {
          this.toaster.warning("Delete Region that Related this City First !! ");
        }
      } else {
      const updatedCities = this.cities.filter
      (city => 
         city.CityCode !== cityCode
        );
      this.cities = updatedCities;
      this.citiesUpdated.next([...this.cities]);
      this.toaster.success(`${cityName} Deleted Successfully .. `)
      }
    })
  }

  updateCity(updCity: City){
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/city/edit',updCity )
    .subscribe((response) => {
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
          case 3:
            this.toaster.error("Duplicated City Code !! ");
            break;
          case 4:
            this.toaster.error("Duplicated City Name !! ");
            break;
        
          default:
            this.toaster.error("Something not Correct !! ");
            break;
        }
      }else{
      const updatedCities = this.cities;
      const oldCityIndex = updatedCities.findIndex(f => f.CityCode === updCity.CityCode);
      const city: City = {
        CityCode : updCity.CityCode,
        CityName : updCity.CityName,
        CommercialRegister : updCity.CommercialRegister
      };
      updatedCities[oldCityIndex] = city;
      this.cities = updatedCities;
      this.citiesUpdated.next([...this.cities]);
      this.toaster.success("City Updated Successfully .. ")
    }
    });
  }

  searchCityCode(cityCode : number){
    console.log(cityCode);
    if (cityCode) {
      this.searchCitieswithCode = [];
      return this.http.get<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/city/GetByCode?cityCode=${cityCode}` )
      .subscribe(transformedCity => {
        this.searchCitieswithCode.push(transformedCity.Data)
        this.citiesUpdated.next([...this.searchCitieswithCode]);
      });
    } else {
      this.getCities();
    }
  }

  searchCommericalRegister(CommericalRegister : number){
   console.log(CommericalRegister)
    if (CommericalRegister) {
      this.searchCitieswithCR = [];
      return this.http.get<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/city/ListByComericalId?comericalId=${CommericalRegister}` )
      .subscribe(transformedCities => {
        this.searchCitieswithCR = transformedCities.Data;
        this.citiesUpdated.next([...this.searchCitieswithCR]);
      });
    } else {
      this.getCities();
    }
  }
}
