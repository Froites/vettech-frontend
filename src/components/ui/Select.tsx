import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
  name?: string;
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  ({
    options,
    value,
    onChange,
    placeholder = 'Selecione uma opção...',
    disabled = false,
    error,
    label,
    required = false,
    className,
    name,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    const selectedOption = options.find(option => option.value === value);

    // 🔒 Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setHighlightedIndex(-1);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ⌨️ Keyboard navigation
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault();
            setHighlightedIndex(prev => 
              prev < options.length - 1 ? prev + 1 : 0
            );
            break;
          case 'ArrowUp':
            event.preventDefault();
            setHighlightedIndex(prev => 
              prev > 0 ? prev - 1 : options.length - 1
            );
            break;
          case 'Enter':
            event.preventDefault();
            if (highlightedIndex >= 0) {
              const option = options[highlightedIndex];
              if (!option.disabled) {
                onChange?.(option.value);
                setIsOpen(false);
                setHighlightedIndex(-1);
              }
            }
            break;
          case 'Escape':
            setIsOpen(false);
            setHighlightedIndex(-1);
            break;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, highlightedIndex, options, onChange]);

    // 📍 Scroll highlighted option into view
    useEffect(() => {
      if (highlightedIndex >= 0 && listRef.current) {
        const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
          });
        }
      }
    }, [highlightedIndex]);

    const handleToggle = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
        if (!isOpen) {
          setHighlightedIndex(-1);
        }
      }
    };

    const handleOptionClick = (option: SelectOption) => {
      if (!option.disabled) {
        onChange?.(option.value);
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    // 🎨 Trigger button classes
    const triggerClasses = clsx(
      // Base styles
      'relative w-full bg-white border rounded-md pl-3 pr-10 py-2 text-left cursor-pointer transition-all duration-200',
      
      // Focus styles
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      
      // State styles
      error 
        ? 'border-error-300' 
        : isOpen 
          ? 'border-primary-500 ring-2 ring-primary-500' 
          : 'border-gray-300 hover:border-gray-400',
      
      // Disabled styles
      disabled && 'bg-gray-50 text-gray-400 cursor-not-allowed hover:border-gray-300',
      
      className
    );

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-error-500">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div ref={containerRef} className="relative">
          <button
            ref={ref}
            type="button"
            name={name}
            className={triggerClasses}
            onClick={handleToggle}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            {...props}
          >
            {/* Selected Value */}
            <span className={clsx(
              'block truncate',
              selectedOption ? 'text-gray-900' : 'text-gray-500'
            )}>
              {selectedOption?.label || placeholder}
            </span>

            {/* Chevron Icon */}
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDown className={clsx(
                'h-4 w-4 transition-transform duration-200',
                isOpen && 'transform rotate-180',
                disabled ? 'text-gray-400' : 'text-gray-500'
              )} />
            </span>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <ul
              ref={listRef}
              className={clsx(
                'absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto',
                'border border-gray-200 focus:outline-none'
              )}
              role="listbox"
            >
              {options.map((option, index) => (
                <li
                  key={option.value}
                  className={clsx(
                    'relative cursor-pointer select-none py-2 pl-3 pr-9 transition-colors duration-150',
                    
                    // Highlighted state (keyboard navigation)
                    index === highlightedIndex && 'bg-primary-50 text-primary-900',
                    
                    // Selected state
                    option.value === value && index !== highlightedIndex && 'bg-primary-100 text-primary-900',
                    
                    // Default state
                    index !== highlightedIndex && option.value !== value && 'text-gray-900 hover:bg-gray-50',
                    
                    // Disabled state
                    option.disabled && 'text-gray-400 cursor-not-allowed hover:bg-white'
                  )}
                  onClick={() => handleOptionClick(option)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {/* Option Content */}
                  <div className="flex flex-col">
                    <span className={clsx(
                      'block truncate',
                      option.value === value ? 'font-semibold' : 'font-normal'
                    )}>
                      {option.label}
                    </span>
                    
                    {option.description && (
                      <span className="text-xs text-gray-500 mt-1">
                        {option.description}
                      </span>
                    )}
                  </div>

                  {/* Check Icon for Selected */}
                  {option.value === value && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Check className="h-4 w-4 text-primary-600" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;