import type { NextPage } from 'next';
import moment from 'moment';

import {
  SingleBookedGuestType,
  BookingStatusType,
  BookingActionType,
} from 'types';
type BookedGuestPropType = {
  guest: SingleBookedGuestType;
  handleClick?: Function;
};

const bookingStatus: BookingStatusType = {
  timed_out: 'Timed Out',
  pending: 'Pending',
  completed: 'Completed',
  detained: 'Detained',
  sent_back: 'Sent Back',
};

const bookingAction: BookingActionType = {
  book_in: 'Book In',
  book_out: 'Book Out',
};
const BookedGuest: NextPage<BookedGuestPropType> = ({ guest, handleClick }) => {
  return (
    <div
      onClick={() => {
        if (handleClick) {
          handleClick(guest.id);
        }
      }}
      className='hover:scale-105  mb-4 transition-all duration-700 cursor-pointer shadow-lg mt-2 border rounded-lg pl-4 pr-4 text-xs md:text-sm  flex justify-between items-center gap-x-4 text-black   pt-2 pb-2'
    >
      <div className='flex items-center gap-x-4 w-4/5 truncate'>
        <div className=' flex justify-center  items-center h-12 w-12 bg-gray-600 text-digiDefault rounded-full'>
          <span className=''>{guest.booking_info.code}</span>
        </div>
        <div className='w-3/5'>
          <p className='  '>{guest.name}</p>
          <p className=''>
            {!!guest.phone_number ? guest.phone_number : 'XXX-XXXXX'}-
            <span className='capitalize'>{guest.gender}</span>
          </p>
          <p>
            {
              bookingAction[
                guest.booking_info.action as keyof BookingActionType
              ]
            }
          </p>
          <span className='block'>
            {' '}
            {moment(guest.created_at).format('DD-MMM-YYYY hh:mm a')}
          </span>
        </div>
      </div>
      <div className='text-gray-600 w-1/5 flex-col flex gap-y-1 items-center justify-end gap-x-4 '>
        <p className='text-xs'>
          {bookingStatus[guest.status as keyof BookingStatusType]}
        </p>
        <span className='bg-gray-600 capitalize text-xs inline-block text-digiDefault pl-2 pr-2 pt-1 pb-1 rounded-lg'>
          {guest.booking_info.type}
        </span>
      </div>
    </div>
  );
};
export default BookedGuest;
