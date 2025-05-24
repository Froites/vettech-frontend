// src/components/layouts/DetailsPageLayout.tsx
import React, { type ReactNode } from 'react';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Layout } from '../layout/Layout';

interface InfoCard {
  icon: React.ElementType;
  title: string;
  items: Array<{
    label: string;
    value: string | ReactNode;
  }>;
}

interface ActionButton {
  text: string;
  icon?: React.ElementType;
  onClick: () => void;
  variant?: 'primary' | 'outline' | 'success' | 'warning' | 'error';
  disabled?: boolean;
  loading?: boolean;
}

interface StatusBadge {
  text: string;
  icon?: React.ElementType;
  color: 'primary' | 'success' | 'warning' | 'error' | 'gray';
}

interface DetailsPageLayoutProps {
  // Header
  title: string;
  subtitle?: string;
  onBack: () => void;
  backText?: string;
  
  // Header icon and status
  headerIcon?: React.ElementType;
  status?: StatusBadge;
  
  // Info Cards (3-column layout)
  infoCards?: InfoCard[];
  
  // Content sections
  children: ReactNode;
  
  // Actions
  actions?: ActionButton[];
  
  // Loading & Error states
  isLoading?: boolean;
  error?: {
    title: string;
    description: string;
  };
  
  // Debug (opcional)
  debugInfo?: string;
}

const getStatusColorClasses = (color: StatusBadge['color']) => {
  const colors = {
    primary: 'text-primary-600 bg-primary-100',
    success: 'text-success-600 bg-success-100',
    warning: 'text-warning-600 bg-warning-100',
    error: 'text-error-600 bg-error-100',
    gray: 'text-gray-600 bg-gray-100'
  };
  return colors[color];
};

const getButtonClasses = (variant: ActionButton['variant'] = 'outline') => {
  const variants = {
    primary: 'btn btn-primary',
    outline: 'btn btn-outline',
    success: 'btn btn-success',
    warning: 'btn btn-warning',
    error: 'btn btn-error'
  };
  return `${variants[variant]} btn-md`;
};

export const DetailsPageLayout: React.FC<DetailsPageLayoutProps> = ({
  title,
  subtitle,
  onBack,
  backText = "Voltar",
  headerIcon: HeaderIcon,
  status,
  infoCards = [],
  children,
  actions = [],
  isLoading = false,
  error,
  debugInfo
}) => {
  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertTriangle className="mx-auto h-12 w-12 text-error-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{error.title}</h3>
          <p className="text-gray-600">{error.description}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
            title={backText}
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-4 flex-1">
            {HeaderIcon && (
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <HeaderIcon className="h-6 w-6 text-primary-600" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
          
          {/* Status Badge */}
          {status && (
            <div className="ml-auto">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClasses(status.color)}`}>
                {status.icon && <status.icon className="h-4 w-4 mr-1" />}
                {status.text}
              </span>
            </div>
          )}
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Debug:</strong> {debugInfo}
            </p>
          </div>
        )}

        {/* Info Cards */}
        {infoCards.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(infoCards.length, 3)} gap-6`}>
            {infoCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Icon className="h-5 w-5 text-primary-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">{card.title}</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    {card.items.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <span className="text-gray-500">{item.label}:</span>
                        <span className="ml-2 font-medium">
                          {typeof item.value === 'string' ? item.value : item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Content */}
        {children}

        {/* Actions */}
        {actions.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-wrap gap-3">
                {actions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.onClick}
                      disabled={action.disabled || action.loading}
                      className={getButtonClasses(action.variant)}
                    >
                      {action.loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                      ) : (
                        Icon && <Icon className="h-4 w-4 mr-1" />
                      )}
                      {action.text}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};