'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { useAppSelector } from '@/redux/hooks';
import { useDeleteProductMutation, useGetProductBySlugQuery } from '@/redux/api/apiSlice';
import { formatDate, formatPrice, getValidImages } from '@/helpers';
import Loading from '@/app/loading';
import AppNavbar from '@/components/ui/app-navbar';
import { ErrorDisplay } from '@/components/ui/global-error';
import Button from '@/components/ui/button';
import ConfirmModal from '@/components/products/confirm-modal';
import { Icons } from '@/lib/icons';

const ProductDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
  const router = useRouter();
  const resolvedParams = use(params);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: product, isLoading, error } = useGetProductBySlugQuery(resolvedParams.slug);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [isMounted, setIsMounted] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  // Get valid images
  const validImages = product ? getValidImages(product.images) : [];
  const hasValidImages = validImages.length > 0;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [isMounted, isAuthenticated, router]);

  const handleDelete = async () => {
    if (!product) return;

    try {
      await deleteProduct(product.id).unwrap();
      router.push('/');
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  if (!isMounted || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return <Loading />;
  }

  if (error || !product) {
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

      <main className='container mx-auto px-4 py-8'>
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className='flex items-center text-accent-green hover:text-accent-green/80 transition-colors mb-6'
        >
          <Icons.NavigateArrow className='w-5 h-5 mr-2' />
          Back to Products
        </button>

        <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            {/* Image Gallery */}
            <div className='p-6'>
              <div className='relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4'>
                {hasValidImages && !imageError ? (
                  <Image
                    src={validImages[currentImageIndex]}
                    alt={product.name}
                    fill
                    className='object-cover'
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className='flex items-center justify-center h-full'>
                    <span className='text-gray-400'>Image not available</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {validImages.length > 1 && (
                <div className='flex gap-2 overflow-x-auto'>
                  {validImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setImageError(false);
                      }}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-accent-green'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className='object-cover'
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className='p-6'>
              {/* Category Badge */}
              <div className='flex items-center gap-2 mb-4'>
                <Icons.Tag className='w-4 h-4 text-accent-green' />
                <span className='px-3 py-1 bg-accent-green/10 text-accent-green text-sm font-semibold rounded-full'>
                  {product.category.name}
                </span>
              </div>

              {/* Product Name */}
              <h1 className='text-4xl font-bold text-primary mb-4'>{product.name}</h1>

              {/* Price */}
              <div className='text-4xl font-bold text-accent-green mb-6'>
                {formatPrice(product.price)}
              </div>

              {/* Description */}
              <div className='mb-6'>
                <h3 className='text-lg font-semibold text-primary mb-2'>Description</h3>
                <p className='text-gray-600 leading-relaxed'>{product.description}</p>
              </div>

              {/* Metadata */}
              <div className='border-t border-gray-200 pt-4 mb-6 space-y-2'>
                <p className='text-sm text-gray-600'>
                  <span className='font-medium'>Created:</span> {formatDate(product.createdAt)}
                </p>
                <p className='text-sm text-gray-600'>
                  <span className='font-medium'>Last Updated:</span> {formatDate(product.updatedAt)}
                </p>
              </div>

              {/* Actions */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Link href={`/products/edit/${product.id}`} className='flex-1'>
                  <Button variant='primary' className='w-full flex justify-center items-center'>
                    <Icons.Edit className='w-5 h-5 mr-2' />
                    <span> Edit Product</span>
                  </Button>
                </Link>
                <Button
                  variant='danger'
                  onClick={() => setDeleteModal(true)}
                  className='flex-1 flex justify-center items-center'
                >
                  <Icons.Delete className='w-5 h-5 mr-2' />
                  <span> Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        productName={product.name}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ProductDetailPage;
