import { CalendarEvent } from 'calendar-utils';

export interface ExpenseEvent extends CalendarEvent, ExpenseRRule {
    expenseId: number;
    title: string;
    amount: number;
    startDate: string;
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

        // old still need ?
        separationCount?: number;
        maxNumOfOccurences?: number;
        dayOfWeek?: number;
        weekOfMonth?: number;
        dayOfMonth?: number;
        monthOfYear?: number;
    };
}
