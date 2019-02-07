import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpenseEvent } from '../expense-event';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private calendarEventSubject = new BehaviorSubject<any>([]);
  calendarEvent$: Observable<ExpenseEvent> = this.calendarEventSubject.asObservable();
  profile: any;

  constructor(private httpClient: HttpClient) { }

  fetchCalendarEventsPromise(id: string) {
    this.httpClient.get(environment.expenseApiUrl + `calendar/${id}`)
      .toPromise().then(data => console.log(data));
  }

  /**
   * Fetches User's Expense Events
   * @param id string
   */
  fetchCalendarEvents(): Observable<any> {
   return this.httpClient.get(environment.expenseApiUrl + `calendar`);
  }

  /**
   * Takes in Expense API Model and formats it NG FullCalendar
   * Events Object additional fields for Full Calendar API
   *  -allday
   *  -editable
   * @param expenseEvent: ExpenseEvent[]
   */
  formatCalendarEvents(expenseEvent: ExpenseEvent[]): ExpenseEvent[] {
    expenseEvent.forEach( e => {
      // add the Amount to the title aka expenseName
      e.title = e.title + ': $' + e.amount;
      e.allDay = true;
      e.editable = true;
      console.log('Dates: ');
      console.log('pre: ' + e.start + ' ' + typeof e.start);
      e.start = this.validDayFormat(e.start);
      console.log('after: ' + e.start + ' ' + typeof e.start);
      e.end = this.validDayFormat(e.end);
      e.draggable = true;
    });
    return expenseEvent;
  }

  validDayFormat(date: string | Date): Date {
    if ( typeof date === 'string') {
      // Convert to Array
      const dateArr = date.split('');

      // Check correct length
      if ( date.length !== 10 ) {
        dateArr[9] = dateArr[8];
        dateArr[8] = '0';
      }

      // Add additional Day as Angular Calendar Days starts from 0...
      dateArr[dateArr.length - 1] = (parseInt(dateArr[dateArr.length - 1], 10) + 1).toString();

      // Convert back to Array;
      date = dateArr.join('');
    } else if ( !date ) {
      return null;
    }
    console.log(date);
    return new Date(date);
  }
}
