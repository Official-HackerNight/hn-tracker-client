import { Injectable } from '@angular/core';
import RRule from 'rrule';
import { NGXLogger } from 'ngx-logger';
import moment from 'moment-timezone';
import { ExpenseRRule, ExpenseEvent } from 'src/app/routes/calendar/expense-event';
import { NgForm } from '@angular/forms';
moment.tz.setDefault('Utc');
@Injectable({
  providedIn: 'root'
})
export class RruleService {

  constructor(private logger: NGXLogger) { }

  /**
   * Controller Method of Sub Formating methods
   *  -feq:
   *        0 to RRule.YEAR
   *        1 to RRule.MONTH
   *        2 to RRule.WEEKLY etc.
   *        3 to RRule.DAILY etc.
   *  -byweekday:
   *    offset: SU -> RRule.MO
   *            MO -> RRule.TU etc.
   * @param events: ExpenseEvent[]
   */
  rruleFormater(events: ExpenseEvent[]): ExpenseEvent[] {
    this.logger.trace(`
    ****************************************
    * rruleFormater()
    * Controller Method of Sub Formating methods
    * -dtStart & until
    *       addOneDay()
    *  -feq:
    *        0 to RRule.YEAR
    *        1 to RRule.MONTH
    *        2 to RRule.WEEKLY etc.
    *  -byweekday:
    *    offset: SU -> RRule.MO
    *            MO -> RRule.TU etc.
    *
    * -bymonthday:
    *   offset:  1 -> 2
    *           10 -> 11
    *           31 -> 32
    * ******************************
    `);
    events = events.map(ev => {
      return {
        ...ev,
        rrule: ev.rrule && {
          ...ev.rrule,
          freq: this.feqFormat(ev.rrule.freq),
          byweekday: ev.rrule.byweekday && this.byweekdayFormat(ev.rrule.byweekday),
          bymonthday: ev.rrule.bymonthday && this.bymonthdayFormat(ev.rrule.bymonthday),
          wkst: RRule.SU,
          dtstart: ev.rrule.dtstart,
          until: this.addOneDay(ev.rrule.until)
        }
      };
    });
    return events;
  }

  /**
   * Creates a new ExpenseRRule Object from an NgForm
   *  e.g. freq: YEARLY -> 0
   * @param form: NgForm
   */
  newExpenseRruleFormat(form: NgForm): ExpenseRRule {
    console.log(form);
    const expenseRrule: ExpenseRRule = {
        freq: -1,
        interval: -1,
        dtstart: '',
        until: ''
    };
    // set dtStart
    expenseRrule.dtstart = form.value.start;

    // set feq & fields of recurring type need e.g. MONTHLY -> bymonthday
    switch (form.value.freq) {
      case('YEARLY'): expenseRrule.freq = 0; break;
      case('MONTHLY'):
        expenseRrule.freq = 1;
        expenseRrule.bymonthday = new Date(expenseRrule.dtstart).getDate() + 1; // new Date() offsets from 0;
        break;
      case('WEEKLY'):
        expenseRrule.freq = 2;
        expenseRrule.byweekday = [];
        if (form.value.SU) { expenseRrule.byweekday.push('SU'); }
        if (form.value.MO) { expenseRrule.byweekday.push('MO'); }
        if (form.value.TU) { expenseRrule.byweekday.push('TU'); }
        if (form.value.WE) { expenseRrule.byweekday.push('WE'); }
        if (form.value.TH) { expenseRrule.byweekday.push('TH'); }
        if (form.value.FR) { expenseRrule.byweekday.push('FR'); }
        if (form.value.SA) { expenseRrule.byweekday.push('SA'); }
        break;
      case('DAILY'): expenseRrule.freq = 3; break;
    }
    // set interval
    expenseRrule.interval = form.value.interval;

    // set until date
    expenseRrule.until = form.value.end;
    return expenseRrule;
  }

  addOneDay(date: Date | string) {
    return moment(new Date(date)).add(1, 'days').toDate();
    // return moment(new Date(date)).toDate();
  }

  feqFormat(frequency: number | string) {
    if (typeof frequency === 'string') {
      frequency = parseInt(frequency, 10);
    }
    switch (frequency) {
      case (0): return RRule.YEARLY;
      case (1): return RRule.MONTHLY;
      case (2): return RRule.WEEKLY;
      case (3): return RRule.DAILY;
    }
  }


  /**
   * Need to convert the Weekday Letter to RRule Objects
   *  but the RRule object does not match the calendar,
   *  needs to be offset by 1 day
   *  e.g. SU -> RRule.SA ( Sunday to Saturday)
   */
  byweekdayFormat(bwd: any[]) {
    bwd.forEach((e, i) => {
      // if (e === 'SU') { bwd[i] = RRule.MO; }
      // if (e === 'MO') { bwd[i] = RRule.TU; }
      // if (e === 'TU') { bwd[i] = RRule.WE; }
      // if (e === 'WE') { bwd[i] = RRule.TH; }
      // if (e === 'TH') { bwd[i] = RRule.FR; }
      // if (e === 'FR') { bwd[i] = RRule.SA; }
      // if (e === 'SA') { bwd[i] = RRule.SU; }

      if (e === 'SU') { bwd[i] = RRule.SU; }
      if (e === 'MO') { bwd[i] = RRule.MO; }
      if (e === 'TU') { bwd[i] = RRule.TU; }
      if (e === 'WE') { bwd[i] = RRule.WE; }
      if (e === 'TH') { bwd[i] = RRule.TH; }
      if (e === 'FR') { bwd[i] = RRule.FR; }
      if (e === 'SA') { bwd[i] = RRule.SA; }
    });
    return bwd;
  }

  /**
   * Calendar & Rrule is offset by 1
   * @param bmd: number
   */
  bymonthdayFormat(bmd: number): number {
    return bmd;
  }


  /**
   * Provide a start/end dates & RRule (Recurring Rules) to retrieve array of dates
   */
  getRecurringDates(rrule: ExpenseRRule, viewStart: Date, viewEnd: Date): any[] {
    let rule = null;
    try {
        rule = new RRule({
            ...rrule,
            dtstart: viewStart,
            until: viewEnd
        });
        return rule.all();
    } catch (e) {
        // logs the exception thrown when recurring events are 0
        console.log(e);
    }
}
}
