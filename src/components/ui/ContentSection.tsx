// src/components/ui/ContentSection.tsx
import React, { type ReactNode } from 'react';

interface ContentSectionProps {
  title: string;
  description?: string;
  icon?: React.ElementType;
  children: ReactNode;
  className?: string;
  headerActions?: ReactNode;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = '',
  headerActions
}) => {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            {Icon && <Icon className="h-5 w-5 mr-2 text-primary-600" />}
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
        {headerActions && (
          <div className="flex items-center space-x-2">
            {headerActions}
          </div>
        )}
      </div>
      {children}
    </div>
  );
};