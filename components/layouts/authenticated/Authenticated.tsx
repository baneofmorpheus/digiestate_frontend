import Sidebar from 'components/navigation/sidebar/SideBar';
import Display from 'components/navigation/display/Display';
import Unauthorized from 'components/utility/unauthorized/Unauthorized';
import ToastWrapper from 'components/utility/toast_wrapper/ToastWrapper';
import { useSelector } from 'react-redux';

import type { NextPage } from 'next';

type Props = {
  children: any;
};

const Authenticated: NextPage<Props> = ({ children }) => {
  const loginToken = useSelector(
    (state: any) => state.authentication.loginToken
  );

  if (!loginToken) {
    return (
      <div>
        <Unauthorized />
      </div>
    );
  }

  return (
    <div className='container mx-auto relative'>
      <Sidebar />
      <main className='lg:w-2/4 ml-auto mr-auto'>{children}</main>
      <ToastWrapper />
      <Display />
    </div>
  );
};
export default Authenticated;
