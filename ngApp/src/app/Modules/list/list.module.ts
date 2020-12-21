import { NgModule } from '@angular/core';
import { ListRoutingModule } from './list-routing.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ListCategoriesComponent } from 'src/app/main-home/Categories/list-categories/list-categories.component';
import { ListSubCategoriesComponent } from 'src/app/main-home/SubCategories/list-sub-categories/list-sub-categories.component';
import { ListCitiesComponent } from 'src/app/main-home/Cities/list-cities/list-cities.component';
import { ListRegionsComponent } from 'src/app/main-home/Regions/list-regions/list-regions.component';
import { ListCommericalRegistersComponent } from 'src/app/main-home/Commerical-Registers/list-commerical-registers/list-commerical-registers.component';
import { ListShahrAqaryComponent } from 'src/app/main-home/ShahrAqary/list-shahr-aqary/list-shahr-aqary.component';
import { ListGovernatesComponent } from 'src/app/main-home/Governates/list-governates/list-governates.component';
import { ListIncorporationActsComponent } from 'src/app/main-home/Incorporation-Acts/list-incorporation-acts/list-incorporation-acts.component';
import { ListEmployeesComponent } from 'src/app/main-home/Employees/list-employees/list-employees.component';
import { ListUsersComponent } from 'src/app/main-home/Users/list-users/list-users.component';
import { SharedModule } from '../shared.module';


@NgModule({
  declarations: [
    ListCategoriesComponent,
    ListSubCategoriesComponent,
    ListCitiesComponent,
    ListRegionsComponent,
    ListCommericalRegistersComponent,
    ListShahrAqaryComponent,
    ListGovernatesComponent,
    ListIncorporationActsComponent,
    ListEmployeesComponent,
    ListUsersComponent
  ],
  imports: [
    ListRoutingModule,
    RouterModule,
    FormsModule,
    SharedModule
  ]
})
export class ListModule { }
