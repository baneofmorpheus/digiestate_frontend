import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import ErrorMessage from 'components/validation/error_msg';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { ProgressBar } from 'primereact/progressbar';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';

import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import { SingleDependentType } from 'types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faUpload } from '@fortawesome/free-solid-svg-icons';
const CreateDependent = () => {
  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const [formLoading, setFormLoading] = useState(false);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const updateToastDispatch = useDispatch();

  const estate = useSelector((state: any) => state.authentication.estate);

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
    formState: { errors },
    formState,
  } = useForm<SingleDependentType>({
    resolver: yupResolver(addDependentSchema),
    mode: 'all',
  });

  const router = useRouter();

  const selectImageToUpload = () => {
    document.getElementById('profile_image_upload_input')?.click();
  };
  const [uploadedImageBlob, setUploadedImageBlob] = useState<any>(null);

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

  const addDependent = async (data: SingleDependentType) => {
    if (!uploadedImagePreview) {
      updateToastDispatch(
        updateToastData({
          severity: 'error',
          summary: 'Profile Image Required',
          detail:
            'Please upload a profile image not greater than 5mb to proceed',
        })
      );
      return;
    }

    try {
      const formData = new FormData();
      formData.append('profile_image', uploadedImageBlob);
      formData.append('first_name', data['first_name']);
      formData.append('middle_name', data['middle_name']);
      formData.append('gender', data['gender']);
      formData.append('estate_id', estate.id);
      formData.append('last_name', data['last_name']);
      formData.append(
        'relationship_to_resident',
        data['relationship_to_resident']
      );
      formData.append('phone_number', data['phone_number']);

      setFormLoading(true);
      const response = await digiEstateAxiosInstance.post(
        `/residents/dependents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: 'application/json',
          },
        }
      );
      updateToastDispatch(
        updateToastData({
          severity: 'success',
          summary: 'Action successful',
          detail: 'Dependent added successfully.',
        })
      );
      return router.push(`/app/dependents`);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  };

  return (
    <div className=' pt-10 pl-2 pr-2'>
      <div className=' '>
        <PreviousPage label='New Dependent' />

        <form
          className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-2 pr-2 '
          onSubmit={handleSubmit(addDependent)}
        >
          <div className=' text-sm'>
            {/* section start */}

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
                {uploadedImagePreview ? 'Change Photo' : 'Upload Photo Here'}
              </p>
              <input
                id='profile_image_upload_input'
                type='file'
                accept='image/*'
                onChange={uploadImage}
                className='hidden'
              />
            </div>

            <div className='x2l:w-2/3 text-base md:text-sm ml-auto mr-auto mb-6 '>
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
                    <ErrorMessage message={errors['first_name']['message']!} />
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
                    <ErrorMessage message={errors['middle_name']['message']!} />
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
              <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
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
            </div>

            {/* section start */}
            {formLoading && (
              <ProgressBar
                mode='indeterminate'
                color='#4B5563'
                style={{ height: '6px' }}
              ></ProgressBar>
            )}
            {/* Section End */}

            <div className='justify-center flex gap-x-4  mt-4 '>
              <button
                disabled={formLoading}
                className='bg-gray-600 hover:bg-black pt-2 pb-2 pl-4 pr-4 rounded-lg text-digiDefault'
              >
                Create Dependent
              </button>
            </div>
          </div>
        </form>
      </div>
      <style global jsx>{`
        @keyframes p-progress-spinner-color {
          100%,
          0% {
            stroke: #000;
          }
          40% {
            stroke: #0057e7;
          }
          66% {
            stroke: #008744;
          }
          80%,
          90% {
            stroke: #f000;
          }
        }
        #bookingMode > div {
          height: 2rem !important;
          font-family: 'Lato', sans-serif;
          font-weight: normal;
        }
        #bookingMode .p-button-label {
          font-weight: normal !important;
          font-size: 0.8rem;
        }
        #bookingMode .p-button.p-highlight {
          background: #4b5563;
          color: #fff2d9;
        }
        #bookingMode {
          text-align: right;
        }

        .guests-container {
          min-height: 10rem;
        }

        #bookGuestsDialog {
          margin: 0;
        }
      `}</style>
    </div>
  );
};

CreateDependent.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default CreateDependent;
