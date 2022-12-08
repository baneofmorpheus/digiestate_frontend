import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import ErrorMessage from 'components/validation/error_msg';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';

import { Accordion, AccordionTab } from 'primereact/accordion';

import { Checkbox } from 'primereact/checkbox';
import { ProgressSpinner } from 'primereact/progressspinner';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import { SelectButton } from 'primereact/selectbutton';
import { Dialog } from 'primereact/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faLeftLong } from '@fortawesome/free-solid-svg-icons';

type BookedGuest = {
  name: string;
  phone_number: string;
  gender: string;
  phone_visible_to_security: boolean;
};

type BookingData = {
  vehicle_make: string;
  vehicle_plate_number: string;
  comment: string;
};

const BookGuests = () => {
  const [showBookGuestModal, setShowBookGuestsModal] = useState<boolean>(false);
  const handleDialogHideEevent = () => {
    setShowBookGuestsModal(false);
  };
  const handleBookGuestsModalHideEevent = () => {
    setFormLoading(false);
  };

  const [activeAccordionIndex, setActiveAccordionIndex] = useState<number>(0);
  const [formLoading, setFormLoading] = useState(false);

  const [bookInVehicle, setBookInVehicle] = useState(false);
  const [passExtraInstructions, setPassExtraInstructions] = useState(false);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const [retreivedToken, setRetrievedToken] = useState<boolean>(false);
  const updateDeviceTokenDispatch = useDispatch();
  const updateToastDispatch = useDispatch();

  const bookingTypes = [
    { label: 'Book In', value: 'book_in' },
    { label: 'Book Out', value: 'book_out' },
  ];

  const [currentGuest, setCurrentGuest] = useState<BookedGuest>({
    name: '',
    phone_number: '',
    phone_visible_to_security: false,
    gender: '',
  });
  const [guests, setGuests] = useState<Array<BookedGuest>>([]);

  const addGuestsSchema = yup
    .object()
    .shape({
      phone_number: yup
        .string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(11)
        .required()
        .label('Phone Number'),

      name: yup.string().required().label('Name'),
      gender: yup
        .string()
        .matches(/(male|female|other)/, 'Gender must be male,female or other')
        .required()
        .label('Gender'),
    })
    .required();

  const bookingDataSchema = yup
    .object()
    .shape({
      vehicle_make: yup.string().label('Vehicle Make'),
      vehicle_plate_number: yup.string().label('Vehicle Plate Number'),
      comment: yup.string().label('Extra Instructions'),
    })
    .required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
  } = useForm<BookingData>({
    resolver: yupResolver(bookingDataSchema),
    mode: 'all',
  });

  const {
    register: registerAddGuest,
    handleSubmit: handleSubmitAddGuests,
    formState: { errors: errorsAddGuest },
    formState: formStateAddGuest,
    reset: resetAddGuest,
  } = useForm<BookedGuest>({
    resolver: yupResolver(addGuestsSchema),
    mode: 'all',
  });

  const router = useRouter();

  const [bookingMode, setBookingMode] = useState<string>('book_in');
  const estate = useSelector((state: any) => state.authentication.estate);
  const bookGuests = async (data: BookingData) => {
    try {
      if (guests.length < 1) {
        updateToastDispatch(
          updateToastData({
            severity: 'error',
            summary: 'Add at least one guest',
            detail: 'You must add a guest to proceed',
          })
        );
        return;
      }
      setFormLoading(true);

      const payload = {
        ...data,
        guests,
        estate_id: estate.id,
        action: bookingMode,
      };
      const response = await digiEstateAxiosInstance.post('/bookings', payload);
      updateToastDispatch(
        updateToastData({
          severity: 'success',
          summary: 'Booking successful',
          detail: 'Your guests were booked successfully.',
        })
      );
      return router.push(`/app/bookings`);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  };

  const addGuest = (data: any) => {
    setShowBookGuestsModal(false);
    setGuests([...guests, currentGuest]);
    setCurrentGuest({
      name: '',
      phone_number: '',
      phone_visible_to_security: false,
      gender: '',
    });
    resetAddGuest({
      name: '',
      phone_number: '',
      phone_visible_to_security: false,
      gender: '',
    });
  };
  return (
    <div className=' pt-10 pl-2 pr-2'>
      <div className=' '>
        <PreviousPage label='Book Guests' />
        <form
          className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-2 pr-2 '
          onSubmit={handleSubmit(bookGuests)}
        >
          <div className=''>
            {/* section start */}

            <SelectButton
              id='bookingMode'
              unselectable={false}
              value={bookingMode}
              options={bookingTypes}
              onChange={(e) => setBookingMode(e.value)}
            ></SelectButton>

            {/* section start */}

            {/* Section End */}

            <div className='text-center mb-4 mt-4 '>
              <button
                disabled={formLoading ? true : false}
                className='  border-2 border-gray-600 text-gray-600 flex ml-auto mr-auto items-center text-sm  mb-4 rounded-lg pl-8 pr-8 pt-2 pb-2'
                type='button'
                onClick={() => {
                  setShowBookGuestsModal(true);
                }}
              >
                <span>Add Guests</span>
              </button>
            </div>
            <div className='guests-container mb-10'>
              {guests.length < 1 && (
                <div className='bg-gray-600 mb-2 text-digiDefault text-center text-sm pt-2 pb-2'>
                  <p>No guests have been added yet</p>
                </div>
              )}
              {guests.map((singleGuest, index) => {
                return (
                  <div
                    key={index}
                    className=' shadow-lg mt-2 border rounded-lg pl-4 pr-4 text-sm  flex justify-between items-center gap-x-4 text-black   pt-2 pb-2'
                  >
                    <div className='flex items-center gap-x-4'>
                      <div className=' flex justify-center  items-center h-8 w-8 bg-gray-600 text-digiDefault rounded-full'>
                        <span className=''>{index + 1}</span>
                      </div>
                      <div>
                        <p className='mb-1'>{singleGuest.name}</p>
                        <p>
                          {singleGuest.phone_number}-
                          <span className='capitalize'>
                            {singleGuest.gender}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className='text-gray-600 flex items-center gap-x-4 '>
                      <button
                        onClick={() => {
                          const allGuests = [...guests];

                          allGuests.splice(index, 1);

                          setGuests(allGuests);
                        }}
                        className=''
                        type='button'
                      >
                        <FontAwesomeIcon
                          className={` text-lg text-gray-600`}
                          icon={faTrash}
                        />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className='mb-10'>
              <Accordion className='text-sm'>
                <AccordionTab
                  className='text-sm lato-font'
                  header='Include Vehicle'
                >
                  <div className='x2l:w-2/3 ml-auto mr-auto pt-4'>
                    <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                      <div className='w-full mb-4'>
                        <label className='text-black text-sm'>
                          Vehicle Make{' '}
                        </label>
                        <input
                          {...register('vehicle_make')}
                          type='text'
                          autoComplete='on'
                          className='rei-text-input'
                          placeholder='2005 Toyota Corolla'
                        />

                        {errors['vehicle_make'] && (
                          <ErrorMessage
                            message={errors['vehicle_make']['message']!}
                          />
                        )}
                      </div>
                    </div>
                    <div className='mb-4 flex flex-col md:flex-row justify-between gap-y-2.5 md:gap-x-2.5 '>
                      <div className='w-full'>
                        <label className='text-black'>
                          Vehicle Plate Number
                          <input
                            {...register('vehicle_plate_number')}
                            type='text'
                            autoComplete='on'
                            className='rei-text-input'
                            name='plate_number'
                          />
                        </label>
                        {errors['vehicle_plate_number'] && (
                          <ErrorMessage
                            message={errors['vehicle_plate_number']['message']!}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionTab>
                <AccordionTab className='text-sm' header='Extra Instructions'>
                  <div className='w-full pt-2 pb-2'>
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
                </AccordionTab>
              </Accordion>

              {passExtraInstructions && <div className='mb-4  j'></div>}
            </div>
            {guests.length > 0 && (
              <div className='text-center'>
                <button className='bg-gray-600 text-sm pt-2 pb-2 pl-4 pr-4 rounded-lg text-digiDefault'>
                  Submit Booking
                </button>
              </div>
            )}
          </div>
        </form>
        <Dialog
          header=''
          id='bookGuestsDialog'
          visible={showBookGuestModal}
          position='bottom'
          modal
          style={{ width: '100vw' }}
          onHide={handleDialogHideEevent}
          draggable={false}
          resizable={false}
        >
          <div>
            <form
              onSubmit={handleSubmitAddGuests(addGuest)}
              className='md:w-1/2 ml-auto mr-auto'
            >
              <div className='mb-6 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
                <h4 className='mb-4 font-bold'>Add Guest</h4>
                <div className='w-full mb-4 text-sm'>
                  <label className='text-black'>
                    Name
                    <input
                      {...registerAddGuest('name')}
                      type='name'
                      autoComplete='on'
                      value={currentGuest.name}
                      onChange={(event) => {
                        setCurrentGuest({
                          ...currentGuest,
                          name: event.target.value,
                        });
                      }}
                      className='rei-text-input text-base'
                    />
                  </label>
                  {errorsAddGuest['name'] && (
                    <ErrorMessage
                      message={errorsAddGuest['name']['message']!}
                    />
                  )}
                </div>
                <div className='w-full mb-4 text-sm'>
                  <label className='text-black'>
                    Phone Number
                    <input
                      {...registerAddGuest('phone_number')}
                      type='tel'
                      onChange={(event) => {
                        setCurrentGuest({
                          ...currentGuest,
                          phone_number: event.target.value,
                        });
                      }}
                      value={currentGuest.phone_number}
                      autoComplete='on'
                      className='rei-text-input text-base'
                    />
                  </label>
                  {errorsAddGuest['phone_number'] && (
                    <ErrorMessage
                      message={errorsAddGuest['phone_number']['message']!}
                    />
                  )}
                </div>
                <div className='w-full mb-4 text-sm'>
                  <label className=''>
                    Gender*
                    <select
                      {...registerAddGuest('gender')}
                      name='gender'
                      value={currentGuest.gender}
                      onChange={(event) => {
                        setCurrentGuest({
                          ...currentGuest,
                          gender: event.target.value,
                        });
                      }}
                      className='rei-text-input text-base'
                    >
                      <option>Select</option>
                      <option value='male'>Male</option>
                      <option value='female'>Female</option>
                      <option value='other'>Other</option>
                    </select>
                  </label>
                  {errorsAddGuest['gender'] && (
                    <ErrorMessage
                      message={errorsAddGuest['gender']['message']!}
                    />
                  )}
                </div>
                <div>
                  <input
                    name='showPassword'
                    id='showPassword'
                    className=' mr-2'
                    type='checkbox'
                    onChange={(event) => {
                      setCurrentGuest({
                        ...currentGuest,
                        phone_visible_to_security: event.target.checked,
                      });
                    }}
                    checked={currentGuest.phone_visible_to_security}
                  />
                  <label
                    htmlFor='showPassword'
                    className='text-gray-800 text-sm cursor-pointer'
                  >
                    Show Phone Number to Security
                  </label>
                </div>
              </div>
              <div>
                <button className='pt-2 pb-2 pl-4 pr-4 bg-gray-600 text-digiDefault rounded-lg text-sm'>
                  Add Guest
                </button>
              </div>
            </form>
          </div>
        </Dialog>
        <Dialog
          header=''
          id='loadingDialog'
          visible={formLoading}
          position='bottom'
          modal
          closable={false}
          style={{ width: '100vw', height: '100vh' }}
          onHide={handleBookGuestsModalHideEevent}
          draggable={false}
          resizable={false}
        >
          <div className='w-full h-full  flex flex-col justify-center items-center'>
            <ProgressSpinner
              strokeWidth='4'
              style={{ width: '50px', height: '50px' }}
            />
            <span className='text-sm ml-2'>Loading..</span>
          </div>
        </Dialog>
      </div>
      <style global jsx>
        {`
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

          #bookGuestsDialog {
            margin: 0;
          }

          .p-checkbox .p-checkbox-box.p-highlight {
            --tw-bg-opacity: 1;
            background-color: rgb(75 85 99 / var(--tw-bg-opacity));
            border-color: rgb(75 85 99 / var(--tw-bg-opacity));
            background: rgb(75 85 99 / var(--tw-bg-opacity));
          }
          .p-checkbox .p-checkbox-box.p-highlight:hover {
            --tw-bg-opacity: 1;
            background-color: rgb(75 85 99 / var(--tw-bg-opacity));
            border-color: rgb(75 85 99 / var(--tw-bg-opacity));
            background: rgb(75 85 99 / var(--tw-bg-opacity));
          }

          .p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-focus {
            border-color: rgb(75 85 99 / var(--tw-bg-opacity)) !important;
          }
          .p-checkbox:not(.p-checkbox-disabled)
            .p-checkbox-box.p-highlight:hover {
            background: rgb(75 85 99 / var(--tw-bg-opacity));
          }
        `}
      </style>
    </div>
  );
};

BookGuests.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default BookGuests;
