import Header from 'components/navigation/header/Header';
import type { NextPage } from 'next';
import ToastWrapper from 'components/utility/toast_wrapper/ToastWrapper';
import Head from 'next/head';

type Props = {
  children: any;
};

const UnAuthenticated: NextPage<Props> = ({ children }) => {
  return (
    <div id='unautenticated' className=' bg-digiDefault min-h-screen'>
      <div className='container mx-auto'>
        <Head>
          <title>DigiEstate Security App - Unauthenticated</title>
        </Head>

        <Header />
        <main className='pt-20'>{children}</main>
        <ToastWrapper />
      </div>
    </div>
  );
};
export default UnAuthenticated;
