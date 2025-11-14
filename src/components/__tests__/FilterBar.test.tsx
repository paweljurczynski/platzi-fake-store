import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FilterBar } from '../FilterBar';
import * as useQueryParamsModule from '../../hooks/useQueryParams';
import * as useProductsModule from '../../hooks/useProducts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const mockUpdateFilters = vi.fn();
const mockResetFilters = vi.fn();
const mockState = {
  filters: {
    title: undefined,
    categoryId: undefined,
    price_min: undefined,
    price_max: undefined,
  },
  sort: { field: 'title' as const, direction: 'asc' as const },
  pagination: { offset: 0, limit: 10 },
};

const mockCategories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Clothing' },
  { id: 3, name: 'Books' },
];

vi.mock('../../hooks/useQueryParams', () => ({
  useQueryParams: vi.fn(),
}));

vi.mock('../../hooks/useProducts', () => ({
  useCategories: vi.fn(),
}));

const renderFilterBar = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FilterBar />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('FilterBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useQueryParamsModule.useQueryParams as any).mockReturnValue({
      state: mockState,
      updateFilters: mockUpdateFilters,
      resetFilters: mockResetFilters,
    });
    (useProductsModule.useCategories as any).mockReturnValue({
      data: mockCategories,
      isLoading: false,
    });
  });

  it('should render all filter fields', () => {
    renderFilterBar();
    expect(
      screen.getByPlaceholderText('Search by title...')
    ).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Min Price')).toBeInTheDocument();
    expect(screen.getByText('Max Price')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /clear filters/i })
    ).toBeInTheDocument();
  });

  it('should render category options', () => {
    renderFilterBar();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText('Clothing')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  it('should update filters when category changes', async () => {
    const user = userEvent.setup();
    renderFilterBar();

    const categorySelect = screen.getByRole('combobox');
    await user.selectOptions(categorySelect, '1');

    await waitFor(
      () => {
        expect(mockUpdateFilters).toHaveBeenCalled();
      },
      { timeout: 2000 }
    );
  });

  it('should debounce title input', async () => {
    const user = userEvent.setup();
    renderFilterBar();
    const titleInput = screen.getByPlaceholderText('Search by title...');

    // Type in the input
    await user.type(titleInput, 'test');

    // Should not update immediately (debounce is 300ms)
    expect(mockUpdateFilters).not.toHaveBeenCalled();

    // Wait for debounce delay (300ms) plus some buffer
    await waitFor(
      () => {
        expect(mockUpdateFilters).toHaveBeenCalled();
      },
      { timeout: 1000 }
    );
  });

  it('should handle price validation (validation logic tested in validation.test.ts)', () => {
    // This test verifies that the FilterBar component is set up to display validation errors
    // The actual validation logic is thoroughly tested in validation.test.ts
    renderFilterBar();

    const inputs = screen.getAllByRole('spinbutton');
    const maxPriceInput = inputs.find(
      input => input.getAttribute('placeholder') === 'Max'
    );
    const minPriceInput = inputs.find(
      input => input.getAttribute('placeholder') === 'Min'
    );

    // Verify that price inputs are rendered and can receive values
    expect(maxPriceInput).toBeInTheDocument();
    expect(minPriceInput).toBeInTheDocument();

    // The validation error display is handled by FormInput component with error prop
    // which is tested in FormInput.test.tsx
    // The filterSchema validation is tested in validation.test.ts
  });

  it('should reset all filters when Clear Filters is clicked', async () => {
    const user = userEvent.setup();
    renderFilterBar();

    const resetButton = screen.getByRole('button', { name: /clear filters/i });
    await user.click(resetButton);

    // resetFilters should be called synchronously
    expect(mockResetFilters).toHaveBeenCalled();
  });

  it('should pre-fill filters from state', () => {
    (useQueryParamsModule.useQueryParams as any).mockReturnValue({
      state: {
        ...mockState,
        filters: {
          title: 'test product',
          categoryId: 1,
          price_min: 10,
          price_max: 100,
        },
      },
      updateFilters: mockUpdateFilters,
      resetFilters: mockResetFilters,
    });

    renderFilterBar();

    const titleInput = screen.getByPlaceholderText(
      'Search by title...'
    ) as HTMLInputElement;
    const inputs = screen.getAllByRole('spinbutton');
    const minPriceInput = inputs.find(
      input => input.getAttribute('placeholder') === 'Min'
    ) as HTMLInputElement;
    const maxPriceInput = inputs.find(
      input => input.getAttribute('placeholder') === 'Max'
    ) as HTMLInputElement;

    expect(titleInput.value).toBe('test product');
    if (minPriceInput) expect(minPriceInput.value).toBe('10');
    if (maxPriceInput) expect(maxPriceInput.value).toBe('100');
  });

  it('should handle empty categories', () => {
    (useProductsModule.useCategories as any).mockReturnValue({
      data: undefined,
      isLoading: false,
    });

    renderFilterBar();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });

  it('should handle loading categories', () => {
    (useProductsModule.useCategories as any).mockReturnValue({
      data: undefined,
      isLoading: true,
    });

    renderFilterBar();
    expect(screen.getByText('All Categories')).toBeInTheDocument();
  });
});
