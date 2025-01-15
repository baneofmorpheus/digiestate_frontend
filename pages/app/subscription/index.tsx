import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { updateToastData } from 'reducers/utility';
import { Skeleton } from 'primereact/skeleton';

import { useDispatch } from 'react-redux';
import { SubscriptionPlanType } from 'types';

const SubscriptionHome = () => {
  const router = useRouter();
  const updateToastDispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    Array<SubscriptionPlanType>
  >([]);

  const getSubscriptionPlans = async () => {
    setLoading(true);

    try {
      const response = await digiEstateAxiosInstance.get(`/subscription-plans`);
      setSubscriptionPlans(response.data.data);
    } catch (error) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setLoading(false);
  };

  useEffect(() => {
    getSubscriptionPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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

      <h4 className='mb-6'>Subscriptions.</h4>
      <div className='mb-4  ml-auto mr-auto  '>
        <div className='mb-10'>
          <p className='uppercase'>Active Plan</p>
          <hr className='mb-2' />
          <p className='mb-2 '> Monthly Subscription</p>
          <p className='mb-2 font-bold text-lg'>20.00 per Month</p>
          <div className='mb-4 flex justify-between gap-x-2'>
            <p className=''> Started: June 25,2023</p>
            <p className=''> Expires: June 27,2023</p>
          </div>
          <button
            type='button'
            className='w-full hover:bg-black  hover:text-digiDefault shadow-lg mx-auto pt-2 pb-2 pl-4 pr-4 rounded-lg block border-2'
          >
            Cancel Plan
          </button>
        </div>
        <div className='mb-4'>
          <p className='uppercase'>Transactions</p>

          <hr className='mb-2' />

          <div className='mb-2'>
            <p className='mb-2 '> Amount: </p>
            <p className='mb-2 '>Status:</p>
            <p className='mb-2 '>Date:</p>
            <p className='mb-2 '>Reference:</p>
          </div>
          <hr className='mb-2' />
          <div className='mb-2'>
            <p className='mb-2 '> Amount: </p>
            <p className='mb-2 '>Status:</p>
            <p className='mb-2 '>Date:</p>
            <p className='mb-2 '>Reference:</p>
          </div>
          <hr className='mb-2' />
          <div className='mb-2'>
            <p className='mb-2 '> Amount: </p>
            <p className='mb-2 '>Status:</p>
            <p className='mb-2 '>Date:</p>
            <p className='mb-2 '>Reference:</p>
          </div>
          <hr className='mb-2' />
          <div className='mb-2'>
            <p className='mb-2 '> Amount: </p>
            <p className='mb-2 '>Status:</p>
            <p className='mb-2 '>Date:</p>
            <p className='mb-2 '>Reference:</p>
          </div>
          <hr className='mb-2' />
          <div className='mb-2'>
            <p className='mb-2 '> Amount: </p>
            <p className='mb-2 '>Status:</p>
            <p className='mb-2 '>Date:</p>
            <p className='mb-2 '>Reference:</p>
          </div>
        </div>
        {/* <div className='grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid justify-center  items-center gap-y-6 gap-x-4 mb-8'>
          {!loading &&
            subscriptionPlans.map((singleSubscription, index) => {
              // singleSubscription.total = String(singleSubscription.total);

              const continerStyle = singleSubscription.is_featured
                ? 'bg-digiDefault text-gray-600'
                : 'bg-gray-600 text-gray-200';
              const buttonStyle = singleSubscription.is_featured
                ? 'bg-gray-600 hover:bg-black text-gray-200'
                : 'bg-digiDefault hover:bg-white text-gray-600';
              return (
                <div
                  key={index}
                  className={`${continerStyle} gap-y-4  text-center  items-center flex flex-col justify-center rounded-lg pl-6 pr-6 pt-20 pb-20`}
                >
                  <p>{singleSubscription.name}</p>
                  <p className='text-xl'>
                    ₦{singleSubscription.total.toLocaleString()}
                  </p>
                  <p>{singleSubscription.description}</p>

                  <button
                    className={`${buttonStyle} pl-4 pr-4 pt-2 pb-2  rounded-lg`}
                  >
                    Subscribe Now
                  </button>
                </div>
              );
            })}
        </div> */}
        <div>
          {!loading && subscriptionPlans.length < 1 && (
            <p className='text-center'>
              Looks like there has been an error,please contact our support.
            </p>
          )}
        </div>

        <div>
          {loading && (
            <div style={{ flex: '1' }}>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='75%'></Skeleton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

SubscriptionHome.getLayout = function getLayout(page: NextPage) {
  return (
    <AuthenticatedLayout allowedRoles={['admin']}>{page}</AuthenticatedLayout>
  );
};

export default SubscriptionHome;
