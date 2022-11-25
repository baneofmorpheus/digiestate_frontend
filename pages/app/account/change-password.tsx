import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import ErrorMessage from 'components/validation/error_msg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { updateToastData } from 'reducers/utility';

import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ProgressBar } from 'primereact/progressbar';

const ChangePassword = () => {
  const router = useRouter();
  const updateToastDispatch = useDispatch();
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const changePasswordSchema = yup
    .object()
    .shape({
      old_password: yup.string().min(8).required().label('Old Password'),
      new_password: yup.string().min(8).required().label('New Password'),
    })
    .required();

  type ChangePasswordInputType = {
    old_password: string;
    new_password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<ChangePasswordInputType>({
    resolver: yupResolver(changePasswordSchema),
    mode: 'all',
  });

  const sendChangePasswordRequest = async (data: ChangePasswordInputType) => {
    setFormLoading(true);

    try {
      const response = await digiEstateAxiosInstance.post(
        `/users/change-password`,
        data
      );
      updateToastDispatch(
        updateToastData({
          severity: 'success',
          summary: 'Password updated',
          detail: 'Password updated successfully',
        })
      );
      return router.push('/app/account');
    } catch (error) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  };
  return (
    <div className='pt-10 text-sm md:pl-2 md:pr-2 pl-4 pr-4'>
      <div className='mb-6 text-xs'>
        <Link href='/app/account'>
          <a className='underline'>
            <span className=''>
              {' '}
              <FontAwesomeIcon className={` mr-2 `} icon={faLeftLong} />
              <span>Go Back</span>
            </span>
          </a>
        </Link>
      </div>

      <h4 className='mb-6'>Change Password</h4>
      <form
        className='mb-4  ml-auto mr-auto  '
        onSubmit={handleSubmit(sendChangePasswordRequest)}
      >
        <div>
          <div className='mb-6 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
            <div className='md:w-1/2 w-full'>
              <label className=''>
                Old Password*
                <input
                  {...register('old_password')}
                  type='text'
                  name='old_password'
                  autoComplete='on'
                  className='rei-text-input text-base'
                />
              </label>
              {errors['old_password'] && (
                <ErrorMessage message={errors['old_password']['message']!} />
              )}
            </div>
            <div className='md:w-1/2 w-full'>
              <label className=''>
                New Password*
                <input
                  {...register('new_password')}
                  type='text'
                  name='new_password'
                  autoComplete='on'
                  className='rei-text-input text-base'
                />
              </label>
              {errors['new_password'] && (
                <ErrorMessage message={errors['new_password']['message']!} />
              )}
            </div>
          </div>
          {formLoading && (
            <div className='mb-4'>
              <ProgressBar
                mode='indeterminate'
                color='#4B5563'
                style={{ height: '6px' }}
              ></ProgressBar>
            </div>
          )}
          <div className='text-center'>
            <button
              disabled={formLoading}
              className='text-sm pl-4 pr-4 pt-2 pb-2 bg-gray-600 text-digiDefault rounded-lg'
              type='submit'
            >
              Change Password
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

ChangePassword.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default ChangePassword;
