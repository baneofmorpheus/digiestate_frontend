import type { NextPage } from 'next';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen,
  faTrash,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

import { SingleDependentType } from 'types';
type DependentPropType = {
  dependent: SingleDependentType;
  editDependent?: Function;
  viewDependent?: Function;
  deleteDependent?: Function;
};

const Dependent: NextPage<DependentPropType> = ({
  dependent,
  editDependent,
  viewDependent,
  deleteDependent,
}) => {
  const role = useSelector((state: any) => state.role);

  return (
    <div
      className={` mb-4 transition-all duration-700 cursor-pointer shadow-lg mt-2 border rounded-lg pl-4 pr-4 text-xs md:text-sm  flex justify-between items-center gap-x-4 text-black   pt-2 pb-2`}
    >
      <div className='flex items-center gap-x-4 w-4/5 truncate'>
        <div className='rounded-full border  border-gray-600'>
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
          <p className='text-gray-500 text-xs mb-1 capitalize'>
            {dependent.gender}
          </p>

          {role === 'resident' && (
            <p className='text-capitalize text-xs mb-1 text-gray-500'>
              {dependent.relationship_to_resident}
            </p>
          )}

          <p className='text-capitalize text-xs text-gray-500'>
            <FontAwesomeIcon className={`mr-1`} icon={faLocationDot} />{' '}
            {dependent.estate_user!.address}
          </p>
        </div>
      </div>
      {role === 'resident' && (
        <div className='text-gray-600  flex gap-y-1 items-center justify-end gap-x-2.5 '>
          <button
            onClick={() => {
              editDependent?.(dependent);
            }}
            type='button'
            className=' hover:text-black pl-2 pr-2 pt-2 pb-2'
          >
            <FontAwesomeIcon className={` text-sm `} icon={faPen} />
          </button>
          <button
            onClick={() => {
              deleteDependent?.(dependent);
            }}
            type='button'
            className='hover:text-black pl-2 pr-2 pt-2 pb-2'
          >
            <FontAwesomeIcon className={` text-sm `} icon={faTrash} />
          </button>
        </div>
      )}
      {role !== 'resident' && (
        <div className='text-gray-600  flex gap-y-1 items-center justify-end gap-x-2.5 '>
          <button
            onClick={() => {
              viewDependent?.(dependent);
            }}
            type='button'
            className=' hover:bg-black text-xs bg-gray-600 rounded-lg text-digiDefault pl-4 pr-4 pt-2 pb-2'
          >
            View
          </button>
        </div>
      )}
    </div>
  );
};
export default Dependent;
