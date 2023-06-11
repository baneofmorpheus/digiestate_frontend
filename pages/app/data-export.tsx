import type { NextPage } from 'next';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import AdminDataExport from 'components/admin/data-export/DataExport';
import ResidentDataExport from 'components/residents/data-export/DataExport';

import { useSelector } from 'react-redux';

const DataExport = () => {
  const { role } = useSelector((state: any) => state.authentication);

  const [componentToDisplay, setComponentToDisplay] = useState<any>(null);

  useEffect(() => {
    switch (role) {
      case 'resident':
        setComponentToDisplay(<ResidentDataExport />);

        break;
      case 'security':
        setComponentToDisplay(<AdminDataExport />);

        break;
      case 'admin':
        setComponentToDisplay(<AdminDataExport />);

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

DataExport.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default DataExport;
