import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthenticationStateType = {
  // loginToken is bearer sanctum token
  loginToken: string | null;
  deviceToken: string | null;
  role: 'admin' | 'superadmin' | 'security' | 'resident' | null;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profileImageLink: string | null;
  } | null;
  estateSubscription: {
    id: number;
    admin: {
      id: number;
      firstName: string;
      lastName: string;
    };
    startDate: string;
    expiryDate: string;
    isRenewable: boolean;
    status: string;
    subscriptionPlan: {
      id: number;
      name: string;
      numberOfMonths: string;
      amountInNaira: string;
      vatPercentage: string;
      code: string;
    };
  } | null;
  estate: {
    id: string;
    name: string;
    code: string;
    imageLink: string;
  } | null;
};

type LoginDataInputType = Omit<AuthenticationStateType, 'deviceToken'>;
export const authenticationSlice = createSlice({
  name: 'authentication',
  initialState: {
    deviceToken: null,
    user: null,
    estateSubscription: null,
    loginToken: null,
    role: null,
    estate: null,
  } as AuthenticationStateType,
  reducers: {
    updateDeviceToken: (state, action) => {
      state.deviceToken = action.payload;
    },
    updateLoginData: (state, action: PayloadAction<LoginDataInputType>) => {
      state.loginToken = action.payload.loginToken;
      state.role = action.payload.role;
      state.user = action.payload.user;
      state.estate = action.payload.estate;
      state.estateSubscription = action.payload.estateSubscription;
    },
    logOut: (state, action) => {
      state.loginToken = null;
      state.user = null;
      state.estate = null;
      state.estateSubscription = null;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateDeviceToken, updateLoginData, logOut } =
  authenticationSlice.actions;

export default authenticationSlice.reducer;
