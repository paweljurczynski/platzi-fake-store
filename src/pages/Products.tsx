import { useNavigate } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import { ProductTable } from '../components/ProductTable';
import { useAuth } from '../context/AuthContext';

export const Products = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <h1 className="text-xl font-semibold text-gray-900 text-center sm:text-left">
              Platzi Fake Store
            </h1>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <button
                onClick={() => navigate('/products/new')}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full sm:w-auto"
              >
                Create Product
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 w-full sm:w-auto"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar />
        <ProductTable />
      </main>
    </div>
  );
};

