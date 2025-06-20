export interface PersonalExpenseState {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string;
    data: PersonalExpense[];
}

export interface PersonalExpenseCreationPayload {
    amount: number;
    title: string;
    description: string;
}

export interface PersonalExpenseCreationResponse {
    success: boolean;
    message: string;
}

export interface GetPersonalExpensesResponse {
    success: boolean;
    message: string;
    data: PersonalExpense[];
}

export interface PersonalExpense {
    id: string;
    title: string;
    description: string;
    amount: number;
    CreatedAt: string;
}
