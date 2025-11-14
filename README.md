# Platzi Fake Store - React Front-End Application

A modern React application for managing products using the Platzi Fake Store REST API. Built with React 18, TypeScript, Tailwind CSS, and TanStack Query.

## Features

- 🔐 **Authentication**: Secure login flow with token-based authentication
- 📦 **Product Management**: Full CRUD operations (Create, Read, Update, Delete)
- 🔍 **Search & Filter**: Searchable and sortable product table with filters
- 📱 **Responsive Design**: Mobile-first responsive UI built with Tailwind CSS
- 🚀 **Code Splitting**: Lazy-loaded routes for optimal performance
- 💾 **State Persistence**: URL query parameters for filters, sorting, and pagination
- ⚡ **Caching**: 10-second cache for product queries using TanStack Query
- ✅ **Form Validation**: Comprehensive form validation with React Hook Form + Zod
- 🧪 **Testing**: Unit and integration tests with Vitest

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Routing with code-splitting
- **TanStack Query** - Data fetching and caching
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **react-hot-toast** - Toast notifications
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality and formatting

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ProductTable.tsx
│   ├── ProductForm.tsx
│   ├── FilterBar.tsx
│   ├── LoadingSpinner.tsx
│   ├── ErrorMessage.tsx
│   └── ProtectedRoute.tsx
├── pages/               # Route pages (code-split)
│   ├── Login.tsx
│   ├── Products.tsx
│   ├── ProductNew.tsx
│   ├── ProductEdit.tsx
│   ├── ProductDetail.tsx
│   └── NotFound.tsx
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   ├── useQueryParams.ts
│   ├── useDebounce.ts
│   └── useProducts.ts
├── services/            # API service layer
│   ├── api.ts
│   ├── authService.ts
│   ├── productService.ts
│   └── categoryService.ts
├── types/               # TypeScript types
│   ├── auth.types.ts
│   ├── product.types.ts
│   ├── category.types.ts
│   └── api.types.ts
├── utils/               # Utility functions
│   ├── storage.ts
│   └── validation.ts
├── context/             # React contexts
│   └── AuthContext.tsx
└── test/                # Test setup
    └── setup.ts
```

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm (or yarn)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd onerail
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env.local` file for environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
- `VITE_API_BASE_URL` - API base URL (defaults to Platzi Fake Store API)
- `VITE_TEST_EMAIL` - Test email for development (only used in dev mode)
- `VITE_TEST_PASSWORD` - Test password for development (only used in dev mode)

**Note:** Test credentials are ONLY pre-filled in development mode. In production, users must enter credentials manually.

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI

## Usage

### Authentication

1. Navigate to `/login`
2. In development mode, test credentials are pre-filled (if configured in `.env.local`):
   - **Email**: Configured via `VITE_TEST_EMAIL` (default: `john@mail.com`)
   - **Password**: Configured via `VITE_TEST_PASSWORD` (default: `changeme`)
3. In production, credentials must be entered manually
4. Click "Sign in" or press Enter
5. Upon successful login, you'll be redirected to the products page
6. The authentication token is validated and stored in secure cookies, automatically attached to all API requests

> **Security Note**: 
> - Test credentials are ONLY pre-filled in development mode (`import.meta.env.DEV`)
> - In production builds, users must enter credentials manually
> - Tokens are validated for format and expiration before use
> - **Cookies are used for token storage** (more secure than localStorage):
>   - Cookies use `Secure` flag in production (HTTPS only)
>   - Cookies use `SameSite=Strict` for CSRF protection
>   - Tokens expire after 7 days
>   - For maximum security, consider using httpOnly cookies set by backend

> **Note**: These are the default test credentials provided by the Platzi Fake Store API. You can also create your own account by registering through the API.

### Product Management

#### Viewing Products
- The main page (`/`) displays a searchable, sortable table of products
- Use the filter bar to search by title, category, or price range
- Click column headers to sort by title or price
- Use pagination controls to navigate through pages

#### Creating Products
1. Click "Create Product" button
2. Fill in the product form:
   - Title (required, min 3 characters)
   - Price (required, must be positive)
   - Description (required)
   - Category (required)
   - Images (required, at least one valid URL)
3. Click "Create Product" to save

#### Editing Products
1. Click "Edit" on any product in the table
2. Modify the product details
3. Click "Update Product" to save changes

#### Deleting Products
1. Click "Delete" on any product
2. Confirm the deletion in the modal
3. The product will be removed

### State Persistence

All filters, sorting, and pagination state is persisted in URL query parameters. This means:
- Refreshing the page maintains your current view
- Sharing URLs preserves the filtered/sorted state
- Browser back/forward navigation works correctly

## API Integration

The application uses the Platzi Fake Store API:
- Base URL: `https://api.escuelajs.co/api/v1`
- All product and category requests require authentication
- The `Authorization: Bearer <token>` header is automatically attached after login

### API Endpoints Used

- `POST /auth/login` - User authentication
- `GET /products` - List products (with filters and pagination)
- `GET /products/:id` - Get product details
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /categories` - List categories

## Architecture Decisions

### Code Splitting
All page components are lazy-loaded using `React.lazy()` and `Suspense`, reducing initial bundle size and improving load times.

### State Management
- **Server State**: TanStack Query handles all API data fetching and caching
- **Client State**: React Context for authentication state
- **URL State**: React Router's `useSearchParams` for persistent filter/sort/pagination state

### Caching Strategy
- Product queries are cached for 10 seconds (configurable in `App.tsx`)
- Cache invalidation occurs automatically after mutations (create, update, delete)

### Form Validation
- React Hook Form for performant form handling
- Zod schemas for type-safe validation
- Real-time validation feedback

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Product table switches to card layout on mobile
- Responsive grid layouts for filters and forms

## Testing

The project includes sample unit and integration tests:

- **Unit Tests**: Utility functions (`storage`, `useDebounce`)
- **Integration Tests**: Login flow, component rendering

Run tests with:
```bash
npm run test
```

## Configuration Files

- `.eslintrc.json` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `vite.config.ts` - Vite build configuration
- `vitest.config.ts` - Vitest test configuration
- `tsconfig.json` - TypeScript configuration

## Browser Support

Modern browsers that support ES6+ features:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for recruitment purposes.
