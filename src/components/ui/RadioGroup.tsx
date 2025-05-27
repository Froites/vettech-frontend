// src/components/ui/RadioGroup.tsx - SELEÇÃO VISUAL APRIMORADA COMPLETA
import React, { createContext, useContext, forwardRef } from 'react';
import { clsx } from 'clsx';

// 🎯 Context para gerenciar estado do grupo
interface RadioGroupContextType {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextType>({});

// 📦 RadioGroup Container
interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  layout?: 'grid' | 'flex';
  columns?: 2 | 3 | 4;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  name,
  disabled = false,
  className,
  children,
  layout = 'grid',
  columns = 3
}) => {
  const layoutClasses = {
    grid: `grid grid-cols-1 sm:grid-cols-${columns} gap-3`,
    flex: 'flex flex-wrap gap-3'
  };

  return (
    <RadioGroupContext.Provider 
      value={{ value, onChange, name, disabled }}
    >
      <div className={clsx(layoutClasses[layout], className)}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

// 🎨 RadioGroup Item
interface RadioGroupItemProps {
  value: string;
  children: React.ReactNode;
  icon?: string | React.ElementType;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, children, icon, description, disabled = false, className }, ref) => {
    const context = useContext(RadioGroupContext);
    const isSelected = context.value === value;
    const isDisabled = disabled || context.disabled;

    const handleChange = () => {
      if (!isDisabled && context.onChange) {
        context.onChange(value);
      }
    };

    // 🎨 Dynamic Classes
    const itemClasses = clsx(
      // Base styles
      'relative flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200',
      
      // Selected state
      isSelected && [
        'border-primary-500 bg-primary-50',
        'ring-2 ring-primary-500 ring-offset-2'
      ],
      
      // Default state
      !isSelected && 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300',
      
      // Disabled state
      isDisabled && 'opacity-50 cursor-not-allowed hover:bg-white hover:border-gray-200',
      
      // Focus state
      'focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
      
      className
    );

    // 🎯 Icon Rendering
    const renderIcon = () => {
      if (!icon) return null;
      
      if (typeof icon === 'string') {
        // String icon (emoji)
        return (
          <span className="text-2xl mr-3 flex-shrink-0">
            {icon}
          </span>
        );
      } else {
        // React Component icon
        const IconComponent = icon;
        return (
          <IconComponent className={clsx(
            'h-6 w-6 mr-3 flex-shrink-0',
            isSelected ? 'text-primary-600' : 'text-gray-400'
          )} />
        );
      }
    };

    return (
      <label className={itemClasses}>
        {/* Hidden Radio Input */}
        <input
          ref={ref}
          type="radio"
          name={context.name}
          value={value}
          checked={isSelected}
          onChange={handleChange}
          disabled={isDisabled}
          className="sr-only"
        />

        {/* Icon */}
        {renderIcon()}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className={clsx(
            'font-medium text-sm',
            isSelected ? 'text-primary-900' : 'text-gray-900'
          )}>
            {children}
          </div>
          
          {description && (
            <div className="text-xs text-gray-500 mt-1">
              {description}
            </div>
          )}
        </div>

        {/* Selection Indicator */}
        <div className={clsx(
          'ml-3 flex-shrink-0 w-4 h-4 rounded-full border-2 transition-all',
          isSelected 
            ? 'border-primary-500 bg-primary-500' 
            : 'border-gray-300 bg-white'
        )}>
          {isSelected && (
            <div className="w-full h-full rounded-full bg-white scale-50"></div>
          )}
        </div>
      </label>
    );
  }
);

RadioGroupItem.displayName = 'RadioGroupItem';

// 🐾 Pet Species Preset Component COMPLETO
interface PetSpeciesOption {
  value: string;
  label: string;
  emoji: string;
  description?: string;
}

interface PetSpeciesRadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

export const PetSpeciesRadioGroup: React.FC<PetSpeciesRadioGroupProps> = ({
  value,
  onChange,
  name = 'species',
  error,
  required = false,
  className
}) => {
  const speciesOptions: PetSpeciesOption[] = [
    { 
      value: 'DOG', 
      label: 'Cão', 
      emoji: '🐕',
      description: 'Cachorro doméstico'
    },
    { 
      value: 'CAT', 
      label: 'Gato', 
      emoji: '🐱',
      description: 'Felino doméstico'
    },
    { 
      value: 'BIRD', 
      label: 'Ave', 
      emoji: '🐦',
      description: 'Pássaro ou ave'
    },
    { 
      value: 'RABBIT', 
      label: 'Coelho', 
      emoji: '🐰',
      description: 'Coelho doméstico'
    },
    { 
      value: 'OTHER', 
      label: 'Outro', 
      emoji: '🐾',
      description: 'Outros tipos de animais'
    },
  ];

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Espécie do Animal {required && <span className="text-error-500">*</span>}
      </label>
      
      <RadioGroup
        value={value}
        onChange={onChange}
        name={name}
        columns={3}
      >
        {speciesOptions.map((option) => (
          <RadioGroupItem
            key={option.value}
            value={option.value}
            icon={option.emoji}
            description={option.description}
          >
            {option.label}
          </RadioGroupItem>
        ))}
      </RadioGroup>
      
      {error && (
        <p className="mt-2 text-sm text-error-600">{error}</p>
      )}
    </div>
  );
};

// Export default para compatibilidade
export default RadioGroup;