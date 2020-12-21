import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Region } from './Region.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class RegionsService {

  private regions: Region[] = [];
  private searchRegionswithCityCode: Region[] = [];
  private searchRegionswithCityCodeBandar: Region[] = [];
  private regionsUpdated = new Subject<Region[]>();

  constructor(private http: HttpClient , private router : Router, private toaster: ToastrService) { }

  addRegion(region: Region) {
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Region/add', region, )
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
              this.toaster.error("Duplicated Region Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated Region Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
        this.regions.push(region);
        this.regionsUpdated.next([...this.regions]);
        this.toaster.success("Region Added Successfully .. ");
        console.log(this.regions);
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getRegions() {
   return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Region/list' )
      .pipe(map( regionsData => {
        if (regionsData.statusCode == 204) {
          switch (regionsData.Data ) {
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
          return regionsData.Data.map( region => {
            return {
              RegionCode: region.RegionCode,
              RegionName: region.RegionName,
              CityCode: region.CityCode,
              Bandar: region.Bandar         
            }
          } )
        }
        })
      )
      .subscribe(transformedRegions => {
        this.regions = transformedRegions;
        this.regionsUpdated.next([...this.regions]);
      });
  }

  getRegionsUpdateListener() {
    return this.regionsUpdated.asObservable();
  }

  getRegion(){
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Region/list', )

  }

  deleteRegion(regionCode: number, regionName: string){
    console.log(regionCode)
    return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/Region/Delete?regionCode=${regionCode}`,{})
    .subscribe(( response ) => {
      if ( response.statusCode == 204) {
        switch (response.Data ) {
          case 51:
            this.toaster.warning("Delete SubCategories First !! ");
            break;
          case 52:
            this.toaster.warning("Delete Regions First !! ");
            break;
          case 53:
            this.toaster.warning("Delete Commerical First !! ");
            break;
          case 54:
            this.toaster.warning("Delete Cities First !! ");
            break;
          case 55:
            this.toaster.warning("Delete Certificates First !! ");
            break;
          case 56:
            this.toaster.warning("Delete Commerical Register First !! ");
            break;
        
          default:
            this.toaster.warning("There is no update in this Data !! ");
            break;
        }
      } else {
      const updatedRegions = this.regions.filter
      (region => 
         region.RegionCode !== regionCode
        );
      this.regions = updatedRegions;
      this.regionsUpdated.next([...this.regions]);
      this.toaster.success(`${regionName} Deleted Successfully .. `)
      }
    })
  }

  updateRegion(updRegion: Region){
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Region/edit',updRegion )
    .subscribe(( response ) => {
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
            this.toaster.error("Duplicated Region Code !! ");
            break;
          case 4:
            this.toaster.error("Duplicated Region Name !! ");
            break;
        
          default:
            this.toaster.error("Something not Correct !! ");
            break;
        }
      }else{
      const updatedRegions = this.regions;
      const oldRegionIndex = updatedRegions.findIndex(f => f.RegionCode === updRegion.RegionCode);
      const region: Region = {
        RegionCode: updRegion.RegionCode,
        RegionName: updRegion.RegionName,
        CityCode: updRegion.CityCode,
        Bandar: updRegion.Bandar
      };
      updatedRegions[oldRegionIndex] = region;
      this.regions = updatedRegions;
      this.regionsUpdated.next([...this.regions]);
      this.toaster.success("Region Updated Successfully .. ");
    }
    });
  }

  searchCityCode(cityCode : number){
    console.log(cityCode);
    if (cityCode) {
      this.searchRegionswithCityCode = [];
      return this.http.get<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/Region/ListByCityCode?cityCode=${cityCode}` )
      .subscribe(transformedRegions => {
        this.searchRegionswithCityCode = transformedRegions.Data;
        this.regionsUpdated.next([...this.searchRegionswithCityCode]);
      });
    } else {
      this.getRegions();
    }
  }

  searchCityCodeBandar(cityCode : number, bandar : boolean){
   console.log(bandar)
    if (cityCode ) {
      this.searchRegionswithCityCodeBandar = [];
      return this.http.get<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/Region/ListByCityCodeBander?cityCode=${cityCode}&bander=${bandar}` )
      .subscribe(transformedRegions => {
        this.searchRegionswithCityCodeBandar = transformedRegions.Data;
        this.regionsUpdated.next([...this.searchRegionswithCityCodeBandar]);
      });
    } else {
      this.getRegions();
    }
  }
  
}
