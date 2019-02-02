
export interface ExpenseEvent {
    expenseId: number;
    expenseName: string;
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
}
