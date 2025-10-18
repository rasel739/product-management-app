import { ProductFormData, ProductFormErrors } from '@/types';

export const validateProductForm = (data: ProductFormData): ProductFormErrors => {
  const errors: ProductFormErrors = {};

  // Name validation
  if (!data.name.trim()) {
    errors.name = 'Product name is required';
  } else if (data.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Product name must not exceed 100 characters';
  }

  // Description validation
  if (!data.description.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  } else if (data.description.trim().length > 500) {
    errors.description = 'Description must not exceed 500 characters';
  }

  // Images validation
  if (!data.images.trim()) {
    errors.images = 'At least one image URL is required';
  } else {
    const urls = data.images
      .split(',')
      .map((url) => url.trim())
      .filter(Boolean);
    if (urls.length === 0) {
      errors.images = 'At least one valid image URL is required';
    } else {
      // Validate each URL
      const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i;
      const invalidUrls = urls.filter((url) => !urlPattern.test(url));
      if (invalidUrls.length > 0) {
        errors.images = 'All image URLs must be valid (jpg, jpeg, png, webp, gif)';
      }
    }
  }

  // Price validation
  if (!data.price.trim()) {
    errors.price = 'Price is required';
  } else {
    const price = parseFloat(data.price);
    if (isNaN(price)) {
      errors.price = 'Price must be a valid number';
    } else if (price <= 0) {
      errors.price = 'Price must be greater than 0';
    } else if (price > 1000000) {
      errors.price = 'Price must not exceed 1,000,000';
    }
  }

  // Category validation
  if (!data.categoryId) {
    errors.categoryId = 'Please select a category';
  }

  return errors;
};

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) {
    return 'Email is required';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};
