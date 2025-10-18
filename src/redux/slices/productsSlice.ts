import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductsState {
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  selectedCategory: string | null;
}

const initialState: ProductsState = {
  currentPage: 1,
  itemsPerPage: 10,
  searchQuery: '',
  selectedCategory: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setCurrentPage: (state, action: PayloadAction<number>) => {
      console.log('🔄 Redux: Changing page from', state.currentPage, 'to', action.payload);
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      console.log('🔍 Redux: Setting search query to', action.payload);
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on search
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      console.log('📂 Redux: Setting category to', action.payload);
      state.selectedCategory = action.payload;
      state.currentPage = 1; // Reset to first page on filter
    },
    resetFilters: (state) => {
      console.log('🔄 Redux: Resetting filters');
      state.searchQuery = '';
      state.selectedCategory = null;
      state.currentPage = 1;
    },
  },
});

export const { setCurrentPage, setSearchQuery, setSelectedCategory, resetFilters } =
  productsSlice.actions;

export default productsSlice.reducer;
