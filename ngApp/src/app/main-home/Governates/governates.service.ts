import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Governate } from './Governate.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GovernatesService {

  private governates: Governate[] = [];
  private governatesUpdated = new Subject<Governate[]>();

  constructor(private http: HttpClient , private router : Router, private toaster: ToastrService) { }

  addGovernate(governate : Governate) {
    
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Governate/add', governate )
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
              this.toaster.error("Duplicated Governate Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated Governate Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
        console.log(response);
        console.log(response.Data);
        const Governate : Governate = {
          GovernorateID : response.Data,
          GovernorateName : governate.GovernorateName
        }
        this.governates.push(Governate);
        this.governatesUpdated.next([...this.governates]);
        this.toaster.success("Governate Added Successfully .. ")
        console.log(this.governates);
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getGovernates() {
  
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Governate/list')
      .pipe(
        map( governatesData => {
          if (governatesData.statusCode == 204) {
            switch (governatesData.Data ) {
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
          return governatesData.Data.map( governate => {
            return {
              GovernorateID: governate.GovernorateID,
              GovernorateName: governate.GovernorateName
            }
          } )
        }
        })
      )
      .subscribe(transformedGovernates => {
        this.governates = transformedGovernates;
        this.governatesUpdated.next([...this.governates]);
      });
  }

  getGovernatesUpdateListener() {
    return this.governatesUpdated.asObservable();
  }

  getGovernate(){
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Governate/list')

  }

  deleteGovernate(GovCode: number, GovName: string){
    console.log(GovCode)
    return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/Governate/Delete?governorateId=${GovCode}`,{})
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
      const updatedGovernates = this.governates.filter
      ( governate => 
         governate.GovernorateID !== GovCode
        );
      this.governates = updatedGovernates;
      this.governatesUpdated.next([...this.governates]);
      this.toaster.success(`${GovName} Deleted Successfully .. `)
      }
    })

  }

  updateGovernate(updGovernate: Governate){
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/Governate/edit',updGovernate )
    .subscribe(( response) => {
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
              this.toaster.error("Duplicated Governate Code !! ");
              break;
          case 4:
              this.toaster.error("Duplicated Governate Name !! ");
              break;
          
          default:
              this.toaster.error("Something not Correct !! ");
              break;
        }
      }else{
      const updatedGovernates = this.governates;
      const oldGovernateIndex = updatedGovernates.findIndex(f => f.GovernorateID === updGovernate.GovernorateID);
      const governate: Governate = {
        GovernorateID: updGovernate.GovernorateID,
        GovernorateName: updGovernate.GovernorateName
      };
      updatedGovernates[oldGovernateIndex] = governate;
      this.governates = updatedGovernates;
      this.governatesUpdated.next([...this.governates]);
      this.toaster.success("Governate Updated Successfully .. ");
    }
    });
  }
  
}
