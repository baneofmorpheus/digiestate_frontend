import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';

import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { SingleBookedGuestType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import BookedGuest from 'components/reusable/booked_guest/BookedGuest';

const ResidentSingleGuest = () => {
  const [formLoading, setFormLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [guest, setGuest] = useState<SingleBookedGuestType>();

  const router = useRouter();

  const estate = useSelector((state: any) => state.authentication.estate);

  const getGuest = useCallback(async () => {
    setFormLoading(true);
    try {
      const bookedGuestId = router.query['booked-guest-id'];
      const response = await digiEstateAxiosInstance.get(
        `/bookings/${estate.id}/guests/${bookedGuestId}`
      );
      const guest = response.data.data;
      guest.booking_info.guests.forEach(
        (singleGuest: SingleBookedGuestType) => {
          singleGuest.booking_info = guest.booking_info;
        }
      );
      setGuest(guest);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  }, [estate.id, router.query, updateToastDispatch]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    getGuest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const navigateToSingleBooking = (id: number) => {
    return router.push(`/app/bookings/guests/${id}`);
  };
  return (
    <div className=' pt-4 md:pl-2 md:pr-2'>
      <div className=' '>
        <h2 className='mb-4 lato-font'>Single Guest</h2>
        <div className='text-right mb-4'>
          <button
            type='button'
            className='bg-gray-600 text-digiDefault pl-2 pr-2 rounded-lg  text-xs pt-2 pb-2'
          >
            {' '}
            Follow Up
          </button>
        </div>
        <div className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-2 pr-2 '>
          <div className=''>
            <div className='guests-container mb-4'>
              {formLoading && (
                <div>
                  <div className='flex mb-4'>
                    <Skeleton
                      shape='circle'
                      size='3REM'
                      className='mr-2'
                    ></Skeleton>
                    <div style={{ flex: '1' }}>
                      <Skeleton width='100%' className='mb-2'></Skeleton>
                      <Skeleton width='75%'></Skeleton>
                    </div>
                  </div>
                </div>
              )}

              {!formLoading && !guest && (
                <div className='bg-gray-600 mb-2 text-digiDefault text-center text-sm pt-2 pb-2'>
                  <p>No guest found matching that info</p>
                </div>
              )}
              {!formLoading && !!guest && (
                <div>
                  <div>
                    <BookedGuest guest={guest} />
                  </div>

                  <div className='text-sm mt-4  mb-10 flex-col justify-start gap-y-1 md:gap-y-0  md:flex-row flex md:justify-between'>
                    <p>Checked At : 10-Nov-2022 09:30 pm</p>
                  </div>
                  {guest.booking_info.type === 'group' && (
                    <div>
                      <h2> Group Members</h2>
                      <div>
                        {guest.booking_info.guests!.map(
                          (groupMember, index) => {
                            if (groupMember.id === guest.id) {
                              return;
                            }
                            return (
                              <BookedGuest
                                handleClick={navigateToSingleBooking}
                                guest={groupMember}
                                key={index}
                              />
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style global jsx>{``}</style>
    </div>
  );
};

export default ResidentSingleGuest;
