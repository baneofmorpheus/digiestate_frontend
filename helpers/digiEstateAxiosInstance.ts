import axios, { AxiosError, AxiosResponse } from 'axios';
import { store } from 'store';
import { updateLoginData } from 'reducers/authentication';
const routesThatDontNeedAuth = [
  `${process.env.NEXT_PUBLIC_API_URL}/users/send-email-verification-mail`,
  `${process.env.NEXT_PUBLIC_API_URL}/users/verify-email`,
  `${process.env.NEXT_PUBLIC_API_URL}/users/send-password-reset-mail`,
  `${process.env.NEXT_PUBLIC_API_URL}/users/reset-password`,
  `${process.env.NEXT_PUBLIC_API_URL}/users/send-password-reset-mail`,
  `${process.env.NEXT_PUBLIC_API_URL}/residents/login`,
  `${process.env.NEXT_PUBLIC_API_URL}/superadmin/login`,
  `${process.env.NEXT_PUBLIC_API_URL}/estate-admin/login`,
  `${process.env.NEXT_PUBLIC_API_URL}/estate-security/login`,
];

const digiEstateAxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

digiEstateAxiosInstance.defaults.headers['Accept'] = 'application/json';
digiEstateAxiosInstance.defaults.headers['Content-Type'] = 'application/json';

digiEstateAxiosInstance.interceptors.request.use(
  function (req) {
    const state = store.getState();
    if (!routesThatDontNeedAuth.includes(req.url!)) {
      req.headers![
        'Authorization'
      ] = `Bearer ${state.authentication.loginToken}`;
    }

    return req;
  },
  function (error) {
    return Promise.reject(error);
  }
);

digiEstateAxiosInstance.interceptors.response.use(
  function (res) {
    return res;
  },
  function (error) {
    if (
      error.response?.status == 401 &&
      error.response.data.message.includes('Unauthenticated')
    ) {
      store.dispatch(
        updateLoginData({
          deviceToken: null,
          userId: null,
          loginToken: null,
          role: null,
          estate: null,
        })
      );
    }
    return Promise.reject(error);
  }
);
export default digiEstateAxiosInstance;
