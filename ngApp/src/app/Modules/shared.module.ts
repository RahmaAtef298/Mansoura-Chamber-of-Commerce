import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageLoaderComponent } from 'src/app/Shared/page-loader/page-loader.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [
    PageLoaderComponent
  ],
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    NgbModule
  ],
  exports: [
    PageLoaderComponent,
    CommonModule,
    NgbModule
  ]
})
export class SharedModule { }
