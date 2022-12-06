import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeftLong } from '@fortawesome/free-solid-svg-icons';

type PropType = {
  label: string;
};
const PreviousPage: NextPage<PropType> = ({ label }) => {
  const router = useRouter();

  return (
    <div className='mb-6 flex items-center text-xs'>
      <button type='button' onClick={() => router.back()}>
        <a className='underline'>
          <FontAwesomeIcon className={` mr-2 `} icon={faLeftLong} />
        </a>
      </button>

      <h2 className='text-base lato-font'>{label}</h2>
    </div>
  );
};

export default PreviousPage;
