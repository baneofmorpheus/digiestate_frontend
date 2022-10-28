import { createSlice } from '@reduxjs/toolkit';

export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    deviceToken: null,
    loginToken: null,
    role: null,
    estateCode: null,
  },
  reducers: {
    updateDeviceToken: (state, action) => {
      state.deviceToken = action.payload;
    },
    updateLoginData: (state, action) => {
      state.loginToken = action.payload.loginToken;
      state.role = action.payload.role;
      state.estateCode = action.payload.estateCode;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDeviceToken, updateLoginData } =
  authenticationSlice.actions;

export default authenticationSlice.reducer;
