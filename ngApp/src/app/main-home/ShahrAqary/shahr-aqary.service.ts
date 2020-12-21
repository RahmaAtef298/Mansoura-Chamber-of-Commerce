import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ShahrAqary } from './ShahrAqary.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ShahrAqaryService {

  private ShahrAqary: ShahrAqary[] = [];
  private searchShahrAqarywithId: ShahrAqary[] = [];
  private ShahrAqaryUpdated = new Subject<ShahrAqary[]>();

  constructor(private http: HttpClient , private router : Router, private toaster: ToastrService) { }

  addShahrAqary(shahrAqary: ShahrAqary) {
    
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/ShahrAqary/add', shahrAqary )
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
              this.toaster.error("Duplicated Shahr Aqary Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated Shahr Aqary Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
          const ShahrAqary : ShahrAqary = {
            ShahrAqaryID : response.Data,
            ShahrAqaryName : shahrAqary.ShahrAqaryName
          }
        this.ShahrAqary.push(ShahrAqary);
        this.ShahrAqaryUpdated.next([...this.ShahrAqary]);
        this.toaster.success("Shahr Aqary Added Successfully .. ");
        console.log(this.ShahrAqary);
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getShahrAqaryS() {
   return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/ShahrAqary/list' )
      .pipe(
        map( shahraqaryData => {
          if (shahraqaryData.statusCode == 204) {
            switch (shahraqaryData.Data ) {
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
          return shahraqaryData.Data.map( shahraqary => {
            return {
              ShahrAqaryID : shahraqary.ShahrAqaryID,
              ShahrAqaryName : shahraqary.ShahrAqaryName
            }
          } )
        }
        })
      )
      .subscribe(transformedCities => {
        this.ShahrAqary = transformedCities;
        this.ShahrAqaryUpdated.next([...this.ShahrAqary]);
      });
  }

  getShahrAqaryUpdateListener() {
    return this.ShahrAqaryUpdated.asObservable();
  }

  getShahrAqary(){
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/ShahrAqary/list', )

  }

  deleteShahrAqary(shahrAqaryCode: number, shahrAqaryName: string){
    // const headers = new HttpHeaders({'Content-Type': 'application/json' , 'Authorization': 'basic MTE4fHx8MTEzOjo6YWRtaW46OjoxMDh8fHwxMi8xNi8yMDE5IDk6MDE6MDcgUE18fHwzLzI0LzIwMjAgOTowMTowNyBQTXx8fDIxfHx8MTIvMTcvMjAxOSAxOjAxOjA3IEFNfHx8MTY2fHx8MTgwfHx8bSFubUB4'});
    console.log(shahrAqaryCode)
    return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/ShahrAqary/Delete?shahrAqaryId=${shahrAqaryCode}`,{})
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
      const updatedCities = this.ShahrAqary.filter
      ( shahraqary => 
         shahraqary.ShahrAqaryID !== shahrAqaryCode
        );
      this.ShahrAqary = updatedCities;
      this.ShahrAqaryUpdated.next([...this.ShahrAqary]);
      this.toaster.success(`${shahrAqaryName} Deleted Successfully .. `)
      }
    })
  }

  updateShahrAqary(updShahraqary: ShahrAqary){
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/ShahrAqary/edit', updShahraqary )
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
            this.toaster.error("Duplicated Shahr Aqary Code !! ");
            break;
          case 4:
            this.toaster.error("Duplicated Shahr Aqary Name !! ");
            break;
        
          default:
            this.toaster.error("Something not Correct !! ");
            break;
        }
      }else{
      const updatedShahrAqarys = this.ShahrAqary;
      const oldShahrAqaryIndex = updatedShahrAqarys.findIndex(f => f.ShahrAqaryID === updShahraqary.ShahrAqaryID);
      const shahrAqary: ShahrAqary = {
        ShahrAqaryID : updShahraqary.ShahrAqaryID,
        ShahrAqaryName : updShahraqary.ShahrAqaryName
      };
      updatedShahrAqarys[oldShahrAqaryIndex] = shahrAqary;
      this.ShahrAqary = updatedShahrAqarys;
      this.ShahrAqaryUpdated.next([...this.ShahrAqary]);
      this.toaster.success("Shahr Aqary Updated Successfully .. ");
      }
    });
  }

  searchShahrAqaryId(SACode : number){
    console.log(SACode);
    if (SACode) {
      this.searchShahrAqarywithId = [];
      return this.http.get<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/ShahrAqary/getbycode?shahrAqaryId=${SACode}` )
      .subscribe(transformedShahrAqary => {
        console.log(transformedShahrAqary.Data);
        this.searchShahrAqarywithId = transformedShahrAqary.Data;
        this.ShahrAqaryUpdated.next([...this.searchShahrAqarywithId]);
      });
    } else {
      this.getShahrAqaryS();
    }
  }
}
