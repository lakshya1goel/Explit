import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@env';
import AuthService from '../../services/AuthService';
import { GetSummaryResponse, GroupSummaryState } from '../types/groupSummary';

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

export const fetchGroupSummary = createAsyncThunk<GetSummaryResponse, number, { rejectValue: string }>(
  'group/fetchSummary',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<GetSummaryResponse>(`split/summary/${id}`);

      if (response.data.success) {
        console.log('Group Summary fetched successfully:', response.data);
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

const initialState: GroupSummaryState = {
  loading: false,
  error: null,
  success: false,
  message: '',
  data: {
    total_group_owed_by: 0,
    total_group_owed_to: 0,
    settlements: [],
  },
};

const groupSummarySlice = createSlice({
  name: 'groupSummary',
  initialState,
  reducers: {
    resetGroupSummaryState: (state) => {
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGroupSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(fetchGroupSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(fetchGroupSummary.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to fetch history';
      });
  },
});

export default groupSummarySlice.reducer;
export const { resetGroupSummaryState } = groupSummarySlice.actions;
