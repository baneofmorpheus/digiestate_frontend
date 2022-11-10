import type { NextPage } from 'next';
import UnauthenticatedLayout from 'components/layouts/unauthenticated/Unauthenticated';
import Image from 'next/image';
import giraffeImage from 'images/home-girrafe.png';
import Link from 'next/link';
import { useRef } from 'react';
import { Toast as ToastType } from 'primereact/toast';
import { Toast } from 'primereact/toast';

const Home = () => {
  const toast = useRef<ToastType>(null);
  return (
    <div className=' pl-2 pr-2  lg:-mt-20 lg:flex-row flex flex-col justify-between items-center '>
      <div>
        <div>
          <h2 className='text-4xl mb-2'>DigiEstate!!</h2>
          <h2 className='text-4xl mb-2'>Estate Security Management</h2>
          <p className='mb-4'>At your fingertips.</p>
          <p className='mb-8'>
            Estate platforms available for you to login as the following users:{' '}
          </p>

          <div className='flex text-center  justify-between md:justify-start gap-x-2 md:gap-x-4  text-sm  '>
            <div className='border w-1/2 md:w-auto hover:bg-gray-600 hover:text-digiDefault cursor-pointer hover:border-black  app-btn border-black rounded-lg pt-2 mr-2 pb-2 pl-2 pr-2'>
              <Link href='/resident'>
                <a className=''>As Resident</a>
              </Link>
            </div>
            <div className='border w-1/2 md:w-auto hover:bg-gray-600 hover:text-digiDefault cursor-pointer hover:border-black border-black rounded-lg pt-2 mr-2 pb-2 pl-2 pr-2'>
              <p>As Security</p>
            </div>
            <div className='border w-1/2 md:w-auto hover:bg-gray-600 hover:text-digiDefault cursor-pointer hover:border-black border-black rounded-lg pt-2  pb-2 pl-2 pr-2'>
              <p>As Admin</p>
            </div>
          </div>
        </div>
      </div>
      <div className='text-right'>
        <Image
          alt=''
          className=''
          width={600}
          height={700}
          src={giraffeImage}
        />
      </div>
      <Toast ref={toast}></Toast>
    </div>
  );
};

Home.getLayout = function getLayout(page: NextPage) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default Home;
