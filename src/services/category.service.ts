import { api } from './api';
import type { Category } from '../types/category.types';

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },
};

