import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldError } from 'react-hook-form';
import { productFormSchema, type ProductFormSchema } from '../utils/validation';
import { useCategories } from '../hooks/useProducts';
import { LoadingSpinner } from './LoadingSpinner';
import { FormInput, FormTextarea, FormSelect, FormField } from './forms';
import type { Product } from '../types/product.types';

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormSchema) => void;
  isLoading?: boolean;
}

export const ProductForm = ({
  product,
  onSubmit,
  isLoading = false,
}: ProductFormProps) => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product
      ? {
          title: product.title,
          price: product.price,
          description: product.description,
          images: product.images,
          categoryId: product.category.id,
        }
      : {
          title: '',
          price: 0,
          description: '',
          images: [''],
          categoryId: 0,
        },
  });

  const images = watch('images');

  const addImageField = () => {
    setValue('images', [...images, ''], { shouldValidate: false });
  };

  const removeImageField = (index: number) => {
    setValue(
      'images',
      images.filter((_, i) => i !== index)
    );
  };

  if (categoriesLoading) {
    return <LoadingSpinner />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <FormInput
        label="Title"
        required
        type="text"
        {...register('title')}
        error={errors.title}
      />

      <FormInput
        label="Price"
        required
        type="number"
        step="0.01"
        min="0"
        {...register('price', { valueAsNumber: true })}
        error={errors.price}
      />

      <FormTextarea
        label="Description"
        required
        rows={4}
        {...register('description')}
        error={errors.description}
      />

      <FormSelect
        label="Category"
        required
        placeholder="Select a category"
        options={[
          { value: 0, label: 'Select a category' },
          ...(categories?.map((category) => ({
            value: category.id,
            label: category.name,
          })) || []),
        ]}
        {...register('categoryId', { valueAsNumber: true })}
        error={errors.categoryId}
      />

      <FormField
        label="Images (URLs)"
        required
        error={errors.images as FieldError | undefined}
      >
        <div className="space-y-2">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={addImageField}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + Add Image
            </button>
          </div>
          {images.map((_, index) => (
            <div key={index} className="flex gap-2">
              <FormInput
                type="url"
                {...register(`images.${index}`)}
                placeholder="https://example.com/image.jpg"
                className="flex-1"
                error={errors.images?.[index]}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImageField(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </FormField>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

