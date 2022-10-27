import axios, { AxiosError } from 'axios';
import { Toast as ToastType, ToastMessageType } from 'primereact/toast';
import { RefObject } from 'react';

const axiosErrorHandler = (
  error: any | AxiosError,
  toast: RefObject<ToastType>
) => {
  /**Handle normal errors */
  if (!axios.isAxiosError(error)) {
    toast.current!.show({
      severity: 'error',
      summary: 'System error',
      detail: error.message,
    });
    return;
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
      toast.current!.show(formattedErrors);

      break;

    default:
      toast.current!.show({
        severity: 'error',
        summary: 'System error',
        detail: data.msg,
        life: 10000,
      });
      break;
  }
};
export default axiosErrorHandler;
