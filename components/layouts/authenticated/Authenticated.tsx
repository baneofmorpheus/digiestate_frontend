import Header from 'components/navigation/header/Header';

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
    <div className='container mx-auto'>
      <Header />
      <main>{children}</main>
    </div>
  );
};
export default Authenticated;
