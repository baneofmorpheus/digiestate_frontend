import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateToastData } from 'reducers/utility';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { SingleBookedGuestType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import BookedGuest from 'components/reusable/booked_guest/BookedGuest';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faFilter } from '@fortawesome/free-solid-svg-icons';
import { Dialog } from 'primereact/dialog';
import { SelectButton } from 'primereact/selectbutton';
import Pagination from 'components/utility/pagination/Pagination';

import moment from 'moment';

type FilterData = {
  selectedPerPage: number;
  bookingMode: string;
  name_or_code: string;
};

const SecurityHome: NextPage = () => {
  const router = useRouter();

  const estate = useSelector((state: any) => state.authentication.estate);
  const paginationRef = useRef<any>(null);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const [loadingRecentBooking, setLoadingRecentBooking] =
    useState<boolean>(false);
  const [showFiltertModal, setShowFilterModal] = useState<boolean>(false);
  const [selectedPerPage, setSelectedPerPage] = useState<number>(10);
  const [bookingMode, setBookingMode] = useState<string>('all');
  const [selectedNameOrCode, setSelectedNameOrCode] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [recentBookings, setRecentBookings] = useState<Array<any>>([]);
  const [filterData, setFilterData] = useState<FilterData>({
    selectedPerPage: 10,
    bookingMode: 'all',
    name_or_code: '',
  });

  const bookingTypes = [
    { label: 'All', value: 'all' },
    { label: 'Book In', value: 'book_in' },
    { label: 'Book Out', value: 'book_out' },
  ];

  const handleNameFilterSubmit = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter') {
      applyFilter();
    }
  };
  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };
  const navigateToSingleBooking = (id: number) => {
    router.push(`/app/bookings/guests/${id}`);
  };

  const resetFilter = () => {
    setShowFilterModal(false);

    setSelectedNameOrCode('');
    setBookingMode('all');
    setSelectedPerPage(10);
    setCurrentPage(1);
    paginationRef.current.resetPagination();

    setFilterData({
      selectedPerPage: 10,
      bookingMode: 'all',
      name_or_code: '',
    });
  };

  const handleDialogHideEevent = () => {
    setShowFilterModal(false);
  };

  const applyFilter = () => {
    setShowFilterModal(false);

    setFilterData({
      selectedPerPage: selectedPerPage,
      bookingMode: bookingMode,
      name_or_code: selectedNameOrCode || '',
    });
  };
  const updateToastDispatch = useDispatch();

  const getRecentBookings = async () => {
    try {
      setLoadingRecentBooking(true);

      const formattedStartDate = moment()
        .subtract(48, 'hours')
        .format('Y-MM-DD');
      const formattedEndDate = moment().format('Y-MM-DD');

      const queryData: any = {};

      queryData.start_date = formattedStartDate;
      queryData.end_date = formattedEndDate;

      queryData.booking_type = filterData.bookingMode;
      queryData.per_page = filterData.selectedPerPage;
      queryData.name_or_code = filterData.name_or_code;
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

      const response: any = await digiEstateAxiosInstance.get(
        `/bookings/${estate.id}/guests?${queryString}`
      );
      setRecentBookings(response.data.data.booked_guests);
      setTotalRecords(response.data.data.links.total);
      setTotalPages(response.data.data.links.last_page);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setLoadingRecentBooking(false);
  };

  useEffect(() => {
    getRecentBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getRecentBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterData]);

  useEffect(() => {
    getRecentBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  return (
    <div className=''>
      <h5 className='mb-4'> {`Recent Bookings`}</h5>
      <div className='flex  mb-6'>
        <div className='w-4/5'>
          <input
            value={selectedNameOrCode}
            onChange={(e) => {
              setSelectedNameOrCode(e.target.value);
            }}
            id='filterInput'
            onKeyDown={handleNameFilterSubmit}
            placeholder='  Search by name or code, press enter key to search'
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
            <FontAwesomeIcon className={`ml-1 filter-icon `} icon={faFilter} />
          </button>
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
                <span className='text-sm'>Booking Action</span>
                <SelectButton
                  id='bookingMode'
                  unselectable={false}
                  value={bookingMode}
                  options={bookingTypes}
                  onChange={(e) => setBookingMode(e.value)}
                ></SelectButton>
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
      {loadingRecentBooking ? (
        <div className='text-sm'>
          <div className='flex mb-4'>
            <Skeleton shape='circle' size='3REM' className='mr-2'></Skeleton>
            <div style={{ flex: '1' }}>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='75%'></Skeleton>
            </div>
          </div>
          <div className='flex mb-4'>
            <Skeleton shape='circle' size='3REM' className='mr-2'></Skeleton>
            <div style={{ flex: '1' }}>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='75%'></Skeleton>
            </div>
          </div>
          <div className='flex mb-4'>
            <Skeleton shape='circle' size='3REM' className='mr-2'></Skeleton>
            <div style={{ flex: '1' }}>
              <Skeleton width='100%' className='mb-2'></Skeleton>
              <Skeleton width='75%'></Skeleton>
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
      <div className='recent-bookings'>
        {!loadingRecentBooking && recentBookings.length < 1 && (
          <div className='text-center text-xs md:text-sm bg-gray-600 text-digiDefault pt-2 pb-2 mb-2'>
            <p>No recent bookings found</p>
          </div>
        )}

        {!loadingRecentBooking &&
          recentBookings.map((singleBooking: SingleBookedGuestType, index) => {
            return (
              <BookedGuest
                key={index}
                handleClick={navigateToSingleBooking}
                guest={singleBooking}
              />
            );
          })}
      </div>
      <Pagination
        ref={paginationRef}
        rowsPerPage={perPage}
        onPageChange={onPageChange}
        totalRecords={totalRecords}
        totalPages={totalPages}
      />
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
        @media screen and (max-width: 325px) {
          .filter-icon {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
export default SecurityHome;
