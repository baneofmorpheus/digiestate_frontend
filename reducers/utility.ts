import { createSlice } from '@reduxjs/toolkit';

export const utilitySlice = createSlice({
  name: 'utility',
  initialState: {
    toastData: {
      severity: null,
      detail: null,
      summary: null,
    },
  },
  reducers: {
    updateToastData: (state, action) => {
      state.toastData = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateToastData } = utilitySlice.actions;

export default utilitySlice.reducer;
