import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import UnauthenticatedLayout from 'components/layouts/unauthenticated/UnauthenticatedWithoutHeader';
import styles from 'styles/Common.module.css';
import bgImage from 'images/login-bg.png';

import { useForm } from 'react-hook-form';
import ErrorMessage from 'components/validation/error_msg';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Toast } from 'primereact/toast';
import { Toast as ToastType } from 'primereact/toast';
import axios from 'axios';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import Link from 'next/link';

import { useSelector, useDispatch } from 'react-redux';

const LoginResident = () => {
  const authToken = useSelector((state: any) => state.authentication.token);

  const router = useRouter();
  const dispatch = useDispatch();

  const loginSchema = yup
    .object()
    .shape({
      phoneNumber: yup.string().required().label('Phone Number'),
      password: yup.string().required().label('Password'),
      estateCode: yup.string().required().label('Estate Code'),
    })
    .required();

  const toast = useRef<ToastType>(null);

  type LoginInputType = {
    phoneNumber: string;
    password: string;
    estateCode: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<LoginInputType>({
    resolver: yupResolver(loginSchema),
    mode: 'all',
  });

  const [formLoading, setFormLoading] = useState(false);

  const loginUser = async (data: any) => {
    try {
      setFormLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        data
      );

      setFormLoading(false);

      if (response.status !== 200) {
        toast.current!.show({
          severity: 'error',
          summary: 'System error',
          detail: 'Error logging in',
        });
        return;
      }

      if (!response.data.data.user.email_verified_at) {
        return router.push(
          `${location.protocol}//${
            location.host
          }/authentication/send-verification-mail/${window.btoa(
            response.data.data.user.email
          )}`
        );
      }
      // router.push(
      //   `${location.protocol}//${location.host}/authentication/verify-email/${data.email}`
      // );
    } catch (error: any) {
      axiosErrorHandler(error, toast);
      setFormLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen justify-end'>
      <div className='w-1/2 pt-40 bg-digiDefault '>
        <h1 className='text-center text-2xl mb-6  lato-font'>
          Login As Resident
        </h1>

        <form
          className='mb-4  ml-auto mr-auto w-2/3'
          onSubmit={handleSubmit(loginUser)}
        >
          <div className='  p-5 md:p-10'>
            <div>
              <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                <div className='w-full'>
                  <label className=''>
                    Phone Number
                    <input
                      {...register('phoneNumber')}
                      type='text'
                      name='phoneNumber'
                      autoComplete='on'
                      className='rei-text-input'
                    />
                  </label>
                  {errors['phoneNumber'] && (
                    <ErrorMessage message={errors['phoneNumber']['message']!} />
                  )}
                </div>
              </div>
            </div>
            {/* Section End */}

            {/* section start */}

            <div>
              <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                <div className='w-full'>
                  <label className='text-black'>
                    Estate Code
                    <input
                      {...register('estateCode')}
                      type='password'
                      autoComplete='on'
                      className='rei-text-input'
                    />
                  </label>
                  {errors['estateCode'] && (
                    <ErrorMessage message={errors['estateCode']['message']!} />
                  )}
                </div>
              </div>
            </div>

            {/* Section End */}

            {/* section start */}

            <div className='mb-8'>
              <div className='mb-2 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                <div className='w-full'>
                  <label className='text-black'>
                    Password
                    <input
                      {...register('password')}
                      type='password'
                      autoComplete='on'
                      className='rei-text-input'
                    />
                  </label>
                  {errors['password'] && (
                    <ErrorMessage message={errors['password']['message']!} />
                  )}
                </div>
              </div>
              <div>
                <input className=' mr-2' type='checkbox' />
                <label htmlFor='' className='text-gray-800'>
                  Show password
                </label>
              </div>
            </div>

            {/* Section End */}

            <div className='text-center mb-4 '>
              <button
                className=' bg-black text-white mb-4 rounded-lg pl-8 pr-8 pt-2 pb-2'
                type='button'
              >
                Log in
              </button>
              <Link href='/authentication/password-reset'>
                <a className='underline block text-center text-xs text-reiGreen'>
                  Forgot password ?
                </a>
              </Link>
            </div>
            <div className='text-xs  text-center'>
              <span className='mr-1 '>Do not have an account ?</span>{' '}
              <Link href='/resident/register'>
                <a className=''>
                  <span className='text-reiGreen underline'>
                    Create an account
                  </span>
                </a>
              </Link>
            </div>
            <Toast ref={toast}></Toast>
          </div>
        </form>
      </div>
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

LoginResident.getLayout = function getLayout(page: NextPage) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default LoginResident;
