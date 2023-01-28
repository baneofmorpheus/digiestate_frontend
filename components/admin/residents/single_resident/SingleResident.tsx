import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRing,
  faLocationDot,
  faMarsAndVenus,
} from '@fortawesome/free-solid-svg-icons';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { UserType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';
import Dependent from 'components/reusable/dependent/Dependent';
import EmptyState from 'components/utility/empty_state/EmptyState';
import { SingleDependentType } from 'types';

const AdminSingleResident = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [approveResident, setApproveResident] = useState<string>('1');

  const [resident, setResident] = useState<UserType>();
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const router = useRouter();

  const estate = useSelector((state: any) => state.authentication.estate);

  const getResident = useCallback(async () => {
    setFormLoading(true);
    try {
      const residentId = router.query['resident-id'];
      const response = await digiEstateAxiosInstance.get(
        `/estates/${estate.id}/residents/${residentId}`
      );
      const resident = response.data.data;
      resident.estate_user?.dependents.forEach(
        (singleDependent: SingleDependentType) => {
          const copiedEstateUser = { ...resident.estate_user };
          delete copiedEstateUser.dependents;
          singleDependent.estate_user = copiedEstateUser;
        }
      );

      setResident(resident);
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

    getResident();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const handleDialogHideEevent = () => {
    setShowFollowUpModal(false);
  };

  const approveOrRejectResident = async () => {
    if (formLoading) {
      return;
    }
    setFollowUpLoading(true);
    try {
      const url = `/estates/${estate.id}/resident/${router.query['resident-id']}/approve-or-reject`;
      const data = {
        approve_resident: approveResident == '1' ? true : false,
      };
      const response = await digiEstateAxiosInstance.post(url, data);
      setShowFollowUpModal(false);

      updateToastDispatch(
        updateToastData({
          severity: 'success',
          detail: 'Action successful',
          summary: 'Resident profile was updated successfully',
        })
      );
      router.push('/app/residents/registrations');
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFollowUpLoading(false);
  };

  const viewDependent = (dependent: SingleDependentType) => {
    return router.push(`/app/dependents/single/${dependent.id}`);
  };

  return (
    <div className=' pt-4 md:pl-2 md:pr-2 pb-2'>
      <div className=' '>
        <PreviousPage label='Single Resident' />
        <div className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-2 pr-2 '>
          <div className=''>
            <div className='guests-container mb-4'>
              {formLoading && (
                <div>
                  <div className='flex mb-4'>
                    <div style={{ flex: '1' }}>
                      <Skeleton width='100%' className='mb-2'></Skeleton>
                      <Skeleton width='100%' className='mb-2'></Skeleton>
                      <Skeleton width='100%' className='mb-2'></Skeleton>
                      <Skeleton width='100%' className='mb-2'></Skeleton>
                      <Skeleton width='75%'></Skeleton>
                    </div>
                  </div>
                </div>
              )}

              {!formLoading && !resident && (
                <div className='bg-gray-600 mb-2 text-digiDefault text-center text-sm pt-2 pb-2'>
                  <EmptyState message='No resident found matching that info' />
                </div>
              )}

              {!formLoading &&
                !!resident &&
                resident.estate_user?.approval_status == 'pending' && (
                  <div className='text-right mb-4'>
                    <button
                      type='button'
                      onClick={() => {
                        setShowFollowUpModal(true);
                      }}
                      className='bg-gray-600 hover:bg-black text-digiDefault pl-2 pr-2 rounded-lg  text-xs pt-2 pb-2'
                    >
                      {' '}
                      Respond to Request
                    </button>
                  </div>
                )}
              {!formLoading && !!resident && (
                <div>
                  <div className='mb-2'>
                    <h3 className='mb-1 capitalize'>
                      {resident.first_name} {resident.last_name}
                    </h3>
                    <p className='text-xs text-gray-600'>
                      {resident.estate_user?.dependents?.length} Dependents
                    </p>
                  </div>
                  <div className='flex-col mb-6 lg:flex-row flex gap-y-5 gap-x-4'>
                    <div className='w-full lg:w-1/2 text-center '>
                      <Image
                        preview={true}
                        alt=''
                        imageClassName='shadow-lg'
                        src={resident.resident_data?.profile_image_link}
                      />
                    </div>
                    <div className='shadow-lg w-full lg:w-1/2  justify-center gap-y-2 capitalize pl-4 pr-4 pt-4 pb-4  text-sm'>
                      <p className='mb-1'>
                        <FontAwesomeIcon
                          className={` text-sm text-gray-600 mr-2`}
                          icon={faLocationDot}
                        />
                        {resident.estate_user?.address}
                      </p>
                      <p className='mb-1'>
                        <FontAwesomeIcon
                          className={` text-sm text-gray-600 mr-2`}
                          icon={faMarsAndVenus}
                        />
                        {resident.resident_data?.gender}
                      </p>
                      <p className='mb-1'>
                        <FontAwesomeIcon
                          className={` text-sm text-gray-600 mr-2`}
                          icon={faRing}
                        />
                        {resident.resident_data?.marital_status}
                      </p>
                    </div>
                  </div>
                  <div>
                    {resident.estate_user!.dependents!.length > 0 && (
                      <h4>Dependents</h4>
                    )}
                    {resident.estate_user?.dependents?.map(
                      (singleDependent: SingleDependentType, index) => {
                        return (
                          <Dependent
                            handleClick={viewDependent}
                            dependent={singleDependent}
                            key={index}
                          />
                        );
                      }
                    )}
                  </div>
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
                <div className='pt-4'>
                  <form className='lg:w-1/2 ml-auto mr-auto'>
                    <div className='mb-2 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
                      <h4 className='mb-4 font-semibold'>Respond to Request</h4>

                      <hr className='h-0.5 mb-2 bg-gray-600' />
                      <div className='mb-2'>
                        <span className='text-sm mb-1'>
                          {' '}
                          What do you want to do?
                        </span>
                        {/* <SelectButton
                          id='followUpSelect'
                          unselectable={false}
                          value={approveResident}
                          options={approveResidentTypes}
                          onChange={(e) => setApproveResident(e.value)}
                        ></SelectButton> */}

                        <select
                          value={approveResident}
                          onChange={(e) => setApproveResident(e.target.value)}
                          className='rei-text-input'
                          name='bookingStatus'
                          id=''
                        >
                          <option value='1'>Approve Resident</option>
                          <option value='0'>Reject Resident</option>
                        </select>
                      </div>
                      <hr className='h-0.5 mb-4 bg-gray-600' />
                    </div>

                    <div className='flex gap-x-4 mb-4'>
                      <button
                        disabled={followUpLoading}
                        type='button'
                        onClick={approveOrRejectResident}
                        className='pt-2 pb-2 pl-4 pr-4 bg-gray-600 text-digiDefault rounded-lg text-sm'
                      >
                        Proceed
                      </button>
                      <button
                        disabled={followUpLoading}
                        onClick={() => {
                          setShowFollowUpModal(false);
                        }}
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

export default AdminSingleResident;
