import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from 'reducers/authentication';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  faUser,
  faUserPlus,
  faCircleQuestion,
  faMoneyBill1Wave,
  faEnvelope,
  faUserTie,
  faLink,
} from '@fortawesome/free-solid-svg-icons';

import { Sidebar } from 'primereact/sidebar';
('@fortawesome/free-solid-svg-icons');
import Link from 'next/link';

type PropType = {
  setSideBarVisibile: Function;
  sidebarVisible: boolean;
};
const ExtraSidebar: NextPage<PropType> = ({
  sidebarVisible,
  setSideBarVisibile,
}) => {
  const updateLoginDataDispatch = useDispatch();

  const router = useRouter();
  const { user, role, estate } = useSelector(
    (state: any) => state.authentication
  );

  const [copiedToClipboard, setCopiedToClipboard] = useState<boolean>(false);
  return (
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
              <button
                type='button'
                className='block text-start mb-2 w-full'
                onClick={() => {
                  setSideBarVisibile(false);
                  router.push('/app/residents/registrations');
                }}
              >
                <FontAwesomeIcon className={` mr-4  `} icon={faUserPlus} />

                <span className=''>Pending Registrations</span>
              </button>
              <hr className='h-0.5 mb-4 bg-gray-200' />
            </>
          )}
          {role === 'admin' && (
            <>
              <button
                type='button'
                className='block text-start mb-2 w-full'
                onClick={() => {
                  setSideBarVisibile(false);
                  router.push('/app/admins/new');
                }}
              >
                <FontAwesomeIcon className={` mr-4  `} icon={faUserTie} />

                <span className=''>Register Admin</span>
              </button>
              <hr className='h-0.5 mb-4 bg-gray-200' />
            </>
          )}

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
          <hr className='h-0.5 mb-4 bg-gray-200' />
          <Link href='#'>
            <a className=' block mb-2 '>
              <FontAwesomeIcon className={` mr-4  `} icon={faCircleQuestion} />
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
              <FontAwesomeIcon className={` mr-4  `} icon={faMoneyBill1Wave} />
              <span className=''>Make Money With Us</span>
            </a>
          </Link>
          <hr className='h-0.5 mb-4 bg-gray-200' />

          <button type='button' className='block text-start mb-2 w-full'>
            <FontAwesomeIcon className={` mr-4  `} icon={faLink} />
            <CopyToClipboard
              text={`${window.location.origin}/resident/register?estateCode=${estate.code}`}
              onCopy={() => {
                setCopiedToClipboard(true);

                setTimeout(() => {
                  setCopiedToClipboard(false);
                }, 3300);
              }}
            >
              <button>Copy Registration Link</button>
            </CopyToClipboard>

            {!!copiedToClipboard && (
              <span className='ml-2 text-xs bg-gray-600 text-digiDefault pl-2 pr-2 pt-1 pb-1 rounded-lg'>
                Copied
              </span>
            )}
          </button>
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
  );
};
export default ExtraSidebar;
