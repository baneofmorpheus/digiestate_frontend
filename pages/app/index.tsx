import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import ResidentHome from 'components/residents/home/Home';
import moment from 'moment';

import SecurityHome from 'components/security/home/Home';
import AdminHome from 'components/admin/home/Home';

import { useSelector } from 'react-redux';

const App = () => {
  const user = useSelector((state: any) => state.authentication.user);

  const role = useSelector((state: any) => state.authentication.role);
  const [componentToDisplay, setComponentToDisplay] = useState<any>(null);

  function generateGreetings() {
    const currentHour: number = parseInt(moment().format('HH'));

    if (currentHour >= 3 && currentHour < 12) {
      return 'Good Morning';
    } else if (currentHour >= 12 && currentHour < 15) {
      return 'Good Afternoon';
    } else if (currentHour >= 15 && currentHour < 20) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }

  useEffect(() => {
    switch (role) {
      case 'resident':
        setComponentToDisplay(<ResidentHome />);

        break;
      case 'security':
        setComponentToDisplay(<SecurityHome />);

        break;
      case 'admin':
        setComponentToDisplay(<AdminHome />);

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

  return (
    <div className='pt-8 pl-2 pr-2'>
      <p className='mb-2'>
        {generateGreetings()}, {user.firstName}
      </p>

      {componentToDisplay}
    </div>
  );
};

App.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default App;
