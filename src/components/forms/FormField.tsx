import { FormError } from './FormError';
import type { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: FieldError;
  helpText?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export const FormField = ({
  label,
  required = false,
  error,
  helpText,
  children,
  className = '',
  labelClassName = '',
}: FormFieldProps) => {
  return (
    <div className={className}>
      {label && (
        <label
          className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      <FormError error={error} />
    </div>
  );
};

