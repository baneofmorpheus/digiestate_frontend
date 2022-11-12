import type { NextPage } from 'next';

import { useRef, useEffect } from 'react';

import { Toast } from 'primereact/toast';
import { Toast as ToastType } from 'primereact/toast';
import { useSelector, useDispatch } from 'react-redux';
import { updateToastData } from 'reducers/utility';
const ToastWrapper: NextPage = () => {
  const toast = useRef<ToastType>(null);

  const toastDispatch = useDispatch();

  const toastData = useSelector((state: any) => state.utility.toastData);

  useEffect(() => {
    const availableSeverity = ['success', 'error', 'warn'];

    if (!toastData) {
      return;
    }

    if (
      !toastData?.length &&
      (!toastData.severity || !availableSeverity.includes(toastData.severity))
    ) {
      return;
    }

    toast.current!.show(toastData);
    toastDispatch(
      updateToastData({
        severity: null,
        detail: null,
        summary: null,
      })
    );
  }, [toastData, toastDispatch]);

  return (
    <div>
      <Toast ref={toast}></Toast>
    </div>
  );
};
export default ToastWrapper;
