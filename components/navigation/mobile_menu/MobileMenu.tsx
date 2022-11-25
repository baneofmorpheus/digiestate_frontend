import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUsers,
  faClipboardList,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
const MobileMenu: NextPage = () => {
  const router = useRouter();
  const selectedRouteStyle = ' text-digiDefault ';

  return (
    <div className='bg-gray-600 lg:hidden fixed bottom-0 left-0  w-screen ml-auto mr-auto'>
      <div className=' xl:w-1/2 items-stretch   flex justify-between text-xs ml-auto mr-auto '>
        <div
          className={`${
            router.pathname == '/app' ? selectedRouteStyle : 'text-gray-400'
          }     pt-4  w-1/4  text-center pb-4 cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          <Link href='/app'>
            <a className=' block text-center'>
              <FontAwesomeIcon className={` mr-2  `} icon={faHouse} />
              <span className='block'>Home</span>
            </a>
          </Link>
        </div>
        <div
          className={`${
            router.pathname.includes('/app/dependents')
              ? selectedRouteStyle
              : 'text-gray-400'
          }   pt-4  w-1/4  pb-4 cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          {' '}
          <Link href='/app/dependents'>
            <a className='text-center block'>
              <FontAwesomeIcon className={` mr-2  `} icon={faUsers} />
              <span className='block'>Dependents</span>
            </a>
          </Link>
        </div>
        <div
          className={`${
            router.pathname.includes('/app/bookings')
              ? selectedRouteStyle
              : 'text-gray-400'
          }   pt-4  w-1/4  pb-4 cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          <Link href='/app/bookings'>
            <a className=' block text-center'>
              <FontAwesomeIcon className={` mr-2  `} icon={faClipboardList} />
              <span className='block'>Bookings</span>
            </a>
          </Link>
        </div>
        {/* <div
          className={`${
            router.pathname == '/app/emergency'
              ? selectedRouteStyle
              : 'text-gray-400'
          }   pt-4  w-1/4  pb-4 cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          {' '}
          <Link href='#'>
            <a className=' block text-center'>
              <FontAwesomeIcon className={` mr-2  `} icon={faTruckMedical} />
              <span className='block '>Emergency</span>
            </a>
          </Link>
        </div> */}
        <div
          className={`${
            router.pathname == '/app/account'
              ? selectedRouteStyle
              : 'text-gray-400'
          }   pt-4  w-1/4  pb-4 cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          {' '}
          <Link href='#'>
            <a className=' block text-center '>
              <FontAwesomeIcon className={` mr-2  `} icon={faUser} />
              <span className='block'>Account</span>
            </a>
          </Link>
        </div>
        {/* <div
          className={`${
            router.pathname == '/app/profile'
              ? selectedRouteStyle
              : 'text-gray-400'
          }   pt-4  w-1/4  pb-4 cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          <button
            className='block text-center w-full'
            onClick={() => {
              updateLoginDataDispatch(
                updateLoginData({
                  deviceToken: null,
                  userId: null,
                  loginToken: null,
                  role: null,
                  estate: null,
                })
              );
            }}
          >
            <FontAwesomeIcon className={` mr-2  `} icon={faRightFromBracket} />
            <span className='block'>Logout</span>
          </button>
        </div> */}
      </div>
    </div>
  );
};
export default MobileMenu;
