export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.escuelajs.co/api/v1',
  },
  auth: {
    testCredentials: import.meta.env.DEV
      ? {
          email: import.meta.env.VITE_TEST_EMAIL || '',
          password: import.meta.env.VITE_TEST_PASSWORD || '',
        }
      : null,
  },
  app: {
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  },
  query: {
    staleTime: 10000,
    gcTime: 10000,
  },
  debounce: {
    delay: 300,
  },
  pagination: {
    defaultLimit: 10,
  },
  images: {
    placeholder: '/placeholder.png',
  },
} as const;

