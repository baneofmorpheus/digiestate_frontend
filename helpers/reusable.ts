import { BookingStatusType } from 'types';
export const bookingStatusLabels: BookingStatusType = {
  timed_out: 'Timed Out',
  cancelled: 'Cancelled',
  in: 'In',
  leaving: 'Leaving',
  booked: 'Booked',
  out: 'Out',
  detained: 'Detained',
  sent_back: 'Sent Back',
};
export const bookingStatuses = [
  { label: 'All', value: 'all' },
  { label: 'Booked', value: 'booked' },
  { label: 'In', value: 'in' },
  { label: 'Out', value: 'out' },
  { label: 'Leaving', value: 'leaving' },
  { label: 'Timed Out', value: 'timed_out' },
  { label: 'Detained', value: 'detained' },
  { label: 'Sent Back', value: 'sent_back' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const phoneRegEx =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
