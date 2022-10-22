import Header from 'components/navigation/header/Header';
import type { NextPage } from 'next';

type Props = {
  children: any;
};

const UnAuthenticated: NextPage<Props> = ({ children }) => {
  return (
    <div className='bg-digiDefault'>
      <div className='container mx-auto'>
        <Header />
        <main className='pt-20'>{children}</main>
      </div>
    </div>
  );
};
export default UnAuthenticated;
