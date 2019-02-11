import { CalendarEvent } from 'calendar-utils';

export interface ExpenseEvent extends CalendarEvent, ExpenseRRule {
    expenseId: number;
    title: string;
    amount: number;
    endDate: string;
    isActive: boolean;

    // Angular Calendar api requirements
    allDay?: boolean;
    editable?: boolean;
}


export interface ExpenseRRule {
    rrule: {
        freq: any,
        bymonth?: number,
        bymonthday?: number,
        byweekday?: any
        wkst?: any,
        dtstart?: any,
        until?: any,
        interval?: number
        // old still need ?
        separationCount?: number;
        maxNumOfOccurences?: number;
        dayOfWeek?: number;
        weekOfMonth?: number;
        dayOfMonth?: number;
        monthOfYear?: number;
    };
}
