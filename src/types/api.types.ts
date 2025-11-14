export interface ProductQueryParams {
  title?: string;
  price?: number;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
  categorySlug?: string;
  limit?: number;
  offset?: number;
}

export interface ProductSortField {
  field: 'title' | 'price';
  direction: 'asc' | 'desc';
}

export interface ProductFilters {
  title?: string;
  categoryId?: number;
  price_min?: number;
  price_max?: number;
}

export interface ProductPagination {
  limit: number;
  offset: number;
}

export interface ProductTableState {
  filters: ProductFilters;
  sort: ProductSortField;
  pagination: ProductPagination;
}

