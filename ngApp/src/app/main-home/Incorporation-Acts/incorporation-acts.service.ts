import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IncorporationAct } from './IncorporationAct.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class IncorporationActsService {

  private incorporationActs: IncorporationAct[] = [];
  private incorporationActUpdated = new Subject<IncorporationAct[]>();

  constructor(private http: HttpClient , private router : Router, private toaster: ToastrService) { }

  addIncorporationAct(incorporationAct : IncorporationAct) {
    
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/IncorporationAct/AddIncorporationAct', incorporationAct )
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
              this.toaster.error("Duplicated Incorporation Act Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated Incorporation Act Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
        console.log(incorporationAct);
        console.log(response);
        const IncorporationAct : IncorporationAct = {
          IncorporationActId : response.Data,
          IncorporationActName : incorporationAct.IncorporationActName
        }
        this.incorporationActs.push(IncorporationAct);
        this.incorporationActUpdated.next([...this.incorporationActs]);
        this.toaster.success("Incorporation Added Successfully .. ")
        console.log(this.incorporationActs);
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getIncorporationActs() {
  
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/IncorporationAct/GetIncorporationAct')
      .pipe(
        map( incorporationActsData => {
          if (incorporationActsData.statusCode == 204) {
            switch (incorporationActsData.Data ) {
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
            console.log(incorporationActsData);
          return incorporationActsData.Data.map( incorporationAct => {
            return {
              IncorporationActId : incorporationAct.IncorporationActId,
              IncorporationActName : incorporationAct.IncorporationActName
            }
          } )
        }
        })
      )
      .subscribe(transformedincorporationActs => {
        this.incorporationActs = transformedincorporationActs;
        this.incorporationActUpdated.next([...this.incorporationActs]);
      });
  }

  getIncorporationActsUpdateListener() {
    return this.incorporationActUpdated.asObservable();
  }

  getIncorporationAct(){
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/IncorporationAct/GetIncorporationAct')

  }

  deleteIncorporationAct(IActCode: number, IActName:  string){
    console.log(IActCode)
    return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/IncorporationAct/DeleteIncorporationAct?incorporationActId=${IActCode}`,{})
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
      const updatedIncorporationActs = this.incorporationActs.filter
      ( incorporationAct => 
        incorporationAct.IncorporationActId !== IActCode
        );
      this.incorporationActs = updatedIncorporationActs;
      this.incorporationActUpdated.next([...this.incorporationActs]);
      this.toaster.success(`${IActName} Deleted Successfully .. `)
      }
    })

  }

  updateIncorporationAct(updIncorporationAct: IncorporationAct){
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/IncorporationAct/EditIncorporationAct', updIncorporationAct )
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
            this.toaster.error("Duplicated Incorporation act Code !! ");
            break;
          case 4:
            this.toaster.error("Duplicated Incorporation act Name !! ");
            break;
        
          default:
            this.toaster.error("Something not Correct !! ");
            break;
        }
      }else{
      const updatedIncorporationActs = this.incorporationActs;
      const oldIncorporationActIndex = updatedIncorporationActs.findIndex(f => f.IncorporationActId === updIncorporationAct.IncorporationActId);
      const incorporationAct: IncorporationAct = {
        IncorporationActId : updIncorporationAct.IncorporationActId,
        IncorporationActName : updIncorporationAct.IncorporationActName
      };
      updatedIncorporationActs[oldIncorporationActIndex] = incorporationAct;
      this.incorporationActs = updatedIncorporationActs;
      this.incorporationActUpdated.next([...this.incorporationActs]);
      this.toaster.success("Incorporation Updated Successfully .. ");
    }
    });
  }
  
}
