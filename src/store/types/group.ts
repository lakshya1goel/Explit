export interface GroupCreationPayload {
    name: string;
    description: string;
    users: string[];
}

export interface GroupCreationResponse {
    success: boolean;
    message: string;
}

export interface GetAllGroupsResponse {
    success: boolean;
    message: string;
    data: Group[];
}

export interface Group {
    id: string;
    name: string;
    description: string;
}

export interface GroupState {
    loading: boolean;
    error: string | null;
    success: boolean;
    message: string;
    data: Group[];
}
