import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommericalRegister } from './CommericalRegister.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CommericalRegistersService {

  private commericalRegs: CommericalRegister[] = [];
  private commericalRegsUpdated = new Subject<CommericalRegister[]>();

  constructor(private http: HttpClient , private router : Router, private toaster: ToastrService) { }

  addCommericalReg(commericalReg: CommericalRegister) {
    
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/ComericalReg/add', commericalReg )
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
              this.toaster.error("Duplicated Commerical Register Code !! ");
              break;
            case 4:
              this.toaster.error("Duplicated Commerical Register Name !! ");
              break;
          
            default:
              this.toaster.error("Something not Correct !! ");
              break;
          }
        }else{
        console.log(commericalReg);
        console.log(response.Data);
        const CommericalReg : CommericalRegister = {
          CommercialRegisterId : response.Data,
          RegisterCommercialName : commericalReg.RegisterCommercialName
        }
        this.commericalRegs.push(CommericalReg);
        this.commericalRegsUpdated.next([...this.commericalRegs]);
        console.log(this.commericalRegs);
        this.toaster.success("Commerical Register Added Successfully .. ");
        }
      },
      (error) => {
        console.log(error)
      }
    );
  }

  getCommericalRegs() {
  
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/ComericalReg/list')
      .pipe(
        map(commericalRegsData => {
          if (commericalRegsData.statusCode == 204) {
            switch (commericalRegsData.Data ) {
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
          return commericalRegsData.Data.map( commericalReg => {
            return {
              CommercialRegisterId : commericalReg.CommercialRegisterId,
              RegisterCommercialName : commericalReg.RegisterCommercialName
            }
          } )
        }
        })
      )
      .subscribe(transformedCommericalRegs => {
        this.commericalRegs = transformedCommericalRegs;
        this.commericalRegsUpdated.next([...this.commericalRegs]);
      });
  }

  getCommericalRegsUpdateListener() {
    return this.commericalRegsUpdated.asObservable();
  }

  getCommericalReg(){
    return this.http.get<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/ComericalReg/list')

  }

  deleteCommericalReg(CRId: number, CRName: string){
    console.log(CRId)
    return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:9999/api/ComericalReg/delete?comericalRegId=${CRId}`,{})
    .subscribe(( response ) => {
      if ( response.statusCode == 204) {
        if (response.Data == 54) {
          this.toaster.warning("Delete Cities that Related this Commerical Register First !!  ");
        }
      } else {
      const updatedCommericalRegs = this.commericalRegs.filter
      ( commericalReg => 
        commericalReg.CommercialRegisterId !== CRId
        );
      this.commericalRegs = updatedCommericalRegs;
      this.commericalRegsUpdated.next([...this.commericalRegs]);
      this.toaster.success(`${CRName} Deleted Successfully .. `)
      }
    })

  }

  updateCommericalReg(updCommericalReg: CommericalRegister){
    return this.http.post<{ statusCode: number; Data: any }>('http://10.0.0.10:9999/api/ComericalReg/edit',updCommericalReg )
    .subscribe(( response ) => {
      if (response.statusCode == 204) {
        this.toaster.warning("Duplicated Commerical Register Name !! ")
      }else{
      const updatedCommericalRegs = this.commericalRegs;
      const oldCategoryIndex = updatedCommericalRegs.findIndex(f => f.CommercialRegisterId === updCommericalReg.CommercialRegisterId);
      const commericalReg: CommericalRegister = {
        CommercialRegisterId: updCommericalReg.CommercialRegisterId,
        RegisterCommercialName: updCommericalReg.RegisterCommercialName
      };
      updatedCommericalRegs[oldCategoryIndex] = commericalReg;
      this.commericalRegs = updatedCommericalRegs;
      this.commericalRegsUpdated.next([...this.commericalRegs]);
      this.toaster.success("Commerical Register Updated Successfully .. ")
    }
    });
  }
}
