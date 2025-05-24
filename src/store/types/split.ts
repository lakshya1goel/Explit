export interface SplitCreationPayload {
    group_id: string;
    amount: number;
    title: string;
    description: string;
}

export interface SplitCreationResponse {
    success: boolean;
    message: string;
}

export interface SplitState {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string;
}
