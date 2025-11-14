import { forwardRef } from 'react';
import { FormField } from './FormField';
import { FormError } from './FormError';
import type { FieldError } from 'react-hook-form';

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  error?: FieldError;
  helpText?: string;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      required = false,
      error,
      helpText,
      options,
      placeholder,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors';
    const errorClasses = error
      ? 'border-red-300 focus:ring-red-500'
      : 'border-gray-300 focus:ring-blue-500';
    const selectClasses = `${baseClasses} ${errorClasses} ${className}`;

    const select = (
      <select
        ref={ref}
        className={selectClasses}
        {...props}
        aria-invalid={error ? 'true' : 'false'}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );

    if (label || helpText) {
      return (
        <FormField label={label} required={required} error={error} helpText={helpText}>
          {select}
        </FormField>
      );
    }

    return (
      <>
        {select}
        {error && <FormError error={error} />}
      </>
    );
  }
);

FormSelect.displayName = 'FormSelect';

