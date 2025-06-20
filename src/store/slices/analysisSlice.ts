import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@env';
import AuthService from '../../services/AuthService';
import { AnalysisState, GetDailyAnalysisRequest, GetDailyAnalysisResponse, GetMonthlyAnalysisRequest, GetMonthlyAnalysisResponse, GetWeeklyAnalysisRequest, GetWeeklyAnalysisResponse } from '../types/analysis';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const tokens = await AuthService.getToken();
        if (tokens?.accessToken) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getMonthlyExpense = createAsyncThunk<GetMonthlyAnalysisResponse, GetMonthlyAnalysisRequest, { rejectValue: string }>(
    'fetch-monthly-expenses',
    async (request, { rejectWithValue }) => {
        try {
            const response = await api.post<GetMonthlyAnalysisResponse>('split/monthly-expenses', request);
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

export const getWeeklyExpense = createAsyncThunk<GetWeeklyAnalysisResponse, GetWeeklyAnalysisRequest, { rejectValue: string }>(
    'fetch-weekly-expenses',
    async (request, { rejectWithValue }) => {
        try {
            const response = await api.post<GetWeeklyAnalysisResponse>('split/weekly-expenses', request);
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

export const getDailyExpense = createAsyncThunk<GetDailyAnalysisResponse, GetDailyAnalysisRequest, { rejectValue: string }>(
    'fetch-daily-expenses',
    async (request, { rejectWithValue }) => {
        try {
            const response = await api.post<GetDailyAnalysisResponse>('split/daily-expenses', request);
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

const initialState: AnalysisState = {
    analysisLoading: false,
    error: null,
    analysisSuccess: false,
    message: '',
    monthly_analysis: null,
    weekly_analysis: null,
    daily_analysis: null,
};

const analysisSlice = createSlice({
    name: 'analysis',
    initialState,
    reducers: {
        resetAnalysisState: (state) => {
            state.analysisSuccess = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getMonthlyExpense.pending, (state) => {
            state.analysisLoading = true;
            state.error = null;
            state.analysisSuccess = false;
            state.message = '';
        })
        .addCase(getMonthlyExpense.fulfilled, (state, action) => {
            state.analysisLoading = false;
            state.analysisSuccess = true;
            state.monthly_analysis = action.payload.data;
            state.message = action.payload.message;
        })
        .addCase(getMonthlyExpense.rejected, (state, action) => {
            state.analysisLoading = false;
            state.analysisSuccess = false;
            state.error = action.payload || 'Failed to fetch personal expenses';
        }).addCase(getWeeklyExpense.pending, (state) => {
            state.analysisLoading = true;
            state.error = null;
            state.analysisSuccess = false;
            state.message = '';
        }).addCase(getWeeklyExpense.fulfilled, (state, action) => {
            state.analysisLoading = false;
            state.analysisSuccess = true;
            state.weekly_analysis = action.payload.data;
            state.message = action.payload.message;
        }).addCase(getWeeklyExpense.rejected, (state, action) => {
            state.analysisLoading = false;
            state.analysisSuccess = false;
            state.error = action.payload || 'Failed to fetch weekly expenses';
        }).addCase(getDailyExpense.pending, (state) => {
            state.analysisLoading = true;
            state.error = null;
            state.analysisSuccess = false;
            state.message = '';
        }).addCase(getDailyExpense.fulfilled, (state, action) => {
            state.analysisLoading = false;
            state.analysisSuccess = true;
            state.daily_analysis = action.payload.data;
            state.message = action.payload.message;
        }).addCase(getDailyExpense.rejected, (state, action) => {
            state.analysisLoading = false;
            state.analysisSuccess = false;
            state.error = action.payload || 'Failed to fetch daily expenses';
        });
    },
});

export default analysisSlice.reducer;
export const { resetAnalysisState } = analysisSlice.actions;
