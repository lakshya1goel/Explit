import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthResponse, AuthState, LoginCredentials, OtpCredentials, OtpResponse, RegisterCredentials, VerifyEmailCredentials, VerifyMobileCredentials } from '../types';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@env';

const api = axios.create({
  baseURL: BASE_URL || 'http://192.168.1.13:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = createAsyncThunk<AuthResponse, LoginCredentials, { rejectValue: string }>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('auth/login', credentials);

      if (response.data.success) {
        return response.data;
      }

      return rejectWithValue(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const register = createAsyncThunk<OtpResponse, RegisterCredentials, { rejectValue: string }>(
  'auth/register',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('auth/register', credentials);

      if (response.data.success) {
        return response.data;
      }

      return rejectWithValue(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const sendOtp = createAsyncThunk<OtpResponse, OtpCredentials, { rejectValue: string }>(
  'auth/send-otp',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<OtpResponse>('auth/send-otp', credentials);

      if (response.data.success) {
        return response.data;
      }

      return rejectWithValue(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const verifyEmail = createAsyncThunk<AuthResponse, VerifyEmailCredentials, { rejectValue: string }>(
  'auth/verify-email',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('auth/verify-mail', credentials);

      if (response.data.success) {
        return response.data;
      }

      return rejectWithValue(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

export const verifyMobile = createAsyncThunk<AuthResponse, VerifyMobileCredentials, { rejectValue: string }>(
  'auth/verify-mobile',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>('auth/verify-mobile', credentials);

      if (response.data.success) {
        return response.data;
      }

      return rejectWithValue(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data?.message
        );
      }
      return rejectWithValue('An unexpected error occurred');
    }
  }
);

const initialState: AuthState = {
  isAuthenticated: false,
  isOtpSent: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
  isEmailVerified: false,
  isMobileVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = {
        id: action.payload.data.id,
        email: action.payload.data.email,
        mobile: action.payload.data.mobile,
        is_email_verified: action.payload.data.is_email_verified,
        is_mobile_verified: action.payload.data.is_mobile_verified,
      };
      state.accessToken = action.payload.data.access_token;
      state.refreshToken = action.payload.data.refresh_token;
    }).addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Login Failed';
    }).addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(register.fulfilled, (state) => {
      state.loading = false;
      state.isOtpSent = true;
    }).addCase(register.rejected, (state, action) =>{
      state.loading = false;
      state.error = action.payload || 'Register Failed';
    }).addCase(verifyEmail.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(verifyEmail.fulfilled, (state) => {
      state.loading = false;
      state.isEmailVerified = true;
    }).addCase(verifyEmail.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Email Verification Failed';
    }).addCase(verifyMobile.pending, (state) => {
      state.loading = true;
      state.error = null;
    }).addCase(verifyMobile.fulfilled, (state) => {
      state.loading = false;
      state.isEmailVerified = true;
    }).addCase(verifyMobile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Mobile Verification Failed';
    });
  },
});

export default authSlice.reducer;
