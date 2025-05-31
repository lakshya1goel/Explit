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
    ID: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
    user_id: number;
    title: string;
    description: string;
    amount: number;
    group_id: number;
    paid_by_count: number;
    splits: null
}

export interface Message {
    ID: string;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: string | null;
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
