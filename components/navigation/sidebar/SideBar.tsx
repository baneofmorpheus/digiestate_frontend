import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from 'reducers/authentication';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse,
  faUsers,
  faClipboardList,
  faTruckMedical,
  faUser,
  faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';

import Link from 'next/link';
const SideBar: NextPage = () => {
  const router = useRouter();
  const updateLoginDataDispatch = useDispatch();

  const selectedRouteStyle =
    'bg-gray-600 border-r-4 border-black text-digiDefault';

  return (
    <div className='sidebar-container hidden lg:block bg-digiDefault fixed left-0 min-h-screen w-1/4 '>
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
          {/* <div
            className={`${
              router.pathname == '/app/emergency' ? selectedRouteStyle : ''
            } mb-4 pr-10 pt-2 pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
          >
            {' '}
            <Link href='#'>
              <a className=' block'>
                <FontAwesomeIcon className={` mr-2  `} icon={faTruckMedical} />
                Emergency
              </a>
            </Link>
          </div> */}
          <Link href='/app/account'>
            <a
              className={`${
                router.pathname.includes('/app/account')
                  ? selectedRouteStyle
                  : ''
              } mb-4 pr-10 block pt-2 pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
            >
              <FontAwesomeIcon className={` mr-2  `} icon={faUser} />
              Account
            </a>
          </Link>
          <button
            className={` mb-4 pr-10 w-full pt-2 block text-right pb-2 cursor-pointer transition-all duration-700 hover:bg-gray-600 hover:border-r-4 hover:border-black hover:text-digiDefault`}
            onClick={() => {
              updateLoginDataDispatch(logOut({}));
            }}
          >
            <FontAwesomeIcon className={` mr-2  `} icon={faRightFromBracket} />
            Logout
          </button>
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
