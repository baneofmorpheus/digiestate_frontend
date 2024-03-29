import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { Timeline } from 'primereact/timeline';
import { bookingStatusLabels } from 'helpers/reusable';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import {
  faHandcuffs,
  faLocationDot,
  faPersonWalkingArrowLoopLeft,
  faHouseUser,
} from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';

import PreviousPage from 'components/navigation/previous_page/PreviousPage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { Skeleton } from 'primereact/skeleton';
import BookedGuest from 'components/reusable/booked_guest/BookedGuest';
import { Dialog } from 'primereact/dialog';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProgressBar } from 'primereact/progressbar';
import {
  SingleBookedGuestType,
  BookingHistory,
  BookingStatusType,
} from 'types';
import EmptyState from 'components/utility/empty_state/EmptyState';
import { Checkbox } from 'primereact/checkbox';

const ResidentSingleGuest = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [bookOutLoading, setBookOutLoading] = useState(false);
  const [cancelBookingLoading, setCancelBookingLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [guest, setGuest] = useState<SingleBookedGuestType>();
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [showBookOutModal, setShowBookOutModal] = useState<boolean>(false);
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [followUpForGroup, setFollowUpForGroup] = useState<boolean>(false);
  const [bookOutForGroup, setBookOutForGroup] = useState<boolean>(false);
  const [cancelGroupBooking, setCancelGroupBooking] = useState<boolean>(false);
  const [bookingHistory, setBookingHistory] = useState<Array<BookingHistory>>();
  const [bookingStatus, setBookingStatus] = useState<string>('detain_guest');

  const [bookingStatuses, setBookingStatuses] = useState([
    { label: 'Send Back', value: 'send_back_guest' },
    { label: 'Detain', value: 'detain_guest' },
  ]);

  const router = useRouter();

  const estate = useSelector((state: any) => state.authentication.estate);

  const bookOutDataSchema = yup
    .object()
    .shape({
      comment: yup.string().max(7000).label('Extra Instructions'),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm({
    resolver: yupResolver(bookOutDataSchema),
    mode: 'all',
  });

  const getGuest = useCallback(async () => {
    setFormLoading(true);
    try {
      const bookedGuestId = router.query['booked-guest-id'];
      const response = await digiEstateAxiosInstance.get(
        `/bookings/${estate.id}/guests/${bookedGuestId}`
      );
      const guest: SingleBookedGuestType = response.data.data;
      guest.booking_info!.guests!.forEach(
        (singleGuest: SingleBookedGuestType) => {
          singleGuest.booking_info = guest.booking_info;
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
  const handleBookOutDialogHideEvent = () => {
    setShowBookOutModal(false);
  };
  const handleCancelDialogHideEvent = () => {
    setShowCancelModal(false);
  };

  const navigateToSingleBooking = (id: number) => {
    return router.push(`/app/bookings/guests/${id}`);
  };

  const followUpBookOut = async () => {
    if (formLoading) {
      return;
    }
    setFollowUpLoading(true);
    try {
      const url = followUpForGroup
        ? `/bookings/${guest!.booking_info.id}/group/follow-up`
        : `/bookings/${guest!.id}/booked_guest/follow-up`;
      const data = {
        [bookingStatus]: true,
      };
      const response = await digiEstateAxiosInstance.post(url, data);
      setShowFollowUpModal(false);

      updateToastDispatch(
        updateToastData({
          severity: 'success',
          detail: 'Security has been notified of your request.',
          summary: 'Follow up was successful',
        })
      );
      await getGuest();
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFollowUpLoading(false);
  };

  const bookOutGuests = async () => {
    setBookOutLoading(true);
    try {
      const url = followUpForGroup
        ? `/bookings/${guest!.booking_info.id}/group/book-out`
        : `/bookings/${guest!.id}/booked_guest/book-out`;

      const response = await digiEstateAxiosInstance.post(url, {});
      setShowBookOutModal(false);

      updateToastDispatch(
        updateToastData({
          severity: 'success',
          detail: 'Book out was successful',
          summary: 'Your guest(s) have been booked out',
        })
      );
      await getGuest();
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setBookOutLoading(false);
  };

  const sendCancelBookingRequest = async () => {
    setCancelBookingLoading(true);
    try {
      const url = cancelGroupBooking
        ? `/bookings/${guest!.booking_info.id}/group/cancel`
        : `/bookings/${guest!.id}/booked_guest/cancel`;

      const response = await digiEstateAxiosInstance.post(url, {});
      setShowCancelModal(false);

      updateToastDispatch(
        updateToastData({
          severity: 'success',
          detail: 'Booking(s) cancelled successfully',
        })
      );
      await getGuest();
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setCancelBookingLoading(false);
  };

  return (
    <div className=' pt-4 md:pl-2 md:pr-2 pb-2'>
      <div className=' '>
        <PreviousPage label='Single Guest' />

        {!guest?.send_back_guest &&
          !guest?.detain_guest &&
          guest?.status == 'leaving' && (
            <div className='text-right mb-4'>
              <button
                type='button'
                onClick={() => {
                  setShowFollowUpModal(true);
                }}
                className='bg-gray-600 text-digiDefault pl-2 pr-2 rounded-lg  text-xs pt-2 pb-2'
              >
                {' '}
                Follow Up
              </button>
            </div>
          )}
        {!formLoading && guest?.status == 'booked' && (
          <div className='text-right mb-4'>
            <button
              type='button'
              onClick={() => {
                setShowCancelModal(true);
              }}
              className='border-gray-600 border-2 text-gray-600 pl-2 pr-2 rounded-lg  text-xs pt-2 pb-2'
            >
              {' '}
              Cancel Booking
            </button>
          </div>
        )}
        {guest?.status == 'in' && (
          <div className='text-right mb-4'>
            <button
              type='button'
              onClick={() => {
                setShowBookOutModal(true);
              }}
              className='bg-gray-600 text-digiDefault pl-2 pr-2 rounded-lg  text-xs pt-2 pb-2'
            >
              {' '}
              Book Out
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
                <div className=' mb-2 text-center  pt-2 pb-2'>
                  <EmptyState message='No guest found matching that info' />
                </div>
              )}
              {!formLoading && !!guest && (
                <div>
                  <div className='mb-8'>
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
                  <div className='shadow-lg border text-xs md:text-sm   rounded-lg pt-2 pb-2 mb-6 pl-2 pr-4'>
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
                            <span className='underline'>
                              {guest.resident.first_name}{' '}
                              {guest.resident.last_name} (Resident)
                            </span>
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
                      <h4 className='mb-4 font-semibold'>Follow Up</h4>
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
                            inputId='followUpCheckbox'
                            name='followUpCheckbox'
                            checked={followUpForGroup}
                            className='mr-2'
                          ></Checkbox>
                          <label
                            htmlFor='followUpCheckbox'
                            className='text-gray-800 text-sm cursor-pointer'
                          >
                            Apply to group
                          </label>
                        </div>
                        <hr className='h-0.5 mb-4 bg-gray-600' />
                      </div>
                    )}

                    <div className='flex gap-x-4 mb-4'>
                      <button
                        disabled={followUpLoading}
                        type='button'
                        onClick={followUpBookOut}
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

              <Dialog
                header=''
                id='followUpDialog'
                visible={showBookOutModal}
                position='bottom'
                modal
                style={{ width: '100vw' }}
                onHide={handleBookOutDialogHideEvent}
                closable={!bookOutLoading}
                draggable={false}
                resizable={false}
              >
                <div>
                  <form
                    onSubmit={handleSubmit(bookOutGuests)}
                    className='lg:w-1/2 ml-auto mr-auto'
                  >
                    <div className='mb-4 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
                      <h4 className='mb-4 font-semibold'>Book Out Guest</h4>
                    </div>
                    {guest?.booking_info.type === 'group' && (
                      <div>
                        <hr className='h-0.5 mb-4 bg-gray-600' />

                        <div className='mb-4'>
                          <Checkbox
                            onChange={(event) => {
                              setBookOutForGroup(event.target.checked);
                            }}
                            inputId='bookOutForGroup'
                            name='bookOutForGroup'
                            checked={bookOutForGroup}
                            className='mr-2'
                          ></Checkbox>
                          <label
                            htmlFor='bookOutForGroup'
                            className='text-gray-800 text-sm cursor-pointer'
                          >
                            Apply to group
                          </label>
                        </div>
                        <hr className='h-0.5 mb-4 bg-gray-600' />
                      </div>
                    )}

                    <div className='flex gap-x-4 mb-4'>
                      <button
                        disabled={bookOutLoading}
                        type='submit'
                        className='pt-2 pb-2 pl-4 pr-4 bg-gray-600 text-digiDefault rounded-lg text-sm'
                      >
                        Proceed
                      </button>
                      <button
                        disabled={bookOutLoading}
                        onClick={() => {}}
                        type='button'
                        className='pt-2 pb-2 pl-4  pr-4 border-2 border-gray-600 rounded-lg text-sm'
                      >
                        Cancel
                      </button>
                    </div>

                    {bookOutLoading && (
                      <ProgressBar
                        mode='indeterminate'
                        color='#4B5563'
                        style={{ height: '6px' }}
                      ></ProgressBar>
                    )}
                  </form>
                </div>
              </Dialog>
              <Dialog
                header=''
                id='followUpDialog'
                visible={showCancelModal}
                position='bottom'
                modal
                style={{ width: '100vw' }}
                onHide={handleCancelDialogHideEvent}
                closable={!cancelBookingLoading}
                draggable={false}
                resizable={false}
              >
                <div>
                  <form
                    onSubmit={handleSubmit(sendCancelBookingRequest)}
                    className='lg:w-1/2 ml-auto mr-auto'
                  >
                    <div className='mb-4 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
                      <h4 className='mb-4 font-semibold'>Cancel Booking</h4>
                    </div>

                    {guest?.booking_info.type === 'group' && (
                      <div>
                        <hr className='h-0.5 mb-4 bg-gray-600' />

                        <div className='mb-4'>
                          <Checkbox
                            onChange={(event) => {
                              setCancelGroupBooking(event.target.checked);
                            }}
                            inputId='applyToGroup'
                            name='applyToGroup'
                            checked={cancelGroupBooking}
                            className='mr-2'
                          ></Checkbox>
                          <label
                            htmlFor='applyToGroup'
                            className='text-gray-800 text-sm cursor-pointer'
                          >
                            Apply to group
                          </label>
                        </div>
                        <hr className='h-0.5 mb-4 bg-gray-600' />
                      </div>
                    )}

                    <div className='flex gap-x-4 mb-4'>
                      <button
                        disabled={cancelBookingLoading}
                        type='submit'
                        className='pt-2 pb-2 pl-4 pr-4 bg-gray-600 text-digiDefault rounded-lg text-sm'
                      >
                        Proceed
                      </button>
                      <button
                        disabled={cancelBookingLoading}
                        onClick={() => {}}
                        type='button'
                        className='pt-2 pb-2 pl-4  pr-4 border-2 border-gray-600 rounded-lg text-sm'
                      >
                        Cancel
                      </button>
                    </div>

                    {cancelBookingLoading && (
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

export default ResidentSingleGuest;
