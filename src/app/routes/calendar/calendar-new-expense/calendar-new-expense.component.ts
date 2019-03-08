import { Component, Inject, OnInit } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExpenseApiService } from '../../expense/services/expense-services/expense-api.service';
import { ExpenseEvent, ExpenseRRule } from '../expense-event';
import { RruleService } from 'src/app/shared/rrule/rrule.service';
import moment from 'moment-timezone';
moment.tz.setDefault('Utc');
@Component({
  selector: 'app-calendar-new-expense',
  templateUrl: './calendar-new-expense.component.html',
  styleUrls: ['./calendar-new-expense.component.css']
})
export class CalendarNewExpenseComponent implements OnInit {
  // today = new FormControl(new Date());
  today = moment().format('YYYY-MM-DD');
  // today = moment().format('MM-DD-YYYY');
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
    private rruleService: RruleService,
    private expenseApi: ExpenseApiService,
    public dialogRef: MatDialogRef<CalendarNewExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit() { }

  onSubmit(form: NgForm) {
    console.log(form.value);
    console.log(form.value.title);
    console.log(form.value.weekly);
    console.log('selectedRruleType ' + this.selectedRruleType);
    this.newExpense.title = form.value.title;
    this.newExpense.amount = form.value.amount;
    this.newExpense.start = form.value.start;

    this.newExpense.id = 0;
    this.newExpense.expenseId = 0;

    if (this.selectedRruleType !== this.rruleTypes[0]) {
      this.newExpense.rrule = this.rruleService.newExpenseRruleFormat(form);
    } else {
      this.newExpense.rrule = null;
    }
    console.log('new expense');
    console.log(this.newExpense);
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

  onNoClick(): void {
    console.log('onNoClick');
    this.dialogRef.close(this.newExpense);
  }
}
