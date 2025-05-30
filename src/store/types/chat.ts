export interface ChatState {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string;
    data: History;
}

export interface History {
    id: string;
    name: string;
    user_id: number;
    description: string;
    total_users: number;
    expenses: Expense[];
    messages: []
}

export interface Expense {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_id: number;
    title: string;
    description: string;
    amount: number;
    group_id: number;
    paid_by_count: number;
    splits: null
}

export interface Message {
    id: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    type: string;
    body: string;
    sender: number;
    group_id: number;
}

export interface FetchHistoryResponse {
    success: boolean;
    message: string;
    data: History;
}

export interface MessageItem {
    msg: Message | null;
    expense?: Expense | null;
}
