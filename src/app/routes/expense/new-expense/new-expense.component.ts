import { Component, OnInit } from '@angular/core';
import { Expense } from '../entities/expense';
import { FormsModule } from '@angular/forms';
import { ExpenseApiService } from '../expense-services/expense-api.service';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Component({
  selector: 'app-new-expense',
  templateUrl: './new-expense.component.html',
  styleUrls: ['./new-expense.component.css']
})
export class NewExpenseComponent implements OnInit {

  newExpense: Expense = {
    expenseId: 0,
    amount: 0,
    userId: '',
    description: '',
    date: null,
    expenseType: {
      'expenseTypeId': 1,
      'type': 'single'
    },
    active: true,
    occurs: 0
  };

  constructor(private authService: AuthService, private expenseApiService: ExpenseApiService) { }

  ngOnInit() {
  }

  onSubmit(): void {
    this.newExpense.userId = this.authService.userProfile.sub;
    console.log('newExpense submitted: ');
    console.log(this.newExpense);
    this.expenseApiService.persistExpense(this.newExpense);
  }

}
