import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from 'src/app/Administration/auth.guard';
import { SearchCommericalRecordsComponent } from 'src/app/main-home/Commerical Records/search-commerical-records/search-commerical-records.component';
import { AddCommericalRecordComponent } from 'src/app/main-home/Commerical Records/add-commerical-record/add-commerical-record.component';


const routes: Routes = [
  { path: '', children :[
    { path: '' , component: SearchCommericalRecordsComponent, canActivate: [AuthGuard] },
    { path: 'searchCommericalRecords', component: SearchCommericalRecordsComponent, canActivate: [AuthGuard] },
    { path: 'addCommericalRecord', component: AddCommericalRecordComponent, canActivate: [AuthGuard] }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class CommericalRoutingModule { }
