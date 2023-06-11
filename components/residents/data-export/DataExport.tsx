import type { NextPage } from 'next';
import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { updateToastData } from 'reducers/utility';
import axiosErrorHandler from 'helpers/axiosErrorHandler';
import digiEstateAxiosInstance from 'helpers/digiEstateAxiosInstance';
import PreviousPage from 'components/navigation/previous_page/PreviousPage';
import { Calendar } from 'primereact/calendar';
import ErrorMessage from 'components/validation/error_msg';
import moment from 'moment';
import { ProgressBar } from 'primereact/progressbar';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { AxiosResponse } from 'axios';

type ExportBookedGuestsInput = {
  name: string;
  format: 'xlsx' | 'csv' | '';
  start_date: string;
  end_date: string;
  resident_name: string;
};

const exportBookingInputSchema = yup
  .object()
  .shape({
    name: yup.string().label('Guest Name'),
    format: yup
      .string()
      .matches(/(csv|xlsx)/, 'Format must be csv,xlsx')
      .required()
      .label('Format'),
  })
  .required();

const DataExport: NextPage = () => {
  const estate = useSelector((state: any) => state.authentication.estate);

  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<any>(null);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | ''>('');

  const updateToastDispatch = useDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    formState,
  } = useForm<ExportBookedGuestsInput>({
    resolver: yupResolver(exportBookingInputSchema),
    mode: 'all',
  });

  async function exportBookingsToEmail(validatedData: ExportBookedGuestsInput) {
    try {
      setExportLoading(true);

      const payload: ExportBookedGuestsInput = {
        start_date: '',
        end_date: '',
        name: validatedData.name,
        format: validatedData.format,
        resident_name: '',
      };

      if (dateRange.length > 0) {
        if (dateRange.length > 1 && !!dateRange[0] && !!dateRange[1]) {
          payload.start_date = moment(dateRange[0]).format('Y-MM-DD');
          payload.end_date = moment(dateRange[1]).format('Y-MM-DD');
        } else if (!!dateRange[0]) {
          payload.start_date = moment(dateRange[0]).format('Y-MM-DD');
        }
      }

      const response: AxiosResponse<{
        message: 'Export  requested';
        code: 200;
        data: null;
      }> = await digiEstateAxiosInstance.post(
        `/bookings/${estate.id}/export`,
        payload
      );

      reset({
        start_date: '',
        end_date: '',
        name: '',
        format: '',
      });
      setDateRange(null);

      updateToastDispatch(
        updateToastData({
          severity: 'success',
          detail: 'The exported data will be sent to your mail shortly.',
          summary: 'Your request was successful',
        })
      );
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
          <form
            onSubmit={handleSubmit(exportBookingsToEmail)}
            className='2xl:w-3/4 ml-auto mr-auto'
          >
            <div className='mb-4 flex flex-col  justify-between gap-y-2.5 md:gap-x-2.5 '>
              <h4 className='mb-4 fon'>Export Bookings to Mail</h4>
              <div className='mb-2'>
                <span className='text-sm mb-1'> Export Format*</span>

                <select
                  {...register('format')}
                  value={exportFormat}
                  onChange={(e) =>
                    setExportFormat(e.target.value as typeof exportFormat)
                  }
                  className='rei-text-input'
                  id=''
                >
                  <option value=''>Select Format</option>
                  <option value='csv'>Csv</option>
                  <option value='xlsx'>Excel</option>
                </select>
                {errors['format'] && (
                  <ErrorMessage message={errors['format']['message']!} />
                )}
              </div>
              <div
                className='flex 
              flex-col mb-2  gap-y-4 lg:gap-y-0 lg:gap-x-2 lg:flex-row justify-between'
              >
                <div className='w-full'>
                  <label className='text-black'>
                    Guest Name
                    <input
                      {...register('name')}
                      type='text'
                      placeholder='E.g Avery Michael'
                      className='rei-text-input'
                    />
                  </label>
                  {errors['name'] && (
                    <ErrorMessage message={errors['name']['message']!} />
                  )}
                </div>
              </div>

              <div className=' text-sm mb-2'>
                <label className='block' htmlFor='range'>
                  Date Range*
                </label>
                <Calendar
                  id='range'
                  required
                  className='w-full'
                  inputClassName='rei-text-input !text-base'
                  value={dateRange}
                  onChange={(e) => setDateRange(e.value)}
                  selectionMode='range'
                  placeholder='Select date range to export'
                  readOnlyInput
                />
              </div>
            </div>
            <small>
              Booking data will be exported and sent to you as an email. <br />{' '}
            </small>
            <hr className='h-0.5 mb-4 bg-gray-600' />

            <div className='flex gap-x-4 mb-4'>
              <button
                disabled={exportLoading}
                type='submit'
                className='pt-2 pb-2 pl-4 pr-4 bg-gray-600 hover:bg-black text-digiDefault rounded-lg text-sm'
              >
                Send to Mail
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
  );
};
export default DataExport;
