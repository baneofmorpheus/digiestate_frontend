import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import EmptyState from 'components/utility/empty_state/EmptyState';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPhone,
  faEnvelope,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { UserType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';

const SingleSecurity = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [revokeLoading, setRevokeLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [security, setSecurity] = useState<UserType>();
  const router = useRouter();

  const [showRevokeConfirmation, setShowRevokeConfirmation] =
    useState<boolean>(false);
  const estate = useSelector((state: any) => state.authentication.estate);

  const getSecurity = useCallback(async () => {
    setFormLoading(true);
    try {
      const residentId = router.query['security-id'];
      const response = await digiEstateAxiosInstance.get(
        `/estates/${estate.id}/security/${residentId}`
      );
      const security = response.data.data;

      setSecurity(security);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  }, [estate.id, router.query, updateToastDispatch]);

  const showRevokeConfirmationDialogue = (security: UserType) => {
    confirmDialog({
      message: `Are you sure you want to revoke the access of ${security.first_name}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        setShowRevokeConfirmation(false);
        revokeSecurityAccess(security.id);
      },
    });
  };

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    getSecurity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  const revokeSecurityAccess = async (security_id: number) => {
    if (formLoading) {
      return;
    }
    setRevokeLoading(true);
    try {
      const url = `/estates/${estate.id}/revoke/${security_id}`;

      const response = await digiEstateAxiosInstance.post(url, {});

      updateToastDispatch(
        updateToastData({
          severity: 'success',
          detail: 'Security account revoked ',
          summary: '',
        })
      );
      await getSecurity();
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setRevokeLoading(false);
  };

  return (
    <div className=' pt-4 md:pl-2 md:pr-2 pb-2'>
      <div className=' '>
        <PreviousPage label='Single Security' />
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

              {!formLoading && !security && (
                <div className='mb-2  text-center  pt-2 pb-2'>
                  <EmptyState message='No security found matching that info' />
                </div>
              )}

              {!formLoading &&
                !!security &&
                security.security_estate_user?.approval_status ==
                  'approved' && (
                  <div className='text-right mb-4'>
                    <button
                      type='button'
                      onClick={() => {
                        showRevokeConfirmationDialogue(security);
                      }}
                      className='bg-gray-600 hover:bg-black text-digiDefault pl-2 pr-2 rounded-lg  text-xs pt-2 pb-2'
                    >
                      {' '}
                      Revoke Access
                    </button>
                  </div>
                )}
              {!formLoading && !!security && (
                <div>
                  <div className='mb-2'>
                    <h3 className='mb-1 capitalize'>
                      {security.first_name} {security.last_name}
                    </h3>
                  </div>
                  <div className='flex-col mb-6 lg:flex-row flex gap-y-5 gap-x-4'>
                    <div className='shadow-lg w-full lg:w-1/2  justify-center gap-y-2 capitalize pl-4 pr-4 pt-4 pb-4  text-sm'>
                      <p className='mb-1'>
                        <FontAwesomeIcon
                          className={` text-sm text-gray-600 mr-2`}
                          icon={faPhone}
                        />
                        {security.phone_number}
                      </p>
                      <p className='mb-1 lowercase'>
                        <FontAwesomeIcon
                          className={` text-sm text-gray-600 mr-2`}
                          icon={faEnvelope}
                        />
                        {security.email}
                      </p>
                      <p className='mb-1'>
                        <FontAwesomeIcon
                          className={` text-sm capitalize text-gray-600 mr-2`}
                          icon={faCircleInfo}
                        />
                        {security.security_estate_user?.approval_status} (
                        Status)
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <Dialog
                header=''
                id='followUpDialog'
                visible={revokeLoading}
                position='bottom'
                modal
                style={{ width: '100vw' }}
                onHide={() => {}}
                closable={false}
                draggable={false}
                resizable={false}
              >
                <div className='pt-4 text-center'>
                  <ProgressSpinner
                    strokeWidth='4'
                    style={{ width: '40px', height: '40px' }}
                  ></ProgressSpinner>
                </div>
              </Dialog>
            </div>
            <ConfirmDialog visible={showRevokeConfirmation} />
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

export default SingleSecurity;
