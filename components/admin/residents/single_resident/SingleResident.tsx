import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { Dialog } from 'primereact/dialog';
import ErrorMessage from 'components/validation/error_msg';
import { faUpload, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRing,
  faLocationDot,
  faMarsAndVenus,
} from '@fortawesome/free-solid-svg-icons';
import 'yup-phone';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { UserType, EditResidentInputType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';
import Dependent from 'components/reusable/dependent/Dependent';
import EmptyState from 'components/utility/empty_state/EmptyState';
import { SingleDependentType } from 'types';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

const AdminSingleResident = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const [uploadedImageBlob, setUploadedImageBlob] = useState<any>(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const [editRequestLoading, setEditRequestLoading] = useState(false);
  const [approveResident, setApproveResident] = useState<string>('1');

  const [resident, setResident] = useState<UserType>();
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const router = useRouter();

  const estate = useSelector((state: any) => state.authentication.estate);

  const editResidentSchema = yup
    .object()
    .shape({
      first_name: yup.string().required().label('First Name'),
      last_name: yup.string().required().label('Last Name'),
      middle_name: yup.string().label('Middle Name'),
      marital_status: yup
        .string()
        .matches(
          /(married|single|other)/,
          'Marital status must be married,single or other'
        )
        .required()
        .label('Marital Status'),
      phone_number: yup
        .string()
        .phone()
        .min(8)
        .required()
        .label('Phone Number'),
      address: yup.string().required().label('Address'),
      type: yup
        .string()
        .matches(
          /(tenant|landlord)/,
          'Resident type must be landlord or tenant'
        )
        .required()
        .label('Resident Type'),
      gender: yup
        .string()
        .matches(/(male|female|other)/, 'Gender must be male,female or other')
        .required()
        .label('Gender'),
    })
    .required();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
  } = useForm<EditResidentInputType>({
    resolver: yupResolver(editResidentSchema),
    mode: 'all',
  });

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

  const selectImageToUpload = () => {
    document.getElementById('profile_image_upload_input')?.click();
  };
  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!(event.target.files instanceof FileList) || !event.target.files[0]) {
        /**
         * Reset image state if
         * uploaded image is not set
         */
        if (!uploadedImagePreview) {
          setUploadedImagePreview(null);
        }

        return;
      }

      // if image is greater than 5mb throw error
      if (event.target.files[0]['size'] > 5000000) {
        setUploadedImagePreview(null);

        updateToastDispatch(
          updateToastData({
            severity: 'error',
            summary: 'Image too large',
            detail: 'Image cannot be larger than 5mb',
          })
        );

        return;
      }
      setUploadedImagePreview(URL.createObjectURL(event.target.files[0]));
      setUploadedImageBlob(event.target.files[0]);
    } catch (error: any) {
      setUploadedImagePreview(null);

      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
  };

  const editResident = () => {
    if (!resident) {
      return;
    }

    setShowEditModal(true);

    setUploadedImagePreview(resident.resident_data!.profile_image_link);
    reset({
      first_name: resident.first_name,
      middle_name: resident.middle_name,
      last_name: resident.last_name,
      phone_number: resident.phone_number,
      gender: resident.resident_data!.gender,
      type: resident.resident_data!.type,
      marital_status: resident.resident_data!.marital_status,
      address: resident.estate_user!.address,
    });
  };

  const sendEditResidentRequest = async (data: EditResidentInputType) => {
    try {
      const formData = new FormData();

      if (uploadedImageBlob) {
        formData.append('profile_image', uploadedImageBlob);
      }
      formData.append('first_name', data['first_name']);
      formData.append('middle_name', data['middle_name']);
      formData.append('gender', data['gender']);
      formData.append('estate_id', estate.id);
      formData.append('last_name', data['last_name']);
      formData.append('type', data['type']);
      formData.append('_method', 'PATCH');
      formData.append('phone_number', data['phone_number']);
      formData.append('marital_status', data['marital_status']);
      formData.append('address', data['address']);

      setEditRequestLoading(true);
      const response = await digiEstateAxiosInstance.post(
        `/estates/${estate.id}/update-resident/${router.query['resident-id']}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        }
      );
      setShowEditModal(false);
      updateToastDispatch(
        updateToastData({
          severity: 'success',
          summary: 'Update successful',
          detail: 'Resident updated successfully.',
        })
      );
      getResident();
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setEditRequestLoading(false);
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

  const handleEditDialogHideEevent = () => {
    setShowEditModal(false);
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
                <div className='mb-2  text-center pt-2 pb-2'>
                  <EmptyState message='No resident found matching that info' />
                </div>
              )}

              {!formLoading &&
                !!resident &&
                resident.estate_user?.approval_status === 'pending' && (
                  <div className='text-right mb-4'>
                    <button
                      type='button'
                      onClick={() => {
                        setShowFollowUpModal(true);
                      }}
                      className='bg-gray-600 hover:bg-black text-digiDefault pl-2 pr-2 rounded-lg  text-xs pt-2 pb-2'
                    >
                      {' '}
                      Approve / Reject
                    </button>
                  </div>
                )}

              {!formLoading && !!resident && (
                <div className='text-right mb-4'>
                  <button
                    type='button'
                    onClick={() => {
                      editResident();
                    }}
                    className='bg-gray-600 hover:bg-black text-digiDefault pl-2 pr-2 rounded-lg  text-xs pt-2 pb-2'
                  >
                    {' '}
                    Update Profile
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
              <Dialog
                header=''
                id='editDialog'
                visible={showEditModal}
                position='bottom'
                modal
                closable={!editRequestLoading}
                style={{ width: '100vw' }}
                onHide={handleEditDialogHideEevent}
                draggable={false}
                resizable={false}
              >
                <form
                  className='xl:w-2/3 text-sm ml-auto mr-auto mb-6 '
                  onSubmit={handleSubmit(sendEditResidentRequest)}
                >
                  <div className='mb-3'>
                    <div
                      style={{
                        ...(uploadedImagePreview && {
                          backgroundImage: `url(${uploadedImagePreview})`,
                        }),
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.4)',
                      }}
                      className='ml-auto cursor-pointer flex flex-col justify-center items-center bg-black rounded-full h-24 w-24'
                    >
                      <button
                        className='h-full w-full'
                        onClick={selectImageToUpload}
                        type='button'
                      >
                        <FontAwesomeIcon
                          className={` text-xl animate-bounce text-white`}
                          icon={faUpload}
                        />
                      </button>
                    </div>
                    <div className='ml-auto w-24 mt-2'>
                      <p className='text-center text-xs mr'>
                        {uploadedImagePreview
                          ? 'Change Photo'
                          : 'Upload Photo Here'}
                      </p>
                      <input
                        id='profile_image_upload_input'
                        type='file'
                        accept='image/*'
                        onChange={uploadImage}
                        className='hidden'
                      />
                    </div>
                  </div>
                  <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                    <div className='w-full lg:w-1/2'>
                      <label className='text-black'>
                        First Name*
                        <input
                          {...register('first_name')}
                          type='text'
                          autoComplete='on'
                          className='rei-text-input'
                        />
                      </label>
                      {errors['first_name'] && (
                        <ErrorMessage
                          message={errors['first_name']['message']!}
                        />
                      )}
                    </div>
                    <div className='w-full lg:w-1/2'>
                      <label className='text-black'>
                        Last Name*
                        <input
                          {...register('last_name')}
                          type='text'
                          autoComplete='on'
                          className='rei-text-input'
                        />
                      </label>
                      {errors['last_name'] && (
                        <ErrorMessage
                          message={errors['last_name']['message']!}
                        />
                      )}
                    </div>
                  </div>
                  <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                    <div className='w-full lg:w-1/2'>
                      <label className='text-black'>
                        Middle Name
                        <input
                          {...register('middle_name')}
                          type='text'
                          autoComplete='on'
                          className='rei-text-input'
                        />
                      </label>
                      {errors['middle_name'] && (
                        <ErrorMessage
                          message={errors['middle_name']['message']!}
                        />
                      )}
                    </div>
                    <div className='w-full lg:w-1/2'>
                      <label className='text-black'>
                        Phone Number*
                        <input
                          {...register('phone_number')}
                          type='tel'
                          autoComplete='on'
                          className='rei-text-input'
                        />
                      </label>
                      {errors['phone_number'] && (
                        <ErrorMessage
                          message={errors['phone_number']['message']!}
                        />
                      )}
                    </div>
                  </div>

                  <div className='mb-6 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                    <div className='md:w-1/2 w-full'>
                      <label className=''>
                        Gender*
                        <select
                          {...register('gender')}
                          name='gender'
                          className='rei-text-input'
                        >
                          <option>Select</option>
                          <option value='male'>Male</option>
                          <option value='female'>Female</option>
                          <option value='other'>Other</option>
                        </select>
                      </label>
                      {errors['gender'] && (
                        <ErrorMessage message={errors['gender']['message']!} />
                      )}
                    </div>
                    <div className='md:w-1/2 w-full'>
                      <label className=''>
                        Marital Status*
                        <select
                          {...register('marital_status')}
                          name='marital_status'
                          className='rei-text-input'
                        >
                          <option>Select</option>
                          <option value='single'>Single</option>
                          <option value='married'>Married</option>
                          <option value='other'>Other</option>
                        </select>
                      </label>
                      {errors['marital_status'] && (
                        <ErrorMessage
                          message={errors['marital_status']['message']!}
                        />
                      )}
                    </div>
                  </div>

                  <div className='mb-6 flex flex-col md:flex-row justify-center gap-y-2.5 md:gap-x-2.5 '>
                    <div className='w-full pt-2 pb-2'>
                      <label className='text-black'>
                        Address
                        <textarea
                          {...register('address')}
                          name='address'
                          className='rei-text-text-area '
                          id=''
                          rows={4}
                        ></textarea>
                      </label>
                      {errors['address'] && (
                        <ErrorMessage message={errors['address']['message']!} />
                      )}
                    </div>
                  </div>

                  <div className='mb-6 flex flex-col md:flex-row justify-center gap-y-2.5 md:gap-x-2.5 '>
                    <div className='md:w-1/2 w-full'>
                      <label className=''>
                        Type*
                        <select
                          {...register('type')}
                          name='type'
                          className='rei-text-input'
                        >
                          <option value=''>Select</option>
                          <option value='landlord'>Landlord</option>
                          <option value='tenant'>Tenant</option>
                        </select>
                      </label>
                      {errors['type'] && (
                        <ErrorMessage message={errors['type']['message']!} />
                      )}
                    </div>
                  </div>

                  {editRequestLoading && (
                    <div className='mb-4'>
                      <ProgressBar
                        mode='indeterminate'
                        color='#4B5563'
                        style={{ height: '6px' }}
                      ></ProgressBar>
                    </div>
                  )}
                  <div className='text-center'>
                    <button
                      disabled={editRequestLoading}
                      className='hoveer:bg-black text-digiDefault bg-gray-600 pl-4 pr-4 pt-2 pb-2 rounded-lg '
                      type='submit'
                    >
                      Update Resident
                    </button>
                  </div>
                </form>
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
