import type { NextPage } from 'next';
import UnauthenticatedLayout from 'components/layouts/unauthenticated/Unauthenticated';

import Link from 'next/link';
import { useRef } from 'react';
import { Toast as ToastType } from 'primereact/toast';
import { Toast } from 'primereact/toast';
import Lottie from 'lottie-react';
import houseLottie from 'lottie/house.json';
const Home = () => {
  const toast = useRef<ToastType>(null);
  return (
    <div className=' pl-2 lg:container min-h-screen pr-2 pb-10  lg:-mt-20 lg:flex-row gap-y-20 lg:gap-y-0 flex flex-col justify-between items-center '>
      <div className=' lg:w-1/2'>
        <div>
          <p className='text-gray-600'>Welcome to</p>

          <h2 className='text-4xl mb-2'>DigiEstate!!</h2>
          <h2 className='text-4xl mb-2'>Estate Security Management App</h2>
          <p className='mb-8 text-gray-600'>
            Estate platforms available for you to login as the following users:{' '}
          </p>

          <div className='flex text-center  justify-between md:justify-start gap-x-2 md:gap-x-4  text-sm  '>
            <div className='border w-1/2 transition-all duration-700 md:w-auto hover:bg-gray-600 hover:text-digiDefault cursor-pointer hover:border-gray-600  app-btn border-black rounded-lg pt-2 mr-2 pb-2 '>
              <Link href='/resident'>
                <a className='pl-2 pr-2'>As Resident</a>
              </Link>
            </div>
            <div className='border w-1/2 pl-2 pr-2 transition-all duration-700 md:w-auto hover:bg-gray-600 hover:text-digiDefault cursor-pointer hover:border-gray-600 border-black rounded-lg pt-2 mr-2 pb-2 '>
              <Link href='/security'>
                <a className='pl-2 pr-2'>As Security</a>
              </Link>
            </div>
            <div className='border w-1/2 pl-2 pr-2 transition-all duration-700 md:w-auto hover:bg-gray-600 hover:text-digiDefault cursor-pointer hover:border-gray-600 border-black rounded-lg pt-2  pb-2 '>
              <Link href='/admin'>
                <a>As Admin</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className='lg:w-1/2 '>
        <div
          id='lottie-container'
          className=' rounded-full p-8 overflow-hidden shadow-2xl '
        >
          <Lottie animationData={houseLottie} loop={true} />
        </div>
      </div>
      <Toast ref={toast}></Toast>
      <style jsx>
        {`
          #lottie-container {
            background-color: #f2f2f0;
          }
        `}
      </style>
    </div>
  );
};

Home.getLayout = function getLayout(page: NextPage) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default Home;
