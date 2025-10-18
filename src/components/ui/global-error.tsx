'use client';
import Button from './button';
import { Icons } from '@/lib/icons';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorDisplay = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorDisplayProps) => {
  return (
    <div className='flex flex-col items-center justify-center py-12 px-4'>
      <div className='bg-red-50 rounded-full p-4 mb-2'>
        <Icons.Alert className='w-12 h-12 text-accent-red' />
      </div>

      <p className='text-accent-red text-center mb-6 max-w-md'>{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant='primary' className='flex justify-center items-center'>
          <Icons.Refresh className='w-4 h-4 mr-2' />
          <span>Try Again</span>
        </Button>
      )}
    </div>
  );
};

export const EmptyState = ({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) => {
  return (
    <div className='flex flex-col items-center justify-center py-16 px-4'>
      <div className='bg-gray-100 rounded-full p-4 mb-4'>
        <Icons.Alert className='w-12 h-12 text-gray-400' />
      </div>
      <h3 className='text-xl font-semibold text-primary mb-2'>{title}</h3>
      <p className='text-gray-600 text-center mb-6 max-w-md'>{message}</p>
      {action}
    </div>
  );
};
