'use client';

import { cn } from '@/helpers';
import { Icons } from '@/lib/icons';
import { useEffect, useState } from 'react';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }: PaginationProps) => {
  const [activePage, setActivePage] = useState(currentPage);

  // Sync activePage with currentPage prop
  useEffect(() => {
    console.log('📄 Pagination: currentPage changed to', currentPage);
    setActivePage(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Don't show pagination if there's only one page or no items
  if (totalPages <= 1 || totalItems === 0) return null;

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Smart pagination with ellipsis
      if (activePage <= 4) {
        // Near the beginning
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (activePage >= totalPages - 3) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = activePage - 1; i <= activePage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page: number) => {
    console.log('🖱️ Pagination: Button clicked for page', page);
    if (page >= 1 && page <= totalPages && page !== activePage) {
      setActivePage(page);
      onPageChange(page);
    }
  };

  const startItem = (activePage - 1) * itemsPerPage + 1;
  const endItem = Math.min(activePage * itemsPerPage, totalItems);

  console.log('🎨 Pagination rendering - Active page:', activePage, 'Total pages:', totalPages);

  return (
    <div className='flex flex-col items-center gap-4 mt-8'>
      {/* Page numbers */}
      <div className='flex items-center gap-2'>
        <button
          onClick={() => handlePageChange(activePage - 1)}
          disabled={activePage === 1}
          className={cn(
            'p-2 rounded-lg transition-colors',
            activePage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-accent-green hover:bg-accent-green/10'
          )}
          aria-label='Previous page'
        >
          <Icons.ArrowLeft className='w-5 h-5' />
        </button>

        {getPageNumbers().map((page, index) => (
          <button
            key={`page-${index}-${page}`}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
            className={cn(
              'min-w-[40px] h-10 rounded-lg font-medium transition-all cursor-pointer',
              page === activePage
                ? 'bg-accent-green text-white shadow-md'
                : page === '...'
                ? 'cursor-default text-gray-400'
                : 'text-gray-700 hover:bg-gray-100'
            )}
            aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
            aria-current={page === activePage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(activePage + 1)}
          disabled={activePage === totalPages}
          className={cn(
            'p-2 rounded-lg transition-colors',
            activePage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-accent-green hover:bg-accent-green/10'
          )}
          aria-label='Next page'
        >
          <Icons.ArrowRight className='w-5 h-5' />
        </button>
      </div>

      {/* Results info */}
      <div className='text-sm text-gray-600'>
        Showing <span className='font-medium text-gray-900'>{startItem}</span> to{' '}
        <span className='font-medium text-gray-900'>{endItem}</span> of{' '}
        <span className='font-medium text-gray-900'>{totalItems}</span> results
      </div>
    </div>
  );
};

export default Pagination;
