import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExpenseApiService } from '../../expense/services/expense-services/expense-api.service';
import { ExpenseEvent, ExpenseRRule } from '../expense-event';

@Component({
  selector: 'app-calendar-new-expense',
  templateUrl: './calendar-new-expense.component.html',
  styleUrls: ['./calendar-new-expense.component.css']
})
export class CalendarNewExpenseComponent implements OnInit {
  newExpense: ExpenseEvent = {
    title: '',
    amount: 0,
    start: new Date(),
    rrule: {
      freq: 0,
      interval: 1,
      dtstart: '',
      until: ''
    }
  };
  rruleTypes = ['NO REPEAT', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
  selectedRruleType = 'NO REPEAT';

  constructor(
    private expenseApi: ExpenseApiService,
    public dialogRef: MatDialogRef<CalendarNewExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    console.log(form.value);
    console.log(form.value.title);
    console.log('selectedRruleType ' + this.selectedRruleType);
    this.newExpense.title = form.value.title;
    this.newExpense.amount = form.value.amount;
    this.newExpense.start = form.value.start;

    this.newExpense.id = 0;
    this.newExpense.expenseId = 0;
    if ( this.selectedRruleType !== this.rruleTypes[0] ) {
      this.newExpense.rrule = this.rruleFormat(form);
    } else {
      this.newExpense.rrule = null;
    }
    this.dialogRef.close(this.newExpense);
  }

  /**
   * (onSelectionChange)="recurringSelected($event)"
   *
   *  Method Placeholder if needed
   *   onSelectionChange fires twice
   *   below is how to handle it
   *
   */
  recurringSelected(type) {
    // if (type.isUserInput) {
    //   console.log('------------recurring changed-----------------' + type);
    //   console.log(type);
    //   console.log(type.source.value);
    // }
  }

  rruleFormat(form: NgForm): {} {
    debugger
    console.log(form);
    const expenseRrule: ExpenseRRule = {
      rrule: {
        freq: -1,
        interval: -1,
        until: ''
      }
    };
    // set feq
    switch (form.value.freq) {
      case('YEARLY'): expenseRrule.rrule.freq = 0; break;
      case('WEEKLY'): expenseRrule.rrule.freq = 1; break;
      case('DAILY'): expenseRrule.rrule.freq = 2; break;
    }
    // set interval
    expenseRrule.rrule.interval = form.value.interval;

    // set until date
    expenseRrule.rrule.until = form.value.end;
    return expenseRrule.rrule;
  }

  onNoClick(): void {
    console.log('onNoClick');
    this.dialogRef.close(this.newExpense);
  }
}
