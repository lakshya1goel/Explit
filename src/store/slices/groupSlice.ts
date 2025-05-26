import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { GetAllGroupsResponse, GroupCreationPayload, GroupCreationResponse, GroupState } from '../types';
import axios, { AxiosError } from 'axios';
import { BASE_URL } from '@env';
import AuthService from '../../services/AuthService';

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

export const createGroup = createAsyncThunk<GroupCreationResponse, GroupCreationPayload, { rejectValue: string }>(
  'group-create',
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

export const fetchGroups = createAsyncThunk<GetAllGroupsResponse, void, { rejectValue: string }>(
  'groups-fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<GetAllGroupsResponse>('group');

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
  data: [],
};

const groupSlice = createSlice({
  name: 'group',
  initialState,
  reducers: {
    resetGroupState: (state) => {
      state.success = false;
      state.message = '';
    },
  },
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
      })
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.message = '';
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload || 'Failed to fetch groups';
      });
  },
});

export default groupSlice.reducer;
export const { resetGroupState } = groupSlice.actions;
