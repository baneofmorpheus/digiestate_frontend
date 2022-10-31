import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import ResidentHome from 'components/residents/home/Home';
import bgImage from 'images/login-bg.png';
import ErrorMessage from 'components/validation/error_msg';

import { Toast } from 'primereact/toast';
import { Toast as ToastType } from 'primereact/toast';
import axios from 'axios';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';

import { ProgressSpinner } from 'primereact/progressspinner';
import { Divider } from 'primereact';

const App = () => {
  const [formLoading, setFormLoading] = useState(false);

  const router = useRouter();
  const toast = useRef<ToastType>(null);
  const role = useSelector((state: any) => state.authentication.role);
  const [componentToDisplay, setComponentToDisplay] = useState<any>(null);
  useEffect(() => {
    switch (role) {
      case 'resident':
        setComponentToDisplay(<ResidentHome />);

        break;

      default:
        setComponentToDisplay(
          <div className='text-center '>
            <p>
              You are not supposed to be here. <br />
              Invalid user role,contact support if you think this is an error.
            </p>
          </div>
        );
        break;
    }
  }, [role]);
  const resendVerificationMail = async () => {
    const { email } = router.query;

    setFormLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/users/send-email-verification-mail`,
        { email: email }
      );
      toast.current!.show({
        severity: 'success',
        summary: 'Verification mail sent',
        detail: 'Please check your email to continue',
      });
    } catch (error) {
      axiosErrorHandler(error, toast);
    }
    setFormLoading(false);
  };

  return (
    <div className='pt-4 pl-2 pr-2'>
      <p className='mb-2'>Good morning, Genii</p>

      {componentToDisplay}
    </div>
  );
};

App.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default App;
