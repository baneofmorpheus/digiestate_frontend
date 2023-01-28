import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';
import { Timeline } from 'primereact/timeline';
import { bookingStatusLabels } from 'helpers/reusable';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHandcuffs,
  faLocationDot,
  faPersonWalkingArrowLoopLeft,
  faHouseUser,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { Skeleton } from 'primereact/skeleton';
import BookedGuest from 'components/reusable/booked_guest/BookedGuest';
import { Dialog } from 'primereact/dialog';
import moment from 'moment';
import Link from 'next/link';
import { Checkbox } from 'primereact/checkbox';
import EmptyState from 'components/utility/empty_state/EmptyState';

import { ProgressBar } from 'primereact/progressbar';
import {
  SingleBookedGuestType,
  BookingHistory,
  BookingStatusType,
} from 'types';

const SecuritySingleGuest = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const updateToastDispatch = useDispatch();
  const [bookingStatuses, setBookingStatuses] = useState([
    { label: 'Book In', value: 'in' },
    { label: 'Book Out', value: 'out' },
    { label: 'Detained', value: 'detained' },
    { label: 'Sent Back', value: 'sent_back' },
  ]);

  const [guest, setGuest] = useState<SingleBookedGuestType>();
  const [bookingStatus, setBookingStatus] = useState<string>();
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [followUpForGroup, setFollowUpForGroup] = useState<boolean>(false);
  const router = useRouter();
  const [bookingHistory, setBookingHistory] = useState<Array<BookingHistory>>();

  const estate = useSelector((state: any) => state.authentication.estate);

  const getGuest = useCallback(async () => {
    setFormLoading(true);
    try {
      const bookedGuestId = router.query['booked-guest-id'];
      const response = await digiEstateAxiosInstance.get(
        `/bookings/${estate.id}/guests/${bookedGuestId}`
      );
      const guest: SingleBookedGuestType = response.data.data;
      guest?.booking_info.guests!.forEach(
        (singleGuest: SingleBookedGuestType) => {
          singleGuest.booking_info = guest?.booking_info;
        }
      );
      setGuest(guest);
      const bookingHistory = guest.logs!.map((singleLog) => {
        return {
          id: singleLog.id,
          status:
            bookingStatusLabels[singleLog.status as keyof BookingStatusType],
          date: moment(singleLog.created_at).format('DD-MMM-YYYY hh:mm a'),
        };
      });

      setBookingHistory(bookingHistory);

      if (guest?.status === 'booked') {
        setBookingStatuses([{ label: 'Book In', value: 'in' }]);
        setBookingStatus('in');
      }
      if (guest?.status === 'leaving') {
        setBookingStatuses([
          { label: 'Book Out', value: 'out' },
          { label: 'Detained', value: 'detained' },
          { label: 'Sent Back', value: 'sent_back' },
        ]);
        setBookingStatus('out');
      }
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

  const handleDialogHideEevent = () => {
    setShowFollowUpModal(false);
  };

  const navigateToSingleBooking = (id: number) => {
    return router.push(`/app/bookings/guests/${id}`);
  };
  const finalizeBooking = async () => {
    if (formLoading) {
      return;
    }
    setFollowUpLoading(true);
    try {
      const url = followUpForGroup
        ? `/bookings/${guest?.booking_info.id}/complete-booking`
        : `/bookings/${guest?.id}/complete`;
      const data = {
        status: bookingStatus,
      };
      console.log('log out');
      console.log(data);

      const response = await digiEstateAxiosInstance.post(url, data);
      setShowFollowUpModal(false);

      updateToastDispatch(
        updateToastData({
          severity: 'success',
          detail: 'Booking finalized',
          summary: 'Booking was finalized successfully',
        })
      );
      getGuest();
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFollowUpLoading(false);
  };
  return (
    <div className=' pt-4 md:pl-2 md:pr-2 pb-2'>
      <div className=' '>
        <PreviousPage label='Single Guest' />

        {(guest?.status === 'booked' || guest?.status === 'leaving') && (
          <div className='text-right mb-4'>
            <button
              type='button'
              onClick={() => {
                setShowFollowUpModal(true);
              }}
              className='bg-gray-600 hover:bg-black text-digiDefault pl-2 pr-2 rounded-lg  text-xs pt-2 pb-2'
            >
              {' '}
              Approve Booking
            </button>
          </div>
        )}

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
                  <EmptyState message='No guest found matching that info' />
                </div>
              )}
              {!formLoading && !!guest && (
                <div>
                  <div>
                    <BookedGuest guest={guest} />
                  </div>
                  <div className='mb-8'>
                    <Timeline
                      value={bookingHistory}
                      align='left'
                      className='!text-xs !md:text-sm'
                      content={(item) => `${item.status} at ${item.date}`}
                    />
                  </div>
                  <div className='shadow-lg border text-xs md:text-sm  rounded-lg pt-2 pb-2 mb-6 pl-4 pr-4'>
                    <div className='mt-4 ml-auto    mb-2 '>
                      <div className='flex flex-col mb-2'>
                        <div className='flex gap-x-1 items-center'>
                          <div className='w-10 text-center'>
                            <FontAwesomeIcon
                              className={`  text-xl text-gray-600 `}
                              icon={faHandcuffs}
                            />
                          </div>
                          <div>
                            <span className=''>
                              {!!guest.detain_guest ? 'Yes' : 'No'} (Detain
                              Guest)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col mb-2'>
                        <div className='flex gap-x-1 items-center'>
                          <div className='w-10 text-center'>
                            <FontAwesomeIcon
                              className={`  text-xl text-gray-600`}
                              icon={faPersonWalkingArrowLoopLeft}
                            />
                          </div>
                          <div>
                            <span className=''>
                              {!!guest.send_back_guest ? 'Yes' : 'No'} (Send
                              Back Guest)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='flex flex-col mb-2'>
                        <div className='flex gap-x-1 items-center'>
                          <div className='w-10 text-center'>
                            <FontAwesomeIcon
                              className={`   text-xl text-gray-600`}
                              icon={faHouseUser}
                            />{' '}
                          </div>
                          <div>
                            <Link
                              href={`/app/residents/single/${guest.resident.id}`}
                            >
                              <a>
                                <span className='underline'>
                                  {guest.resident.first_name}{' '}
                                  {guest.resident.last_name} (Resident)
                                </span>
                              </a>
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col mb-2'>
                        <div className='flex gap-x-1 items-center'>
                          <div className='w-10 text-center'>
                            <FontAwesomeIcon
                              className={`  text-xl text-gray-600`}
                              icon={faLocationDot}
                            />{' '}
                          </div>
                          <div>
                            <span className=''>{guest?.address} (Address)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {!!guest.booking_info.comment && (
                    <div className='shadow-lg border text-xs md:text-sm  rounded-lg pt-2 pb-2 mb-6 pl-4 pr-4'>
                      <p className='font-bold mb-1'>Extra Instructions</p>
                      <p className=''>{guest.booking_info.comment}</p>
                    </div>
                  )}
                  {(!!guest.booking_info.vehicle_make ||
                    !!guest.booking_info.vehicle_plate_number) && (
                    <div className='shadow-lg border text-xs md:text-sm  rounded-lg pt-2 pb-2 mb-6 pl-4 pr-4'>
                      <p className='font-bold mb-1'>Vehicle Info</p>
                      <p className=''>
                        Vehicle Make :{guest.booking_info.vehicle_make}
                      </p>
                      <p className=''>
                        Plate Number :{guest.booking_info.vehicle_plate_number}
                      </p>
                    </div>
                  )}

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

              <Dialog
                header=''
                id='followUpDialog'
                visible={showFollowUpModal}
                position='bottom'
                modal
                style={{ width: '100vw' }}
                onHide={handleDialogHideEevent}
                closable={!followUpLoading}
                draggable={false}
                resizable={false}
              >
                <div>
                  <form className='lg:w-1/2 ml-auto mr-auto'>
                    <div className='mb-4 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
                      <h4 className='mb-4 font-semibold'>Approve Booking</h4>
                      <div className=''>
                        <span className='text-sm'> Action</span>
                        <select
                          value={bookingStatus}
                          onChange={(e) => setBookingStatus(e.target.value)}
                          className='rei-text-input'
                          name='bookingStatus'
                          id=''
                        >
                          {bookingStatuses.map((singleBookingStatus, index) => {
                            return (
                              <option
                                key={index}
                                value={singleBookingStatus.value}
                              >
                                {singleBookingStatus.label}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    {guest?.booking_info.type === 'group' && (
                      <div>
                        <hr className='h-0.5 mb-4 bg-gray-600' />

                        <div className='mb-4'>
                          <Checkbox
                            onChange={(event) => {
                              setFollowUpForGroup(event.target.checked);
                            }}
                            inputId='applyToGroup'
                            name='applyToGroup'
                            checked={followUpForGroup}
                            className='mr-2'
                          ></Checkbox>
                          <label
                            htmlFor='applyToGroup'
                            className='text-gray-800 text-sm cursor-pointer'
                          >
                            Apply to group
                          </label>
                        </div>
                      </div>
                    )}
                    <hr className='h-0.5 mb-4 bg-gray-600' />

                    <div className='flex gap-x-4 mb-4'>
                      <button
                        disabled={followUpLoading}
                        type='button'
                        onClick={finalizeBooking}
                        className='pt-2 pb-2 pl-4 pr-4 bg-gray-600 text-digiDefault rounded-lg text-sm'
                      >
                        Proceed
                      </button>
                      <button
                        disabled={followUpLoading}
                        onClick={() => {}}
                        type='button'
                        className='pt-2 pb-2 pl-4  pr-4 border-2 border-gray-600 rounded-lg text-sm'
                      >
                        Cancel
                      </button>
                    </div>

                    {followUpLoading && (
                      <ProgressBar
                        mode='indeterminate'
                        color='#4B5563'
                        style={{ height: '6px' }}
                      ></ProgressBar>
                    )}
                  </form>
                </div>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
      <style global jsx>{`
        #followUpSelect > div {
          height: 2rem !important;
          font-family: 'Lato', sans-serif;
          font-weight: normal;
        }
        #followUpSelect .p-button-label {
          font-weight: normal !important;
          font-size: 0.8rem;
        }
        #followUpSelect .p-button.p-highlight {
          background: #4b5563;
          color: #fff2d9;
        }
        #followUpSelect {
          text-align: left;
        }

        .guests-container {
          min-height: 10rem;
        }

        #followUpDialog {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default SecuritySingleGuest;
