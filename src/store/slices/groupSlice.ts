import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GroupCreationPayload, GroupCreationResponse, GroupState } from '../types';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@env';
import AuthService from '../../services/AuthService';

const api = axios.create({
  baseURL: BASE_URL || 'http://192.168.1.13:8000/api/',
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

export const createGroup = createAsyncThunk<GroupCreationResponse, GroupCreationPayload, { rejectValue: string }>(
  'group',
  async (details, { rejectWithValue }) => {
    try {
      const response = await api.post<GroupCreationResponse>('group', details);

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

const initialState: GroupState = {
  loading: false,
  error: null,
  success: false,
  message: '',
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to create group';
      });
  },
});

export default groupSlice.reducer;
