import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  value: "Year",
};

const ChartDataFilterToggleSlice = createSlice({
  name: "activeTabFilter",
  initialState,
  reducers: {
    toggleFilter: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { toggleFilter } = ChartDataFilterToggleSlice.actions;

export default ChartDataFilterToggleSlice.reducer;
