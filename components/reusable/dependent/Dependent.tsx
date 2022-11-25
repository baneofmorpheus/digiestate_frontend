import type { NextPage } from 'next';
import moment from 'moment';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

import { SingleDependentType } from 'types';
type DependentPropType = {
  dependent: SingleDependentType;
  editDependent: Function;
  deleteDependent: Function;
};

const Dependent: NextPage<DependentPropType> = ({
  dependent,
  editDependent,
  deleteDependent,
}) => {
  return (
    <div className='  mb-4 transition-all duration-700 cursor-pointer shadow-lg mt-2 border rounded-lg pl-4 pr-4 text-xs md:text-sm  flex justify-between items-center gap-x-4 text-black   pt-2 pb-2'>
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
          <p className='  '>
            {dependent.first_name} {dependent.last_name}
          </p>

          <p className='text-capitalize text-xs text-gray-500'>
            {dependent.relationship_to_resident}
          </p>
        </div>
      </div>
      <div className='text-gray-600  flex gap-y-1 items-center justify-end gap-x-2.5 '>
        <button
          onClick={() => {
            editDependent(dependent);
          }}
          type='button'
          className=' hover:text-black pl-2 pr-2 pt-2 pb-2'
        >
          <FontAwesomeIcon className={` text-sm `} icon={faPen} />
        </button>
        <button
          onClick={() => {
            deleteDependent(dependent);
          }}
          type='button'
          className='hover:text-black pl-2 pr-2 pt-2 pb-2'
        >
          <FontAwesomeIcon className={` text-sm `} icon={faTrash} />
        </button>
      </div>
    </div>
  );
};
export default Dependent;
