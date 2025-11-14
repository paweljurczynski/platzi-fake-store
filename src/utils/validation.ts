import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(6, 'Password must be at least 6 characters');

export const urlSchema = z
  .string()
  .url('Must be a valid URL')
  .or(z.literal(''));

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const productFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters'),
  price: z
    .number({ message: 'Price must be a number' })
    .min(0, 'Price must be positive'),
  description: z.string().min(1, 'Description is required'),
  images: z
    .array(z.string().url('Must be a valid URL'))
    .min(1, 'At least one image URL is required'),
  categoryId: z
    .number({ message: 'Category must be selected' })
    .min(1, 'Category is required'),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;

// Helper to convert NaN to undefined for optional number fields
const optionalNumber = z.preprocess(
  (val: unknown) => {
    if (typeof val === 'number' && Number.isNaN(val)) {
      return undefined;
    }
    return val;
  },
  z.number().optional()
);

// Helper for optional positive numbers (for prices)
const optionalPositiveNumber = optionalNumber.refine(
  (val) => val === undefined || val >= 0,
  {
    message: 'Price must be positive or zero',
  }
);

export const filterSchema = z
  .object({
    title: z.string().optional(),
    categoryId: z.number().optional(),
    price_min: optionalPositiveNumber,
    price_max: optionalPositiveNumber,
  })
  .refine(
    (data) => {
      if (data.price_min != null && data.price_max != null) {
        return data.price_min <= data.price_max;
      }
      return true;
    },
    {
      message: 'Min price cannot be greater than max price',
      path: ['price_max'],
    }
  );

export type FilterSchema = z.infer<typeof filterSchema>;

