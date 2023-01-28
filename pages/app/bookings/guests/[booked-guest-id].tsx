import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import ResidentSingleGuest from 'components/residents/bookings/single_guest/SingleGuest';
import SecuritySingleGuest from 'components/security/bookings/single_guest/SingleGuest';
import { Toast as ToastType } from 'primereact/toast';

import { useSelector } from 'react-redux';

const SingleGuest = () => {
  const router = useRouter();
  const toast = useRef<ToastType>(null);
  const role = useSelector((state: any) => state.authentication.role);
  const [componentToDisplay, setComponentToDisplay] = useState<any>(null);
  useEffect(() => {
    switch (role) {
      case 'resident':
        setComponentToDisplay(<ResidentSingleGuest />);

        break;
      case 'security':
        setComponentToDisplay(<SecuritySingleGuest />);

        break;
      case 'admin':
        setComponentToDisplay(<SecuritySingleGuest />);

        break;

      default:
        setComponentToDisplay(
          <div className='text-center bg-gray-600 text-digiDefault pt-4 pb-2 '>
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

SingleGuest.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default SingleGuest;
