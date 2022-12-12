import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import {
  faHandcuffs,
  faLocationDot,
  faPersonWalkingArrowLoopLeft,
  faHouseUser,
  faClock,
} from '@fortawesome/free-solid-svg-icons';
import { useForm } from 'react-hook-form';
import ErrorMessage from 'components/validation/error_msg';

import PreviousPage from 'components/navigation/previous_page/PreviousPage';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { Skeleton } from 'primereact/skeleton';
import BookedGuest from 'components/reusable/booked_guest/BookedGuest';
import { Dialog } from 'primereact/dialog';
import { SelectButton } from 'primereact/selectbutton';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ProgressBar } from 'primereact/progressbar';
import {
  ExtraBookingDataType,
  SingleBookedGuestType,
  NewGuestType,
} from 'types';

type BookOutFormType = {
  comment: string;
};

const ResidentSingleGuest = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [bookOutLoading, setBookOutLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [followUpType, setFollowUpType] = useState<string>('send_back_guest');
  const followUpTypes = [
    { label: 'Send Back', value: 'send_back_guest' },
    { label: 'Detain', value: 'detain_guest' },
  ];

  const [guest, setGuest] = useState<SingleBookedGuestType>();
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [showBookOutModal, setShowBookOutModal] = useState<boolean>(false);
  const [followUpForGroup, setFollowUpForGroup] = useState<boolean>(false);
  const [bookOutForGroup, setBookOutForGroup] = useState<boolean>(false);
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
  } = useForm<BookOutFormType>({
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

  const handleDialogHideEevent = () => {
    setShowFollowUpModal(false);
  };
  const handleBookOutDialogHideEvent = () => {
    setShowBookOutModal(false);
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
        [followUpType]: true,
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
      getGuest();
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFollowUpLoading(false);
  };

  const bookOutGuests = async (data: BookOutFormType) => {
    setBookOutLoading(true);
    try {
      let guests: Array<NewGuestType> = [];

      if (bookOutForGroup) {
        guests = guest!.booking_info.guests!.map(
          (singleGuest: SingleBookedGuestType) => {
            return {
              name: singleGuest.name,
              phone_number: singleGuest.phone_number,
              gender: singleGuest.gender,
              phone_visible_to_security: singleGuest.phone_visible_to_security,
            };
          }
        );
      } else {
        /**
         * Book out current guest only
         */

        guests.push({
          name: guest!.name,
          phone_number: guest!.phone_number,
          gender: guest!.gender,
          phone_visible_to_security: guest!.phone_visible_to_security,
        });
      }

      const data: ExtraBookingDataType = {
        vehicle_make: guest!.booking_info.vehicle_make as string,
        vehicle_plate_number: guest!.booking_info
          .vehicle_plate_number as string,
        comment: '',
      };
      const payload = {
        ...data,
        guests,
        estate_id: estate.id,
        action: 'book_out',
      };
      const response = await digiEstateAxiosInstance.post('/bookings', payload);
      setShowBookOutModal(false);

      updateToastDispatch(
        updateToastData({
          severity: 'success',
          detail: 'Book out was successful',
          summary: 'Your guest(s) have been booked out',
        })
      );
      router.push('/app/bookings');
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setBookOutLoading(false);
  };

  return (
    <div className=' pt-4 md:pl-2 md:pr-2 pb-2'>
      <div className=' '>
        <PreviousPage label='Single Guest' />

        {!guest?.send_back_guest &&
          !guest?.detain_guest &&
          guest?.booking_info.action == 'book_out' &&
          guest?.status == 'pending' && (
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
        {guest?.booking_info.action == 'book_in' &&
          guest?.status == 'completed' && (
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
                <div className='bg-gray-600 mb-2 text-digiDefault text-center text-sm pt-2 pb-2'>
                  <p>No guest found matching that info</p>
                </div>
              )}
              {!formLoading && !!guest && (
                <div>
                  <div>
                    <BookedGuest guest={guest} />
                  </div>
                  <div className='shadow-lg border text-xs md:text-sm   rounded-lg pt-2 pb-2 mb-6 pl-2 pr-4'>
                    <div className='mt-4 ml-auto    mb-2 '>
                      <div className='flex flex-col mb-2'>
                        <div className='flex gap-x-1 items-center'>
                          <div className='w-1/6 text-center'>
                            <FontAwesomeIcon
                              className={`  text-xl text-gray-600 `}
                              icon={faHandcuffs}
                            />
                          </div>
                          <div>
                            <span className=''>
                              {!!guest.detain_guest ? 'Yes' : 'No'} (Detain)
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='flex flex-col mb-2'>
                        <div className='flex gap-x-1 items-center'>
                          <div className='w-1/6 text-center'>
                            <FontAwesomeIcon
                              className={`  text-xl text-gray-600`}
                              icon={faPersonWalkingArrowLoopLeft}
                            />
                          </div>
                          <div>
                            <span className=''>
                              {!!guest.send_back_guest ? 'Yes' : 'No'} (Send
                              Back)
                            </span>
                          </div>
                        </div>
                      </div>

                      {!!guest.time_checked_by_security && (
                        <div className='flex flex-col mb-2'>
                          <div className='flex gap-x-1 items-center'>
                            <div className='w-1/6 text-center'>
                              <FontAwesomeIcon
                                className={`  text-xl text-gray-600`}
                                icon={faClock}
                              />
                            </div>
                            <div>
                              <span className=''>
                                {moment(guest.time_checked_by_security).format(
                                  'DD-MMM-YYYY hh:mm a'
                                )}{' '}
                                (Check in/out)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div className='flex flex-col mb-2'>
                        <div className='flex gap-x-1 items-center'>
                          <div className='w-1/6 text-center'>
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
                          <div className='w-1/6 text-center'>
                            <FontAwesomeIcon
                              className={`  text-xl text-gray-600`}
                              icon={faLocationDot}
                            />{' '}
                          </div>
                          <div>
                            <span className=''>{guest?.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
                        <SelectButton
                          id='followUpSelect'
                          unselectable={false}
                          value={followUpType}
                          options={followUpTypes}
                          onChange={(e) => setFollowUpType(e.value)}
                        ></SelectButton>
                      </div>
                    </div>

                    {guest?.booking_info.type === 'group' && (
                      <div>
                        <hr className='h-0.5 mb-4 bg-gray-600' />

                        <div className='mb-4'>
                          <input
                            name='showPassword'
                            id='showPassword'
                            className=' mr-2'
                            type='checkbox'
                            onChange={(event) => {
                              setFollowUpForGroup(event.target.checked);
                            }}
                            checked={followUpForGroup}
                          />
                          <label
                            htmlFor='showPassword'
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

                    <div className='mb-4'>
                      <label className='text-black'>
                        Extra Instructions
                        <textarea
                          {...register('comment')}
                          name=''
                          className='rei-text-text-area '
                          id=''
                          rows={4}
                        ></textarea>
                      </label>
                      {errors['comment'] && (
                        <ErrorMessage message={errors['comment']['message']!} />
                      )}
                    </div>
                    <div>
                      <hr className='h-0.5 mb-4 bg-gray-600' />

                      <div className='mb-4'>
                        <input
                          name='applyToGroup'
                          id='applyToGroup'
                          className=' mr-2'
                          type='checkbox'
                          onChange={(event) => {
                            setBookOutForGroup(event.target.checked);
                          }}
                          checked={bookOutForGroup}
                        />
                        <label
                          htmlFor='applyToGroup'
                          className='text-gray-800 text-sm cursor-pointer'
                        >
                          Apply to group
                        </label>
                      </div>
                      <hr className='h-0.5 mb-4 bg-gray-600' />
                    </div>

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
