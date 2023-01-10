import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import UnauthenticatedLayout from 'components/layouts/unauthenticated/UnauthenticatedWithoutHeader';
import bgImage from 'images/login-bg.jpg';
import { updateLoginData } from 'reducers/authentication';

import { useForm } from 'react-hook-form';
import ErrorMessage from 'components/validation/error_msg';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { updateDeviceToken } from 'reducers/authentication';

import { ProgressSpinner } from 'primereact/progressspinner';
import { retrieveToken } from 'helpers/firebase';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
type LoginDataPropType = {};

const LoginData: NextPage<LoginDataPropType> = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState(false);
  const updateLoginDispatch = useDispatch();
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const [retreivedToken, setRetrievedToken] = useState<boolean>(false);
  const updateDeviceTokenDispatch = useDispatch();
  const updateToastDispatch = useDispatch();
  const router = useRouter();

  const loginToken = useSelector(
    (state: any) => state.authentication.loginToken
  );

  useEffect(() => {
    const initCloudMessaging = async () => {
      if (retreivedToken) {
        return;
      }
      try {
        const token: string | null = await retrieveToken();

        if (typeof token == 'string') {
          setRetrievedToken(true);
          updateDeviceTokenDispatch(updateDeviceToken(token));
        }
      } catch (error: any) {
        updateToastDispatch(
          updateToastData({
            severity: 'error',
            summary: 'Device registeration errror',
            detail: error.message || 'Contact support',
          })
        );
      }
    };

    if (loginToken) {
      router.push('/app');
      return;
    }
    initCloudMessaging();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deviceToken = useSelector(
    (state: any) => state.authentication.deviceToken
  );

  const loginSchema = yup
    .object()
    .shape({
      phone_number: yup
        .string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(11)
        .required()
        .label('Phone Number'),

      password: yup.string().required().label('Password'),
      estate_code: yup.string().required().label('Estate Code'),
    })
    .required();

  type LoginInputType = {
    phone_number: string;
    password: string;
    estate_code: string;
    device_id: string;
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

  const handleLogin = async (data: LoginInputType) => {
    setFormLoading(true);

    try {
      data.device_id = deviceToken;

      const response = await digiEstateAxiosInstance.post(
        '/estate-admin/login',
        data
      );

      updateToastDispatch(
        updateToastData({
          severity: 'success',
          summary: 'Login successful',
          detail: '',
        })
      );

      const estate = response.data.data.estate;
      const estateSubscription = response.data.data.estate_subscription;

      updateLoginDispatch(
        updateLoginData({
          loginToken: response.data.data.token,
          role: response.data.data.role,
          user: {
            id: response.data.data.user.id,
            profileImageLink: null,
            firstName: response.data.data.user.first_name,
            lastName: response.data.data.user.last_name,
          },
          estate: {
            id: estate.id,
            name: estate.name,
            code: estate.code,
            imageLink: estate.image_link,
          },
          estateSubscription: {
            id: estateSubscription.id,
            admin: {
              id: estateSubscription.admin.id,
              firstName: estateSubscription.admin.first_name,
              lastName: estateSubscription.admin.last_name,
            },
            startDate: estateSubscription.string,
            expiryDate: estateSubscription.string,
            isRenewable: estateSubscription.is_renewable,
            status: estateSubscription.status,
            subscriptionPlan: {
              id: estateSubscription.subscription_plan.id,
              name: estateSubscription.subscription_plan.name,
              numberOfMonths:
                estateSubscription.subscription_plan.number_of_months,
              amountInNaira:
                estateSubscription.subscription_plan.amount_in_naira,
              vatPercentage:
                estateSubscription.subscription_plan.vat_percentage,
              code: estateSubscription.subscription_plan.code,
            },
          },
        })
      );

      return router.push(`/app`);
    } catch (error: any) {
      if (
        error.response?.status === 403 &&
        error.response.data.error_action === 'VERIFY_EMAIL'
      ) {
        return router.push(
          `/send-email-verification?email=${error.response.data.email}`
        );
      }
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form
      className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-4 pr-4 md:pl-2 md:pr-2 w-full md:w-3/4'
      onSubmit={handleSubmit(handleLogin)}
    >
      <div className=''>
        {/* section start */}

        <div>
          <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
            <div className='w-full'>
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
          </div>
          <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
            <div className='w-full'>
              <label className='text-black'>
                Estate Code*
                <input
                  {...register('estate_code')}
                  type='text'
                  autoComplete='on'
                  className='rei-text-input'
                />
              </label>
              {errors['estate_code'] && (
                <ErrorMessage message={errors['estate_code']['message']!} />
              )}
            </div>
          </div>
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
            className=' bg-gray-600 text-digiDefault text-sm hover:bg-black flex ml-auto mr-auto items-center  mb-4 rounded-lg pl-8 pr-8 pt-2 pb-2'
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
              <span>Login</span>
            )}
          </button>
        </div>
        <div className='text-sm mb-2  text-center'>
          <span className='mr-1 '>Do not have an account ?</span>{' '}
          <Link href='/resident/register'>
            <a className=''>
              <span className='text-reiGreen underline'>Register</span>
            </a>
          </Link>
        </div>
        <Link href='/'>
          <a className='block text-center text-xs'>
            <span className='text-reiGreen underline'>Go Home</span>
          </a>
        </Link>
      </div>
    </form>
  );
};

const LoginAdmin = () => {
  return (
    <div className='flex min-h-screen justify-end '>
      <div className='lg:w-1/2 md:pt-20 pt-10 w-full bg-digiDefault '>
        <h1 className='text-center text-2xl mb-8  lato-font'>
          Login As Estate Admin
        </h1>

        <LoginData />
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

LoginAdmin.getLayout = function getLayout(page: NextPage) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default LoginAdmin;
