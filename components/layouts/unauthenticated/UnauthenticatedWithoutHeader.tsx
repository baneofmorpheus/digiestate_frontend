import Header from 'components/navigation/header/Header';
import type { NextPage } from 'next';

type Props = {
  children: any;
};

const UnAuthenticated: NextPage<Props> = ({ children }) => {
  return (
    <div id='unautenticated' className=' bg-digiDefault min-h-screen'>
      <div className='container mx-auto'>
        <main className=''>{children}</main>
      </div>
    </div>
  );
};
export default UnAuthenticated;
