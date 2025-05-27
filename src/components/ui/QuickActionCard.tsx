import React from 'react';
import { clsx } from 'clsx';

interface QuickActionCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick?: () => void;
  className?: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  onClick,
  className
}) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={clsx(
        'flex items-center p-4 bg-gray-50 rounded-lg transition-colors',
        onClick && 'hover:bg-gray-100 cursor-pointer',
        className
      )}
    >
      <Icon className="h-10 w-10 text-primary-600 mr-3" />
      <div className="text-left">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </Component>
  );
};

export default QuickActionCard;