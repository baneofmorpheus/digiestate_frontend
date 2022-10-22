import type { NextPage } from 'next';
import Link from 'next/link';
import styles from '../../styles/authentication/ChoosePlan.module.css';

const Header: NextPage = () => {
  return (
    <div
      id='digi-header'
      className=' flex shadow-md fixed top-0 left-0 items-stretch  w-full justify-between border-b border-orange-300 pl-2 pr-2 '
    >
      <div className='flex w-full text-sm text-black items-center justify-between  pt-4 pb-4 pl-32 pr-32'>
        <div>
          <Link href='/'>
            <a className='mr-6'>Home</a>
          </Link>
          <Link href='/'>
            <a className='mr-6'>Contact</a>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Header;
