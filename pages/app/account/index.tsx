import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { updateLoginData } from 'reducers/authentication';

import { useSelector, useDispatch } from 'react-redux';

const Account = () => {
  const router = useRouter();
  const role = useSelector((state: any) => state.authentication.role);
  const updateLoginDataDispatch = useDispatch();

  return (
    <div className='pt-10 md:pl-2 md:pr-2 pl-4 pr-4'>
      <div>
        <div className='flex items-center gap-x-4 mb-4'>
          <div>
            <Image
              alt=''
              className='rounded-full  inline-block'
              src='https://picsum.photos/id/237/200/300
'
              height={60}
              width={60}
            />
          </div>
          <div>
            <p>Leon Chux</p>
          </div>
        </div>
        <div className='text-sm mb-4'>
          <h4 className='text-gray-600 mb-4 '>ACCOUNT</h4>

          <div>
            <Link href='/app'>
              <a className='flex justify-between w-full pt-2 pb-2 '>
                <span className='block'>Change Password</span>
                <FontAwesomeIcon className={` mr-2  `} icon={faChevronRight} />
              </a>
            </Link>
          </div>
        </div>
        <div className='text-sm'>
          <h4 className='text-gray-600 mb-4'>ABOUT DIGIESTATE</h4>

          <div>
            <div className='mb-4'>
              <Link href='/app'>
                <a className=' flex justify-between  w-full pt-2 pb-2 '>
                  <span className='block'>Terms and Conditions</span>
                  <FontAwesomeIcon
                    className={` mr-2  `}
                    icon={faChevronRight}
                  />
                </a>
              </Link>
              <hr className='bg-gray-200 block w-full h-0.5' />
            </div>
            <div className='mb-4'>
              <Link href='/app'>
                <a className=' flex justify-between w-full  pt-2 pb-2'>
                  <span className='block'>Privacy Policy</span>
                  <FontAwesomeIcon
                    className={` mr-2  `}
                    icon={faChevronRight}
                  />
                </a>
              </Link>
              <hr className='bg-gray-200 block w-full h-0.5' />
            </div>
            <div className='mb-4'>
              <Link href='/app'>
                <a className=' flex justify-between w-full pt-2 pb-2  '>
                  <span className='block'>FAQS</span>
                  <FontAwesomeIcon
                    className={` mr-2  `}
                    icon={faChevronRight}
                  />
                </a>
              </Link>
              <hr className='bg-gray-200 block w-full h-0.5' />
            </div>
            <div className='mb-4'>
              <Link href='/app'>
                <a className=' flex justify-between w-full pt-2 pb-2 '>
                  <span className='block'>Contact Us</span>
                  <FontAwesomeIcon
                    className={` mr-2  `}
                    icon={faChevronRight}
                  />
                </a>
              </Link>
              <hr className='bg-gray-200 block w-full h-0.5' />
            </div>
          </div>
        </div>
        <button
          className='flex justify-between text-red-600 w-full '
          type='button'
          onClick={() => {
            updateLoginDataDispatch(
              updateLoginData({
                deviceToken: null,
                userId: null,
                loginToken: null,
                role: null,
                estate: null,
                firstName: null,
              })
            );
          }}
        >
          <span className='block'>Logout</span>
          <FontAwesomeIcon className={` mr-2  `} icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
};

Account.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default Account;
