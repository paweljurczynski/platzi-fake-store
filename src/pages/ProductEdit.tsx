import { useNavigate, useParams } from 'react-router-dom';
import { ProductForm } from '../components/ProductForm';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import type { ProductFormSchema } from '../utils/validation';

export const ProductEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : 0;
  const { data: product, isLoading, error } = useProduct(productId);
  const updateMutation = useUpdateProduct();

  const handleSubmit = async (data: ProductFormSchema) => {
    try {
      await updateMutation.mutateAsync({ id: productId, data });
      navigate('/');
    } catch {
      // Error is handled by the mutation's onError callback
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error.message} />;
  }

  if (!product) {
    return <ErrorMessage message="Product not found" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
            <button
              onClick={() => navigate('/')}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              ← Back to Products
            </button>
          </div>
          <ProductForm
            product={product}
            onSubmit={handleSubmit}
            isLoading={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

