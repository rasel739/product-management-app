import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import {
  Product,
  Category,
  AuthRequest,
  AuthResponse,
  CreateProductRequest,
  UpdateProductRequest,
  FilterParams,
  SearchParams,
} from '@/types';
import { getBaseUrl } from '@/utils/config';

const baseQuery = fetchBaseQuery({
  baseUrl: getBaseUrl(),
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'Products', 'Category'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthRequest>({
      query: (credentials) => ({
        url: '/auth',
        method: 'POST',
        body: credentials,
      }),
    }),
    getProducts: builder.query<Product[], FilterParams>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.offset !== undefined) queryParams.append('offset', params.offset.toString());
        if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
        if (params.categoryId) queryParams.append('categoryId', params.categoryId);

        return `/products?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Products' as const, id: 'LIST' },
            ]
          : [{ type: 'Products' as const, id: 'LIST' }],
    }),

    getProductBySlug: builder.query<Product, string>({
      query: (slug) => `/products/${slug}`,
      providesTags: (result, error, slug) => [{ type: 'Product', id: slug }],
    }),

    searchProducts: builder.query<Product[], SearchParams>({
      query: (params) => `/products/search?searchedText=${params.searchedText}`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Products' as const, id: 'SEARCH' },
            ]
          : [{ type: 'Products' as const, id: 'SEARCH' }],
    }),

    createProduct: builder.mutation<Product, CreateProductRequest>({
      query: (product) => ({
        url: '/products',
        method: 'POST',
        body: product,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),

    updateProduct: builder.mutation<Product, { id: string; data: UpdateProductRequest }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product', id },
        { type: 'Products', id: 'LIST' },
      ],
    }),

    deleteProduct: builder.mutation<Product, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),

    searchCategories: builder.query<Category[], SearchParams>({
      query: (params) => `/categories/search?searchedText=${params.searchedText}`,
      providesTags: ['Category'],
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProductsQuery,
  useGetProductBySlugQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useSearchCategoriesQuery,
} = apiSlice;
