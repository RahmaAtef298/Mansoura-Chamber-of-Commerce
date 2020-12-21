import { NgModule } from '@angular/core';
import { CommericalRoutingModule } from './commerical-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SharedModule } from '../shared.module';
import { SearchCommericalRecordsComponent } from 'src/app/main-home/Commerical Records/search-commerical-records/search-commerical-records.component';
import { AddCommericalRecordComponent } from 'src/app/main-home/Commerical Records/add-commerical-record/add-commerical-record.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    SearchCommericalRecordsComponent,
    AddCommericalRecordComponent
  ],
  imports: [
    CommericalRoutingModule,
    RouterModule,
    FormsModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot()
  ]
})
export class CommericalRecordsModule { }
