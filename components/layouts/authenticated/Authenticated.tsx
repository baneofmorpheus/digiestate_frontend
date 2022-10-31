import Sidebar from 'components/navigation/sidebar/SideBar';
import Display from 'components/navigation/display/Display';

import type { NextPage } from 'next';

type Props = {
  children: any;
};

const Authenticated: NextPage<Props> = ({ children }) => {
  // const authToken = useSelector((state: any) => state.authentication.token);

  // if (!authToken) {
  //   return <Unauthorized />;
  // }

  return (
    <div className='container mx-auto relative'>
      <Sidebar />
      <main className='lg:w-2/4 ml-auto mr-auto'>{children}</main>
      <Display />
    </div>
  );
};
export default Authenticated;
