import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { config } from '../config/constants';
import { loginSchema, type LoginSchema } from '../utils/validation';
import { FormInput, FormError } from '../components/forms';
import toast from 'react-hot-toast';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError: setFormError,
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: config.auth.testCredentials?.email || '',
      password: config.auth.testCredentials?.password || '',
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data);
      toast.success('Login successful!');
      navigate('/');
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setFormError('root', { message: errorMessage });
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          {config.auth.testCredentials && (
            <p className="mt-2 text-center text-sm text-gray-600">
              Use test credentials:{' '}
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {config.auth.testCredentials.email}
              </span>{' '}
              /{' '}
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                {config.auth.testCredentials.password}
              </span>
            </p>
          )}
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <FormInput
              type="email"
              autoComplete="email"
              placeholder="Email address"
              className="appearance-none rounded-none relative block w-full border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:z-10 sm:text-sm"
              {...register('email')}
              error={errors.email}
            />
            <FormInput
              type="password"
              autoComplete="current-password"
              placeholder="Password"
              className="appearance-none rounded-none relative block w-full border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:z-10 sm:text-sm"
              {...register('password')}
              error={errors.password}
            />
          </div>

          {errors.root && (
            <FormError error={errors.root.message} className="text-center" />
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

