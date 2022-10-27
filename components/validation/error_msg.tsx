import type { NextPage } from 'next';

interface Props {
  message: string;
}

const ErrorMessage: NextPage<Props> = ({ message }) => {
  return (
    <span className='bg-red-100 mt-2 text-red-500 text-xs pl-4 pr-4 pt-2 pb-2 rounded-lg block'>
      {message}
    </span>
  );
};
export default ErrorMessage;
