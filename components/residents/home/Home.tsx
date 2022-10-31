import type { NextPage } from 'next';
import Link from 'next/link';
import styles from '../../styles/authentication/ChoosePlan.module.css';

const ResidentHome: NextPage = () => {
  return (
    <div className=''>
      <h5 className='mb-2'> Recent Bookings</h5>
      <div className='recent-bookings'>
        <div className='flex mb-2 items-center bg-gray-600 text-white pl-2 pr-2 pt-4 pb-4 rounded-sm'>
          <div className='bg-digiDefault rounded-full p-2 text-black mr-4'>
            <p>741</p>
          </div>

          <div className='text-sm flex justify-between w-full items-center'>
            <div>
              <p>Abbey</p>
              <p>08101209762</p>
              <p>23-Oct-2022 02:00:PM</p>
            </div>
            <div>Timed Out</div>
          </div>
        </div>
        <div className='flex mb-2 items-center bg-gray-600 text-white pl-2 pr-2 pt-4 pb-4 rounded-sm'>
          <div className='bg-digiDefault rounded-full p-2 text-black mr-4'>
            <p>741</p>
          </div>

          <div className='text-sm flex justify-between w-full items-center'>
            <div>
              <p>Abbey</p>
              <p>08101209762</p>
              <p>23-Oct-2022 02:00:PM</p>
            </div>
            <div>Timed Out</div>
          </div>
        </div>
        <div className='flex mb-2 items-center bg-gray-600 text-white pl-2 pr-2 pt-4 pb-4 rounded-sm'>
          <div className='bg-digiDefault rounded-full p-2 text-black mr-4'>
            <p>741</p>
          </div>

          <div className='text-sm flex justify-between w-full items-center'>
            <div>
              <p>Abbey</p>
              <p>08101209762</p>
              <p>23-Oct-2022 02:00:PM</p>
            </div>
            <div>Timed Out</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ResidentHome;
