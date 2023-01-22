import type { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { UserType } from 'types';
type SecurityPropType = {
  security: UserType;
  handleClick?: Function;
};

const Security: NextPage<SecurityPropType> = ({ security, handleClick }) => {
  return (
    <div
      onClick={() => {
        if (handleClick) {
          handleClick(security);
        }
      }}
      className={`betterhover:hover:scale-105  mb-4 transition-all duration-700 cursor-pointer shadow-lg mt-2 border rounded-lg pl-4 pr-4 text-xs md:text-sm  flex justify-between items-center gap-x-4 text-black   pt-2 pb-2`}
    >
      <div className='flex items-center gap-x-4 w-4/5 truncate'>
        <div className='w-3/5'>
          <p className=' mb-2 '>
            {security.first_name} {security.last_name}
          </p>
          <p className='  mb-2 '>{security.email}</p>
          <p className=' mb-2 '>{security.phone_number}</p>
        </div>
      </div>
      <div className='text-gray-600 w-1/5 flex-col flex gap-y-1 items-center justify-end gap-x-4 '>
        <span className='bg-gray-600 capitalize text-xs inline-block text-digiDefault pl-2 pr-2 pt-1 pb-1 rounded-lg'>
          {security?.security_estate_user?.approval_status}
        </span>
      </div>
    </div>
  );
};
export default Security;
