import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpenseEvent } from '../expense-event';
import moment from 'moment-timezone';
import RRule from 'rrule';
import { NGXLogger } from 'ngx-logger';
import { RruleService } from 'src/app/shared/rrule/rrule.service';
moment.tz.setDefault('Utc');
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  public events: ExpenseEvent[] = [];
  public ogEvents: ExpenseEvent[] = [];

  private calendarEventSubject = new BehaviorSubject<any>([]);
  calendarEvent$: Observable<ExpenseEvent> = this.calendarEventSubject.asObservable();

  constructor(private httpClient: HttpClient, private rruleService: RruleService, private logger: NGXLogger) { }

  fetchCalendarEventsPromise(): Promise<ExpenseEvent[]> {
    return this.httpClient.get<ExpenseEvent[]>(environment.expenseApiUrl + `calendar`).toPromise<ExpenseEvent[]>();
  }

  /**
   * Fetches User's Expense Events
   * @param id string
   */
  fetchCalendarEvents(): Observable<any> {
    return this.httpClient.get(environment.expenseApiUrl + `calendar`);
  }


  persistExpense(expenseEvent: ExpenseEvent) {
    this.logger.info('persisting expense ' + expenseEvent);
    this.httpClient.post(environment.expenseApiUrl + 'calendar', expenseEvent)
      .toPromise().then( () => console.log('expense persisted'));
  }

  /**
   * Takes in Expense API Model and formats it NG Calendar
   *  Events Object additional fields for NG Calendar API
   *  -allday
   *  -editable
   *  -use Rrule Formater
   * @param expenseEvent: ExpenseEvent[]
   */
   processCalendarEvents(): void {
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
    // return await this.fetchCalendarEvents();
    this.fetchCalendarEvents().subscribe(data => {
      // Set Original DB Events to new object reference
      this.ogEvents = data;
      // format ExpenseEvents
      this.ogEvents = this.addNgCalFields(this.ogEvents);
      // rruleFormater - take data from DB and Format with RRule
      this.ogEvents = this.rruleService.rruleFormater(this.ogEvents);

      this.logger.info(`Original DB Events Formatted`);
      console.log('process ogEvents:');
      console.log(this.ogEvents);
      this.calendarEventSubject.next(data);
    });
  }

  /**
   *  -allday
   *  -editable
   * @param expenseEvent: ExpenseEvent[]
   */
   addNgCalFields(expenseEvents: ExpenseEvent[]): ExpenseEvent[] {
    expenseEvents = expenseEvents.map(e => {
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
    return expenseEvents;
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
