import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Expense } from '../../entities/expense';


@Injectable()
export class ExpenseApiService {

  private expenseSubject = new BehaviorSubject<any>([]);
  expenses$: Observable<Expense> = this.expenseSubject.asObservable();
  profile: any;

  constructor(private httpClient: HttpClient) {
  }

  // FETCH

  /**
   * Fetch Expenses from API as a Promise, probably not used often
   *  will leave for a while until proven useless
   * @updated 1/27/2019
   * @author Steven K
   * @param id: string
   */
  fetchExpensesPromise(id: string): void {
    // if (this.auth.userProfile) {
      // console.log(`fetchExpenses using profile.sub:   ${this.profile.sub}`);
      this.httpClient.get(environment.expenseApiUrl + `${id}`).toPromise().then(
        data => console.log(data));
    // } else {
      // console.log(`not ready yet..`);
    // }
  }

  /**
   * Fetches User Expenses life by id
   *  Uses an Observable
   * @param id: string
   */
  fetchExpenses(id: string): void {
     this.httpClient.get<Expense>(environment.expenseApiUrl + `${id}`)
        .subscribe(resp => {
          console.log(resp);
          this.expenseSubject.next(resp);
        });
  }

  fetchExpensesThisYear(id: string): Observable<number> {
    return this.httpClient.get<number>(environment.expenseApiUrl + `${id}/year`);
  }

  // PERSIST
  persistExpense(expense: Expense) {
    this.httpClient.post(environment.expenseApiUrl + `expense`, expense)
      .toPromise().then(() => console.log('Expense created'));
  }

}
