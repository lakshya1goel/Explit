export interface GroupCreationPayload {
    name: string;
    description: string;
    users: string[];
}

export interface GroupCreationResponse {
    success: boolean;
    message: string;
}

export interface GroupState {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string;
}
