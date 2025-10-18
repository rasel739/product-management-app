import Spinner from '@/components/ui/spinner';

const Loading = () => {
  return (
    <div className='min-h-screen flex items-center justify-center bg-secondary'>
      <div className='text-center'>
        <Spinner size='lg' />
        <p className='mt-4 text-lg text-gray-600'>Thinking...</p>
      </div>
    </div>
  );
};

export default Loading;
