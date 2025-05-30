import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import groupReducer from './slices/groupSlice';
import splitReducer from './slices/splitSlice';
import chatReducer from './slices/chatSlics';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    group: groupReducer,
    split: splitReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
