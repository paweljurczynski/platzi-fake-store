import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useProducts,
  useProduct,
  useCategories,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '../useProducts';
import * as productServiceModule from '../../services/product.service';
import * as categoryServiceModule from '../../services/category.service';
import toast from 'react-hot-toast';

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../../services/product.service');
vi.mock('../../services/category.service');

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return React.createElement(QueryClientProvider, { client: queryClient }, children);
}
const wrapper = Wrapper;

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('useProducts', () => {
    it('should fetch products', async () => {
      const mockProducts = [
        { 
          id: 1, 
          title: 'Product 1', 
          price: 10, 
          description: 'Description 1', 
          images: ['https://example.com/image1.jpg'],
          category: { id: 1, name: 'Category 1', image: 'https://example.com/cat1.jpg' }
        },
        { 
          id: 2, 
          title: 'Product 2', 
          price: 20, 
          description: 'Description 2', 
          images: ['https://example.com/image2.jpg'],
          category: { id: 1, name: 'Category 1', image: 'https://example.com/cat1.jpg' }
        },
      ];
      vi.mocked(productServiceModule.productService.getProducts).mockResolvedValue(mockProducts);

      const { result } = renderHook(() => useProducts(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(productServiceModule.productService.getProducts).toHaveBeenCalled();
    });

    it('should pass query params to service', async () => {
      const params = { title: 'test', categoryId: 1 };
      vi.mocked(productServiceModule.productService.getProducts).mockResolvedValue([]);

      renderHook(() => useProducts(params), { wrapper });

      await waitFor(() => {
        expect(productServiceModule.productService.getProducts).toHaveBeenCalledWith(params);
      });
    });
  });

  describe('useProduct', () => {
    it('should fetch single product', async () => {
      const mockProduct = { 
        id: 1, 
        title: 'Product 1', 
        price: 10, 
        description: 'Description', 
        images: ['https://example.com/image.jpg'],
        category: { id: 1, name: 'Category 1', image: 'https://example.com/cat1.jpg' }
      };
      vi.mocked(productServiceModule.productService.getProduct).mockResolvedValue(mockProduct);

      const { result } = renderHook(() => useProduct(1), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProduct);
      expect(productServiceModule.productService.getProduct).toHaveBeenCalledWith(1);
    });

    it('should not fetch when id is 0', () => {
      const { result } = renderHook(() => useProduct(0), { wrapper });

      expect(result.current.isFetching).toBe(false);
      expect(productServiceModule.productService.getProduct).not.toHaveBeenCalled();
    });
  });

  describe('useCategories', () => {
    it('should fetch categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Category 1', image: 'https://example.com/cat1.jpg' },
        { id: 2, name: 'Category 2', image: 'https://example.com/cat2.jpg' },
      ];
      vi.mocked(categoryServiceModule.categoryService.getCategories).mockResolvedValue(mockCategories);

      const { result } = renderHook(() => useCategories(), { wrapper });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockCategories);
      expect(categoryServiceModule.categoryService.getCategories).toHaveBeenCalled();
    });
  });

  describe('useCreateProduct', () => {
    it('should create product and show success toast', async () => {
      const newProduct = {
        title: 'New Product',
        price: 100,
        description: 'Description',
        images: ['https://example.com/image.jpg'],
        categoryId: 1,
      };
      const createdProduct = { 
        id: 1, 
        title: newProduct.title,
        price: newProduct.price,
        description: newProduct.description,
        images: newProduct.images,
        category: { id: 1, name: 'Category 1', image: 'https://example.com/cat1.jpg' }
      };
      vi.mocked(productServiceModule.productService.createProduct).mockResolvedValue(createdProduct);

      const { result } = renderHook(() => useCreateProduct(), { wrapper });

      result.current.mutate(newProduct);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(productServiceModule.productService.createProduct).toHaveBeenCalledWith(newProduct);
      expect(toast.success).toHaveBeenCalledWith('Product created successfully!');
    });

    it('should show error toast on failure', async () => {
      const error = new Error('Failed to create');
      vi.mocked(productServiceModule.productService.createProduct).mockRejectedValue(error);

      const { result } = renderHook(() => useCreateProduct(), { wrapper });

      result.current.mutate({
        title: 'Product',
        price: 10,
        description: 'Desc',
        images: ['https://example.com/image.jpg'],
        categoryId: 1,
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to create product: Failed to create');
    });
  });

  describe('useUpdateProduct', () => {
    it('should update product and show success toast', async () => {
      const updateData = { title: 'Updated Product' };
      const updatedProduct = { 
        id: 1, 
        title: 'Updated Product',
        price: 10,
        description: 'Description',
        images: ['https://example.com/image.jpg'],
        category: { id: 1, name: 'Category 1', image: 'https://example.com/cat1.jpg' }
      };
      vi.mocked(productServiceModule.productService.updateProduct).mockResolvedValue(updatedProduct);

      const { result } = renderHook(() => useUpdateProduct(), { wrapper });

      result.current.mutate({ id: 1, data: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(productServiceModule.productService.updateProduct).toHaveBeenCalledWith(1, updateData);
      expect(toast.success).toHaveBeenCalledWith('Product updated successfully!');
    });

    it('should show error toast on failure', async () => {
      const error = new Error('Failed to update');
      vi.mocked(productServiceModule.productService.updateProduct).mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateProduct(), { wrapper });

      result.current.mutate({ id: 1, data: { title: 'Updated' } });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to update product: Failed to update');
    });
  });

  describe('useDeleteProduct', () => {
    it('should delete product and show success toast', async () => {
      vi.mocked(productServiceModule.productService.deleteProduct).mockResolvedValue(true);

      const { result } = renderHook(() => useDeleteProduct(), { wrapper });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(productServiceModule.productService.deleteProduct).toHaveBeenCalledWith(1);
      expect(toast.success).toHaveBeenCalledWith('Product deleted successfully!');
    });

    it('should show error toast on failure', async () => {
      const error = new Error('Failed to delete');
      vi.mocked(productServiceModule.productService.deleteProduct).mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteProduct(), { wrapper });

      result.current.mutate(1);

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(toast.error).toHaveBeenCalledWith('Failed to delete product: Failed to delete');
    });
  });
});

