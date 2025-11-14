import { api } from './api';
import type {
  Product,
  ProductCreateRequest,
  ProductUpdateRequest,
} from '../types/product.types';
import type { ProductQueryParams } from '../types/api.types';

export const productService = {
  getProducts: async (params?: ProductQueryParams): Promise<Product[]> => {
    const cleanParams: Record<string, string | number> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          cleanParams[key] = value;
        }
      });
    }
    const response = await api.get<Product[]>('/products', { params: cleanParams });
    return response.data;
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data: ProductCreateRequest): Promise<Product> => {
    const response = await api.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (
    id: number,
    data: ProductUpdateRequest
  ): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: number): Promise<boolean> => {
    await api.delete(`/products/${id}`);
    return true;
  },
};

