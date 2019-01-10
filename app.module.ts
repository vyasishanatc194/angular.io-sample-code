/**
 * Created by PhpStorm.
 * User: TJ 
 * Date: 20/08/18
 * Time: 10:30 AM
 */




import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { CommonEventsService } from "./common-events.service";
import { ParentGardService } from './service/parent-gard.service';
import { ChildGardService } from './service/child-gard.service';
import { AuthApiService } from './default/auth-api.service';
import { environment } from '../environments/environment';


 



@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastModule.forRoot(),
    ScrollToModule.forRoot() ,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule
  ],
  providers: [CommonEventsService, ParentGardService, ChildGardService,AuthApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
