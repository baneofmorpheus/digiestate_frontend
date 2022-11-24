import type { NextPage } from 'next';
import Link from 'next/link';
import styles from '../../styles/authentication/ChoosePlan.module.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateToastData } from 'reducers/utility';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { BookingStatusType, SingleBookedGuestType } from 'types';
import { Skeleton } from 'primereact/skeleton';

import moment from 'moment';

const ResidentHome: NextPage = () => {
  const estate = useSelector((state: any) => state.authentication.estate);

  const [loadingRecentBooking, setLoadingRecentBooking] =
    useState<boolean>(false);

  const [recentBookings, setRecentBookings] = useState<Array<any>>([]);

  const updateToastDispatch = useDispatch();

  const bookingStatus: BookingStatusType = {
    timed_out: 'Timed Out',
    pending: 'Pending',
    completed: 'Completed',
    detained: 'Detained',
    sent_back: 'Sent Back',
  };
  useEffect(() => {
    async function getRecentBookings() {
      try {
        setLoadingRecentBooking(true);

        const formattedStartDate = moment()
          .subtract(48, 'hours')
          .format('Y-MM-DD');
        const formattedEndDate = moment().format('Y-MM-DD');

        const response: any = await digiEstateAxiosInstance.get(
          `/bookings/${estate.id}/guests?start_date=${formattedStartDate}&end_date=${formattedEndDate}&sort[by]=created_at&sort[order]=desc&per_page=5`
        );
        setRecentBookings(response.data.data.booked_guests);
      } catch (error: any) {
        const toastData = axiosErrorHandler(error);
        updateToastDispatch(updateToastData(toastData));
      }
      setLoadingRecentBooking(false);
    }
    getRecentBookings();
  }, [estate, updateToastDispatch]);

  return (
    <div className=''>
      <div className='text-right'>
        <Link href='/app/bookings/new'>
          <a className='bg-gray-600  text-digiDefault text-sm items-center pl-4 pr-4 pt-2 hover:bg-black pb-2 rounded-lg'>
            Book Guest
          </a>
        </Link>
      </div>
      <h5 className='mb-4'> Recent Bookings</h5>

      {loadingRecentBooking ? (
        <div>
          <div className='flex mb-4'>
            <Skeleton shape='circle' size='3REM' className='mr-2'></Skeleton>
            <div style={{ flex: '1' }}>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='75%'></Skeleton>
            </div>
          </div>
          <div className='flex mb-4'>
            <Skeleton shape='circle' size='3REM' className='mr-2'></Skeleton>
            <div style={{ flex: '1' }}>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='75%'></Skeleton>
            </div>
          </div>
          <div className='flex mb-4'>
            <Skeleton shape='circle' size='3REM' className='mr-2'></Skeleton>
            <div style={{ flex: '1' }}>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='75%'></Skeleton>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <div className='recent-bookings'>
        {!loadingRecentBooking && recentBookings.length < 1 && (
          <div className='text-center bg-gray-600 text-digiDefault pt-2 pb-2 mb-2'>
            <p>No recent bookings found</p>
          </div>
        )}

        {recentBookings.map((singleBooking: SingleBookedGuestType, index) => {
          return (
            <div
              key={index}
              className='flex mb-2 items-center bg-gray-600 text-white pl-2 pr-2 pt-4 pb-4 rounded-sm'
            >
              <div className='bg-digiDefault h-12 w-12 items-center justify-center text-sm flex  rounded-full p-2 text-black mr-4'>
                <span>{singleBooking.booking_info.code}</span>
              </div>

              <div className='text-sm flex justify-between w-full items-center'>
                <div>
                  <p>{singleBooking.name}</p>
                  <p>{singleBooking.phone_number}</p>
                  <p>
                    {moment(singleBooking.created_at).format(
                      'DD-MMM-YYYY hh:mm a'
                    )}
                  </p>
                </div>
                <div>
                  {
                    bookingStatus[
                      singleBooking.status as keyof BookingStatusType
                    ]
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ResidentHome;
