import type { NextPage } from 'next';
import Lottie from 'lottie-react';
import emptyLottie from 'lottie/empty.json';

type EmptyStateProp = {
  message: string;
};

const EmptyState: NextPage<EmptyStateProp> = ({ message }) => {
  return (
    <div>
      <Lottie animationData={emptyLottie} loop={true} />

      <p className='text-sm text-gray-600'>{message}</p>
    </div>
  );
};
EmptyState.displayName = 'EmptyState';
export default EmptyState;
