import React from 'react';
import { clsx } from 'clsx';

interface StatsCardProps {
  icon: React.ElementType;
  label: string;
  value: number | string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'gray';
  subtitle?: string;
  loading?: boolean;
  className?: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon: Icon,
  label,
  value,
  color = 'primary',
  subtitle,
  loading = false,
  className,
  onClick
}) => {
  // 🎨 Mapeamento de cores baseado no padrão existente
  const colorClasses = {
    primary: 'text-primary-600',
    success: 'text-success-600', 
    warning: 'text-warning-600',
    error: 'text-error-600',
    gray: 'text-gray-600'
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={clsx(
        'bg-white shadow rounded-lg p-6',
        onClick && 'hover:shadow-md hover:bg-gray-50 transition-all cursor-pointer',
        className
      )}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {loading ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <Icon className={clsx('h-8 w-8', colorClasses[color])} />
          )}
        </div>
        <div className="ml-4 flex-1 min-w-0">
          <p className="text-sm text-gray-600 truncate">{label}</p>
          <p className={clsx(
            'text-2xl font-bold truncate',
            colorClasses[color]
          )}>
            {loading ? '...' : value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 truncate mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </Component>
  );
};

export default StatsCard;