import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpenseEvent } from '../expense-event';
import { RruleService } from './rrule/rrule.service';
import moment from 'moment-timezone';
import RRule from 'rrule';
import { NGXLogger } from 'ngx-logger';
moment.tz.setDefault('Utc');
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private calendarEventSubject = new BehaviorSubject<any>([]);
  calendarEvent$: Observable<ExpenseEvent> = this.calendarEventSubject.asObservable();
  profile: any;

  constructor(private httpClient: HttpClient, private rruleService: RruleService, private logger: NGXLogger) { }

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

  persistExpense(expenseEvent: ExpenseEvent) {
    console.log('adding expense: ');
    console.log(expenseEvent);
    // this.expenseSubject.next(expense);
    this.httpClient.post(environment.expenseApiUrl + `calendar`, expenseEvent)
      .toPromise().then(() => console.log('Expense created'));
  }

  /**
   * Takes in Expense API Model and formats it NG Calendar
   *  Events Object additional fields for NG Calendar API
   *  -allday
   *  -editable
   *  -use Rrule Formater
   * @param expenseEvent: ExpenseEvent[]
   */
  processCalendarEvents(expenseEvent: ExpenseEvent[]): ExpenseEvent[] {
    this.logger.trace(`
    ****************************************
    * processCalendarEvents()
    * Takes in Expense API Model and formats it NG Calendar
    *  Events Object additional fields for NG Calendar API
    *  -addNgCalFields()
    *  -rruleFormater()
    *  -addInitReccuringEvents()
    *  -removeDuplicates()
    ***
    `);
    // format ExpenseEvents
    expenseEvent = this.addNgCalFields(expenseEvent);
    // rruleFormater - take data from DB and Format with RRule
    expenseEvent = this.rruleService.rruleFormater(expenseEvent);

    return expenseEvent;
  }

  /**
   *  -allday
   *  -editable
   * @param expenseEvent: ExpenseEvent[]
   */
  private addNgCalFields(expenseEvent: ExpenseEvent[]) {
    expenseEvent = expenseEvent.map(e => {
      return {
        ...e,
        title: e.title + ': $' + e.amount,
        allDay: true,
        editable: true,
        draggable: true,
        start: this.validDayFormat(e.start),
        end: e.end && this.validDayFormat(e.end),
      };
    });
    return expenseEvent;
  }


  /**
   * Takes in User's Date - eStart & View Period RR Date - rrStart
   *  if the eStart is prior to rrStart
   *  than rrStart is return (since we are only showing 30-60 days of today's View Range)
   *  if the estart is within the view period (less than rrStart)
   *    then the eStart is return since it was created within the view period
   * @param eventStart: Date
   * @param viewStart: Date
   */
  calReccuringEventStartDate(eventStart, viewStart, feq: number) {
    if ((moment(eventStart).diff(viewStart, 'days') > 0) || feq === 0) {
      return eventStart;
    } else {
      return viewStart;
    }
  }

  /**
   * Same idea as calReccuringEventStartDate but for end date
   * @param eventEnd: Date
   * @param viewEnd: Date
   */
  calReccuringEventEndDate(eventEnd, viewEnd) {
    if (moment(eventEnd).diff(viewEnd, 'days') < 0) {
      return eventEnd;
    } else {
      return viewEnd;
    }
  }

  /**
   * Remove duplicate ExpenseEvent from the Array
   *  also sorts by date but can/should be removed
   * @param arr: ExpenseEvent[]
   */
  removeDuplicates(arr: ExpenseEvent[]): ExpenseEvent[] {
    // console.log(typeof arr[0].start);
    const result = arr.filter((thing, index, self) =>
      index === self.findIndex((t) => (
        t.title === thing.title && t.start.getTime() === thing.start.getTime()
      )));
    return result;
  }

  /**
   * Angular Calendar has a bug w/ "2019-02-02"
   *  where it set this to Feb 1st 2019 when it should be the 2nd
   *   same w/
   *  Bug for days with a 2 digits e.g. 11 is changed to 10
   *
   * Method adds additional day (incremented by 1) and
   *  ensures day has a 2 digits
   * @param date: string | Date
   */
  validDayFormat(date: string | Date): Date {
    return moment(date).add(0, 'days').hour(17).toDate();
  }
}
