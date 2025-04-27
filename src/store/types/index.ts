export interface User {
    id: number;
    email: string;
    mobile: string;
    is_email_verified: boolean;
    is_mobile_verified: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    data: {
        id: number;
        email: string;
        mobile: string;
        access_token: string;
        refresh_token: string;
        access_token_exp: number;
        refresh_token_exp: number;
        is_email_verified: boolean;
        is_mobile_verified: boolean;
    };
    message: string;
    success: boolean;
}

export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
}
