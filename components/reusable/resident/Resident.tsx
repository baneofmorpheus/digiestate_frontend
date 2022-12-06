import type { NextPage } from 'next';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { UserType } from 'types';
type ResidentPropType = {
  resident: UserType;
  handleClick?: Function;
};

import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

const Resident: NextPage<ResidentPropType> = ({ resident, handleClick }) => {
  return (
    <div
      onClick={() => {
        if (handleClick) {
          handleClick(resident);
        }
      }}
      className={`hover:scale-105  mb-4 transition-all duration-700 cursor-pointer shadow-lg mt-2 border rounded-lg pl-4 pr-4 text-xs md:text-sm  flex justify-between items-center gap-x-4 text-black   pt-2 pb-2`}
    >
      <div className='flex items-center gap-x-4 w-4/5 truncate'>
        <div
          style={{ height: 50, width: 50 }}
          className='rounded-full border  border-gray-600'
        >
          <Image
            alt=''
            className='rounded-full  inline-block'
            src={resident.resident_data!.profile_image_link}
            height={50}
            width={50}
          />
        </div>

        <div className='w-3/5'>
          <p className=' mb-2 '>
            {resident.first_name} {resident.last_name}
          </p>

          <p className='text-gray-500 text-xs mb-2 capitalize'>
            {resident.resident_data!.marital_status}
          </p>
          <p className='text-gray-500 text-xs mb-2 capitalize'>
            <FontAwesomeIcon className={` text-sm mr-1`} icon={faLocationDot} />

            {resident.estate_user!.address}
          </p>
        </div>
      </div>
      <div className='text-gray-600 w-1/5 flex-col flex gap-y-1 items-center justify-end gap-x-4 '>
        <span className='bg-gray-600 capitalize text-xs inline-block text-digiDefault pl-2 pr-2 pt-1 pb-1 rounded-lg'>
          {resident.resident_data!.gender}
        </span>
      </div>
    </div>
  );
};
export default Resident;
