import { UserType } from './user';

export type BookingStatusType = {
  timed_out: string;
  pending: string;
  completed: string;
  detained: string;
  sent_back: string;
};

export type BookingActionType = {
  book_in: string;
  book_out: string;
};

export type SingleBooking = {
  id: number;
  name: string;
  action: string;
  code: boolean;
  comment: boolean;
  status: string;
  type: string;
  guests?: Array<SingleBookedGuestType>;
  vehicle_make: null | string;
  vehicle_plate_number: null | string;
  resident: UserType;
  created_at: string;
  updated_at: string;
};

export type SingleBookedGuestType = {
  id: number;
  name: string;
  phone_number: string;
  phone_visible_to_security: boolean;
  gender: string;
  send_back_guest: boolean;
  detain_guest: boolean;
  booking_info: SingleBooking;
  status: string;
  time_checked_by_security: null | string;
  resident: UserType;
  created_at: string;
  updated_at: string;
};

export type SingleBookedGuestListType = Array<SingleBookedGuestType>;
