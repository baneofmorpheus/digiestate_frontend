import { useRouter } from 'next/router';
import { useState, useEffect, useCallback } from 'react';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import {
  faLocationDot,
  faMarsAndVenus,
} from '@fortawesome/free-solid-svg-icons';
import { ProgressSpinner } from 'primereact/progressspinner';

import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { SingleDependentType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import { Image } from 'primereact/image';
import Link from 'next/link';
import ErrorMessage from 'components/validation/error_msg';
import { ProgressBar } from 'primereact/progressbar';
import EmptyState from 'components/utility/empty_state/EmptyState';

const SingleDependent = () => {
  const [formLoading, setFormLoading] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const updateToastDispatch = useDispatch();
  const [uploadedImageBlob, setUploadedImageBlob] = useState<any>(null);
  const [dependent, setDependent] = useState<SingleDependentType>();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showLoadingDeleteModal, setShowLoadingDeleteModal] =
    useState<boolean>(true);
  const [editRequestLoading, setEditRequestLoading] = useState(false);
  const [deleteRequestLoading, setDeleteRequestLoading] = useState(false);
  const router = useRouter();
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const { estate, role } = useSelector((state: any) => state.authentication);

  const addDependentSchema = yup
    .object()
    .shape({
      phone_number: yup
        .string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(11)
        .required()
        .label('Phone Number'),

      first_name: yup.string().required().label('First Name'),
      last_name: yup.string().required().label('Last Name'),
      middle_name: yup.string().label('Middle Name'),
      relationship_to_resident: yup.string().label('Relationship'),
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
  } = useForm<SingleDependentType>({
    resolver: yupResolver(addDependentSchema),
    mode: 'all',
  });

  const selectImageToUpload = () => {
    document.getElementById('profile_image_upload_input')?.click();
  };

  const handleEditDialogHideEevent = () => {
    setShowEditModal(false);
  };

  const editDependent = (dependent: SingleDependentType) => {
    setShowEditModal(true);

    setUploadedImagePreview(dependent.profile_image_link);
    reset({
      first_name: dependent.first_name,
      middle_name: dependent.middle_name,
      last_name: dependent.last_name,
      phone_number: dependent.phone_number,
      relationship_to_resident: dependent.relationship_to_resident,
      gender: dependent.gender,
    });
  };

  const showDeleteConfirmationDialogue = (dependent: SingleDependentType) => {
    confirmDialog({
      message: `Are you sure you want to delete ${dependent.first_name}?`,
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => {
        setShowDeleteConfirmation(false);
        sendDeleteDependentRequest(dependent.id);
      },
    });
  };

  const sendDeleteDependentRequest = async (dependentId: number) => {
    try {
      setDeleteRequestLoading(true);
      const response = await digiEstateAxiosInstance.delete(
        `/residents/dependents/${dependentId}`
      );
      updateToastDispatch(
        updateToastData({
          severity: 'success',
          summary: 'Delete successful',
          detail: 'Dependent deleted successfully.',
        })
      );
      router.push('/app/dependents');
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setDeleteRequestLoading(false);
  };

  const sendEditDependentRequest = async (data: SingleDependentType) => {
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
      formData.append('_method', 'PATCH');
      formData.append(
        'relationship_to_resident',
        data['relationship_to_resident']
      );
      formData.append('phone_number', data['phone_number']);

      setEditRequestLoading(true);
      const response = await digiEstateAxiosInstance.post(
        `/residents/dependents/${router.query['dependent-id']}`,
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
          detail: 'Dependent updated successfully.',
        })
      );
      router.push('/app/dependents');
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setEditRequestLoading(false);
  };
  const deleteDependent = (dependent: SingleDependentType) => {
    showDeleteConfirmationDialogue(dependent);
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
                <div className='mb-2  text-center  pt-2 pb-2'>
                  <EmptyState message='No dependent found matching that info' />
                </div>
              )}
              {!formLoading && !!dependent && (
                <div>
                  <div className='mb-2'>
                    <h3 className='mb-1 capitalize'>
                      {dependent.first_name} {dependent.last_name}
                    </h3>
                    {role !== 'resident' && (
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
                    )}
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

            <Dialog
              header=''
              id='deleteDialog'
              visible={deleteRequestLoading}
              position='bottom'
              modal
              closable={false}
              style={{ width: '100vw' }}
              onHide={() => {}}
              draggable={false}
              resizable={false}
            >
              <div className='w-full h-40 flex flex-col gap-y-4 justify-center items-center'>
                <ProgressSpinner
                  strokeWidth='4'
                  style={{ width: '40px', height: '40px' }}
                />
                <span className='text-sm '>Loading..</span>
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
                onSubmit={handleSubmit(sendEditDependentRequest)}
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
                      <ErrorMessage message={errors['last_name']['message']!} />
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
                  <div className='w-full md:w-1/2  '>
                    <label className='text-black'>
                      Relationship*
                      <input
                        {...register('relationship_to_resident')}
                        type='text'
                        autoComplete='on'
                        className='rei-text-input'
                      />
                    </label>
                    {errors['relationship_to_resident'] && (
                      <ErrorMessage
                        message={errors['relationship_to_resident']['message']!}
                      />
                    )}
                  </div>
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
                    Save Dependent
                  </button>
                </div>
              </form>
            </Dialog>
            <ConfirmDialog visible={showDeleteConfirmation} />
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

export default SingleDependent;
