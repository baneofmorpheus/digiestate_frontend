import { createSlice } from '@reduxjs/toolkit';

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    deviceToken: null,
    userId: null,
    firstName: null,
    loginToken: null,
    role: null,
    estate: null,
  },
  reducers: {
    updateDeviceToken: (state, action) => {
      state.deviceToken = action.payload;
    },
    updateLoginData: (state, action) => {
      state.loginToken = action.payload.loginToken;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.estate = action.payload.estate;
      state.firstName = action.payload.firstName;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDeviceToken, updateLoginData } =
  authenticationSlice.actions;

export default authenticationSlice.reducer;
