import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CalendarNewExpenseComponent } from '../calendar-new-expense/calendar-new-expense.component';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.css']
})
export class CalendarHeaderComponent implements OnInit {

 /**
     * Configuration Object passed
     *  into New Expense Modal
     */
    newExpenseModalConfig = {
      disableClose: false,
      panelClass: 'new-expense-modal',
      hasBackdrop: true,
      backdropClass: '',
      width: '80%',
      height: '80%',
      minWidth: '',
      minHeight: '',
      maxWidth: '100%',
      maxHeight: '',
      position: {
          top: '',
          bottom: '',
          left: '',
          right: ''
      },
      data: {}
  };
  newExpense = [];
  @Input() view: string;
  @Input() viewDate: Date;
  @Input() locale = 'en';
  @Output() viewChange: EventEmitter<string> = new EventEmitter();
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  constructor(public dialog: MatDialog, public calendarService: CalendarService) { }

  ngOnInit() {
  }
    /**
     * Opens New Expense Modal
     *  once closed, new expense will be added
     *  to the events[]
     */
    openNewExpenseDialog(): void {
      const dialogRef = this.dialog.open(CalendarNewExpenseComponent, this.newExpenseModalConfig);

      dialogRef.afterClosed().subscribe(result => {
          if (result) {
              this.newExpense.push(result);
              this.calendarService.ogEvents.push(this.newExpense[0]);
              this.calendarService.persistExpense(this.newExpense[0]);
              this.newExpense = [];
          }
      });
  }
}
