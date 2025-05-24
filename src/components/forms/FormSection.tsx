// src/components/forms/FormSection.tsx
import React, { type ReactNode } from 'react';

interface FormSectionProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: ReactNode;
  className?: string;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white shadow rounded-lg p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          {Icon && <Icon className="h-5 w-5 mr-2 text-primary-600" />}
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};