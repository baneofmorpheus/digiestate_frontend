import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useSelector, useDispatch } from 'react-redux';
import { updateToastData } from 'reducers/utility';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { SingleBookedGuestType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import BookedGuest from 'components/reusable/booked_guest/BookedGuest';

import EmptyState from 'components/utility/empty_state/EmptyState';
import NewItemButton from 'components/navigation/new_item_button/NewItemButton';
import moment from 'moment';

const ResidentHome: NextPage = () => {
  const estate = useSelector((state: any) => state.authentication.estate);

  const [loadingRecentBooking, setLoadingRecentBooking] =
    useState<boolean>(false);

  const [recentBookings, setRecentBookings] = useState<Array<any>>([]);
  const router = useRouter();

  const updateToastDispatch = useDispatch();

  useEffect(() => {
    async function getRecentBookings() {
      try {
        setLoadingRecentBooking(true);

        const formattedStartDate = moment()
          .subtract(48, 'hours')
          .format('Y-MM-DD');
        const formattedEndDate = moment().format('Y-MM-DD');

        const response: any = await digiEstateAxiosInstance.get(
          `/bookings/${estate.id}/guests?start_date=${formattedStartDate}&end_date=${formattedEndDate}&sort[by]=updated_at&sort[order]=desc&per_page=25`
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
  const navigateToSingleBooking = (id: number) => {
    router.push(`/app/bookings/guests/${id}`);
  };
  return (
    <div className='relative min-h-screen pt-2'>
      <h5 className='mb-4'> Recent Bookings</h5>

      {loadingRecentBooking ? (
        <div className='text-sm'>
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
          <div className='text-center  pt-2 pb-2 mb-2'>
            <EmptyState message='No recent bookings found' />
          </div>
        )}

        {!loadingRecentBooking &&
          recentBookings.map((singleBooking: SingleBookedGuestType, index) => {
            return (
              <BookedGuest
                key={index}
                handleClick={navigateToSingleBooking}
                guest={singleBooking}
              />
            );
          })}
      </div>
      <NewItemButton link='/app/bookings/new' />
    </div>
  );
};
export default ResidentHome;
