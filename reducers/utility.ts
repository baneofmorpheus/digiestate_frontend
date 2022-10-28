import { createSlice } from '@reduxjs/toolkit';

export const utilitySlice = createSlice({
  name: 'utility',
  initialState: {
    toast: null,
  },
  reducers: {
    updateToast: (state, action) => {
      state.toast = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateToast } = utilitySlice.actions;

export default utilitySlice.reducer;
