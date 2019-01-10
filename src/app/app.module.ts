import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './shared/app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './routes/dashboard/dashboard.component';
import { NavComponent } from './shared/nav/nav.component';
import { NgMaterialModule } from './shared/ng-material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthService } from './shared/auth/auth.service';
import { AuthGuardService } from './shared/auth/auth-guard.service';
import { ScopeGuardService } from './shared/auth/scope-guard.service';
import { ExpenseModule } from './routes/expense/expense.module';
import { LoginComponent } from './routes/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { CallbackComponent } from './shared/callback/callback.component';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { ProfileComponent } from './routes/profile/profile.component';
import { PrimeNgModule } from './shared/prime-ng.module';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavComponent,
    LoginComponent,
    CallbackComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ExpenseModule,
    BrowserAnimationsModule,
    NgMaterialModule,
    PrimeNgModule,
    LoggerModule.forRoot({ level: NgxLoggerLevel.DEBUG })
  ],
  providers: [
    ScopeGuardService,
    AuthGuardService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
