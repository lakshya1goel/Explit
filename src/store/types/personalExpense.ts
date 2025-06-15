export interface PersonalExpenseState {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string;
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
