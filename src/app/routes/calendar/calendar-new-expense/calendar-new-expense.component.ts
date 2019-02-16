import { Component, Inject, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ExpenseApiService } from '../../expense/services/expense-services/expense-api.service';
import { ExpenseEvent } from '../expense-event';

@Component({
  selector: 'app-calendar-new-expense',
  templateUrl: './calendar-new-expense.component.html',
  styleUrls: ['./calendar-new-expense.component.css']
})
export class CalendarNewExpenseComponent implements OnInit {
  newExpense: ExpenseEvent;
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
    console.log('selectedRruleType ' + this.selectedRruleType);
    this.newExpense = form.value;
    this.newExpense.id = 58;
    this.newExpense.expenseId = 0;
    this.dialogRef.close(this.newExpense);
  }

  /**
   *  Method Placeholder if needed
   *   onSelectionChange fires twice
   *   below is how to handle it
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
