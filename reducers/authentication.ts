import { createSlice } from '@reduxjs/toolkit';

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    deviceToken: null,
  },
  reducers: {
    updateDeviceToken: (state, action) => {
      state.deviceToken = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDeviceToken } = authenticationSlice.actions;

export default authenticationSlice.reducer;
