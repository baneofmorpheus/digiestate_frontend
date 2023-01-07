import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

import {
  faHouse,
  faUsers,
  faClipboardList,
  faUserPlus,
  faUser,
  faAnglesRight,
  faHouseUser,
} from '@fortawesome/free-solid-svg-icons';
import ExtraSidebar from '../extra_sidebar/ExtraSidebar';

import Link from 'next/link';
const SideBar: NextPage = () => {
  const router = useRouter();
  const { role, estate } = useSelector((state: any) => state.authentication);
  const [sidebarVisible, setSideBarVisibile] = useState<boolean>(false);

  const selectedRouteStyle =
    'bg-gray-600 border-r-4 border-black text-digiDefault';

  return (
    <div className='sidebar-container lg:flex-col justify-between hidden lg:flex lg:justify-between bg-digiDefault fixed left-0 min-h-screen w-1/4 '>
      <div className='text-black  text-right  pt-6 '>
        <h4 className='text-xl bold mb-4 pr-10'>DigiEstate</h4>

        <div className='w-2/3 xl:w-1/2  ml-auto '>
          <Link href='/app'>
            <a
              className={`${
                router.pathname === '/app' ? selectedRouteStyle : ''
              } mb-4 pt-2 block pr-10  pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
            >
              {' '}
              <FontAwesomeIcon className={` mr-2  `} icon={faHouse} /> Home
            </a>
          </Link>

          {role !== 'resident' && (
            <>
              <Link href='/app/residents/registrations'>
                <a
                  className={`${
                    router.pathname.includes('/app/residents/registrations')
                      ? selectedRouteStyle
                      : ''
                  } mb-4 pr-10 block pt-2 pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
                >
                  <FontAwesomeIcon className={` mr-2  `} icon={faUserPlus} />
                  Registrations
                </a>
              </Link>
              <Link href='/app/residents/'>
                <a
                  className={`${
                    router.pathname.includes('/app/residents/') &&
                    router.pathname !== '/app/residents/registrations'
                      ? selectedRouteStyle
                      : ''
                  } mb-4 pr-10 block pt-2 pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
                >
                  <FontAwesomeIcon className={` mr-2  `} icon={faHouseUser} />
                  Residents
                </a>
              </Link>
            </>
          )}

          <Link href='/app/dependents'>
            <a
              className={`${
                router.pathname.includes('/app/dependents')
                  ? selectedRouteStyle
                  : ''
              } mb-4 pr-10 block pt-2 pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
            >
              <FontAwesomeIcon className={` mr-2  `} icon={faUsers} />
              Dependents
            </a>
          </Link>
          <Link href='/app/bookings'>
            <a
              className={`${
                router.pathname.includes('/app/bookings')
                  ? selectedRouteStyle
                  : ''
              } mb-4 pr-10 pt-2 block pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
            >
              <FontAwesomeIcon className={` mr-2  `} icon={faClipboardList} />
              Bookings
            </a>
          </Link>

          <button
            className={` mb-4 pr-10 w-full pt-2 block text-right pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
            onClick={() => {
              setSideBarVisibile(true);
            }}
          >
            <FontAwesomeIcon className={` mr-2   `} icon={faAnglesRight} />
            <span className=''>More</span>
          </button>
        </div>
      </div>
      <div className='w-full bg-gray-600 mt-auto text-digiDefault pt-2 pb-2 pr-10 text-right ml-auto '>
        <p className='capitalize mb-1'>Estate: {estate.name}</p>
        <p className='capitalize'>Role: {role}</p>
      </div>
      <ExtraSidebar
        sidebarVisible={sidebarVisible}
        setSideBarVisibile={setSideBarVisibile}
      />
      <style jsx>{`
        .sidebar-container {
          border-right: 1px solid rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};
export default SideBar;
