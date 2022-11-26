import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';

import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { SingleBookedGuestType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import BookedGuest from 'components/reusable/booked_guest/BookedGuest';
import { Dialog } from 'primereact/dialog';
import { SelectButton } from 'primereact/selectbutton';
import moment from 'moment';

import { ProgressBar } from 'primereact/progressbar';
const ResidentSingleGuest = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [followUpType, setFollowUpType] = useState<string>('send_back_guest');
  const followUpTypes = [
    { label: 'Send Back', value: 'send_back_guest' },
    { label: 'Detain', value: 'detain_guest' },
  ];

  const [guest, setGuest] = useState<SingleBookedGuestType>();
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [followUpForGroup, setFollowUpForGroup] = useState<boolean>(false);
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

  const handleDialogHideEevent = () => {
    setShowFollowUpModal(false);
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
  return (
    <div className=' pt-4 md:pl-2 md:pr-2 pb-2'>
      <div className=' '>
        <h2 className='mb-4 lato-font'>Single Guest</h2>
        {!guest?.send_back_guest &&
          !guest?.detain_guest &&
          guest?.booking_info.action == 'book_out' && (
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

                  <div className='text-xs mt-4  mb-10 flex-col justify-start gap-y-1 md:gap-y-0  md:flex-row flex md:justify-between'>
                    <p>
                      Checked At :{' '}
                      {!!guest.time_checked_by_security
                        ? moment(guest.time_checked_by_security).format(
                            'DD-MMM-YYYY hh:mm a'
                          )
                        : '-- -- --'}
                    </p>
                    <p>Detain Guest : {!!guest.detain_guest ? 'Yes' : 'No'}</p>
                    <p>
                      Send Back Guest : {!!guest.send_back_guest ? 'Yes' : 'No'}
                    </p>
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
                      <h4 className='mb-4 font-bold'>Follow Up</h4>
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