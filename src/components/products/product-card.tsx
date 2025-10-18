'use client';

import { Product } from '@/types';
import { formatPrice, truncateText, getValidImages } from '@/helpers';
import { Eye, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Get valid images
  const validImages = getValidImages(product.images);
  const imageSrc = validImages[0] || null;

  return (
    <div className='group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden'>
      {/* Image */}
      <Link href={`/products/${product.slug}`}>
        <div className='relative h-56 bg-gray-100 overflow-hidden'>
          {imageSrc && !imageError ? (
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className='object-cover group-hover:scale-110 transition-transform duration-300'
              onError={() => setImageError(true)}
            />
          ) : (
            <div className='flex items-center justify-center h-full'>
              <span className='text-gray-400'>No Image</span>
            </div>
          )}

          {/* Category Badge */}
          <div className='absolute top-3 left-3'>
            <span className='px-3 py-1 bg-accent-green/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm'>
              {product.category.name}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className='p-5'>
        <Link href={`/products/${product.slug}`}>
          <h3 className='text-lg font-bold text-primary mb-2 hover:text-accent-green transition-colors line-clamp-1'>
            {product.name}
          </h3>
        </Link>

        <p className='text-gray-600 text-sm mb-4 line-clamp-2'>
          {truncateText(product.description, 80)}
        </p>

        <div className='flex items-center justify-between'>
          <span className='text-2xl font-bold text-accent-green'>{formatPrice(product.price)}</span>

          {/* Actions */}
          <div className='flex gap-2'>
            <Link href={`/products/${product.slug}`}>
              <button className='p-2 bg-accent-green/10 text-accent-green rounded-lg hover:bg-accent-green hover:text-white transition-all duration-200'>
                <Eye className='w-5 h-5' />
              </button>
            </Link>
            <button
              onClick={() => onDelete(product.id)}
              className='p-2 bg-accent-red/10 text-accent-red rounded-lg hover:bg-accent-red hover:text-white transition-all duration-200'
            >
              <Trash2 className='w-5 h-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
