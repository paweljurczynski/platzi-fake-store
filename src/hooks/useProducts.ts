import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { categoryService } from '../services/category.service';
import { config } from '../config/constants';
import type {
  ProductCreateRequest,
  ProductUpdateRequest,
} from '../types/product.types';
import type { ProductQueryParams } from '../types/api.types';
import toast from 'react-hot-toast';

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: ProductQueryParams) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

export const categoryKeys = {
  all: ['categories'] as const,
};

export const useProducts = (params?: ProductQueryParams) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getProducts(params),
    staleTime: config.query.staleTime,
  });
};

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
    staleTime: config.query.staleTime,
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: () => categoryService.getCategories(),
    staleTime: config.query.staleTime,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductCreateRequest) =>
      productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create product: ${error.message}`);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductUpdateRequest }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(variables.id),
      });
      toast.success('Product updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update product: ${error.message}`);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('Product deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete product: ${error.message}`);
    },
  });
};

