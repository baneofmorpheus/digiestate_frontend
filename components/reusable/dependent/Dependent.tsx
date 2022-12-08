import type { NextPage } from 'next';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

import { SingleDependentType } from 'types';
type DependentPropType = {
  dependent: SingleDependentType;
  handleClick?: Function;
};

const Dependent: NextPage<DependentPropType> = ({ dependent, handleClick }) => {
  return (
    <div
      onClick={() => {
        if (handleClick) {
          handleClick(dependent);
        }
      }}
      className={`betterhover:hover:scale-105 mb-4 transition-all duration-700 cursor-pointer shadow-lg mt-2 border rounded-lg pl-4 pr-4 text-xs md:text-sm  flex justify-between items-center gap-x-4 text-black   pt-2 pb-2`}
    >
      <div className='flex items-center gap-x-4 w-4/5 truncate'>
        <div
          style={{ height: 50, width: 50 }}
          className='rounded-full border  border-gray-600'
        >
          <Image
            alt=''
            className='rounded-full  inline-block'
            src={dependent.profile_image_link}
            height={50}
            width={50}
          />
        </div>

        <div className='w-3/5'>
          <p className=' mb-1 '>
            {dependent.first_name} {dependent.last_name}
          </p>

          <p className='capitalize text-xs mb-1 text-gray-500'>
            {dependent.relationship_to_resident} to the Resident
          </p>

          <p className='capitalize text-xs mb-1 text-gray-500'>
            <FontAwesomeIcon className={` text-sm mr-1`} icon={faLocationDot} />
            {dependent.estate_user!.address}
          </p>
        </div>
      </div>

      <div className='text-gray-600 w-1/5 flex-col flex gap-y-1 items-center justify-end gap-x-4 '>
        <span className='bg-gray-600 capitalize text-xs inline-block text-digiDefault pl-2 pr-2 pt-1 pb-1 rounded-lg'>
          {dependent.gender}
        </span>
      </div>
    </div>
  );
};
export default Dependent;
