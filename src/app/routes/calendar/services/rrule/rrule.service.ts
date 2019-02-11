import { Injectable } from '@angular/core';
import { ExpenseEvent } from '../../expense-event';
import RRule from 'rrule';
@Injectable({
  providedIn: 'root'
})
export class RruleService {

  constructor() { }

  /**
   * Controller Method of Sub Formating methods
   *  -feq
   *  -byweekday
   * @param events: ExpenseEvent[]
   */
  rruleFormater(events: ExpenseEvent[]): ExpenseEvent[] {
    events.forEach(e => {
      if (e.rrule) {
        e.rrule.freq = this.feqFormat(e.rrule.freq);
        e.rrule.byweekday ?  e.rrule.byweekday = this.byweekdayFormat(e.rrule.byweekday) : e.rrule.byweekday = undefined;
        // e.rrule.bymonthday ?  e.rrule.bymonthday = this.bymonthdayFormat(e.rrule.bymonthday) : e.rrule.bymonthday = undefined;
      }
    });
    return events;
  }

  feqFormat(frequency) {
    switch ( frequency ) {
      case(0 || '0'): return RRule.YEARLY;
      case(1 || '1'): return RRule.MONTHLY;
      case(2 || '2'): return RRule.WEEKLY;
    }
  }


  /**
   * Need to convert the Weekday Letter to RRule Objects
   *  but the RRule object does not match the calendar,
   *  needs to be offset by 1 day
   *  e.g. SU -> RRule.SA ( Sunday to Saturday)
   */
  byweekdayFormat(bwd: any[]) {
    bwd.forEach( (e, i) => {
      if (e === 'SU') { bwd[i] = RRule.MO; }
      if (e === 'MO') { bwd[i] = RRule.TU; }
      if (e === 'TU') { bwd[i] = RRule.WE; }
      if (e === 'WE') { bwd[i] = RRule.TH; }
      if (e === 'TH') { bwd[i] = RRule.FR; }
      if (e === 'FR') { bwd[i] = RRule.SA; }
      if (e === 'SA') { bwd[i] = RRule.SU; }
    });
    return bwd;
  }

  /**
   * Calendar & Rrule is offset by 1
   * @param bmd: number
   */
  bymonthdayFormat(bmd: number): number {
    return ++bmd;
  }
}
