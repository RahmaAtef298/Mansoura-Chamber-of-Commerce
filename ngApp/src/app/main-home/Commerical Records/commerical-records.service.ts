import { Injectable } from '@angular/core';
import { CommericalRecord } from './CommericalRecord.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { CommericalData } from './CommericalData.model';

@Injectable({
  providedIn: 'root'
})
export class CommericalRecordsService {

  private commericalRecords: CommericalRecord[] = [];
  private commericalRecordsUpdated = new Subject<CommericalRecord[]>();

  constructor(private http: HttpClient, private toaster: ToastrService) { }

  searchCommericalRecord(commericalRecord : CommericalRecord){
    console.log(commericalRecord)
     if (commericalRecord) {
       return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:5757/api/records/getrecords` , commericalRecord ); 
     } 
    }

  addCommericalRecord(commericalRecord : CommericalData){
    console.log(commericalRecord)
     if (commericalRecord) {
       return this.http.post<{ statusCode: number; Data: any }>(`http://10.0.0.10:5757/api/records/addTabs` , commericalRecord ); 
     } 
    }
}
