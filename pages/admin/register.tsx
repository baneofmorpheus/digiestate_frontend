import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import UnauthenticatedLayout from 'components/layouts/unauthenticated/UnauthenticatedWithoutHeader';
import bgImage from 'images/login-bg.jpg';

import { useForm } from 'react-hook-form';
import ErrorMessage from 'components/validation/error_msg';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUpload } from '@fortawesome/free-solid-svg-icons';

import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';

import { ProgressSpinner } from 'primereact/progressspinner';

type AdminDataPropType = {};

const AdminData: NextPage<AdminDataPropType> = () => {
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const [uploadedImageBlob, setUploadedImageBlob] = useState<any>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState(false);
  const deviceToken = useSelector(
    (state: any) => state.authentication.deviceToken
  );

  const updateToastDispatch = useDispatch();

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const registerSchema = yup
    .object()
    .shape({
      first_name: yup.string().required().label('First Name'),
      last_name: yup.string().required().label('Last Name'),
      middle_name: yup.string().label('Middle Name'),
      email: yup.string().email().required().label('Email'),
      phone_number: yup
        .string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(11)
        .required()
        .label('Phone Number'),
      estate_name: yup.string().required().label('Gender'),
      estate_address: yup.string().required().label('Resident Type'),

      password: yup.string().required().label('Password'),
    })
    .required();

  type RegisterInputType = {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    estate_name: string;
    estate_address: string;
    address: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<RegisterInputType>({
    resolver: yupResolver(registerSchema),
    mode: 'all',
  });

  const router = useRouter();

  const handleResidentDataSubmit = async (data: RegisterInputType) => {
    if (!uploadedImagePreview) {
      updateToastDispatch(
        updateToastData({
          severity: 'error',
          summary: 'Profile Image Required',
          detail:
            'Please upload a profile image not greater than 5mb to proceed',
        })
      );
      return;
    }
    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append('estate_image', uploadedImageBlob);
      formData.append('first_name', data['first_name']);
      formData.append('middle_name', data['middle_name']);
      formData.append('last_name', data['last_name']);
      formData.append('email', data['email']);
      formData.append('phone_number', data['phone_number']);
      formData.append('device_id', deviceToken);
      formData.append('estate_name', data['estate_name']);
      formData.append('estate_address', data['estate_address']);
      formData.append('password', data['password']);
      const response = await digiEstateAxiosInstance.post(
        `/estate-admin/register`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        }
      );
      updateToastDispatch(
        updateToastData({
          severity: 'success',
          summary: 'Account Registered',
          detail: 'Please verify your email to continue',
        })
      );
      return router.push(`/send-email-verification?email=${data['email']}`);
    } catch (error) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const selectImageToUpload = () => {
    document.getElementById('profile_image_upload_input')?.click();
  };

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!(event.target.files instanceof FileList) || !event.target.files[0]) {
        /**
         * Reset image state if
         * uploaded image is not set
         */
        if (!uploadedImagePreview) {
          setUploadedImagePreview(null);
        }

        return;
      }

      // if image is greater than 5mb throw error
      if (event.target.files[0]['size'] > 5000000) {
        setUploadedImagePreview(null);

        updateToastDispatch(
          updateToastData({
            severity: 'error',
            summary: 'Image too large',
            detail: 'Image cannot be larger than 5mb',
          })
        );

        return;
      }
      setUploadedImagePreview(URL.createObjectURL(event.target.files[0]));
      setUploadedImageBlob(event.target.files[0]);
    } catch (error: any) {
      setUploadedImagePreview(null);

      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
  };
  return (
    <form
      className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-4 pr-4 md:pl-2 md:pr-2 w-full md:w-3/4'
      onSubmit={handleSubmit(handleResidentDataSubmit)}
    >
      <div className=''>
        <div>
          <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
            <div className='md:w-1/2 w-full'>
              <label className=''>
                First Name*
                <input
                  {...register('first_name')}
                  type='text'
                  name='first_name'
                  autoComplete='on'
                  className='rei-text-input'
                />
              </label>
              {errors['first_name'] && (
                <ErrorMessage message={errors['first_name']['message']!} />
              )}
            </div>
            <div className='md:w-1/2 w-full'>
              <label className=''>
                Last Name*
                <input
                  {...register('last_name')}
                  type='text'
                  name='last_name'
                  autoComplete='on'
                  className='rei-text-input'
                />
              </label>
              {errors['last_name'] && (
                <ErrorMessage message={errors['last_name']['message']!} />
              )}
            </div>
          </div>
        </div>
        {/* Section End */}

        {/* section start */}

        <div>
          <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
            <div className='md:w-1/2 w-full'>
              <label className=''>
                Middle Name
                <input
                  {...register('middle_name')}
                  type='text'
                  name='middle_name'
                  autoComplete='on'
                  className='rei-text-input'
                />
              </label>
              {errors['middle_name'] && (
                <ErrorMessage message={errors['middle_name']['message']!} />
              )}
            </div>
            <div className='md:w-1/2 w-full'>
              <label className=''>
                Email *
                <input
                  {...register('email')}
                  type='email'
                  name='email'
                  autoComplete='on'
                  className='rei-text-input'
                />
              </label>
              {errors['email'] && (
                <ErrorMessage message={errors['email']['message']!} />
              )}
            </div>
          </div>
        </div>
        <div>
          <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
            <div className='md:w-1/2 w-full'>
              {' '}
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
                <ErrorMessage message={errors['phone_number']['message']!} />
              )}
            </div>
            <div className='md:w-1/2 w-full'>
              <label className=''>
                Estate Name*
                <input
                  {...register('estate_name')}
                  type='text'
                  name='estate_name'
                  autoComplete='on'
                  className='rei-text-input'
                />
              </label>
              {errors['estate_name'] && (
                <ErrorMessage message={errors['estate_name']['message']!} />
              )}
            </div>
          </div>
        </div>
        {/* Section End */}

        {/* section start */}

        {/* Section End */}

        {/* section start */}

        <div>
          <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
            <div className='w-full'>
              <label className=''>
                Estate Address*
                <input
                  {...register('estate_address')}
                  type='text'
                  name='estate_address'
                  autoComplete='on'
                  className='rei-text-input'
                />
              </label>
              {errors['estate_address'] && (
                <ErrorMessage message={errors['estate_address']['message']!} />
              )}
            </div>
          </div>
        </div>

        {/* Section End */}
        <div className='mb-8'>
          <div className=' mt-2'>
            <p className=''>Estate Entrance/Gate Photo*</p>
            <input
              id='profile_image_upload_input'
              type='file'
              accept='image/*'
              onChange={uploadImage}
              className='hidden'
            />
          </div>
          <div
            style={{
              ...(uploadedImagePreview && {
                backgroundImage: `url(${uploadedImagePreview})`,
              }),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              // boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)',
            }}
            className='ml-auto border-gray-400 cursor-pointer rounded-lg flex flex-col justify-center items-center border  bg-white h-48 w-full'
          >
            <button
              className='h-full w-full'
              onClick={selectImageToUpload}
              type='button'
            >
              <FontAwesomeIcon
                className={`${
                  uploadedImagePreview ? 'text-white' : 'text-black'
                } text-xl animate-bounce `}
                icon={faUpload}
              />
            </button>
          </div>
          <p className='text-xs mt-1 text-gray-700'>
            We use this together with the address to verify estate locations.
          </p>
        </div>
        {/* section start */}

        <div className='mb-8'>
          <div className='mb-2 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
            <div className='w-full'>
              <label className='text-black'>
                Password*
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
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
            <input
              name='showPassword'
              id='showPassword'
              onChange={toggleShowPassword}
              className=' mr-2'
              type='checkbox'
            />
            <label
              htmlFor='showPassword'
              className='text-gray-800 cursor-pointer'
            >
              Show password
            </label>
          </div>
        </div>

        {/* Section End */}

        <div className='text-center mb-4 '>
          <button
            disabled={formLoading ? true : false}
            className=' bg-black flex ml-auto mr-auto items-center text-white mb-4 rounded-lg pl-8 pr-8 pt-2 pb-2'
            type='submit'
          >
            {formLoading ? (
              <>
                <ProgressSpinner
                  strokeWidth='4'
                  style={{ width: '30px', height: '30px' }}
                />
                <span className='text-sm ml-2'>Loading..</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </button>
        </div>
        <div className='text-sm  text-center mb-2'>
          <span className='mr-1 '>Have an account ?</span>{' '}
          <Link href='/admin'>
            <a className=''>
              <span className='text-reiGreen underline'>Sign in</span>
            </a>
          </Link>
        </div>
        <Link href='/'>
          <a className='block text-center text-sm'>
            <span className='text-reiGreen underline'>Go Home</span>
          </a>
        </Link>
      </div>
    </form>
  );
};

const RegisterAdmin = () => {
  return (
    <div className='flex min-h-screen justify-end '>
      <div className='lg:w-1/2 md:pt-20 pt-10 w-full bg-digiDefault '>
        <h1 className='text-center text-2xl mb-6  lato-font'>
          Register New Estate
        </h1>

        <AdminData />
      </div>
      <style jsx>{`
        @keyframes p-progress-spinner-color {
          100%,
          0% {
            stroke: #fff;
          }
          40% {
            stroke: #0057e7;
          }
          66% {
            stroke: #008744;
          }
          80%,
          90% {
            stroke: #fff;
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

RegisterAdmin.getLayout = function getLayout(page: NextPage) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default RegisterAdmin;
