import { createSlice } from '@reduxjs/toolkit';

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    deviceToken: null,
    user: {
      id: null,
      firstName: null,
      profileImageLink: null,
      lastName: null,
    },
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
      state.user = action.payload.user;
      state.estate = action.payload.estate;
    },
    logOut: (state, action) => {
      state.loginToken = null;
      state.user = {
        id: null,
        firstName: null,
        lastName: null,
        profileImageLink: null,
      };
      state.estate = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDeviceToken, updateLoginData, logOut } =
  authenticationSlice.actions;

export default authenticationSlice.reducer;
