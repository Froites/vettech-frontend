// src/components/layouts/CreatePageLayout.tsx
import React, { type ReactNode } from 'react';

import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Layout } from '../layout/Layout';

interface CreatePageLayoutProps {
  // Header
  title: string;
  description?: string;
  onBack: () => void;
  
  // Form handling
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting?: boolean;
  
  // Content
  children: ReactNode;
  
  // Actions
  cancelText?: string;
  submitText?: string;
  submitIcon?: React.ElementType;
  onCancel?: () => void;
  
  // Success state
  showSuccess?: boolean;
  successTitle?: string;
  successDescription?: string;
  
  // Debug (opcional)
  debugInfo?: string;
  
  // Summary (opcional)
  summary?: {
    title: string;
    items: Array<{
      label: string;
      value: string;
    }>;
  };
}

export const CreatePageLayout: React.FC<CreatePageLayoutProps> = ({
  title,
  description,
  onBack,
  onSubmit,
  isSubmitting = false,
  children,
  cancelText = "Cancelar",
  submitText = "Salvar",
  submitIcon: SubmitIcon,
  onCancel,
  showSuccess = false,
  successTitle = "Criado com sucesso!",
  successDescription = "Redirecionando...",
  debugInfo,
  summary
}) => {
  // Success Screen
  if (showSuccess) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {successTitle}
            </h2>
            <p className="text-gray-600 mb-6">
              {successDescription}
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          </div>
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
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            {description && (
              <p className="text-gray-600">{description}</p>
            )}
          </div>
        </div>

        {/* Debug Info */}
        {debugInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Debug:</strong> {debugInfo}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-8">
          {children}

          {/* Summary Section */}
          {summary && summary.items.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{summary.title}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  {summary.items.map((item, index) => (
                    <p key={index}>
                      <strong>{item.label}:</strong> {item.value}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onCancel || onBack}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                {cancelText}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    {SubmitIcon && <SubmitIcon className="h-4 w-4 mr-2" />}
                    {submitText}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};