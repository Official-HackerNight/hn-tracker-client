import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Expense } from '../entities/expense';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class ExpenseApiService {

  // Cache expenses
  private expenseSubject = new BehaviorSubject<any>([]);
  expenses$: Observable<any> = this.expenseSubject.asObservable();


  // profile data
  profile: any;

  constructor(private httpClient: HttpClient) {
    // this.fetchExpenses();
    // this.fetchExpenseLifeTimeTotal();

    // if (this.auth.userProfile) {
    //   this.profile = this.auth.userProfile;
    // } else {
    //   this.auth.getProfile((err, profile) => {
    //     this.profile = profile;
    //   });
    // }
  }

  // FETCH
  fetchExpenses(id: string): void {
    // if (this.auth.userProfile) {
      // console.log(`fetchExpenses using profile.sub:   ${this.profile.sub}`);
      this.httpClient.get(`http://localhost:8090/api/v1/expense/${id}/life`).toPromise().then(
        data => console.log(data));
    // } else {
      // console.log(`not ready yet..`);
    // }
  }

  fetchExpensesLifeTimeTotal(id: string): void {
     this.httpClient.get<Expense>(`http://localhost:8090/api/v1/expense/${id}/life`)
        .subscribe(resp => {
          console.log(resp);
          this.expenseSubject.next(resp);
        });
  }

  fetchExpensesThisYear(id: string): Observable<number> {
    return this.httpClient.get<number>(`http://localhost:8090/api/v1/expense/${id}/year`);
  }

  // PERSISTENCE
  persistExpense(expense: Expense) {
    this.httpClient.post(`http://localhost:8090/api/v1/expense`, expense)
      .toPromise().then(() => console.log('Expense created'));
  }

}
