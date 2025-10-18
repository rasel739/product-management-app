'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hooks';
import { CreateProductRequest } from '@/types';
import { useCreateProductMutation } from '@/redux/api/apiSlice';
import AppNavbar from '@/components/ui/app-navbar';
import { ProductForm } from '@/components/products/product-form';

export default function CreateProductPage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [createProduct, { isLoading }] = useCreateProductMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (data: CreateProductRequest) => {
    try {
      await createProduct(data).unwrap();
      router.push('/');
    } catch (err: any) {
      console.error('Failed to create product:', err);
      alert(err?.data?.message || 'Failed to create product. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className='min-h-screen bg-secondary'>
      <AppNavbar />
      <main className='container mx-auto px-4 py-8 max-w-3xl'>
        <ProductForm onSubmit={handleSubmit} isLoading={isLoading} mode='create' />
      </main>
    </div>
  );
}
