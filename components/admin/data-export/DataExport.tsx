import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import { useSelector, useDispatch } from 'react-redux';
import { updateToastData } from 'reducers/utility';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import { SingleBookedGuestType } from 'types';
import { Skeleton } from 'primereact/skeleton';
import BookedGuest from 'components/reusable/booked_guest/BookedGuest';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';
import { Calendar } from 'primereact/calendar';

import EmptyState from 'components/utility/empty_state/EmptyState';
import NewItemButton from 'components/navigation/new_item_button/NewItemButton';
import moment from 'moment';
import { ProgressBar } from 'primereact/progressbar';

const DataExport: NextPage = () => {
  const estate = useSelector((state: any) => state.authentication.estate);

  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<any>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | ''>('');

  const [recentBookings, setRecentBookings] = useState<Array<any>>([]);
  const router = useRouter();

  const updateToastDispatch = useDispatch();

  async function exportBookingsToEmail() {
    try {
      setExportLoading(true);

      const formattedStartDate = moment()
        .subtract(48, 'hours')
        .format('Y-MM-DD');
      const formattedEndDate = moment().format('Y-MM-DD');

      const response: any = await digiEstateAxiosInstance.get(
        `/bookings/${estate.id}/guests?start_date=${formattedStartDate}&end_date=${formattedEndDate}&sort[by]=updated_at&sort[order]=desc&per_page=25`
      );
      setRecentBookings(response.data.data.booked_guests);
    } catch (error: any) {
      const toastData = axiosErrorHandler(error);
      updateToastDispatch(updateToastData(toastData));
    }
    setExportLoading(false);
  }

  return (
    <div className=' pt-4 md:pl-2 md:pr-2 pb-2'>
      <div className=' '>
        <PreviousPage label='Data Export' />

        <div className='mb-4  ml-auto mr-auto lg:pr-0 lg:pl-0 pl-2 pr-2 '>
          <form className='lg:w-3/4 ml-auto mr-auto'>
            <div className='mb-4 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
              <h4 className='mb-4 fon'>Export Bookings to Mail</h4>
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
                  placeholder='Select date range to export'
                  readOnlyInput
                />
              </div>
              <div className='mb-2'>
                <span className='text-sm mb-1'> Export Format</span>

                <select
                  value={exportFormat}
                  onChange={(e) =>
                    setExportFormat(e.target.value as typeof exportFormat)
                  }
                  className='rei-text-input'
                  name='bookingStatus'
                  id=''
                >
                  <option value=''>Select Format</option>
                  <option value='csv'>Csv</option>
                  <option value='excel'>Excel</option>
                </select>
              </div>
            </div>
            <small>
              Your data will be exported and sent to you as an email.
            </small>
            <hr className='h-0.5 mb-4 bg-gray-600' />

            <div className='flex gap-x-4 mb-4'>
              <button
                disabled={exportLoading}
                type='button'
                onClick={exportBookingsToEmail}
                className='pt-2 pb-2 pl-4 pr-4 bg-gray-600 hover:bg-black text-digiDefault rounded-lg text-sm'
              >
                Send to Mail
              </button>
              <button
                disabled={exportLoading}
                onClick={() => {}}
                type='button'
                className='pt-2 pb-2 pl-4 hover:bg-gray-100  pr-4 border-2 border-gray-600 rounded-lg text-sm'
              >
                Cancel
              </button>
            </div>

            {exportLoading && (
              <ProgressBar
                mode='indeterminate'
                color='#4B5563'
                style={{ height: '6px' }}
              ></ProgressBar>
            )}
          </form>
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
    // <div className='relative min-h-screen pt-2'>
    //   <h5 className='mb-4'> Recent Bookings</h5>

    //   {loadingRecentBooking ? (
    //     <div className='text-sm'>
    //       <div className='flex mb-4'>
    //         <Skeleton shape='circle' size='3REM' className='mr-2'></Skeleton>
    //         <div style={{ flex: '1' }}>
    //           <Skeleton width='100%' className='mb-2'></Skeleton>
    //           <Skeleton width='75%'></Skeleton>
    //         </div>
    //       </div>
    //       <div className='flex mb-4'>
    //         <Skeleton shape='circle' size='3REM' className='mr-2'></Skeleton>
    //         <div style={{ flex: '1' }}>
    //           <Skeleton width='100%' className='mb-2'></Skeleton>
    //           <Skeleton width='75%'></Skeleton>
    //         </div>
    //       </div>
    //       <div className='flex mb-4'>
    //         <Skeleton shape='circle' size='3REM' className='mr-2'></Skeleton>
    //         <div style={{ flex: '1' }}>
    //           <Skeleton width='100%' className='mb-2'></Skeleton>
    //           <Skeleton width='75%'></Skeleton>
    //         </div>
    //       </div>
    //     </div>
    //   ) : (
    //     ''
    //   )}
    //   <div className='recent-bookings'>
    //     {!loadingRecentBooking && recentBookings.length < 1 && (
    //       <div className='text-center  pt-2 pb-2 mb-2'>
    //         <EmptyState message='No recent bookings found' />
    //       </div>
    //     )}

    //     {!loadingRecentBooking &&
    //       recentBookings.map((singleBooking: SingleBookedGuestType, index) => {
    //         return (
    //           <BookedGuest
    //             key={index}
    //             handleClick={navigateToSingleBooking}
    //             guest={singleBooking}
    //           />
    //         );
    //       })}
    //   </div>
    //   <NewItemButton link='/app/bookings/new' />
    // </div>
  );
};
export default DataExport;
