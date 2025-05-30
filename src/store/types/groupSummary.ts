export interface GroupSummaryState {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string;
    data: {
        total_group_owed_by: number;
        total_group_owed_to: number;
        settlements: Settlement[];
    };
}

export interface Settlement {
    no_of_splits: number;
    owed_by_amt: number;
    owed_to_amt: number;
    settlement: number;
    user_id: number;
    user_name: string;
}

export interface GetSummaryResponse {
    success: boolean;
    message: string;
    data: {
        total_group_owed_by: number;
        total_group_owed_to: number;
        settlements: Settlement[];
    };
}
