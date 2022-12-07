import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from 'reducers/authentication';

import {
  faHouse,
  faUsers,
  faClipboardList,
  faUser,
  faAnglesRight,
  faEllipsis,
  faHouseUser,
  faUserPlus,
  faCircleQuestion,
  faMoneyBill1Wave,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

import { Sidebar } from 'primereact/sidebar';
('@fortawesome/free-solid-svg-icons');
import Link from 'next/link';

const MobileMenu: NextPage = () => {
  const updateLoginDataDispatch = useDispatch();

  const router = useRouter();
  const [sidebarVisible, setSideBarVisibile] = useState<boolean>(false);
  const selectedRouteStyle = ' text-digiDefault ';
  const { user, role, estate } = useSelector(
    (state: any) => state.authentication
  );

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
        {role !== 'resident' && (
          <div
            className={`${
              router.pathname.includes('/app/residents/') &&
              router.pathname !== '/app/residents/registrations'
                ? selectedRouteStyle
                : 'text-gray-400'
            }   pt-4  w-1/4  pb-4 cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
          >
            {' '}
            <Link href='/app/residents'>
              <a className='text-center block'>
                <FontAwesomeIcon className={` mr-2  `} icon={faHouseUser} />
                <span className='block'>Residents</span>
              </a>
            </Link>
          </div>
        )}

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
        {/* <div
          className={`${
            router.pathname.includes('/app/account')
              ? selectedRouteStyle
              : 'text-gray-400'
          }   pt-4  w-1/4  pb-4 cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          {' '}
          <Link href='/app/account'>
            <a className=' block text-center '>
              <FontAwesomeIcon className={` mr-2  `} icon={faUser} />
              <span className='block'>Account</span>
            </a>
          </Link>
        </div> */}
        <div
          className={`
          }   pt-4 text-gray-400  w-1/4  pb-4 cursor-pointer transition-all duration-700 hover:bg-gray-600  hover:text-digiDefault`}
        >
          {' '}
          <button
            onClick={() => {
              setSideBarVisibile(true);
            }}
            className='text-center block w-full'
            type='button'
          >
            <FontAwesomeIcon className={` mr-2   `} icon={faEllipsis} />
            <span className='block'>More</span>
          </button>
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
      <Sidebar
        position='right'
        showCloseIcon={false}
        visible={sidebarVisible}
        onHide={() => setSideBarVisibile(false)}
      >
        <div className='h-full flex flex-col justify-between '>
          <div className='text-gray-600'>
            <h4 className='font-medium mb-6'>Extra Features</h4>
            {role !== 'resident' && (
              <>
                <Link href='/app'>
                  <a className=' block mb-2 '>
                    <FontAwesomeIcon className={` mr-4  `} icon={faUserPlus} />
                    <span className=''>Registrations</span>
                  </a>
                </Link>
                <hr className='h-0.5 mb-4 bg-gray-200' />
              </>
            )}

            <Link href='/app/account'>
              <button
                type='button'
                className='block text-start mb-2 w-full'
                onClick={() => {
                  setSideBarVisibile(false);
                  router.push('/app/account');
                }}
              >
                <FontAwesomeIcon className={` mr-4  `} icon={faUser} />
                <span className=''>Account</span>
              </button>
            </Link>
            <hr className='h-0.5 mb-4 bg-gray-200' />
            <Link href='#'>
              <a className=' block mb-2 '>
                <FontAwesomeIcon
                  className={` mr-4  `}
                  icon={faCircleQuestion}
                />
                <span className=''>Get Help</span>
              </a>
            </Link>
            <hr className='h-0.5 mb-4 bg-gray-200' />
            <Link href='#'>
              <a className=' block mb-2 '>
                <FontAwesomeIcon className={` mr-4  `} icon={faEnvelope} />
                <span className=''>Contact Us</span>
              </a>
            </Link>
            <hr className='h-0.5 mb-4 bg-gray-200' />
            <Link href='#'>
              <a className=' block mb-2 '>
                <FontAwesomeIcon
                  className={` mr-4  `}
                  icon={faMoneyBill1Wave}
                />
                <span className=''>Make Money With Us</span>
              </a>
            </Link>
          </div>

          <div className=''>
            <div className='capitalize mb-2   text-sm'>
              <p className='mb-1'>
                {user.firstName}
                <span className='capitalize ml-1'> ({role})</span>
              </p>
              <p>{estate.name}</p>
            </div>
            <button
              onClick={() => {
                updateLoginDataDispatch(logOut({}));
              }}
              className='border block w-full ml-auto mr-auto rounded-lg border-gray-400 pl-4 pr-4 pt-2 pb-2'
              type='button'
            >
              Log Out
            </button>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};
export default MobileMenu;
