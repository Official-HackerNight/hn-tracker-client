import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ytd-expense',
  templateUrl: './ytd-expense.component.html',
  styleUrls: ['./ytd-expense.component.css']
})
export class YtdExpenseComponent implements OnInit {

  ytdExpenses = [{test: 'value'}];
  constructor() { }

  ngOnInit() {
  }

}
