import Sidebar from 'components/navigation/sidebar/SideBar';
import Display from 'components/navigation/display/Display';
import Unauthenticated from 'components/utility/unauthenticated/Unauthenticated';
import ToastWrapper from 'components/utility/toast_wrapper/ToastWrapper';
import { useSelector } from 'react-redux';
import Unauthorized from 'components/utility/unauthorized/Unauthorized';
import MobileMenu from 'components/navigation/mobile_menu/MobileMenu';
import type { NextPage } from 'next';

type Props = {
  children: any;
  allowedRoles?: Array<string>;
};

const Authenticated: NextPage<Props> = ({ children, allowedRoles }) => {
  const authentication = useSelector((state: any) => state.authentication);

  const { loginToken, role } = authentication;

  if (!loginToken) {
    return (
      <div>
        <Unauthenticated />
      </div>
    );
  }
  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    (!role || !allowedRoles.includes(role))
  ) {
    return (
      <div>
        <Unauthorized />
      </div>
    );
  }

  return (
    <div className='container mx-auto relative'>
      <Sidebar />
      <main className='lg:w-2/4 ml-auto mr-auto pb-20'>{children}</main>
      <ToastWrapper />
      <Display />
      <MobileMenu />
    </div>
  );
};
export default Authenticated;
