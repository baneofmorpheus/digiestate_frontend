import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUsers,
  faClipboardList,
  faTruckMedical,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
const SideBar: NextPage = () => {
  const router = useRouter();

  const selectedRouteStyle =
    'bg-gray-600 border-r-4 border-black text-digiDefault';
  useEffect(() => {
    console.log(router.pathname);
  }, [router]);
  return (
    <div className='sidebar-container hidden lg:block bg-digiDefault fixed left-0 min-h-screen w-1/4 '>
      <div className='text-black  text-right  pt-6 '>
        <h4 className='text-xl bold mb-4 pr-10'>DigiEstate</h4>

        <div className='w-2/3 xl:w-1/2  ml-auto '>
          <div
            className={`${
              router.pathname == '/app' ? selectedRouteStyle : ''
            } mb-4 pr-10 pt-2 pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
          >
            <Link href='/'>
              <a>
                {' '}
                <FontAwesomeIcon className={` mr-2  `} icon={faHouse} /> Home
              </a>
            </Link>
          </div>
          <div
            className={`${
              router.pathname.includes('/app/dependents')
                ? selectedRouteStyle
                : ''
            } mb-4 pr-10 pt-2 pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
          >
            {' '}
            <Link href='/'>
              <a>
                <FontAwesomeIcon className={` mr-2  `} icon={faUsers} />
                Dependents
              </a>
            </Link>
          </div>
          <div
            className={`${
              router.pathname.includes('/app/bookings')
                ? selectedRouteStyle
                : ''
            } mb-4 pr-10 pt-2 pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
          >
            <Link href='/'>
              <a>
                <FontAwesomeIcon className={` mr-2  `} icon={faClipboardList} />
                Bookings
              </a>
            </Link>
          </div>
          <div
            className={`${
              router.pathname == '/app/emergency' ? selectedRouteStyle : ''
            } mb-4 pr-10 pt-2 pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
          >
            {' '}
            <Link href='/'>
              <a>
                <FontAwesomeIcon className={` mr-2  `} icon={faTruckMedical} />
                Emergency
              </a>
            </Link>
          </div>
          <div
            className={`${
              router.pathname == '/app/profile' ? selectedRouteStyle : ''
            } mb-4 pr-10 pt-2 pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
          >
            {' '}
            <Link href='/'>
              <a>
                <FontAwesomeIcon className={` mr-2  `} icon={faUser} />
                Profile
              </a>
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .sidebar-container {
          border-right: 1px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};
export default SideBar;
