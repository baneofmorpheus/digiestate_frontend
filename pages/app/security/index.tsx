import type { NextPage } from 'next';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';
import NewItemButton from 'components/navigation/new_item_button/NewItemButton';
import EmptyState from 'components/utility/empty_state/EmptyState';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { Dialog } from 'primereact/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { UserType } from 'types';
import Pagination from 'components/utility/pagination/Pagination';
import { Skeleton } from 'primereact/skeleton';
import Security from 'components/reusable/security/Security';

type FilterData = {
  selectedPerPage: number;
  selectedApprovalStatus: string;
  name: string;
};
const SecurityList = () => {
  const [showFiltertModal, setShowFilterModal] = useState<boolean>(false);

  const paginationRef = useRef<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [security, setSecurity] = useState<Array<UserType>>([]);

  const router = useRouter();

  const estate = useSelector((state: any) => state.authentication.estate);
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedPerPage, setSelectedPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedName, setSelectedName] = useState<string>('');
  const [selectedApprovalStatus, setSelectedApprovalStatus] =
    useState<string>('all');
  const [filterData, setFilterData] = useState<FilterData>({
    selectedPerPage: 10,
    name: '',
    selectedApprovalStatus: 'all',
  });
  const handleDialogHideEevent = () => {
    setShowFilterModal(false);
  };

  const resetFilter = () => {
    setShowFilterModal(false);

    setSelectedName('');

    setSelectedPerPage(10);
    setCurrentPage(1);
    paginationRef.current.resetPagination();

    setFilterData({
      selectedPerPage: 10,
      name: '',
      selectedApprovalStatus: 'all',
    });
  };
  const applyFilter = () => {
    setShowFilterModal(false);

    setFilterData({
      selectedPerPage: selectedPerPage,
      name: selectedName || '',
      selectedApprovalStatus,
    });
  };

  const getSecurity = useCallback(async () => {
    const queryData: any = {};

    queryData.per_page = filterData.selectedPerPage;
    queryData.name = filterData.name;
    queryData['sort[by]'] = 'created_at';
    queryData['sort[order]'] = 'desc';
    queryData['approval_status'] = selectedApprovalStatus;

    setPerPage(selectedPerPage);
    queryData.page = currentPage;
    const queryString = Object.keys(queryData)
      .map((key) => {
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
        `/estates/${estate.id}/security?${queryString}`
      );
      setSecurity(response.data.data.users);

      setTotalRecords(response.data.data.links.total);
      setTotalPages(response.data.data.links.last_page);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setFormLoading(false);
  }, [
    currentPage,
    estate.id,
    updateToastDispatch,
    filterData,
    selectedPerPage,
    selectedApprovalStatus,
  ]);

  useEffect(() => {
    getSecurity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSecurity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  useEffect(() => {
    getSecurity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const navigateToSingleSecurity = (security: UserType) => {
    router.push(`/app/security/single/${security.id}`);
  };
  const handleNameFilterSubmit = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      applyFilter();
    }
  };

  return (
    <div className='pt-4 pl-2 pr-2'>
      <div className=' pt-6 md:pl-2 md:pr-2'>
        <div className=' '>
          <div className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-2 pr-2 '>
            <div className='flex mb-2 justify-between'>
              <h2 className='  lato-font'> Security </h2>
            </div>
            <div className=''>
              <div className='flex  mb-6'>
                <div className='w-4/5'>
                  <input
                    value={selectedName}
                    onChange={(e) => {
                      setSelectedName(e.target.value);
                    }}
                    id='filterInput'
                    onKeyDown={handleNameFilterSubmit}
                    placeholder='  Search by name, press enter key to search'
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
                      className={`ml-1 filter-icon `}
                      icon={faFilter}
                    />
                  </button>
                </div>
              </div>

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

                {!formLoading && security.length < 1 && (
                  <div className='bg-gray-600 mb-2 text-digiDefault text-center text-sm pt-2 pb-2'>
                    <EmptyState message='No security found' />
                  </div>
                )}
                {!formLoading &&
                  security.map((singleSecurity, index) => {
                    return (
                      <Security
                        key={index}
                        handleClick={navigateToSingleSecurity}
                        security={singleSecurity}
                      />
                    );
                  })}
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
            id='filterDialog'
            visible={showFiltertModal}
            position='bottom'
            modal
            style={{ width: '100vw' }}
            onHide={handleDialogHideEevent}
            draggable={false}
            resizable={false}
          >
            <div className='pt-4'>
              <form className='lg:w-1/2 ml-auto mr-auto'>
                <div className='mb-2 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
                  <h4 className='mb-4 font-bold'>Filter</h4>

                  <div className='text-sm mb-4'>
                    <label className='block' htmlFor='range'>
                      Approval Status
                    </label>
                    <select
                      value={selectedApprovalStatus}
                      className='rei-text-input'
                      name='approvalStatus'
                      onChange={(e) =>
                        setSelectedApprovalStatus(e.target.value)
                      }
                      id=''
                    >
                      <option value='all'>All</option>
                      <option value='approved'>Approved</option>
                      <option value='revoked'>Revoked</option>
                    </select>
                  </div>
                  <div className='text-sm mb-4'>
                    <label className='block' htmlFor='range'>
                      Number of Results Per Page
                    </label>
                    <select
                      value={selectedPerPage}
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
          <NewItemButton link='/app/security/new' />
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
          #filterInput {
            -webkit-appearance: none;
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
            text-align: left;
          }

          .guests-container {
            min-height: 10rem;
          }

          #filterDialog {
            margin: 0;
          }
        `}</style>
      </div>
    </div>
  );
};

SecurityList.getLayout = function getLayout(page: NextPage) {
  return (
    <AuthenticatedLayout allowedRoles={['admin', 'security']}>
      {page}
    </AuthenticatedLayout>
  );
};

export default SecurityList;
