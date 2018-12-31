import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { routes } from './expense-routing';
import { Routes, RouterModule } from '@angular/router';
import { ExpenseComponent } from './expense.component';
import { DayOfMonthComponent } from './day-of-month/day-of-month.component';
import { DayOfWeekComponent } from './day-of-week/day-of-week.component';
import { YearToDateComponent } from './year-to-date/year-to-date.component';
import { ExpenseApiService } from './expense-services/expense-api.service';
import { HttpClientModule } from '@angular/common/http';
import { NewExpenseComponent } from './new-expense/new-expense.component';
import { FormsModule } from '@angular/forms';
import { YtdExpenseComponent } from './year-to-date/ytd-expense/ytd-expense.component';
import { LifeTimeComponent } from './life-time/life-time.component';
import { HnDateService } from './services/hn-date.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    // Components
    ExpenseComponent,
    DayOfMonthComponent,
    DayOfWeekComponent,
    YearToDateComponent,
    NewExpenseComponent,
    YtdExpenseComponent,
    LifeTimeComponent,

    // Pipes
  ],
  providers: [
    ExpenseApiService,
    HnDateService,
    HttpClientModule
  ]
})
export class ExpenseModule { }
