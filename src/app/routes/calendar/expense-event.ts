
export interface ExpenseEvent {
    expenseId: number;
    title: string;
    amount: number;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
    isActive: boolean;
    recurringType: string;
    separationCount: number;
    maxNumOfOccurences: number;
    dayOfWeek: number;
    weekOfMonth: number;
    dayOfMonth: number;
    monthOfYear: number;

    // full calendar api requirements
    allDay?: boolean;
    editable?: boolean;
}
