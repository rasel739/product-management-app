import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/helpers';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className='w-full'>
        {label && <label className='block text-sm font-medium text-primary mb-1.5'>{label}</label>}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent',
            'disabled:bg-gray-100 disabled:cursor-not-allowed',
            'bg-white appearance-none cursor-pointer',
            error
              ? 'border-accent-red focus:ring-accent-red'
              : 'border-gray-300 hover:border-gray-400',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className='mt-1.5 text-sm text-accent-red'>{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
