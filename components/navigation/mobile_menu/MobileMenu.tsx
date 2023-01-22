import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ExtraSidebar from '../extra_sidebar/ExtraSidebar';
import {
  faHouse,
  faUsers,
  faClipboardList,
  faAnglesRight,
  faHouseUser,
  faLock,
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';

const MobileMenu: NextPage = () => {
  const router = useRouter();
  const [sidebarVisible, setSideBarVisibile] = useState<boolean>(false);
  const selectedRouteStyle = ' text-digiDefault ';
  const { role } = useSelector((state: any) => state.authentication);

  return (
    <div className='bg-gray-600 lg:hidden fixed bottom-0 left-0  w-screen ml-auto mr-auto'>
      <div className=' xl:w-1/2 items-stretch   flex justify-between text-xs ml-auto mr-auto '>
        <div
          className={`${
            router.pathname == '/app' ? selectedRouteStyle : 'text-gray-400'
          }       w-1/4  text-center  cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          <Link href='/app'>
            <a className=' block text-center pt-4 pb-4'>
              <FontAwesomeIcon className={` mr-2  `} icon={faHouse} />
              <span className='block'>Home</span>
            </a>
          </Link>
        </div>
        <div
          className={`${
            router.pathname.includes('/app/bookings')
              ? selectedRouteStyle
              : 'text-gray-400'
          }    w-1/4   cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          <Link href='/app/bookings'>
            <a className=' block text-center pt-4 pb-4'>
              <FontAwesomeIcon className={` mr-2  `} icon={faClipboardList} />
              <span className='block'>Bookings</span>
            </a>
          </Link>
        </div>
        {role !== 'resident' && (
          <div
            className={`${
              router.pathname.includes('/app/residents') &&
              router.pathname !== '/app/residents/registrations'
                ? selectedRouteStyle
                : 'text-gray-400'
            }     w-1/4  cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
          >
            {' '}
            <Link href='/app/residents'>
              <a className='text-center block pt-4 pb-4'>
                <FontAwesomeIcon className={` mr-2  `} icon={faHouseUser} />
                <span className='block'>Residents</span>
              </a>
            </Link>
          </div>
        )}

        {!['admin'].includes(role) && (
          <div
            className={`${
              router.pathname.includes('/app/dependents')
                ? selectedRouteStyle
                : 'text-gray-400'
            }    w-1/4   cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
          >
            {' '}
            <Link href='/app/dependents'>
              <a className='text-center block pt-4 pb-4'>
                <FontAwesomeIcon className={` mr-2  `} icon={faUsers} />
                <span className='block'>Dependents</span>
              </a>
            </Link>
          </div>
        )}
        {['admin'].includes(role) && (
          <div
            className={`${
              router.pathname.includes('/app/security')
                ? selectedRouteStyle
                : 'text-gray-400'
            }    w-1/4   cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
          >
            {' '}
            <Link href='/app/security'>
              <a className='text-center block pt-4 pb-4'>
                <FontAwesomeIcon className={` mr-2  `} icon={faLock} />
                <span className='block'>Security</span>
              </a>
            </Link>
          </div>
        )}

        <div
          className={`
          }   text-gray-400  w-1/4  cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          {' '}
          <button
            onClick={() => {
              setSideBarVisibile(true);
            }}
            className='text-center pt-4  pb-4 block w-full'
            type='button'
          >
            <FontAwesomeIcon className={` mr-2   `} icon={faAnglesRight} />
            <span className='block'>More</span>
          </button>
        </div>
      </div>
      <ExtraSidebar
        sidebarVisible={sidebarVisible}
        setSideBarVisibile={setSideBarVisibile}
      />
    </div>
  );
};
export default MobileMenu;
