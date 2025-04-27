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

export interface RegisterCredentials {
    email: string;
    mobile: string;
    password: string;
    confirm_password: string;
}

export interface OtpCredentials {
    email: string;
    mobile: string;
}

export interface VerifyEmailCredentials {
    email: string;
    otp: string;
}

export interface VerifyMobileCredentials {
    mobile: string;
    otp: string;
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

export interface OtpResponse {
    message: string;
    success: boolean;
}

export interface AuthState {
    user: User | null;
    isOtpSent: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    isEmailVerified: boolean;
    isMobileVerified: boolean;
}
