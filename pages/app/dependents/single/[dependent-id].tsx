import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import SingleDependent from 'components/reusable/single_dependent/SingleDependent';
import { Toast as ToastType } from 'primereact/toast';

import { useSelector } from 'react-redux';

const SingleSecurity = () => {
  const router = useRouter();
  const toast = useRef<ToastType>(null);
  const role = useSelector((state: any) => state.authentication.role);
  const [componentToDisplay, setComponentToDisplay] = useState<any>(null);
  useEffect(() => {
    switch (role) {
      case 'security':
        setComponentToDisplay(<SingleDependent />);

        break;
      case 'resident':
        setComponentToDisplay(<SingleDependent />);

        break;
      case 'admin':
        setComponentToDisplay(<SingleDependent />);

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

SingleSecurity.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default SingleSecurity;
