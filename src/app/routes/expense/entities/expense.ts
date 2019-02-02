
export interface Expense {
    expenseId: number;
    expenseName: string;
    userId: string;
    amount: number;
    description: string;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
    tags: [];
    isActive: boolean;
}
