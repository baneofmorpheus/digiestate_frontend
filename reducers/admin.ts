import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AdminStateType = {
  pendingRegistrationCount: number;
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    pendingRegistrationCount: 0,
  } as AdminStateType,
  reducers: {
    updatePendingRegistrationCount: (state, action: PayloadAction<number>) => {
      state.pendingRegistrationCount = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updatePendingRegistrationCount } = adminSlice.actions;

export default adminSlice.reducer;
