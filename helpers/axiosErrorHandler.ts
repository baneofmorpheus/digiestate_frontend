import axios, { AxiosError, AxiosResponse } from 'axios';
import { ToastMessageType } from 'primereact/toast';

const axiosErrorHandler = (error: any | AxiosError) => {
  /**Handle normal errors */
  if (!axios.isAxiosError(error)) {
    return {
      severity: 'error',
      summary: 'System error',
      detail: error.message,
    };
  }

  /**Handle axios errors */
  const data: any = error.response!.data;
  switch (error.response!.status) {
    case 422:
      let errors: Array<string> = [];

      /**Combine all field errors into one array */
      Object.values(data.errors).forEach((fieldError: any) => {
        errors = [...errors, ...fieldError];
      });

      const formattedErrors: ToastMessageType = errors.map((singleError) => {
        return {
          severity: 'error',
          summary: 'Validation error',
          detail: singleError,
        };
      });
      return formattedErrors;

    default:
      return {
        severity: 'error',
        summary: 'System error',
        detail: data.message,
        life: 10000,
      };
  }
};
export default axiosErrorHandler;
