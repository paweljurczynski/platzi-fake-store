import { useSearchParams } from 'react-router-dom';
import { useMemo, useCallback } from 'react';
import type {
  ProductFilters,
  ProductSortField,
  ProductPagination,
  ProductTableState,
} from '../types/api.types';

const DEFAULT_PAGINATION: ProductPagination = {
  limit: 10,
  offset: 0,
};

const DEFAULT_SORT: ProductSortField = {
  field: 'title',
  direction: 'asc',
};

const isSortField = (value: string | null): value is ProductSortField['field'] =>
  value === 'title' || value === 'price';

const isSortDirection = (value: string | null): value is ProductSortField['direction'] =>
  value === 'asc' || value === 'desc';

const getStringParam = (params: URLSearchParams, key: 'title'): string | undefined => {
  return params.get(key) || undefined;
};

const getNumberParam = (
  params: URLSearchParams,
  key: 'categoryId' | 'price_min' | 'price_max'
): number | undefined => {
  const value = params.get(key);
  if (!value) return undefined;
  const num = Number(value);
  return Number.isFinite(num) ? num : undefined;
};

const getNumberParamWithDefault = (
  params: URLSearchParams,
  key: 'limit' | 'offset',
  defaultValue: number
): number => {
  const value = params.get(key);
  if (!value) return defaultValue;
  const num = Number(value);
  return Number.isFinite(num) ? num : defaultValue;
};

const getSortField = (params: URLSearchParams): ProductSortField['field'] => {
  const value = params.get('sortField');
  return isSortField(value) ? value : DEFAULT_SORT.field;
};

const getSortDirection = (params: URLSearchParams): ProductSortField['direction'] => {
  const value = params.get('sortDirection');
  return isSortDirection(value) ? value : DEFAULT_SORT.direction;
};

const setOrDeleteParam = (
  params: URLSearchParams,
  key: string,
  value: string | number | undefined | null,
  isValid: (val: string | number) => boolean = (val) => Boolean(val)
): void => {
  if (value !== undefined && value !== null && isValid(value)) {
    params.set(key, String(value));
  } else {
    params.delete(key);
}
};

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const state = useMemo((): ProductTableState => {
    return {
      filters: {
        title: getStringParam(searchParams, 'title'),
        categoryId: getNumberParam(searchParams, 'categoryId'),
        price_min: getNumberParam(searchParams, 'price_min'),
        price_max: getNumberParam(searchParams, 'price_max'),
      },
      sort: {
        field: getSortField(searchParams),
        direction: getSortDirection(searchParams),
      },
      pagination: {
        limit: getNumberParamWithDefault(searchParams, 'limit', DEFAULT_PAGINATION.limit),
        offset: getNumberParamWithDefault(searchParams, 'offset', DEFAULT_PAGINATION.offset),
      },
    };
  }, [searchParams]);

  const updateFilters = useCallback((filters: Partial<ProductFilters>) => {
    const newParams = new URLSearchParams(searchParams);

    if ('title' in filters) {
      setOrDeleteParam(newParams, 'title', filters.title);
    }
    if ('categoryId' in filters) {
      setOrDeleteParam(newParams, 'categoryId', filters.categoryId, (val) => Number.isFinite(val) && Number(val) > 0);
    }
    if ('price_min' in filters) {
      setOrDeleteParam(newParams, 'price_min', filters.price_min, Number.isFinite);
    }
    if ('price_max' in filters) {
      setOrDeleteParam(newParams, 'price_max', filters.price_max, Number.isFinite);
    }

    newParams.set('offset', '0');
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const updateSort = useCallback((sort: ProductSortField) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortField', sort.field);
    newParams.set('sortDirection', sort.direction);
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const updatePagination = useCallback((pagination: Partial<ProductPagination>) => {
    const newParams = new URLSearchParams(searchParams);

    if (pagination.limit !== undefined) {
      newParams.set('limit', pagination.limit.toString());
    }
    if (pagination.offset !== undefined) {
      newParams.set('offset', pagination.offset.toString());
    }

    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  const resetFilters = useCallback(() => {
    const newParams = new URLSearchParams();
    newParams.set('sortField', state.sort.field);
    newParams.set('sortDirection', state.sort.direction);
    newParams.set('limit', state.pagination.limit.toString());
    newParams.set('offset', DEFAULT_PAGINATION.offset.toString());
    setSearchParams(newParams);
  }, [state.sort.field, state.sort.direction, state.pagination.limit, setSearchParams]);

  return {
    state,
    updateFilters,
    updateSort,
    updatePagination,
    resetFilters,
  };
};

