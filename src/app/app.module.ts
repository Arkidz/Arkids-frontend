import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './shared/components/components.module';
import { ToasterModule } from 'angular2-toaster';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    ToasterModule.forRoot(),
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    NgxQRCodeModule,
    DataTablesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
