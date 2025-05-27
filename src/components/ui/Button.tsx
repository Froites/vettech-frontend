import React, { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    children,
    className,
    ...props
  }, ref) => {
    
    // 🎨 Variant Styles
    const variantClasses = {
      primary: [
        'bg-primary-600 text-white border-primary-600',
        'hover:bg-primary-700 hover:border-primary-700',
        'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:bg-primary-300 disabled:border-primary-300',
        'active:bg-primary-800 active:border-primary-800'
      ].join(' '),
      
      secondary: [
        'bg-secondary-600 text-white border-secondary-600',
        'hover:bg-secondary-700 hover:border-secondary-700',
        'focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2',
        'disabled:bg-secondary-300 disabled:border-secondary-300',
        'active:bg-secondary-800 active:border-secondary-800'
      ].join(' '),
      
      outline: [
        'bg-transparent text-gray-700 border-gray-300',
        'hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400',
        'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:text-gray-400 disabled:border-gray-200 disabled:bg-transparent',
        'active:bg-gray-100'
      ].join(' '),
      
      ghost: [
        'bg-transparent text-gray-600 border-transparent',
        'hover:bg-gray-100 hover:text-gray-900',
        'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
        'disabled:text-gray-400 disabled:hover:bg-transparent',
        'active:bg-gray-200'
      ].join(' '),
      
      danger: [
        'bg-error-600 text-white border-error-600',
        'hover:bg-error-700 hover:border-error-700',
        'focus:ring-2 focus:ring-error-500 focus:ring-offset-2',
        'disabled:bg-error-300 disabled:border-error-300',
        'active:bg-error-800 active:border-error-800'
      ].join(' ')
    };

    // 📏 Size Styles
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm leading-4',
      md: 'px-4 py-2 text-sm leading-5',
      lg: 'px-6 py-3 text-base leading-6'
    };

    // 🔄 Icon Sizes
    const iconSizes = {
      sm: 'h-4 w-4',
      md: 'h-4 w-4', 
      lg: 'h-5 w-5'
    };

    // 🎯 Base Classes
    const baseClasses = [
      'inline-flex items-center justify-center',
      'border font-medium rounded-md',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none focus:ring-offset-white',
      'disabled:cursor-not-allowed disabled:opacity-50',
      fullWidth && 'w-full'
    ].filter(Boolean).join(' ');

    // 📦 Combined Classes
    const buttonClasses = clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    // 🔄 Loading Icon
    const LoadingIcon = () => (
      <Loader2 className={clsx(iconSizes[size], 'animate-spin')} />
    );

    // 🎨 Regular Icon
    const RegularIcon = () => Icon && (
      <Icon className={clsx(iconSizes[size])} />
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {/* Left Icon/Loading */}
        {loading && iconPosition === 'left' && (
          <span className={children ? 'mr-2' : ''}>
            <LoadingIcon />
          </span>
        )}
        
        {!loading && Icon && iconPosition === 'left' && (
          <span className={children ? 'mr-2' : ''}>
            <RegularIcon />
          </span>
        )}

        {/* Button Text */}
        {children}

        {/* Right Icon/Loading */}
        {loading && iconPosition === 'right' && (
          <span className={children ? 'ml-2' : ''}>
            <LoadingIcon />
          </span>
        )}
        
        {!loading && Icon && iconPosition === 'right' && (
          <span className={children ? 'ml-2' : ''}>
            <RegularIcon />
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;