// Category Type
export interface Category {
  id: string;
  name: string;
  description: string | null;
  image: string;
  createdAt: string;
  updatedAt?: string;
}

// Product Type
export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

// API Request/Response Types
export interface AuthRequest {
  email: string;
}

export interface AuthResponse {
  token: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  images: string[];
  price: number;
  categoryId: string;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  images?: string[];
  price?: number;
  categoryId?: string;
}

export interface PaginationParams {
  offset?: number;
  limit?: number;
}

export interface SearchParams {
  searchedText: string;
}

export interface FilterParams extends PaginationParams {
  categoryId?: string;
}

// Form validation types
export interface ProductFormData {
  name: string;
  description: string;
  images: string;
  price: string;
  categoryId: string;
}

export interface ProductFormErrors {
  name?: string;
  description?: string;
  images?: string;
  price?: string;
  categoryId?: string;
}

// Redux State Types
export interface AuthState {
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

export interface ProductsState {
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  selectedCategory: string | null;
}
