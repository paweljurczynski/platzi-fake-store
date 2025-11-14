import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../hooks/useProducts';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { config } from '../config/constants';

export const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const productId = id ? Number(id) : 0;
  const { data: product, isLoading, error } = useProduct(productId);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <button
            onClick={() => navigate('/')}
            className="mb-4 text-blue-600 hover:text-blue-800"
          >
            ← Back to Products
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <img
                src={imageErrors.has(0) || !product.images[0] 
                  ? config.images.placeholder 
                  : product.images[0]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-lg"
                onError={() => setImageErrors(prev => new Set(prev).add(0))}
                loading="lazy"
              />
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 mt-4">
                  {product.images.slice(1).map((image, index) => {
                    const actualIndex = index + 1;
                    return (
                      <img
                        key={`${product.id}-${actualIndex}`}
                        src={imageErrors.has(actualIndex) 
                          ? config.images.placeholder 
                          : image}
                        alt={`${product.title} ${actualIndex + 1}`}
                        className="w-full h-24 object-cover rounded"
                        onError={() => setImageErrors(prev => new Set(prev).add(actualIndex))}
                        loading="lazy"
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
              <p className="text-3xl font-semibold text-blue-600 mb-4">
                ${product.price.toFixed(2)}
              </p>
              <div className="mb-4">
                <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {product.category.name}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{product.description}</p>
              <button
                onClick={() => navigate(`/products/${product.id}/edit`)}
                className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

