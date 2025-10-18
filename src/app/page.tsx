'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useSearchProductsQuery,
} from '@/redux/api/apiSlice';
import { setCurrentPage, setSearchQuery, setSelectedCategory } from '@/redux/slices/productsSlice';
import AppNavbar from '@/components/ui/app-navbar';
import SearchBar from '@/components/products/search-bar';
import Button from '@/components/ui/button';
import CategoryFilter from '@/components/products/category-filter';
import Spinner from '@/components/ui/spinner';
import { EmptyState, ErrorDisplay } from '@/components/ui/global-error';
import ProductCard from '@/components/products/product-card';
import Pagination from '@/components/products/pagination';
import ConfirmModal from '@/components/products/confirm-modal';
import { Icons } from '@/lib/icons';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { currentPage, itemsPerPage, searchQuery, selectedCategory } = useAppSelector(
    (state) => state.products
  );

  const [isMounted, setIsMounted] = useState(false);
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  // Reset to page 1 when search query or category changes
  useEffect(() => {
    dispatch(setCurrentPage(1));
  }, [searchQuery, selectedCategory, dispatch]);

  const shouldSearch = searchQuery.trim().length > 0;

  // Search query results
  const {
    data: searchResults,
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchProductsQuery({ searchedText: searchQuery }, { skip: !shouldSearch });

  // Regular query results - fetch ALL products when not searching
  const {
    data: allProducts,
    isLoading: isRegularLoading,
    error: regularError,
    refetch: refetchRegular,
  } = useGetProductsQuery(
    {
      offset: 0,
      limit: 1000,
      categoryId: selectedCategory || undefined,
    },
    { skip: shouldSearch }
  );

  // Determine which data to use
  const isLoading = shouldSearch ? isSearchLoading : isRegularLoading;
  const error = shouldSearch ? searchError : regularError;
  const refetch = shouldSearch ? refetchSearch : refetchRegular;

  // Get all items
  const allItems = shouldSearch ? searchResults : allProducts;
  const totalItems = allItems?.length || 0;

  // Calculate pagination on client side
  const offset = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = allItems?.slice(offset, offset + itemsPerPage) || [];

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

      // Check if we need to go back a page after deletion
      const remainingItems = totalItems - 1;
      const maxPage = Math.ceil(remainingItems / itemsPerPage);
      if (currentPage > maxPage && maxPage > 0) {
        dispatch(setCurrentPage(maxPage));
      }

      refetch();
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  // Calculate if pagination should be shown
  const showPagination = totalItems > itemsPerPage;

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
              <Button
                variant='primary'
                className='w-full lg:w-auto flex justify-center items-center'
              >
                <Icons.Add className='w-5 h-5 mr-2' />
                <span> Add Product</span>
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
                : selectedCategory
                ? 'No products in this category'
                : 'Get started by adding your first product'
            }
            action={
              !searchQuery && !selectedCategory ? (
                <Link href='/products/create'>
                  <Button variant='primary'>
                    <Plus className='w-5 h-5 mr-2' />
                    Add Product
                  </Button>
                </Link>
              ) : null
            }
          />
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8'>
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={(id) => handleDeleteClick(id, product.name)}
                />
              ))}
            </div>

            {/* Pagination - Only show if there are more items than itemsPerPage */}
            {showPagination && (
              <Pagination
                key={`pagination-${currentPage}`}
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
              />
            )}
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
