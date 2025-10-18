'use client';

import { debounce } from '@/helpers';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

const SearchBar = ({ onSearch, placeholder = 'Search products...' }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Debounced search
  useEffect(() => {
    const debouncedSearch = debounce((term: string) => {
      onSearch(term);
    }, 500);

    debouncedSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className='relative w-full max-w-md'>
      <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />

      <input
        type='text'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className='w-full pl-12 pr-12 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all'
      />

      {searchTerm && (
        <button
          onClick={handleClear}
          className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors'
        >
          <X className='w-5 h-5' />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
