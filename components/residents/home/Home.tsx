import type { NextPage } from 'next';
import Link from 'next/link';
import styles from '../../styles/authentication/ChoosePlan.module.css';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateToastData } from 'reducers/utility';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { ProgressSpinner } from 'primereact/progressspinner';
import { BookingStatusType, SingleBookedGuestType } from 'types';
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
          `/bookings/${estate.id}/guests?start_date=${formattedStartDate}&end_date=${formattedEndDate}&sort[by]=created_at&sort[order]=desc`
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
      <h5 className='mb-2'> Recent Bookings</h5>

      {loadingRecentBooking ? (
        <div className='text-center'>
          <ProgressSpinner
            strokeWidth='4'
            style={{ width: '30px', height: '30px' }}
          />
          <span className='text-sm ml-2 block'>Loading..</span>
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
              <div className='bg-digiDefault  rounded-full p-2 text-black mr-4'>
                <p>{singleBooking.booking_info.code}</p>
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
