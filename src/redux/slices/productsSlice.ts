import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductsState } from '@/types';

const initialState: ProductsState = {
  currentPage: 1,
  itemsPerPage: 12,
  searchQuery: '',
  selectedCategory: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on search
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset to first page on filter
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
      state.currentPage = 1;
    },
  },
});

export const { setCurrentPage, setSearchQuery, setSelectedCategory, resetFilters } =
  productsSlice.actions;

export default productsSlice.reducer;
