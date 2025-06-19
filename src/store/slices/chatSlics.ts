import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@env';
import AuthService from '../../services/AuthService';
import { ChatState, FetchHistoryResponse } from '../types/chat';

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

export const fetchChatHistory = createAsyncThunk<FetchHistoryResponse, number, { rejectValue: string }>(
  'group/fetchChatHistory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<FetchHistoryResponse>(`group/history/${id}`);

      if (response.data.success) {
        console.log('Chat history fetched successfully:', response.data);
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

const initialState: ChatState = {
  loading: false,
  error: null,
  success: false,
  message: '',
  data: {
    id: '',
    name: '',
    user_id: 0,
    description: '',
    total_users: 0,
    expenses: [],
    messages: [],
  },
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    resetChatState: (state) => {
      state.success = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to fetch history';
      });
  },
});

export default chatSlice.reducer;
export const { resetChatState } = chatSlice.actions;
