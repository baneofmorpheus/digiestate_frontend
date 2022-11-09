import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import UnauthenticatedLayout from 'components/layouts/unauthenticated/UnauthenticatedWithoutHeader';
import bgImage from 'images/login-bg.png';

import { Toast } from 'primereact/toast';
import { Toast as ToastType } from 'primereact/toast';
import axios from 'axios';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import Link from 'next/link';
import { updateToastData } from 'reducers/utility';
import { useDispatch } from 'react-redux';

import { ProgressSpinner } from 'primereact/progressspinner';

const SendEmailVerification = () => {
  const [formLoading, setFormLoading] = useState(false);

  const router = useRouter();
  const toast = useRef<ToastType>(null);
  const updateToastDispatch = useDispatch();

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
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  };

  return (
    <div className='flex min-h-screen justify-end '>
      <div className='lg:w-1/2 md:pt-20 pt-10 w-full bg-digiDefault '>
        <h1 className='text-center text-2xl mb-8  lato-font'>Verify Email</h1>
        <p className='text-center mb-2'>
          A verification email has been sent to your email address. <br />
          Follow the instructions to verify your account. <br />
          You can close this page.
        </p>

        <div className='text-center mb-4 '>
          {formLoading && (
            <ProgressSpinner
              strokeWidth='4'
              style={{ width: '30px', height: '30px' }}
            />
          )}
        </div>
        <div className='text-sm  text-center'>
          <span className='mr-1 '>Did not get the email ?</span>{' '}
          <button
            type='button'
            onClick={resendVerificationMail}
            className='animate-bounce'
          >
            <span className='text-reiGreen underline '>Resend email</span>
          </button>
          <Link href='/'>
            <a className='block'>
              <span className='text-reiGreen underline'>Go home</span>
            </a>
          </Link>
        </div>
        <Toast ref={toast}></Toast>
      </div>
      <style jsx>{`
        @keyframes p-progress-spinner-color {
          100%,
          0% {
            stroke: #000;
          }
          40% {
            stroke: #0057e7;
          }
          66% {
            stroke: #008744;
          }
          80%,
          90% {
            stroke: #000;
          }
        }
      `}</style>
      <style jsx global>{`
        #unautenticated {
          background-image: url(${bgImage.src});
          background-size: 70% 100%;
          background-position: left;
          background-repeat: no-repeat;
        }
      `}</style>
    </div>
  );
};

SendEmailVerification.getLayout = function getLayout(page: NextPage) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default SendEmailVerification;
