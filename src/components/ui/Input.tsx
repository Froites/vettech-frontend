import { 
  forwardRef,
  type InputHTMLAttributes, 
  type TextareaHTMLAttributes, 
  type SelectHTMLAttributes
} from 'react';
import { clsx } from 'clsx';

interface BaseInputProps {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, BaseInputProps {
  as?: 'input';
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, BaseInputProps {
  as: 'textarea';
  rows?: number;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, BaseInputProps {
  as: 'select';
  options?: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
  placeholder?: string;
}

type UnifiedInputProps = InputProps | TextareaProps | SelectProps;

const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  UnifiedInputProps
>(({ className, label, error, helper, required, as = 'input', ...props }, ref) => {
  
  const baseClasses = clsx(
    'block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    'transition-colors duration-200',
    error ? 'border-error-300 focus:ring-error-500 focus:border-error-500' : 'border-gray-300',
    'disabled:bg-gray-50 disabled:text-gray-500',
    className
  );

  const renderInput = () => {
    switch (as) {
      case 'textarea':
        const textareaProps = props as TextareaProps;
        return (
          <textarea
            className={baseClasses}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            rows={textareaProps.rows || 3}
            {...(textareaProps as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        );

      case 'select':
        const selectProps = props as SelectProps;
        return (
          <select
            className={baseClasses}
            ref={ref as React.Ref<HTMLSelectElement>}
            {...(selectProps as SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {selectProps.placeholder && (
              <option value="">{selectProps.placeholder}</option>
            )}
            {selectProps.options?.map((option, index) => (
              <option 
                key={option.value || index} 
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
            {selectProps.children}
          </select>
        );

      default:
        return (
          <input
            className={baseClasses}
            ref={ref as React.Ref<HTMLInputElement>}
            {...(props as InputHTMLAttributes<HTMLInputElement>)}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-error-500">*</span>}
        </label>
      )}
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-error-600">{error}</p>
      )}
      {helper && !error && (
        <p className="mt-1 text-sm text-gray-500">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;