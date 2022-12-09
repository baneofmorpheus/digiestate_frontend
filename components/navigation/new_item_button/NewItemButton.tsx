import type { NextPage } from 'next';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

type PropType = {
  link: string;
};
const NewItemButton: NextPage<PropType> = ({ link }) => {
  return (
    <div className='fixed   right-0 lg:left-3/4 lg:right-auto lg:-translate-x-full bottom-16 z-50 p-4 '>
      <Link href={link}>
        <a className='rounded-full  h-12 w-12 hover:bg-black  flex items-center justify-center shadow-xl  bg-gray-600 text-digiDefault '>
          <FontAwesomeIcon icon={faPlus} />
        </a>
      </Link>
    </div>
  );
};
export default NewItemButton;
