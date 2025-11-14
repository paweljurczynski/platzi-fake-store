import { forwardRef } from 'react';
import { FormField } from './FormField';
import { FormError } from './FormError';
import type { FieldError } from 'react-hook-form';

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: FieldError;
  helpText?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      required = false,
      error,
      helpText,
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
    const textareaClasses = `${baseClasses} ${errorClasses} ${className}`;

    const textarea = (
      <textarea
        ref={ref}
        className={textareaClasses}
        {...props}
        aria-invalid={error ? 'true' : 'false'}
      />
    );

    if (label || helpText) {
      return (
        <FormField label={label} required={required} error={error} helpText={helpText}>
          {textarea}
        </FormField>
      );
    }

    return (
      <>
        {textarea}
        {error && <FormError error={error} />}
      </>
    );
  }
);

FormTextarea.displayName = 'FormTextarea';

