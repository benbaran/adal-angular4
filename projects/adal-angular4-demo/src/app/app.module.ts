import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AdalService, AdalGuard, AdalInterceptor } from 'adal-angular4';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [AdalService, AdalGuard, { provide: HTTP_INTERCEPTORS, useClass: AdalInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
