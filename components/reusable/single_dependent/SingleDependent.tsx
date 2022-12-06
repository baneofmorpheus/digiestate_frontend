import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';
import {
  faLocationDot,
  faMarsAndVenus,
} from '@fortawesome/free-solid-svg-icons';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { SingleDependentType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import Link from 'next/link';

const SecuritySingleDependent = () => {
  const [formLoading, setFormLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [dependent, setDependent] = useState<SingleDependentType>();

  const router = useRouter();

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

  return (
    <div className=' pt-4 md:pl-2 md:pr-2 pb-2'>
      <div className=' '>
        <PreviousPage label='Single Dependent' />

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

              {!formLoading && !dependent && (
                <div className='bg-gray-600 mb-2 text-digiDefault text-center text-sm pt-2 pb-2'>
                  <p>No dependent found matching that info</p>
                </div>
              )}
              {!formLoading && !!dependent && (
                <div>
                  <div className='mb-2'>
                    <h3 className='mb-1 capitalize'>
                      {dependent.first_name} {dependent.last_name}
                    </h3>
                    <p className='text-xs text-gray-600'>
                      <Link
                        href={`/app/residents/single/${dependent.estate_user?.user_id}`}
                      >
                        <a className='underline'>
                          {dependent.estate_user?.user?.first_name}{' '}
                          {dependent.estate_user?.user?.last_name} (Resident)
                        </a>
                      </Link>
                    </p>
                  </div>
                  <div className='flex-col lg:flex-row flex gap-y-5 gap-x-4'>
                    <div className='w-full lg:w-1/2  text-center '>
                      <Image
                        preview={true}
                        alt=''
                        imageClassName='shadow-lg'
                        src={dependent.profile_image_link}
                      />
                    </div>
                    <div className='shadow-lg w-full lg:w-1/2  justify-center gap-y-2 capitalize pl-4 pr-4 pt-4 pb-4  text-sm'>
                      <p className='mb-1'>
                        <FontAwesomeIcon
                          className={` text-sm text-gray-600 mr-2`}
                          icon={faLocationDot}
                        />{' '}
                        {dependent.estate_user?.address}
                      </p>
                      <p className='mb-1'>
                        <FontAwesomeIcon
                          className={` text-sm text-gray-600 mr-2`}
                          icon={faMarsAndVenus}
                        />
                        {dependent.gender}
                      </p>
                      <p className='mb-1 capitalize'>
                        <FontAwesomeIcon
                          className={` text-sm text-gray-600 mr-2`}
                          icon={faPeopleGroup}
                        />
                        {dependent.relationship_to_resident} to The Resident
                      </p>
                    </div>
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
