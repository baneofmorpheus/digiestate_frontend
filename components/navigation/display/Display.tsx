import type { NextPage } from 'next';

import Link from 'next/link';
const Display: NextPage = () => {
  return (
    <div className='display-container hidden lg:block bg-digiDefault z-90 fixed right-0 top-0 w-1/4  min-h-screen border-l border-black'>
      <div className='text-black'>
        <div className='pl-2 pr-2 pt-4 pb-4   bg-gray-600 text-white '>
          <p className='mb-2 text-digiDefault'>Announcements.</p>

          <p>There are no announcements at this time</p>
        </div>
      </div>
      <style jsx>{`
        .display-container {
          border-left: 1px solid rgba(0, 0, 0, 0.1);
        }
        .gradient-bg {
          background-image: radial-gradient(
            circle,
            #ffffff,
            #b9b9b9,
            #777777,
            #3b3b3b,
            #000000
          );
        }
      `}</style>
    </div>
  );
};
export default Display;
