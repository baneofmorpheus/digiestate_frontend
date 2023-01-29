import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';

import axiosErrorHandler from 'helpers/axiosErrorHandler';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import { updateToastData } from 'reducers/utility';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { Dialog } from 'primereact/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { Calendar } from 'primereact/calendar';
import { SingleBookedGuestType } from 'types';
import Pagination from 'components/utility/pagination/Pagination';
import { Skeleton } from 'primereact/skeleton';
import BookedGuest from 'components/reusable/booked_guest/BookedGuest';
import { bookingStatuses } from 'helpers/reusable';
import EmptyState from 'components/utility/empty_state/EmptyState';

type FilterData = {
  selectedPerPage: number;
  dateRange: Array<any>;
  bookingStatus: string;

  name: string;
};

const SecurityBookingList = () => {
  const [showFiltertModal, setShowFilterModal] = useState<boolean>(false);
  const [bookingStatus, setBookingStatus] = useState<string>('all');

  const paginationRef = useRef<any>(null);
  const [formLoading, setFormLoading] = useState(false);
  const updateToastDispatch = useDispatch();

  const [guests, setGuests] = useState<Array<SingleBookedGuestType>>([]);

  const router = useRouter();

  const [dateRange, setDateRange] = useState<any>([]);
  const [bookingMode, setBookingMode] = useState<string>('all');
  const estate = useSelector((state: any) => state.authentication.estate);
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedPerPage, setSelectedPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedName, setSelectedName] = useState<string>('');
  const [filterData, setFilterData] = useState<FilterData>({
    selectedPerPage: 10,
    dateRange: [],
    bookingStatus: 'all',
    name: '',
  });
  const handleDialogHideEevent = () => {
    setShowFilterModal(false);
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
      bookingStatus: 'all',

      name: '',
    });
  };
  const applyFilter = () => {
    setShowFilterModal(false);

    setFilterData({
      selectedPerPage: selectedPerPage,
      dateRange: dateRange,
      bookingStatus: bookingStatus,

      name: selectedName || '',
    });
  };

  const getBookings = useCallback(async () => {
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
    queryData.status = filterData.bookingStatus;
    queryData.per_page = filterData.selectedPerPage;
    queryData.name = filterData.name;
    queryData['sort[by]'] = 'created_at';
    queryData['sort[order]'] = 'desc';

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
        `/bookings/${estate.id}/guests?${queryString}`
      );
      setGuests(response.data.data.booked_guests);

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
  ]);

  useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  useEffect(() => {
    getBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const navigateToSingleBooking = (id: number) => {
    router.push(`/app/bookings/guests/${id}`);
  };
  const handleNameFilterSubmit = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      applyFilter();
    }
  };
  return (
    <div className=' pt-6 md:pl-2 md:pr-2'>
      <div className=' '>
        <div className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-2 pr-2 '>
          <div className='flex mb-2 justify-between'>
            <h2 className='  lato-font'>Booked Guests</h2>
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

              {!formLoading && guests.length < 1 && (
                <div className=' mb-2 text-center  pt-2 pb-2'>
                  <EmptyState message='No guests found' />
                </div>
              )}
              {!formLoading &&
                guests.map((singleGuest, index) => {
                  return (
                    <BookedGuest
                      key={index}
                      handleClick={navigateToSingleBooking}
                      guest={singleGuest}
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
          <div>
            <form className='lg:w-1/2 ml-auto mr-auto'>
              <div className='mb-6 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
                <h4 className='mb-4 font-bold'>Filter</h4>
                <div className='mb-4'>
                  <span className='text-sm'>Booking Status</span>

                  <select
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value)}
                    className='rei-text-input'
                    name='bookingStatus'
                    id=''
                  >
                    {bookingStatuses.map((singleBookingStatus, index) => {
                      return (
                        <option key={index} value={singleBookingStatus.value}>
                          {singleBookingStatus.label}
                        </option>
                      );
                    })}
                  </select>
                </div>

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
                <div className=' text-sm'>
                  <label className='block' htmlFor='range'>
                    Date Range
                  </label>
                  <Calendar
                    id='range'
                    className='w-full'
                    inputClassName='rei-text-input !text-base'
                    value={dateRange}
                    onChange={(e) => setDateRange(e.value)}
                    selectionMode='range'
                    placeholder='Select date range to search from'
                    readOnlyInput
                  />
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
  );
};

export default SecurityBookingList;
