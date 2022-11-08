import type { NextPage } from 'next';
import Image from 'next/image';
import scarecrowImage from 'images/scarecrow.png';
import Link from 'next/link';

const Unauthenticated: NextPage = () => {
  return (
    <div className='!min-h-screen flex lg:flex-row flex-col lg:justify-between justify-center'>
      <div className='w-full lg:w-3/5 xl:w-2/5 flex-col flex justify-center md:items-center '>
        <div className='pl-2 pr-2'>
          <h2 className='text-4xl mb-2'>Unauthenticated Access</h2>
          <p>Looks like your login session has expired.</p>
          <p className='mb-4'>
            Login as your preferred user below and try again.
          </p>
          <div className='flex gap-x-2 md:gap-x-4'>
            <Link href='/resident'>
              <a className='bg-gray-600 hover:bg-black text-white pl-4 pr-4 rounded-lg pb-1 pt-1'>
                Resident
              </a>
            </Link>
            <Link href='#'>
              <a className='bg-gray-600 hover:bg-black text-white pl-4 pr-4 rounded-lg pb-1 pt-1'>
                Security
              </a>
            </Link>
            <Link href='#'>
              <a className='bg-gray-600 hover:bg-black text-white pl-4 pr-4 rounded-lg pb-1 pt-1'>
                Admin
              </a>
            </Link>
            <Link href='#'>
              <a className='bg-gray-600 hover:bg-black text-white pl-4 pr-4 rounded-lg pb-1 pt-1'>
                SuperAdmin
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className='w-full lg:w-3/5  flex items-center flex-col justify-center'>
        <Image alt='' className='w-full h-auto  ' src={scarecrowImage} />
      </div>
    </div>
  );
};
export default Unauthenticated;