import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  filters: {},
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setAllFilters(state, action) {
      state.filters = { ...action.payload };
    },
  },
});

// Selector to get the filters from the state
export const getAllFilters = (state) => state.filters;

// Export actions and reducer
export const { setAllFilters } = filtersSlice.actions;
export default filtersSlice.reducer;