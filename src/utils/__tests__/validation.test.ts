import { describe, it, expect } from 'vitest';
import {
  filterSchema,
  loginSchema,
  productFormSchema,
  emailSchema,
  passwordSchema,
  urlSchema,
} from '../validation';

describe('validation', () => {
  describe('emailSchema', () => {
    it('should validate correct email', () => {
      expect(emailSchema.parse('test@example.com')).toBe('test@example.com');
    });

    it('should reject empty email', () => {
      expect(() => emailSchema.parse('')).toThrow('Email is required');
    });

    it('should reject invalid email format', () => {
      expect(() => emailSchema.parse('invalid-email')).toThrow('Invalid email address');
    });
  });

  describe('passwordSchema', () => {
    it('should validate password with 6+ characters', () => {
      expect(passwordSchema.parse('password123')).toBe('password123');
    });

    it('should reject empty password', () => {
      expect(() => passwordSchema.parse('')).toThrow('Password is required');
    });

    it('should reject password shorter than 6 characters', () => {
      expect(() => passwordSchema.parse('12345')).toThrow('Password must be at least 6 characters');
    });
  });

  describe('urlSchema', () => {
    it('should validate correct URL', () => {
      expect(urlSchema.parse('https://example.com/image.jpg')).toBe('https://example.com/image.jpg');
    });

    it('should validate empty string', () => {
      expect(urlSchema.parse('')).toBe('');
    });

    it('should reject invalid URL', () => {
      expect(() => urlSchema.parse('not-a-url')).toThrow('Must be a valid URL');
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };
      expect(loginSchema.parse(validData)).toEqual(validData);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '12345',
      };
      expect(() => loginSchema.parse(invalidData)).toThrow();
    });
  });

  describe('productFormSchema', () => {
    it('should validate correct product data', () => {
      const validData = {
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        images: ['https://example.com/image.jpg'],
        categoryId: 1,
      };
      expect(productFormSchema.parse(validData)).toEqual(validData);
    });

    it('should reject title shorter than 3 characters', () => {
      const invalidData = {
        title: 'AB',
        price: 99.99,
        description: 'Test description',
        images: ['https://example.com/image.jpg'],
        categoryId: 1,
      };
      expect(() => productFormSchema.parse(invalidData)).toThrow('Title must be at least 3 characters');
    });

    it('should reject negative price', () => {
      const invalidData = {
        title: 'Test Product',
        price: -10,
        description: 'Test description',
        images: ['https://example.com/image.jpg'],
        categoryId: 1,
      };
      expect(() => productFormSchema.parse(invalidData)).toThrow('Price must be positive');
    });

    it('should reject empty description', () => {
      const invalidData = {
        title: 'Test Product',
        price: 99.99,
        description: '',
        images: ['https://example.com/image.jpg'],
        categoryId: 1,
      };
      expect(() => productFormSchema.parse(invalidData)).toThrow('Description is required');
    });

    it('should reject empty images array', () => {
      const invalidData = {
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        images: [],
        categoryId: 1,
      };
      expect(() => productFormSchema.parse(invalidData)).toThrow('At least one image URL is required');
    });

    it('should reject invalid image URL', () => {
      const invalidData = {
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        images: ['not-a-url'],
        categoryId: 1,
      };
      expect(() => productFormSchema.parse(invalidData)).toThrow('Must be a valid URL');
    });

    it('should reject invalid categoryId', () => {
      const invalidData = {
        title: 'Test Product',
        price: 99.99,
        description: 'Test description',
        images: ['https://example.com/image.jpg'],
        categoryId: 0,
      };
      expect(() => productFormSchema.parse(invalidData)).toThrow('Category is required');
    });
  });

  describe('filterSchema', () => {
    it('should validate empty filter data', () => {
      const data = {};
      expect(filterSchema.parse(data)).toEqual(data);
    });

    it('should validate filter with only title', () => {
      const data = { title: 'test' };
      expect(filterSchema.parse(data)).toEqual(data);
    });

    it('should validate filter with only categoryId', () => {
      const data = { categoryId: 1 };
      expect(filterSchema.parse(data)).toEqual(data);
    });

    it('should validate filter with only price_min', () => {
      const data = { price_min: 10 };
      expect(filterSchema.parse(data)).toEqual(data);
    });

    it('should validate filter with only price_max', () => {
      const data = { price_max: 100 };
      expect(filterSchema.parse(data)).toEqual(data);
    });

    it('should validate filter with valid price range (min < max)', () => {
      const data = { price_min: 10, price_max: 100 };
      expect(filterSchema.parse(data)).toEqual(data);
    });

    it('should validate filter with valid price range (min = max)', () => {
      const data = { price_min: 50, price_max: 50 };
      expect(filterSchema.parse(data)).toEqual(data);
    });

    it('should reject filter with invalid price range (min > max)', () => {
      const data = { price_min: 100, price_max: 10 };
      const result = filterSchema.safeParse(data);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Min price cannot be greater than max price');
        expect(result.error.issues[0].path).toEqual(['price_max']);
      }
    });

    it('should validate filter with all fields', () => {
      const data = {
        title: 'test',
        categoryId: 1,
        price_min: 10,
        price_max: 100,
      };
      expect(filterSchema.parse(data)).toEqual(data);
    });

    it('should validate filter with all fields and valid price range', () => {
      const data = {
        title: 'test product',
        categoryId: 5,
        price_min: 20,
        price_max: 200,
      };
      expect(filterSchema.parse(data)).toEqual(data);
    });

    it('should convert NaN to undefined for price_min', () => {
      const data = { price_min: NaN };
      const result = filterSchema.parse(data);
      expect(result.price_min).toBeUndefined();
    });

    it('should convert NaN to undefined for price_max', () => {
      const data = { price_max: NaN };
      const result = filterSchema.parse(data);
      expect(result.price_max).toBeUndefined();
    });

    it('should convert NaN to undefined for both price fields', () => {
      const data = { price_min: NaN, price_max: NaN };
      const result = filterSchema.parse(data);
      expect(result.price_min).toBeUndefined();
      expect(result.price_max).toBeUndefined();
    });
  });
});

