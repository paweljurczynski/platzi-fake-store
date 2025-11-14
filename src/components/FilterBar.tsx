import { useEffect, useMemo, useRef } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from '../hooks/useDebounce';
import { useQueryParams } from '../hooks/useQueryParams';
import { useCategories } from '../hooks/useProducts';
import { filterSchema, type FilterSchema } from '../utils/validation';
import { FormInput, FormSelect } from './forms';
import { config } from '../config/constants';

export const FilterBar = () => {
  const { state, updateFilters, resetFilters } = useQueryParams();
  const { data: categories } = useCategories();
  const form = useForm<FilterSchema>({
    resolver: zodResolver(filterSchema) as Resolver<FilterSchema>,
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      title: state.filters.title || '',
      categoryId: state.filters.categoryId,
      price_min: state.filters.price_min,
      price_max: state.filters.price_max,
    },
  });


  const titleValue = form.watch('title');
  const debouncedTitle = useDebounce(titleValue, config.debounce.delay);

  const priceMinValue = form.watch('price_min');
  const priceMaxValue = form.watch('price_max');
  const debouncedPriceMin = useDebounce(priceMinValue, config.debounce.delay);
  const debouncedPriceMax = useDebounce(priceMaxValue, config.debounce.delay);

  const prevPriceMinRef = useRef<number | undefined>(state.filters.price_min);
  const prevPriceMaxRef = useRef<number | undefined>(state.filters.price_max);

  useEffect(() => {
    prevPriceMinRef.current = state.filters.price_min;
    prevPriceMaxRef.current = state.filters.price_max;
  }, [state.filters.price_min, state.filters.price_max]);

  useEffect(() => {
    updateFilters({ title: debouncedTitle || undefined });
  }, [debouncedTitle, updateFilters]);

  useEffect(() => {
    const priceMin = Number.isFinite(debouncedPriceMin) ? debouncedPriceMin : undefined;
    const priceMax = Number.isFinite(debouncedPriceMax) ? debouncedPriceMax : undefined;

    if (
      priceMin === prevPriceMinRef.current &&
      priceMax === prevPriceMaxRef.current
    ) {
      return;
    }

    form.trigger(['price_min', 'price_max']).then((isValid) => {
      const errors = form.formState.errors;
      if (isValid && !errors.price_min && !errors.price_max) {
        prevPriceMinRef.current = priceMin;
        prevPriceMaxRef.current = priceMax;
        updateFilters({
          price_min: priceMin,
          price_max: priceMax,
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPriceMin, debouncedPriceMax]);

  const handleCategoryChange = (value: number | undefined) => {
    updateFilters({ categoryId: value });
  };

  const categoryOptions = useMemo(
    () => [
      { value: '', label: 'All Categories' },
      ...(categories?.map((category) => ({
        value: String(category.id),
        label: category.name,
      })) || []),
    ],
    [categories]
  );

  const handleReset = () => {
    form.reset({
      title: '',
      categoryId: undefined,
      price_min: undefined,
      price_max: undefined,
    });
    resetFilters();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6 space-y-4">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <FormInput
            label="Title"
            type="text"
            {...form.register('title')}
            placeholder="Search by title..."
          />

          <FormSelect
            label="Category"
            value={form.watch('categoryId') || ''}
            {...form.register('categoryId', {
              valueAsNumber: true,
              onChange: (e) => {
                const value = e.target.value ? Number(e.target.value) : undefined;
                handleCategoryChange(value);
              },
            })}
            options={categoryOptions}
          />

          <FormInput
            label="Min Price"
            type="number"
            {...form.register('price_min', {
              valueAsNumber: true,
              onChange: (e) => {
                const inputValue = e.target.value;
                if (inputValue === '') {
                  form.setValue('price_min', undefined, { shouldValidate: true });
                } else {
                  const numValue = Number(inputValue);
                  if (Number.isFinite(numValue)) {
                    form.setValue('price_min', numValue, { shouldValidate: true });
                  }
                }
              },
            })}
            placeholder="Min"
            min="0"
            step="0.01"
            error={form.formState.errors.price_min}
          />

          <FormInput
            label="Max Price"
            type="number"
            {...form.register('price_max', {
              valueAsNumber: true,
              onChange: (e) => {
                const inputValue = e.target.value;
                if (inputValue === '') {
                  form.setValue('price_max', undefined, { shouldValidate: true });
                } else {
                  const numValue = Number(inputValue);
                  if (Number.isFinite(numValue)) {
                    form.setValue('price_max', numValue, { shouldValidate: true });
                  }
                }
              },
            })}
            placeholder="Max"
            min="0"
            step="0.01"
            error={form.formState.errors.price_max}
          />
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

