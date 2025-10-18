'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useDeleteProductMutation,
} from '@/redux/api/apiSlice';
import { setCurrentPage, setSearchQuery, setSelectedCategory } from '@/redux/slices/productsSlice';

import Button from '@/components/ui/button';
import Link from 'next/link';
import AppNavbar from '@/components/ui/app-navbar';
import ProductCard from '@/components/products/product-card';
import { Icons } from '@/lib/icons';
import SearchBar from '@/components/products/search-bar';
import CategoryFilter from '@/components/products/category-filter';
import Spinner from '@/components/ui/spinner';
import Pagination from '@/components/products/pagination';
import ConfirmModal from '@/components/products/confirm-modal';
import { EmptyState, ErrorDisplay } from '@/components/ui/global-error';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentPage, itemsPerPage, searchQuery, selectedCategory } = useAppSelector(
    (state) => state.products
  );

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: '',
    productName: '',
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Calculate pagination offset
  const offset = (currentPage - 1) * itemsPerPage;

  // Fetch products based on search or filter
  const shouldSearch = searchQuery.trim().length > 0;

  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = shouldSearch
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useSearchProductsQuery({ searchedText: searchQuery })
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useGetProductsQuery({
        offset,
        limit: itemsPerPage,
        categoryId: selectedCategory || undefined,
      });

  const handleSearch = (query: string) => {
    dispatch(setSearchQuery(query));
  };

  const handleCategoryChange = (categoryId: string | null) => {
    dispatch(setSelectedCategory(categoryId));
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteModal({ isOpen: true, productId: id, productName: name });
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(deleteModal.productId).unwrap();
      setDeleteModal({ isOpen: false, productId: '', productName: '' });
      refetch();
    } catch (err) {
      console.error('Failed to delete product:', err);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  // Get paginated products for search results
  const paginatedProducts =
    shouldSearch && products ? products.slice(offset, offset + itemsPerPage) : products;

  const totalItems = products?.length || 0;
  return (
    <div className='min-h-screen bg-secondary'>
      <AppNavbar />
      <main className='container mx-auto px-4 py-8'>
        {/* Header Section */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold text-primary mb-2'>Products</h1>
          <p className='text-gray-600'>Browse and manage your product catalog</p>
        </div>

        {/* Search and Filter Section */}
        <div className='bg-white rounded-xl shadow-md p-6 mb-8'>
          <div className='flex flex-col lg:flex-row gap-4 mb-6'>
            <SearchBar onSearch={handleSearch} />
            <Link href='/products/create' className='lg:ml-auto'>
              <Button variant='primary' className='w-full lg:w-auto'>
                <Icons.Add className='w-5 h-5 mr-2' />
                Add Product
              </Button>
            </Link>
          </div>

          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className='flex justify-center py-12'>
            <Spinner size='lg' />
          </div>
        ) : error ? (
          <ErrorDisplay message='Failed to load products. Please try again.' onRetry={refetch} />
        ) : !paginatedProducts || paginatedProducts.length === 0 ? (
          <EmptyState
            title='No products found'
            message={
              searchQuery
                ? 'Try adjusting your search terms'
                : 'Get started by adding your first product'
            }
            action={
              <Link href='/products/create'>
                <Button variant='primary'>
                  <Icons.Add className='w-5 h-5 mr-2' />
                  Add Product
                </Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={(id) => handleDeleteClick(id, product.name)}
                />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: '', productName: '' })}
        onConfirm={handleDeleteConfirm}
        productName={deleteModal.productName}
        isLoading={isDeleting}
      />
    </div>
  );
}
