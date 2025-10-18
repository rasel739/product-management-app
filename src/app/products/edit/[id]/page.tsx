'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { UpdateProductRequest } from '@/types';
import { useAppSelector } from '@/redux/hooks';
import { useGetProductsQuery, useUpdateProductMutation } from '@/redux/api/apiSlice';
import Loading from '@/app/loading';
import AppNavbar from '@/components/ui/app-navbar';
import { ErrorDisplay } from '@/components/ui/global-error';
import { ProductForm } from '@/components/products/product-form';

const EditProductPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch products with high limit to ensure we get the one we need
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsQuery({
    limit: 100,
    offset: 0,
  });

  const [updateProduct, { isLoading: isUpdating, error: updateErroe }] = useUpdateProductMutation();
  const [isMounted, setIsMounted] = useState(false);

  // Find product by ID from the products list
  const product = products?.find((p) => p.id === resolvedParams.id);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  const handleSubmit = async (data: UpdateProductRequest) => {
    if (!product) {
      alert('Product not found');
      return;
    }

    try {
      const result = await updateProduct({
        id: resolvedParams.id,
        data,
      }).unwrap();

      // Navigate to the product detail page using slug
      const productSlug = result?.slug || product?.slug;

      if (productSlug) {
        router.push(`/products/${productSlug}`);
      } else {
        // Fallback to home if slug is not available
        router.push('/');
      }
    } catch (err: any) {
      console.error('Failed to update product:', err);

      // Better error message handling
      let errorMessage = 'Failed to update product. Please try again.';

      if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (err?.status) {
        errorMessage = `Failed to update product (Error ${err.status})`;
      }

      alert(errorMessage);
    }
  };

  // Show nothing while checking authentication
  if (!isMounted || !isAuthenticated) {
    return null;
  }

  // Show loading state while fetching products
  if (isLoading) {
    return <Loading />;
  }

  // Show error if products fetch failed
  if (error) {
    return (
      <div className='min-h-screen bg-secondary'>
        <AppNavbar />
        <main className='container mx-auto px-4 py-8'>
          <ErrorDisplay
            message='Failed to load product data'
            onRetry={() => window.location.reload()}
          />
        </main>
      </div>
    );
  }

  // Show error if product not found in the list
  if (!product) {
    return (
      <div className='min-h-screen bg-secondary'>
        <AppNavbar />
        <main className='container mx-auto px-4 py-8'>
          <ErrorDisplay message='Product not found' onRetry={() => router.push('/')} />
        </main>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-secondary'>
      <AppNavbar />
      <main className='container mx-auto px-4 py-8 max-w-3xl'>
        <ProductForm
          initialData={product}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          mode='edit'
        />
      </main>
    </div>
  );
};

export default EditProductPage;
