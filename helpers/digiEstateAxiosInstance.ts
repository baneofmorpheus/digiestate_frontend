import axios, { AxiosError, AxiosResponse } from 'axios';
import { store } from 'store';

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
    console.log('running interceptor');

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
  function (req) {
    return req;
  },
  function (error) {
    return Promise.reject(error);
  }
);
export default digiEstateAxiosInstance;
