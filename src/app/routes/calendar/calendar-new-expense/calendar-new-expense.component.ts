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
  reccuringTypes = ['NO REPEAT', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

  constructor(private expenseApi: ExpenseApiService, public dialogRef: MatDialogRef<CalendarNewExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    this.newExpense = form.value;
    this.dialogRef.close(this.newExpense);
  }

  onNoClick(): void {
    console.log('onNoClick');
    this.dialogRef.close(this.newExpense);
  }

}

