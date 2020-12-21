import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainHomeComponent } from './main-home/main-home.component';
import { HomeComponent } from './main-home/home/home.component';
import { LoginComponent } from './Administration/login/login.component';
import { AddUserComponent } from './main-home/Users/add-user/add-user.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './Administration/auth.guard';


const routes: Routes = [
  { path: '', component: MainHomeComponent , canActivate: [AuthGuard], children:[
    { path: '', redirectTo:'/Home', pathMatch: 'full' },
    { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'AddUser', component: AddUserComponent, canActivate: [AuthGuard] },
    { path: 'EditUser/:ID', component: AddUserComponent, canActivate: [AuthGuard] },
    { path: 'list', loadChildren: () => import('../app/Modules/list/list.module').then(m => m.ListModule) },
    { path: 'records', loadChildren: () => import('../app/Modules/CommericalRecords/commerical.module').then(m => m.CommericalRecordsModule) }
  ]},
  { path: 'Login' , component: LoginComponent },
  { path: "**", component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
