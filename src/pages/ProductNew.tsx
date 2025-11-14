import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../components/ProductForm';
import { useCreateProduct } from '../hooks/useProducts';
import type { ProductFormSchema } from '../utils/validation';

export const ProductNew = () => {
  const navigate = useNavigate();
  const createMutation = useCreateProduct();

  const handleSubmit = async (data: ProductFormSchema) => {
    try {
      await createMutation.mutateAsync(data);
      navigate('/');
    } catch (error) {
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Product
            </h1>
            <button
              onClick={() => navigate('/')}
              className="mt-2 text-blue-600 hover:text-blue-800"
            >
              ← Back to Products
            </button>
          </div>
          <ProductForm
            onSubmit={handleSubmit}
            isLoading={createMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
};

