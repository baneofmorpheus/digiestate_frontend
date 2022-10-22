import type { NextPage } from 'next';

import Link from 'next/link';
const SideBar: NextPage = () => {
  return (
    <div className='flex shadow-md  left-0 items-stretch fixed w-full justify-between border-b border-orange-300 pl-2 pr-2  mt-6'>
      <div className='flex items-end pb-6 pl-4 pr-4'>
        <Link href='/'>
          <a>Home</a>
        </Link>
      </div>
    </div>
  );
};
export default SideBar;
