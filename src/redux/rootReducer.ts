import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import { apiSlice } from './api/apiSlice';

export const reducer = {
  auth: authReducer,
  products: productsReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
};
