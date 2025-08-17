import { configureStore } from '@reduxjs/toolkit';
import filtersReducer from './filtersSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
  },
});
