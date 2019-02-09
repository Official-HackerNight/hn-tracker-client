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


  byweekdayFormat(bwd: any[]) {
    bwd.forEach( (e, i) => {
      if (e === 'MO') { bwd[i] = RRule.MO; }
      if (e === 'TU') { bwd[i] = RRule.TU; }
      if (e === 'WE') { bwd[i] = RRule.WE; }
      if (e === 'TH') { bwd[i] = RRule.TH; }
      if (e === 'FR') { bwd[i] = RRule.FR; }
      if (e === 'SA') { bwd[i] = RRule.SA; }
      if (e === 'SU') { bwd[i] = RRule.SU; }
    });
    return bwd;
  }
}
