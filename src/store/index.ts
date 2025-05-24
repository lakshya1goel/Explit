import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import groupReducer from './slices/groupSlice';
import splitReducer from './slices/splitSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    group: groupReducer,
    split: splitReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
