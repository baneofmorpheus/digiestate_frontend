import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import ErrorMessage from 'components/validation/error_msg';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { ProgressBar } from 'primereact/progressbar';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';

import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import { UserType } from 'types';

const CreateAdmin = () => {
  const [formLoading, setFormLoading] = useState(false);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const updateToastDispatch = useDispatch();

  const estate = useSelector((state: any) => state.authentication.estate);

  const createAdminSchema = yup
    .object()
    .shape({
      phone_number: yup
        .string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(11)
        .required()
        .label('Phone Number'),

      email: yup.string().email().required().label('Email'),
      first_name: yup.string().required().label('First Name'),
      last_name: yup.string().required().label('Last Name'),
      middle_name: yup.string().label('Middle Name'),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<UserType>({
    resolver: yupResolver(createAdminSchema),
    mode: 'all',
  });

  const router = useRouter();

  const createAdmin = async (data: UserType) => {
    try {
      setFormLoading(true);
      const adminInput = { ...data, role: 'admin' };
      const response = await digiEstateAxiosInstance.post(
        `/estates/${estate.id}/administrative-staff`,
        adminInput
      );
      updateToastDispatch(
        updateToastData({
          severity: 'success',
          summary: 'Registeration successful',
          detail: 'Admin has been registered successfully.',
        })
      );
      return router.push(`/app`);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  };

  return (
    <div className=' pt-10 pl-2 pr-2'>
      <div className=' '>
        <PreviousPage label='New Admin' />

        <form
          className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-2 pr-2 '
          onSubmit={handleSubmit(createAdmin)}
        >
          <div className=' text-sm'>
            {/* section start */}

            <div className='x2l:w-2/3 text-base md:text-sm ml-auto mr-auto mb-6 '>
              <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                <div className='w-full lg:w-1/2'>
                  <label className='text-black'>
                    First Name*
                    <input
                      {...register('first_name')}
                      type='text'
                      autoComplete='on'
                      className='rei-text-input'
                    />
                  </label>
                  {errors['first_name'] && (
                    <ErrorMessage message={errors['first_name']['message']!} />
                  )}
                </div>
                <div className='w-full lg:w-1/2'>
                  <label className='text-black'>
                    Last Name*
                    <input
                      {...register('last_name')}
                      type='text'
                      autoComplete='on'
                      className='rei-text-input'
                    />
                  </label>
                  {errors['last_name'] && (
                    <ErrorMessage message={errors['last_name']['message']!} />
                  )}
                </div>
              </div>
              <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                <div className='w-full lg:w-1/2'>
                  <label className='text-black'>
                    Middle Name
                    <input
                      {...register('middle_name')}
                      type='text'
                      autoComplete='on'
                      className='rei-text-input'
                    />
                  </label>
                  {errors['middle_name'] && (
                    <ErrorMessage message={errors['middle_name']['message']!} />
                  )}
                </div>
                <div className='w-full lg:w-1/2 '>
                  <label className='text-black'>
                    Email
                    <input
                      {...register('email')}
                      type='email'
                      autoComplete='on'
                      className='rei-text-input'
                    />
                  </label>
                  {errors['email'] && (
                    <ErrorMessage message={errors['email']['message']!} />
                  )}
                </div>
              </div>
              <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                <div className='w-full lg:w-1/2'>
                  <label className='text-black'>
                    Phone Number*
                    <input
                      {...register('phone_number')}
                      type='tel'
                      autoComplete='on'
                      className='rei-text-input'
                    />
                  </label>
                  {errors['phone_number'] && (
                    <ErrorMessage
                      message={errors['phone_number']['message']!}
                    />
                  )}
                </div>
              </div>
            </div>
            <p className='text-xs text-center text-gray-500'>
              The admin will get their password sent to their email <br /> with
              a verification link after you click the button below.
            </p>

            {/* section start */}
            {formLoading && (
              <ProgressBar
                mode='indeterminate'
                color='#4B5563'
                style={{ height: '6px' }}
              ></ProgressBar>
            )}
            {/* Section End */}

            <div className='justify-center flex gap-x-4  mt-4 '>
              <button
                disabled={formLoading}
                className='bg-gray-600 hover:bg-black pt-2 pb-2 pl-4 pr-4 rounded-lg text-digiDefault'
              >
                Register Admin
              </button>
            </div>
          </div>
        </form>
      </div>
      <style global jsx>{`
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
            stroke: #f000;
          }
        }
        #bookingMode > div {
          height: 2rem !important;
          font-family: 'Lato', sans-serif;
          font-weight: normal;
        }
        #bookingMode .p-button-label {
          font-weight: normal !important;
          font-size: 0.8rem;
        }
        #bookingMode .p-button.p-highlight {
          background: #4b5563;
          color: #fff2d9;
        }
        #bookingMode {
          text-align: right;
        }

        .guests-container {
          min-height: 10rem;
        }

        #bookGuestsDialog {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

CreateAdmin.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default CreateAdmin;
