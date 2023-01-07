import type { NextPage } from 'next';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';

import PreviousPage from 'components/navigation/previous_page/PreviousPage';

import { useSelector, useDispatch } from 'react-redux';

const Account = () => {
  const { user, role, estate } = useSelector(
    (state: any) => state.authentication
  );

  console.log(user);

  const updateLoginDataDispatch = useDispatch();

  return (
    <div className='pt-10 md:pl-2 md:pr-2 pl-4 pr-4'>
      <div>
        <PreviousPage label='Account Settings' />

        <div className='flex items-center gap-x-4 mb-6'>
          {role == 'resident' && (
            <div>
              <Image
                alt=''
                className='rounded-full  inline-block'
                src={user.profileImageLink}
                height={60}
                width={60}
              />
            </div>
          )}

          <div className='capitalize text-gray-600 text-sm'>
            <p className='mb-1'>
              {user.firstName} {user.lastName}{' '}
              <span className=' block'> ({role})</span>
            </p>
            <p>{estate.name}</p>
          </div>
        </div>
        <div className='text-sm mb-4'>
          <h4 className='text-gray-600 mb-4 '>ACCOUNT</h4>

          <div>
            <Link href='/app/account/change-password'>
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
              <Link href='#'>
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
              <Link href='#'>
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
              <Link href='#'>
                <a className=' flex justify-between w-full pt-2 pb-2  '>
                  <span className='block'>FAQS</span>
                  <FontAwesomeIcon
                    className={` mr-2  `}
                    icon={faChevronRight}
                  />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Account.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default Account;
