import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import ResidentDependentList from 'components/residents/dependents/dependents_list/DependentList';

import { useSelector } from 'react-redux';

const DependentList = () => {
  const role = useSelector((state: any) => state.authentication.role);
  const [componentToDisplay, setComponentToDisplay] = useState<any>(null);
  useEffect(() => {
    switch (role) {
      case 'resident':
        setComponentToDisplay(<ResidentDependentList />);

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

DependentList.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default DependentList;
