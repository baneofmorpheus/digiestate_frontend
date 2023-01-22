import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import ResidentBookingList from 'components/residents/bookings/booking_list/BookingList';
import SecurityBookingList from 'components/security/bookings/booking_list/BookingList';

import { useSelector } from 'react-redux';

const BookingsList = () => {
  const router = useRouter();
  const role = useSelector((state: any) => state.authentication.role);
  const [componentToDisplay, setComponentToDisplay] = useState<any>(null);
  useEffect(() => {
    switch (role) {
      case 'resident':
        setComponentToDisplay(<ResidentBookingList />);

        break;
      case 'security':
        setComponentToDisplay(<SecurityBookingList />);

        break;
      case 'admin':
        setComponentToDisplay(<SecurityBookingList />);

        break;

      default:
        setComponentToDisplay(
          <div className='text-center bg-gray-600 text-digiDefault pt-2 pb-2 '>
            <p>
              You are not supposed to be here. <br />
              Invalid user role,contact support if you think this is an error.
            </p>
          </div>
        );
        break;
    }
  }, [role]);

  return <div className='pt-4 pl-2 pr-2'>{componentToDisplay}</div>;
};

BookingsList.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default BookingsList;
