import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@env';
import AuthService from '../../services/AuthService';
import { PersonalExpenseCreationPayload, PersonalExpenseCreationResponse, PersonalExpenseState } from '../types/personalExpense';

const api = axios.create({
    baseURL: BASE_URL || 'http://140.40.0.118:8000/api/',
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

export const createPersonalExpense = createAsyncThunk<PersonalExpenseCreationResponse, PersonalExpenseCreationPayload, { rejectValue: string }>(
    'personal-expense-create',
    async (details, { rejectWithValue }) => {
        try {
        const response = await api.post<PersonalExpenseCreationResponse>('split/personal-expense', details);

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

const initialState: PersonalExpenseState = {
    loading: false,
    error: null,
    success: false,
    message: '',
};

const personalExpenseSlice = createSlice({
    name: 'personalExpense',
    initialState,
    reducers: {
        resetPersonalExpenseState: (state) => {
            state.success = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder.addCase(createPersonalExpense.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
            state.message = '';
        })
        .addCase(createPersonalExpense.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.message = action.payload.message;
        })
        .addCase(createPersonalExpense.rejected, (state, action) => {
            state.loading = false;
            state.success = false;
            state.error = action.payload || 'Failed to create personal expense';
        });
    },
});

export default personalExpenseSlice.reducer;
export const { resetPersonalExpenseState } = personalExpenseSlice.actions;
