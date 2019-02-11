import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ExpenseEvent } from '../expense-event';
import { RruleService } from './rrule/rrule.service';
import moment from 'moment-timezone';
import RRule from 'rrule';
@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private calendarEventSubject = new BehaviorSubject<any>([]);
  calendarEvent$: Observable<ExpenseEvent> = this.calendarEventSubject.asObservable();
  profile: any;

  constructor(private httpClient: HttpClient, private rruleService: RruleService) {}

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
   * Takes in Expense API Model and formats it NG Calendar
   *  Events Object additional fields for NG Calendar API
   *  -allday
   *  -editable
   *  -use Rrule Formater
   * @param expenseEvent: ExpenseEvent[]
   */
  processCalendarEvents(expenseEvent: ExpenseEvent[]): ExpenseEvent[] {
    // expenseEvent.forEach(e => {
    //   // add the Amount to the title aka expenseName
    //   e.title = e.title + ': $' + e.amount;
    //   e.allDay = true;
    //   e.editable = true;
    //   e.draggable = true;
    //   console.log('process init start');
    //   console.log(e.start);
    //   e.start = this.validDayFormat(e.start);
    //   console.log('process after start');
    //   console.log(e.start);
    //   if (e.end) { e.end = this.validDayFormat(e.end); }
    //   if ( e.rrule ) {
    //     e.rrule.wkst = 0;
    //     e.rrule.dtstart = this.validDayFormat(e.rrule.dtstart);
    //    }
    // });
    // rruleFormater - take data from DB and Format with RRule
    // expenseEvent = this.rruleService.rruleFormater(expenseEvent);
    expenseEvent = expenseEvent.map(e => {
      return  {
        ...e,
        title: e.title + ': $' + e.amount,
        allDay: true,
        editable: true,
        draggable: true,
        start: this.validDayFormat(e.start),
        end: e.end && this.validDayFormat(e.end),
        rrule: e.rrule && {
          ...e.rrule,
          wkst: 0,
          dtstart: this.validDayFormat(e.rrule.dtstart)
        }
      };
    });

    expenseEvent = this.rruleService.rruleFormater(expenseEvent);
    console.log('prior rr expenses');
    console.log(expenseEvent);
    // Add Recurring Events 30 prior and future
    expenseEvent = this.addInitReccuringEvents(expenseEvent);
    // Remove Duplicates
    expenseEvent = this.removeDuplicates(expenseEvent);
    console.log('init expenses');
    console.log(expenseEvent);
    return expenseEvent;
  }

  /**
   * Using RRule to calculate the inital Reccuring Expense
   *  of the last 30 days & future 30 days depending on
   *  the start date of the Expense
   * @param expenseEvent: ExpenseEvent[]
   */
  addInitReccuringEvents(expenseEvent: ExpenseEvent[]): ExpenseEvent[] {
    console.log('init rr');
    const dtStart = moment().subtract(30, 'd').toDate();
    const until = moment().add(30, 'd').toDate();
    const initReccuringEvents: ExpenseEvent[] = [];
    expenseEvent.forEach(event => {
      const rule = new RRule({
        ...event.rrule,
        dtstart: this.calReccuringEventStartDate(event.start, dtStart),
        until: this.calReccuringEventEndDate(event.end, until)
      });
      rule.all().forEach((date, i) => {
        const e = {
          ...event
        };
        e.start = moment(date).toDate();
        initReccuringEvents.push(e);
      });
    });
    return expenseEvent.concat(initReccuringEvents);
  }

  /**
   * Takes in User's Date - eStart & View Period RR Date - rrStart
   *  if the eStart is prior to rrStart
   *  than rrStart is return (since we are only showing 30-60 days of today's View Range)
   *  if the estart is within the view period (less than rrStart)
   *    then the eStart is return since it was created within the view period
   * @param eStart: Date
   * @param rrStart: Date
   */
  calReccuringEventStartDate(eStart, rrStart) {
    console.log('calStart');
    console.log(moment(eStart).toDate());
    console.log(moment(rrStart).toDate());
    console.log(moment(eStart).diff(rrStart, 'days'));
    if (moment(eStart).diff(rrStart, 'days') > 36) {
      return eStart;
    } else {
      return rrStart;
    }
  }

  /**
   * Same idea as calReccuringEventStartDate but for end date
   * @param eEnd: Date
   * @param rrEnd: Date
   */
  calReccuringEventEndDate(eEnd, rrEnd) {
    if (moment(eEnd).diff(rrEnd, 'days') < -30) {
      return eEnd;
    } else {
      return rrEnd;
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
    result.sort((a, b) => {
      const keyA = new Date(a.start),
        keyB = new Date(b.start);
      // Compare the 2 dates
      if (keyA < keyB) { return -1; }
      if (keyA > keyB) { return 1; }
      return 0;
    });
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
    
    // if (typeof date === 'string') {
    //   // Convert to Array
    //   const dateArr = date.split('');

    //   // Check correct length
    //   if (date.length !== 10) {
    //     dateArr[9] = dateArr[8];
    //     dateArr[8] = '0';
    //   }

    //   // Add additional Day as Angular Calendar Days starts from 0...
    //   dateArr[dateArr.length - 1] = (parseInt(dateArr[dateArr.length - 1], 10) + 1).toString();

    //   // Convert back to Array;
    //   date = dateArr.join('');
    // } else if (!date) {
    //   return null;
    // }
    console.log('validDate');
    console.log(date);
    console.log(moment(new Date(date)).add(1, 'days').toDate());
    console.log(new Date(date));
    return moment(new Date(date)).add(1, 'days').toDate();
  }
}
