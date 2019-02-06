import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import {FullCalendarModule} from 'primeng/fullcalendar';
import { MatFormFieldModule, MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CalendarNewExpenseComponent } from './calendar-new-expense/calendar-new-expense.component';
import { NgMaterialModule } from 'src/app/shared/ng-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarModule as CM, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
@NgModule({
  declarations: [CalendarComponent, CalendarNewExpenseComponent, CalendarHeaderComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    NgMaterialModule,
    FlexLayoutModule,
    CM.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })
  ],
  entryComponents: [CalendarNewExpenseComponent]
})
export class CalendarModule { }
