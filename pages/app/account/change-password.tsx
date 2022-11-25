import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState, useRef, useEffect } from 'react';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import Link from 'next/link';

import { useSelector, useDispatch } from 'react-redux';

const ChangePassword = () => {
  const router = useRouter();
  const role = useSelector((state: any) => state.authentication.role);
  const updateLoginDataDispatch = useDispatch();

  return (
    <div className='pt-10 md:pl-2 md:pr-2 pl-4 pr-4'>
      <h4 className=''>Change Password</h4>
    </div>
  );
};

ChangePassword.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default ChangePassword;
