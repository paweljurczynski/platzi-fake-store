import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormTextarea } from '../FormTextarea';
import type { FieldError } from 'react-hook-form';

describe('FormTextarea', () => {
  it('should render textarea without label', () => {
    render(<FormTextarea placeholder="Enter text" />);
    const textarea = screen.getByPlaceholderText('Enter text');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('should render textarea with label', () => {
    render(<FormTextarea label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    const textarea = document.querySelector('textarea');
    expect(textarea).toBeInTheDocument();
  });

  it('should show required indicator when required', () => {
    render(<FormTextarea label="Test Label" required />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display error message', () => {
    const error: FieldError = {
      type: 'required',
      message: 'This field is required',
    };
    render(<FormTextarea error={error} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should not display error when error is undefined', () => {
    render(<FormTextarea />);
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
  });

  it('should apply error styling when error exists', () => {
    const error: FieldError = {
      type: 'required',
      message: 'Error',
    };
    render(<FormTextarea error={error} />);
    const textarea = document.querySelector('textarea');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('should pass through all textarea props', () => {
    render(
      <FormTextarea
        placeholder="Description"
        name="description"
        id="description-textarea"
        rows={5}
        data-testid="test-textarea"
      />
    );
    const textarea = screen.getByTestId('test-textarea');
    expect(textarea).toHaveAttribute('name', 'description');
    expect(textarea).toHaveAttribute('id', 'description-textarea');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('should display help text when provided', () => {
    render(<FormTextarea label="Test" helpText="This is help text" />);
    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });
});

