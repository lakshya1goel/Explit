import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@env';
import AuthService from '../../services/AuthService';
import { SplitCreationPayload, SplitCreationResponse, SplitState } from '../types/split';

const api = axios.create({
  baseURL: BASE_URL || 'http://192.168.111.248:8000/api/',
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

export const createSplit = createAsyncThunk<SplitCreationResponse, SplitCreationPayload, { rejectValue: string }>(
  'split-create',
  async (details, { rejectWithValue }) => {
    try {
      const response = await api.post<SplitCreationResponse>('split', details);

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

const initialState: SplitState = {
  loading: false,
  error: null,
  success: false,
  message: '',
};

const groupSlice = createSlice({
  name: 'split',
  initialState,
  reducers: {
    resetSplitState: (state) => {
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createSplit.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(createSplit.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createSplit.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to create split';
      });
  },
});

export default groupSlice.reducer;
export const { resetSplitState } = groupSlice.actions;
