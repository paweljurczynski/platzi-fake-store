import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts, useDeleteProduct } from '../hooks/useProducts';
import { useQueryParams } from '../hooks/useQueryParams';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { config } from '../config/constants';
import type { Product } from '../types/product.types';

const ProductTableRow = ({
  product,
  onView,
  onEdit,
  onDelete,
}: {
  product: Product;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError || !product.images[0] 
    ? config.images.placeholder 
    : product.images[0];

  return (
    <tr
      className="border-b hover:bg-gray-50 cursor-pointer"
      onClick={() => onView(product.id)}
    >
      <td className="px-4 py-3">
        <img
          src={imageSrc}
          alt={product.title}
          className="w-16 h-16 object-cover rounded"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      </td>
      <td className="px-4 py-3 font-medium">{product.title}</td>
      <td className="px-4 py-3">${product.price.toFixed(2)}</td>
      <td className="px-4 py-3">{product.category.name}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={(event) => {
              event.stopPropagation();
              onEdit(product.id);
            }}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onDelete(product.id);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

const ProductCard = ({
  product,
  onView,
  onEdit,
  onDelete,
}: {
  product: Product;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const [imageError, setImageError] = useState(false);
  const imageSrc = imageError || !product.images[0] 
    ? config.images.placeholder 
    : product.images[0];

  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 border border-gray-200 cursor-pointer"
      onClick={() => onView(product.id)}
    >
      <img
        src={imageSrc}
        alt={product.title}
        className="w-full h-48 object-cover rounded mb-4"
        onError={() => setImageError(true)}
        loading="lazy"
      />
      <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
      <p className="text-gray-600 mb-2">${product.price.toFixed(2)}</p>
      <p className="text-sm text-gray-500 mb-4">{product.category.name}</p>
      <div className="flex gap-2">
        <button
          onClick={(event) => {
            event.stopPropagation();
            onEdit(product.id);
          }}
          className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={(event) => {
            event.stopPropagation();
            onDelete(product.id);
          }}
          className="flex-1 px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export const ProductTable = () => {
  const navigate = useNavigate();
  const { state, updateSort, updatePagination } = useQueryParams();
  const { data: products, isLoading, error } = useProducts({
    ...state.filters,
    ...state.pagination,
  });
  const deleteMutation = useDeleteProduct();
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleSort = (field: 'title' | 'price') => {
    const newDirection =
      state.sort.field === field && state.sort.direction === 'asc'
        ? 'desc'
        : 'asc';
    updateSort({ field, direction: newDirection });
  };

  const handleEdit = (id: number) => {
    navigate(`/products/${id}/edit`);
  };

  const handleView = (id: number) => {
    navigate(`/products/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmId(id);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteMutation.mutate(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmId(null);
  };

  const sortedProducts = products
    ? [...products].sort((a, b) => {
    const field = state.sort.field;
    const direction = state.sort.direction;
    let comparison = 0;

    if (field === 'title') {
      comparison = a.title.localeCompare(b.title);
    } else if (field === 'price') {
      comparison = a.price - b.price;
    }

      return direction === 'asc' ? comparison : -comparison;
    })
  : [];

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Title
                  {state.sort.field === 'title' && (
                    <span>{state.sort.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                <button
                  onClick={() => handleSort('price')}
                  className="flex items-center gap-1 hover:text-gray-700"
                >
                  Price
                  {state.sort.field === 'price' && (
                    <span>{state.sort.direction === 'asc' ? '↑' : '↓'}</span>
                  )}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => (
                <ProductTableRow
                  key={product.id}
                  product={product}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {sortedProducts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No products found</div>
        ) : (
          sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={() =>
            updatePagination({
              offset: Math.max(0, state.pagination.offset - state.pagination.limit),
            })
          }
          disabled={state.pagination.offset === 0}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="text-gray-600">
          Page {Math.floor(state.pagination.offset / state.pagination.limit) + 1}
        </span>
        <button
          onClick={() =>
            updatePagination({
              offset: state.pagination.offset + state.pagination.limit,
            })
          }
          disabled={sortedProducts.length < state.pagination.limit}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be
              undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleDeleteCancel}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteMutation.isPending ? (
                  <>
                    <LoadingSpinner size="small" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

