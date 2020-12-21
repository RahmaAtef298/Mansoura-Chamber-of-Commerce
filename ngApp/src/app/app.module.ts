import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { MainHomeComponent } from './main-home/main-home.component';
import { HomeComponent } from './main-home/home/home.component';
import { LoginComponent } from './Administration/login/login.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CategoriesService } from './main-home/Categories/categories.service';
import { SubCategoriesService } from './main-home/SubCategories/sub-categories.service';
import { CitiesService } from './main-home/Cities/cities.service';
import { RegionsService } from './main-home/Regions/regions.service';
import { CommericalRegistersService } from './main-home/Commerical-Registers/commerical-registers.service';
import { GovernatesService } from './main-home/Governates/governates.service';
import { EmployeesService } from './main-home/Employees/employees.service';
import { ShahrAqaryService } from './main-home/ShahrAqary/shahr-aqary.service';
import { IncorporationActsService } from './main-home/Incorporation-Acts/incorporation-acts.service';
import { UsersService } from './main-home/Users/users.service';
import { TokenIntercepterService } from './Administration/login/token-intercepter.service';
import { SharedModule } from './Modules/shared.module';
import { SignupComponent } from './Administration/signup/signup.component';
import { AddUserComponent } from './main-home/Users/add-user/add-user.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    MainHomeComponent,
    PageNotFoundComponent,
    SignupComponent,
    AddUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    }),
    NgMultiSelectDropDownModule.forRoot()
  ],
  providers: [
    CategoriesService,
    SubCategoriesService,
    CitiesService,
    RegionsService,
    CommericalRegistersService,
    GovernatesService,
    EmployeesService,
    ShahrAqaryService,
    IncorporationActsService,
    UsersService,
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: TokenIntercepterService, 
      multi: true 
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
