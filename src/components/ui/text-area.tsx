'use client';
import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/helpers';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && <label className='block text-sm font-medium text-primary mb-1.5'>{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed resize-none',
            error
              ? 'border-accent-red focus:ring-accent-red'
              : 'border-gray-300 hover:border-gray-400',
            className
          )}
          {...props}
        />
        {error && <p className='mt-1.5 text-sm text-accent-red'>{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
