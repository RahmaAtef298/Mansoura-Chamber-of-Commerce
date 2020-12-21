import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCategoriesComponent } from 'src/app/main-home/Categories/list-categories/list-categories.component';
import { ListSubCategoriesComponent } from 'src/app/main-home/SubCategories/list-sub-categories/list-sub-categories.component';
import { ListCitiesComponent } from 'src/app/main-home/Cities/list-cities/list-cities.component';
import { ListRegionsComponent } from 'src/app/main-home/Regions/list-regions/list-regions.component';
import { ListCommericalRegistersComponent } from 'src/app/main-home/Commerical-Registers/list-commerical-registers/list-commerical-registers.component';
import { ListEmployeesComponent } from 'src/app/main-home/Employees/list-employees/list-employees.component';
import { ListGovernatesComponent } from 'src/app/main-home/Governates/list-governates/list-governates.component';
import { ListShahrAqaryComponent } from 'src/app/main-home/ShahrAqary/list-shahr-aqary/list-shahr-aqary.component';
import { ListIncorporationActsComponent } from 'src/app/main-home/Incorporation-Acts/list-incorporation-acts/list-incorporation-acts.component';
import { ListUsersComponent } from 'src/app/main-home/Users/list-users/list-users.component';
import { AuthGuard } from 'src/app/Administration/auth.guard';


const routes: Routes = [
  { path: '', children :[
    { path: '' , component: ListCategoriesComponent, canActivate: [AuthGuard] },
    { path: 'ListCategories' , component: ListCategoriesComponent, canActivate: [AuthGuard] },
    { path: 'ListSubCategories' , component: ListSubCategoriesComponent, canActivate: [AuthGuard] },
    { path: 'ListCities' , component: ListCitiesComponent, canActivate: [AuthGuard] },
    { path: 'ListRegions' , component: ListRegionsComponent, canActivate: [AuthGuard] },
    { path: 'ListCommericalRegisters' , component: ListCommericalRegistersComponent },
    { path: 'ListEmployees' , component: ListEmployeesComponent, canActivate: [AuthGuard] },
    { path: 'ListGovernates' , component: ListGovernatesComponent, canActivate: [AuthGuard] },
    { path: 'ListShahrAqary' , component: ListShahrAqaryComponent, canActivate: [AuthGuard] },
    { path: 'ListIncorporationActs' , component: ListIncorporationActsComponent, canActivate: [AuthGuard] },
    { path: 'ListUsers' , component: ListUsersComponent, canActivate: [AuthGuard] }
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers : [AuthGuard]
})
export class ListRoutingModule { }
