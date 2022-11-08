import type { NextPage } from 'next';
import Image from 'next/image';
import scarecrowImage from 'images/scarecrow.png';
import Link from 'next/link';

const Unauthorized: NextPage = () => {
  return (
    <div className='!min-h-screen flex lg:flex-row flex-col lg:justify-between justify-center'>
      <div className='w-full lg:w-3/5 xl:w-2/5 flex-col flex justify-center md:items-center '>
        <div className='pl-2 pr-2'>
          <h2 className='text-4xl mb-2'>Unauthorized Access</h2>
          <p className='mb-4'>
            Looks like you do not have permission to view that page
          </p>
          <div className='flex gap-x-2 md:gap-x-4'>
            <Link href='/app'>
              <a className='bg-gray-600 hover:bg-black text-white pl-4 pr-4 rounded-lg pb-1 pt-1'>
                Go Back
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
export default Unauthorized;
