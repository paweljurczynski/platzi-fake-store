import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FormInput } from '../FormInput';
import type { FieldError } from 'react-hook-form';

describe('FormInput', () => {
  it('should render input without label', () => {
    render(<FormInput type="text" placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe('INPUT');
  });

  it('should render input with label', () => {
    render(<FormInput label="Test Label" type="text" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  it('should show required indicator when required', () => {
    render(<FormInput label="Test Label" required type="text" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should display error message', () => {
    const error: FieldError = {
      type: 'required',
      message: 'This field is required',
    };
    render(<FormInput type="text" error={error} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should not display error when error is undefined', () => {
    render(<FormInput type="text" />);
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
  });

  it('should apply error styling when error exists', () => {
    const error: FieldError = {
      type: 'required',
      message: 'Error',
    };
    render(<FormInput type="text" error={error} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('should pass through all input props', () => {
    render(
      <FormInput
        type="email"
        placeholder="Email"
        name="email"
        id="email-input"
        data-testid="test-input"
      />
    );
    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
    expect(input).toHaveAttribute('id', 'email-input');
  });

  it('should display help text when provided', () => {
    render(<FormInput label="Test" helpText="This is help text" type="text" />);
    expect(screen.getByText('This is help text')).toBeInTheDocument();
  });
});

