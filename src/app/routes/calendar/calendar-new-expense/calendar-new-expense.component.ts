import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-calendar-new-expense',
  templateUrl: './calendar-new-expense.component.html',
  styleUrls: ['./calendar-new-expense.component.css']
})
export class CalendarNewExpenseComponent implements OnInit {

  reccuringTypes = [ 'NO REPEAT', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];
  constructor( public dialogRef: MatDialogRef<CalendarNewExpenseComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
      data = {
        title: 'steve'
      };
     }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    console.log(form);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

