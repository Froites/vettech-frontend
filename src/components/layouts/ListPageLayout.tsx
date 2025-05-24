// src/components/layouts/ListPageLayout.tsx
import React, { type ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { Search, Filter, Plus } from 'lucide-react';
import { Layout } from '../layout/Layout';

interface StatCard {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'gray';
}

interface FilterOption {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

interface CreateButton {
  text: string;
  href: string;
  show?: boolean;
}

interface ListPageLayoutProps {
  // Header
  title: string;
  description: string;
  createButton?: CreateButton;
  
  // Stats (opcional)
  stats?: StatCard[];
  
  // Search & Filters
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  activeFilters?: Record<string, string>;
  onFilterChange?: (key: string, value: string) => void;
  
  // Content
  children: ReactNode;
  
  // Loading & Empty states
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyState?: {
    icon: React.ElementType;
    title: string;
    description: string;
    action?: {
      text: string;
      onClick: () => void;
    };
  };
  
  // Debug (opcional)
  debugInfo?: string;
}

const getColorClasses = (color: StatCard['color'] = 'primary') => {
  const colors = {
    primary: 'text-primary-600',
    success: 'text-success-600',
    warning: 'text-warning-600', 
    error: 'text-error-600',
    gray: 'text-gray-600'
  };
  return colors[color];
};

export const ListPageLayout: React.FC<ListPageLayoutProps> = ({
  title,
  description,
  createButton,
  stats,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  filters,
  activeFilters = {},
  onFilterChange,
  children,
  isLoading = false,
  isEmpty = false,
  emptyState,
  debugInfo
}) => {
  // Loading skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Empty state
  const EmptyState = () => {
    if (!emptyState) return null;
    
    const { icon: Icon, title: emptyTitle, description: emptyDesc, action } = emptyState;
    
    return (
      <div className="text-center py-12">
        <Icon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyTitle}</h3>
        <p className="text-gray-600 mb-6">{emptyDesc}</p>
        {action && (
          <button 
            onClick={action.onClick}
            className="btn btn-primary btn-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            {action.text}
          </button>
        )}
      </div>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600">{description}</p>
          </div>
          
          {createButton && createButton.show !== false && (
            <Link to={createButton.href}>
              <button className="btn btn-primary btn-md">
                <Plus className="h-4 w-4 mr-2" />
                {createButton.text}
              </button>
            </Link>
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

        {/* Stats Cards */}
        {stats && stats.length > 0 && (
          <div className={`grid grid-cols-1 md:grid-cols-${Math.min(stats.length, 4)} gap-6`}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center">
                    <Icon className={`h-8 w-8 ${getColorClasses(stat.color)}`} />
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className={`text-2xl font-bold ${getColorClasses(stat.color)}`}>
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Search & Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            {/* Filters */}
            {filters && filters.length > 0 && (
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-600" />
                {filters.map((filter) => (
                  <select
                    key={filter.key}
                    value={activeFilters[filter.key] || ''}
                    onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">{filter.label}</option>
                    {filter.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : isEmpty ? (
          <EmptyState />
        ) : (
          children
        )}
      </div>
    </Layout>
  );
};