import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormSelect } from '../FormSelect';
import type { FieldError } from 'react-hook-form';

describe('FormSelect', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
  ];

  it('should render select without label', () => {
    render(<FormSelect options={options} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select.tagName).toBe('SELECT');
  });

  it('should render select with label', () => {
    render(<FormSelect label="Test Label" options={options} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
  });

  it('should show required indicator when required', () => {
    render(<FormSelect label="Test Label" required options={options} />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<FormSelect options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('should render placeholder option when provided', () => {
    render(<FormSelect options={options} placeholder="Select an option" />);
    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('should display error message', () => {
    const error: FieldError = {
      type: 'required',
      message: 'This field is required',
    };
    render(<FormSelect options={options} error={error} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('should not display error when error is undefined', () => {
    render(<FormSelect options={options} />);
    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
  });

  it('should apply error styling when error exists', () => {
    const error: FieldError = {
      type: 'required',
      message: 'Error',
    };
    render(<FormSelect options={options} error={error} />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  it('should handle value change', async () => {
    const user = userEvent.setup();
    render(<FormSelect options={options} />);
    const select = screen.getByRole('combobox');
    
    await user.selectOptions(select, '2');
    expect(select).toHaveValue('2');
  });

  it('should support numeric values', () => {
    const numericOptions = [
      { value: 1, label: 'One' },
      { value: 2, label: 'Two' },
    ];
    render(<FormSelect options={numericOptions} />);
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('should pass through all select props', () => {
    render(
      <FormSelect
        options={options}
        name="test-select"
        id="test-select"
        data-testid="test-select"
      />
    );
    const select = screen.getByTestId('test-select');
    expect(select).toHaveAttribute('name', 'test-select');
    expect(select).toHaveAttribute('id', 'test-select');
  });
});

