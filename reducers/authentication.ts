import { createSlice } from '@reduxjs/toolkit';

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    token: 0,
  },
  reducers: {
    updateToken: (state, action) => {
      state.token = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateToken } = authenticationSlice.actions;

export default authenticationSlice.reducer;
