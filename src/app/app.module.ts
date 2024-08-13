import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './helpers/http.interceptor';
import { BrowserModule } from '@angular/platform-browser';
import { AppLayoutModule } from './layout/app.layout.module';
import {CookieService} from 'ngx-cookie-service';


@NgModule({
  declarations: [AppComponent],
  imports: [AppLayoutModule, AppRoutingModule, TableModule, TooltipModule, HttpClientModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }, AuthInterceptor,CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}

