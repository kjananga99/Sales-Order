import { configureStore } from '@reduxjs/toolkit';
import salesOrderReducer from './slices/salesOrderSlice';

export const store = configureStore({
  reducer: {
    salesOrder: salesOrderReducer,
  },
});

export default store;