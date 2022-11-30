import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';

import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { SingleDependentType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import Link from 'next/link';

const SecuritySingleDependent = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [completeBookingType, setCompleteBookingType] =
    useState<string>('completed');
  const [completeBookingTypes, setCompleteBookingTypes] = useState<any>([
    { label: 'Completed', value: 'completed' },
  ]);

  const [dependent, setDependent] = useState<SingleDependentType>();
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [followUpForGroup, setFollowUpForGroup] = useState<boolean>(false);
  const router = useRouter();

  const estate = useSelector((state: any) => state.authentication.estate);

  const getDependent = useCallback(async () => {
    setFormLoading(true);
    try {
      const dependentId = router.query['dependent-id'];
      const response = await digiEstateAxiosInstance.get(
        `/dependents/${dependentId}`
      );
      const dependent = response.data.data;
      setDependent(dependent);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  }, [router.query, updateToastDispatch]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    getDependent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const handleDialogHideEevent = () => {
    setShowFollowUpModal(false);
  };

  const navigateToSingleBooking = (id: number) => {
    return router.push(`/app/bookings/guests/${id}`);
  };

  return (
    <div className=' pt-4 md:pl-2 md:pr-2 pb-2'>
      <div className=' '>
        <div className='mb-6 text-xs'>
          <Link href='/app/dependents'>
            <a className='underline'>
              <span className=''>
                {' '}
                <FontAwesomeIcon className={` mr-2 `} icon={faLeftLong} />
                <span>Go Back</span>
              </span>
            </a>
          </Link>
        </div>
        <h2 className='mb-4 lato-font'>Single Dependent</h2>

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

              {!formLoading && !dependent && (
                <div className='bg-gray-600 mb-2 text-digiDefault text-center text-sm pt-2 pb-2'>
                  <p>No dependent found matching that info</p>
                </div>
              )}
              {!formLoading && !!dependent && (
                <div className='flex-col lg:flex-row flex gap-y-5 gap-x-2'>
                  <div className=' shadow-lg text-center '>
                    <Image
                      preview={true}
                      alt=''
                      imageClassName='w-full'
                      src={dependent.profile_image_link}
                    />
                  </div>
                  <div className=' text-sm'>
                    <p className='mb-1'>
                      Name: {dependent.first_name} {dependent.last_name}
                    </p>
                    <p className='mb-1'>
                      Address: {dependent.estate_user?.address}
                    </p>
                    <p className='mb-1'>
                      Resident:{' '}
                      <span className='underline cursor-pointer'>
                        {dependent.estate_user?.user?.first_name}{' '}
                        {dependent.estate_user?.user?.last_name}
                      </span>
                    </p>
                    <p className='mb-1 capitalize'>
                      Relationship To Resident:{' '}
                      {dependent.relationship_to_resident}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style global jsx>{`
        // .p-image-preview-container {
        //   display: block;
        // }
      `}</style>
    </div>
  );
};

export default SecuritySingleDependent;
