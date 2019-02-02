import { Component, OnInit } from '@angular/core';
import { Expense } from '../entities/expense';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { HnDateService } from '../services/hn-date.service';
import { ExpenseApiService } from '../services/expense-services/expense-api.service';

@Component({
  selector: 'app-year-to-date',
  templateUrl: './year-to-date.component.html',
  styleUrls: ['./year-to-date.component.css']
})
export class YearToDateComponent implements OnInit {

  today: number = Date.now();

  test: any;

  testExpense: Expense;

  totalSpentForYear = 3000;
  dayOfYear: number;
  spentPerDay: number;
  constructor(private hnDateService: HnDateService, private expenseService: ExpenseApiService,
     private authService: AuthService) { }

  ngOnInit() {
    this.dayOfYear = this.hnDateService.setDayOfTheYear();
    this.spentPerDay =  this.totalSpentForYear / this.dayOfYear;
    this.test = this.expenseService.expenses$.subscribe();
    // not finished, switching to lifetime
    // this.expenseService.fetchExpensesThisYear(this.authService.userProfile.sub).subscribe(res => this.totalSpentForYear = res);
  }

}
