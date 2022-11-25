import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import ErrorMessage from 'components/validation/error_msg';
import { ProgressBar } from 'primereact/progressbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { Dialog } from 'primereact/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPlus, faUpload } from '@fortawesome/free-solid-svg-icons';
import Pagination from 'components/utility/pagination/Pagination';
import { Skeleton } from 'primereact/skeleton';
import { DependentListType, SingleDependentType } from 'types/';
import Dependent from 'components/reusable/dependent/Dependent';
import { ProgressSpinner } from 'primereact/progressspinner';

type FilterData = {
  selectedPerPage: number;
  dateRange: Array<any>;
  bookingMode: string;
  name: string;
};

const ResidentDependentList = () => {
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

  const selectImageToUpload = () => {
    document.getElementById('profile_image_upload_input')?.click();
  };

  const [uploadedImageBlob, setUploadedImageBlob] = useState<any>(null);
  const [idOfDependentToEdit, setIdOfDependentToEdit] = useState<number>();

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

  const [showFiltertModal, setShowFilterModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showLoadingDeleteModal, setShowLoadingDeleteModal] =
    useState<boolean>(true);

  const paginationRef = useRef<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [editRequestLoading, setEditRequestLoading] = useState(false);
  const [deleteRequestLoading, setDeleteRequestLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [dependents, setDependents] = useState<DependentListType>([]);

  const router = useRouter();

  const [dateRange, setDateRange] = useState<any>([]);
  const [bookingMode, setBookingMode] = useState<string>('all');
  const { estate, userId } = useSelector((state: any) => state.authentication);
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedPerPage, setSelectedPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedName, setSelectedName] = useState<string>('');
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState<boolean>(false);
  const [filterData, setFilterData] = useState<FilterData>({
    selectedPerPage: 10,
    dateRange: [],
    bookingMode: 'all',
    name: '',
  });

  const [uploadedImagePreview, setUploadedImagePreview] = useState<
    string | null
  >(null);
  const handleDialogHideEevent = () => {
    setShowFilterModal(false);
  };
  const handleEditDialogHideEevent = () => {
    setShowEditModal(false);
  };

  const resetFilter = () => {
    setShowFilterModal(false);

    setSelectedName('');
    setDateRange([]);
    setBookingMode('all');
    setSelectedPerPage(10);
    setCurrentPage(1);
    paginationRef.current.resetPagination();

    setFilterData({
      selectedPerPage: 10,
      dateRange: [],
      bookingMode: 'all',
      name: '',
    });
  };
  const applyFilter = () => {
    setShowFilterModal(false);

    setFilterData({
      selectedPerPage: selectedPerPage,
      dateRange: dateRange,
      bookingMode: bookingMode,
      name: selectedName || '',
    });
  };

  const editDependent = (dependent: SingleDependentType) => {
    setShowEditModal(true);

    setIdOfDependentToEdit(dependent.id);

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

  const getDependents = useCallback(async () => {
    const queryData: any = {};

    if (filterData.dateRange.length > 0) {
      if (
        filterData.dateRange.length > 1 &&
        !!filterData.dateRange[0] &&
        !!filterData.dateRange[1]
      ) {
        queryData.start_date = moment(filterData.dateRange[0]).format(
          'Y-MM-DD'
        );
        queryData.end_date = moment(filterData.dateRange[1]).format('Y-MM-DD');
      } else if (!!filterData.dateRange[0]) {
        queryData.start_date = moment(filterData.dateRange[0]).format(
          'Y-MM-DD'
        );
      }
    }
    queryData.per_page = filterData.selectedPerPage;
    queryData.name = filterData.name;

    setPerPage(selectedPerPage);
    queryData.page = currentPage;
    const queryString = Object.keys(queryData)
      .map((key) => {
        /**
         * If booking type is all dont include the filter at all
         */

        if (queryData[key] != 'all') {
          return (
            encodeURIComponent(key) + '=' + encodeURIComponent(queryData[key])
          );
        }
      })
      .join('&');

    setFormLoading(true);
    try {
      const response = await digiEstateAxiosInstance.get(
        `/residents/${userId}/dependents/${estate.id}?${queryString}`
      );
      setDependents(response.data.data.dependents);

      setTotalRecords(response.data.data.links.total);
      setTotalPages(response.data.data.links.last_page);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  }, [
    filterData.dateRange,
    filterData.selectedPerPage,
    filterData.name,
    selectedPerPage,
    currentPage,
    userId,
    estate.id,
    updateToastDispatch,
  ]);

  useEffect(() => {
    getDependents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getDependents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  const onPageChange = (page: number) => {
    getDependents();
    setCurrentPage(page);
  };

  const handleNameFilterSubmit = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      applyFilter();
    }
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
      getDependents();
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
        `/residents/dependents/${idOfDependentToEdit}`,
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
      getDependents();
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setEditRequestLoading(false);
  };

  return (
    <div className=' pt-4 md:pl-2 md:pr-2'>
      <div className=' '>
        <div className='flex justify-between mb-4'>
          <h2 className='mb-8  lato-font'>Dependents </h2>
          <button
            onClick={() => {
              router.push('/app/dependents/new');
            }}
            className='bg-gray-600 h-8 hover:bg-black  text-digiDefault block text-sm rounded-lg pl-4 pr-4 '
          >
            New
            <FontAwesomeIcon className={` filter-icon ml-2 `} icon={faPlus} />
          </button>
        </div>
        <div className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-2 pr-2  '>
          <div className=''>
            {/* #TODO  implement dependent filter and search on frontend */}
            {/* <div className='flex  mb-6'>
              <div className='w-4/5'>
                <input
                  value={selectedName}
                  onChange={(e) => {
                    setSelectedName(e.target.value);
                  }}
                  onKeyDown={handleNameFilterSubmit}
                  placeholder='  Search by name, press enter or search key to search'
                  className='rei-text-input !rounded-r-none '
                  type='search'
                  name='name'
                />{' '}
              </div>
              <div className='w-1/5  '>
                <button
                  type='button'
                  className='bg-gray-600 w-full transition-all duration-700 hover:bg-black hover:text-white lg:pl-4 pl-2 pr-2 lg:pr-4 pt-2 pb-2 rounded-r-lg text-digiDefault text-sm'
                  onClick={() => {
                    setShowFilterModal(true);
                  }}
                >
                  Filter{' '}
                  <FontAwesomeIcon
                    className={` filter-icon `}
                    icon={faFilter}
                  />
                </button>
              </div>
            </div> */}

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

              <ConfirmDialog visible={showDeleteConfirmation} />
              {!formLoading && dependents.length < 1 && (
                <div className='bg-gray-600 mb-2 text-digiDefault text-xs md:text-sm text-center  pt-2 pb-2'>
                  <p>No dependents found</p>
                </div>
              )}
              {!formLoading &&
                dependents.map(
                  (singleDependent: SingleDependentType, index) => {
                    return (
                      <Dependent
                        editDependent={editDependent}
                        deleteDependent={deleteDependent}
                        key={index}
                        dependent={singleDependent}
                      />
                    );
                  }
                )}
            </div>
            <div>
              <Pagination
                ref={paginationRef}
                rowsPerPage={perPage}
                onPageChange={onPageChange}
                totalRecords={totalRecords}
                totalPages={totalPages}
              />
            </div>
          </div>
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
                  <ErrorMessage message={errors['phone_number']['message']!} />
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

        <Dialog
          header=''
          id='filterDialog'
          visible={showFiltertModal}
          position='bottom'
          modal
          style={{ width: '100vw' }}
          onHide={handleDialogHideEevent}
          draggable={false}
          resizable={false}
        >
          <div>
            <form className='lg:w-1/2 ml-auto mr-auto'>
              <div className='mb-6 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
                <h4 className='mb-4 font-bold'>Filter</h4>

                <div className='text-sm mb-4'>
                  <label className='block' htmlFor='range'>
                    Number of Results Per Page
                  </label>
                  <select
                    value={selectedPerPage}
                    onChange={(e) => setSelectedPerPage(Number(e.target.value))}
                    className='rei-text-input'
                    name='perPage'
                    id=''
                  >
                    <option value='10'>10</option>
                    <option value='20'>20</option>
                    <option value='60'>60</option>
                    <option value='100'>100</option>
                    <option value='200'>200</option>
                  </select>
                </div>
              </div>
              <div className='flex gap-x-4'>
                <button
                  type='button'
                  onClick={applyFilter}
                  className='pt-2 pb-2 pl-4 pr-4 bg-gray-600 text-digiDefault rounded-lg text-sm'
                >
                  Apply
                </button>
                <button
                  onClick={resetFilter}
                  type='button'
                  className='pt-2 pb-2 pl-4 pr-4 border-2 border-gray-600 rounded-lg text-sm'
                >
                  Cancel / Reset
                </button>
              </div>
            </form>
          </div>
        </Dialog>
      </div>
      <style global jsx>{`
        @keyframes p-progress-spinner-color {
          100%,
          0% {
            stroke: #4b5563;
          }
          40% {
            stroke: #4b5563;
          }
          66% {
            stroke: #4b5563;
          }
          80%,
          90% {
            stroke: #4b5563;
          }
        }

        #filterDialog,
        #editDialog,
        #deleteDialog {
          margin: 0;
        }
        @media screen and (max-width: 325px) {
          .filter-icon {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ResidentDependentList;
