'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { validateProductForm } from '@/utils/validation';
import { ProductFormData, ProductFormErrors, Product } from '@/types';
import { ArrowLeft } from 'lucide-react';
import { useGetCategoriesQuery } from '@/redux/api/apiSlice';
import FormInput from '../ui/form-input';
import Textarea from '../ui/text-area';
import Select from '../ui/select';
import Button from '../ui/button';

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
  mode: 'create' | 'edit';
}

export const ProductForm = ({ initialData, onSubmit, isLoading, mode }: ProductFormProps) => {
  const router = useRouter();
  const { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    images: '',
    price: '',
    categoryId: '',
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        images: Array.isArray(initialData.images) ? initialData.images.join(', ') : '',
        price: initialData.price?.toString() || '',
        categoryId: initialData.category?.id || '',
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof ProductFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate single field on blur
    const fieldErrors = validateProductForm(formData);
    if (fieldErrors[field as keyof ProductFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: fieldErrors[field as keyof ProductFormErrors],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      name: true,
      description: true,
      images: true,
      price: true,
      categoryId: true,
    });

    // Validate all fields
    const validationErrors = validateProductForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      images: formData.images
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean),
      price: parseFloat(formData.price),
      categoryId: formData.categoryId,
    };

    await onSubmit(submitData);
  };

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...(categories?.map((cat) => ({ value: cat.id, label: cat.name })) || []),
  ];

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Back Button */}
      <button
        type='button'
        onClick={() => router.back()}
        className='flex items-center text-accent-green hover:text-accent-green/80 transition-colors'
      >
        <ArrowLeft className='w-5 h-5 mr-2' />
        Back
      </button>

      {/* Title */}
      <div>
        <h1 className='text-3xl font-bold text-primary mb-2'>
          {mode === 'create' ? 'Create New Product' : 'Edit Product'}
        </h1>
        <p className='text-gray-600'>
          {mode === 'create'
            ? 'Fill in the details to add a new product'
            : 'Update the product information'}
        </p>
      </div>

      {/* Form Fields */}
      <div className='bg-white rounded-xl shadow-md p-6 space-y-6'>
        <FormInput
          name='name'
          label='Product Name *'
          placeholder='Enter product name'
          value={formData.name}
          onChange={handleChange}
          onBlur={() => handleBlur('name')}
          error={touched.name ? errors.name : undefined}
        />

        <Textarea
          name='description'
          label='Description *'
          placeholder='Enter product description'
          value={formData.description}
          onChange={handleChange}
          onBlur={() => handleBlur('description')}
          error={touched.description ? errors.description : undefined}
          rows={4}
        />

        <FormInput
          name='images'
          label='Image URLs *'
          placeholder='Enter image URLs separated by commas'
          value={formData.images}
          onChange={handleChange}
          onBlur={() => handleBlur('images')}
          error={touched.images ? errors.images : undefined}
        />

        <FormInput
          name='price'
          label='Price *'
          type='number'
          step='0.01'
          placeholder='Enter price'
          value={formData.price}
          onChange={handleChange}
          onBlur={() => handleBlur('price')}
          error={touched.price ? errors.price : undefined}
        />

        <Select
          name='categoryId'
          label='Category *'
          options={categoryOptions}
          value={formData.categoryId}
          onChange={handleChange}
          onBlur={() => handleBlur('categoryId')}
          error={touched.categoryId ? errors.categoryId : undefined}
          disabled={isCategoriesLoading}
        />
      </div>

      {/* Actions */}
      <div className='flex gap-4'>
        <Button type='button' variant='outline' onClick={() => router.back()} className='flex-1'>
          Cancel
        </Button>
        <Button type='submit' variant='primary' isLoading={isLoading} className='flex-1'>
          {mode === 'create' ? 'Create Product' : 'Update Product'}
        </Button>
      </div>
    </form>
  );
};
