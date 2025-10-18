'use client';

import { useGetCategoriesQuery } from '@/redux/api/apiSlice';
import { cn } from '@/helpers';
import Spinner from '../ui/spinner';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (categoryId: string | null) => void;
}

const CategoryFilter = ({ selectedCategory, onCategoryChange }: CategoryFilterProps) => {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  if (isLoading) {
    return <Spinner size='sm' />;
  }

  return (
    <div className='flex flex-wrap gap-2'>
      <button
        onClick={() => onCategoryChange(null)}
        className={cn(
          'px-4 py-2 rounded-lg font-medium transition-all',
          !selectedCategory
            ? 'bg-accent-green text-white shadow-md'
            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
        )}
      >
        All Products
      </button>

      {categories?.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-all',
            selectedCategory === category.id
              ? 'bg-accent-green text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
