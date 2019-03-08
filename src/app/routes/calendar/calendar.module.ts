import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import { MatFormFieldModule, MatDialogModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarNewExpenseComponent } from './calendar-new-expense/calendar-new-expense.component';
import { NgMaterialModule } from 'src/app/shared/ng-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CalendarModule as CM, DateAdapter, MOMENT, CalendarDateFormatter, CalendarMomentDateFormatter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import { CalendarHeaderComponent } from './calendar-header/calendar-header.component';
import { moment } from 'moment-timezone';

export function momentAdapterFactory() {
  return adapterFactory(moment);
}

@NgModule({
  declarations: [CalendarComponent, CalendarNewExpenseComponent, CalendarHeaderComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NgMaterialModule,
    FlexLayoutModule,
    CM.forRoot({
      provide: DateAdapter,
      useFactory: momentAdapterFactory
    },
    {
      dateFormatter: {
        provide: CalendarDateFormatter,
        useClass: CalendarMomentDateFormatter
      }
    })
  ],
  entryComponents: [CalendarNewExpenseComponent],
  providers: [{
    provide: MOMENT,
    useValue: moment
  }]
})
export class CalendarModule { }
