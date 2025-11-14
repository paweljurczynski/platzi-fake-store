import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormError } from '../FormError';
import type { FieldError } from 'react-hook-form';

describe('FormError', () => {
  it('should render error message from string', () => {
    render(<FormError error="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  it('should render error message from FieldError', () => {
    const error: FieldError = {
      type: 'required',
      message: 'This field is required',
    };
    render(<FormError error={error} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should not render when error is undefined', () => {
    const { container } = render(<FormError error={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when error message is empty', () => {
    const error: FieldError = {
      type: 'required',
      message: '',
    };
    const { container } = render(<FormError error={error} />);
    expect(container.firstChild).toBeNull();
  });

  it('should apply custom className', () => {
    render(<FormError error="Error message" className="custom-class" />);
    const errorElement = screen.getByText('Error message');
    expect(errorElement).toHaveClass('custom-class');
  });

  it('should have default error styling', () => {
    render(<FormError error="Error message" />);
    const errorElement = screen.getByText('Error message');
    expect(errorElement).toHaveClass('text-red-600');
  });
});

