import Sidebar from 'components/navigation/sidebar/SideBar';
import Display from 'components/navigation/display/Display';
import ToastWrapper from 'components/utility/toast_wrapper/ToastWrapper';

import type { NextPage } from 'next';

type Props = {
  children: any;
};

const Authenticated: NextPage<Props> = ({ children }) => {
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
