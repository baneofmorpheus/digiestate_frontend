import type { NextPage } from 'next';
import UnauthenticatedLayout from 'components/layouts/unauthenticated/Unauthenticated';
import Image from 'next/image';
import giraffeImage from 'images/home-girrafe.png';

const Home = () => {
  return (
    <div className='min-h-screen -mt-20  flex justify-between items-center '>
      <div>
        <div>
          <h2 className='text-4xl mb-2'>Estate Security Management</h2>
          <p className='mb-4'>At your fingertips</p>
          <p className='mb-8'>
            Estate platforms available for the following users:{' '}
          </p>

          <div className='flex justify-between text-sm  '>
            <div className='border hover:bg-white cursor-pointer hover:text-black hover:border-black  app-btn border-black rounded-lg pt-2 mr-2 pb-2 pl-2 pr-2'>
              <p>View the Resident App</p>
            </div>
            <div className='border hover:bg-white cursor-pointer hover:text-black hover:border-black border-black rounded-lg pt-2 mr-2 pb-2 pl-2 pr-2'>
              <p>View the Security App</p>
            </div>
            <div className='border hover:bg-white cursor-pointer hover:text-black hover:border-black border-black rounded-lg pt-2  pb-2 pl-2 pr-2'>
              <p>View the Admin App</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Image
          alt=''
          className=''
          width={600}
          height={700}
          src={giraffeImage}
        />
      </div>
    </div>
  );
};

Home.getLayout = function getLayout(page: NextPage) {
  return <UnauthenticatedLayout>{page}</UnauthenticatedLayout>;
};

export default Home;
