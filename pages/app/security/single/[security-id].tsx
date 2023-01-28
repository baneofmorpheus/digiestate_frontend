import type { NextPage } from 'next';
import AuthenticatedLayout from 'components/layouts/authenticated/Authenticated';
import SingleSecurity from 'components/reusable/security/SingleSecurity';

const SingleSecurityWrapper = () => {
  return (
    <div className='pt-4 pl-2 pr-2'>
      <SingleSecurity />
    </div>
  );
};

SingleSecurityWrapper.getLayout = function getLayout(page: NextPage) {
  return <AuthenticatedLayout>{page}</AuthenticatedLayout>;
};

export default SingleSecurityWrapper;
