import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from './calendar.component';
import {FullCalendarModule} from 'primeng/fullcalendar';
import { MatFormFieldModule, MatDialogModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { CalendarNewExpenseComponent } from './calendar-new-expense/calendar-new-expense.component';
import { NgMaterialModule } from 'src/app/shared/ng-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  declarations: [CalendarComponent, CalendarNewExpenseComponent],
  imports: [
    CommonModule,
    FullCalendarModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    NgMaterialModule,
    FlexLayoutModule
  ],
  entryComponents: [CalendarNewExpenseComponent]
})
export class CalendarModule { }
