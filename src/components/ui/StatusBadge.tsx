import React from 'react';
import { clsx } from 'clsx';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Pause,
  AlertCircle,
  Info,
  Zap
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  color?: 'primary' | 'success' | 'warning' | 'error' | 'gray' | 'info';
  icon?: React.ElementType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  customText?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  color,
  icon,
  size = 'md',
  className,
  showIcon = true,
  customText
}) => {
  // 🎨 Mapeamento automático de cores baseado no status
  const getAutoColor = (status: string): NonNullable<StatusBadgeProps['color']> => {
    const statusColors: Record<string, NonNullable<StatusBadgeProps['color']>> = {
      // Appointment statuses
      'SCHEDULED': 'primary',
      'IN_PROGRESS': 'success', 
      'COMPLETED': 'gray',
      'CANCELLED': 'error',
      'NO_SHOW': 'warning',
      
      // Prescription statuses
      'ACTIVE': 'success',
      'EXPIRED': 'error',
      'DISPENSED': 'gray',
      
      // Medical record statuses
      'DRAFT': 'warning',
      'FINALIZED': 'success',
      
      // General statuses
      'PENDING': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'error',
      'REVIEW': 'info',
      
      // Pet statuses
      'HEALTHY': 'success',
      'SICK': 'error',
      'RECOVERING': 'warning',
      
      // User statuses
      'AVAILABLE': 'success',
      'UNAVAILABLE': 'error',
      'BUSY': 'warning'
    };
    
    return statusColors[status.toUpperCase()] || 'gray';
  };

  // 🎯 Mapeamento automático de ícones baseado no status
  const getAutoIcon = (status: string): React.ElementType => {
    const statusIcons: Record<string, React.ElementType> = {
      // Appointment statuses
      'SCHEDULED': Clock,
      'IN_PROGRESS': Play,
      'COMPLETED': CheckCircle,
      'CANCELLED': XCircle,
      'NO_SHOW': AlertCircle,
      
      // Prescription statuses
      'ACTIVE': CheckCircle,
      'EXPIRED': AlertTriangle,
      'DISPENSED': CheckCircle,
      
      // Medical record statuses
      'DRAFT': Clock,
      'FINALIZED': CheckCircle,
      
      // General statuses
      'PENDING': Clock,
      'APPROVED': CheckCircle,
      'REJECTED': XCircle,
      'REVIEW': Info,
      
      // Pet statuses
      'HEALTHY': CheckCircle,
      'SICK': AlertTriangle,
      'RECOVERING': Clock,
      
      // User statuses
      'AVAILABLE': CheckCircle,
      'UNAVAILABLE': XCircle,
      'BUSY': Pause
    };
    
    return statusIcons[status.toUpperCase()] || Clock;
  };

  // 🎨 Mapeamento de textos em português
  const getStatusText = (status: string): string => {
    const statusTexts: Record<string, string> = {
      // Appointment statuses
      'SCHEDULED': 'Agendado',
      'IN_PROGRESS': 'Em Andamento',
      'COMPLETED': 'Concluído',
      'CANCELLED': 'Cancelado',
      'NO_SHOW': 'Não Compareceu',
      
      // Prescription statuses
      'ACTIVE': 'Ativa',
      'EXPIRED': 'Expirada',
      'DISPENSED': 'Dispensada',
      
      // Medical record statuses
      'DRAFT': 'Rascunho',
      'FINALIZED': 'Finalizado',
      
      // General statuses
      'PENDING': 'Pendente',
      'APPROVED': 'Aprovado',
      'REJECTED': 'Rejeitado',
      'REVIEW': 'Em Análise',
      
      // Pet statuses
      'HEALTHY': 'Saudável',
      'SICK': 'Doente',
      'RECOVERING': 'Recuperando',
      
      // User statuses
      'AVAILABLE': 'Disponível',
      'UNAVAILABLE': 'Indisponível',
      'BUSY': 'Ocupado'
    };
    
    return statusTexts[status.toUpperCase()] || status;
  };

  // Usar cor automática se não especificada
  const finalColor = color || getAutoColor(status);
  
  // Usar ícone automático se não especificado
  const Icon = icon || getAutoIcon(status);
  
  // Usar texto customizado ou automático
  const displayText = customText || getStatusText(status);

  // 🎨 Classes de estilo baseadas na cor
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800', 
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
    gray: 'bg-gray-100 text-gray-800',
    info: 'bg-blue-100 text-blue-800'
  };

  // 🎨 Classes de tamanho
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1 text-sm', 
    lg: 'px-3 py-1.5 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <span className={clsx(
      'inline-flex items-center rounded-full font-medium',
      colorClasses[finalColor],
      sizeClasses[size],
      className
    )}>
      {showIcon && (
        <Icon className={clsx(iconSizes[size], 'mr-1')} />
      )}
      {displayText}
    </span>
  );
};

export default StatusBadge;