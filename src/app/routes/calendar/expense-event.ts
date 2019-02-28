import { CalendarEvent } from 'calendar-utils';
/**
 * ExpenseEvent extends CalendarEvent & ExpenseRRule
 *  -start
 *  -end
 *  -amount
 *  -isActive
 *  -allDay
 *  -editable
 */
export interface ExpenseEvent extends CalendarEvent {
    expenseId?: number;
    title: string;
    amount: number;
    isActive?: boolean;
    rrule: ExpenseRRule;
    // Angular Calendar api requirements
    editable?: boolean;
}


export interface ExpenseRRule {
        freq: any;
        interval: number;
        dtstart: any;
        until: any;

        bymonth?: number;
        bymonthday?: number;
        byweekday?: any[];
        wkst?: any;
        // old still need ?
        separationCount?: number;
        maxNumOfOccurences?: number;
        dayOfWeek?: number;
        weekOfMonth?: number;
        dayOfMonth?: number;
        monthOfYear?: number;
}
