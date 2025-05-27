import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Square,
  Heart
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// 🎯 Tipos para o Appointment (baseado no uso atual)
interface Appointment {
  id: string;
  scheduledAt: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  type: 'ROUTINE' | 'EMERGENCY' | 'FOLLOW_UP';
  price: string;
  duration: number;
  notes?: string;
  pet?: {
    id: string;
    name: string;
    photoUrl?: string;
  };
  veterinarian?: {
    id: string;
    profile?: {
      firstName: string;
      lastName: string;
    };
  };
}

interface AppointmentCardProps {
  appointment: Appointment;
  showPetInfo?: boolean;
  compact?: boolean;
  onCancel?: (id: string, petName: string) => void;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
  isVet?: boolean;
  isLoading?: {
    cancelling?: boolean;
    starting?: boolean;
    completing?: boolean;
  };
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  showPetInfo = true,
  compact = false,
  onCancel,
  onStart,
  onComplete,
  isVet = false,
  isLoading = {}
}) => {
  // 🎨 Funções de formatação e display (reutilizadas do código original)
  const getStatusDisplay = (status: string) => {
    const statusMap = {
      'SCHEDULED': 'Agendado',
      'IN_PROGRESS': 'Em Andamento',
      'COMPLETED': 'Concluído',
      'CANCELLED': 'Cancelado',
      'NO_SHOW': 'Não Compareceu'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'IN_PROGRESS':
        return <Play className="h-4 w-4 text-green-500" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-gray-500" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'NO_SHOW':
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800';
      case 'NO_SHOW':
        return 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800';
      default:
        return 'inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800';
    }
  };

  const getTypeDisplay = (type: string) => {
    const typeMap = {
      'ROUTINE': 'Rotina',
      'EMERGENCY': 'Emergência', 
      'FOLLOW_UP': 'Retorno'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const formatDateTime = (dateTime: string) => {
    return format(parseISO(dateTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  const formatPrice = (price: string) => {
    return `R$ ${parseFloat(price).toFixed(2).replace('.', ',')}`;
  };

  // 🎯 Renderização das ações baseada no status e papel do usuário
  const renderActions = () => {
    const actions = [];

    // Ações para appointments agendados
    if (appointment.status === 'SCHEDULED') {
      if (isVet && onStart) {
        actions.push(
          <button
            key="start"
            onClick={() => onStart(appointment.id)}
            disabled={isLoading.starting}
            className="btn btn-success btn-sm"
          >
            {isLoading.starting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            Iniciar
          </button>
        );
      }
      
      if (onCancel) {
        actions.push(
          <button
            key="cancel"
            onClick={() => onCancel(appointment.id, appointment.pet?.name || 'Pet')}
            disabled={isLoading.cancelling}
            className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
          >
            {isLoading.cancelling ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-1"></div>
            ) : (
              <XCircle className="h-4 w-4 mr-1" />
            )}
            Cancelar
          </button>
        );
      }
    }

    // Ações para appointments em andamento
    if (appointment.status === 'IN_PROGRESS' && isVet && onComplete) {
      actions.push(
        <button
          key="complete"
          onClick={() => onComplete(appointment.id)}
          disabled={isLoading.completing}
          className="btn btn-primary btn-sm"
        >
          {isLoading.completing ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
          ) : (
            <Square className="h-4 w-4 mr-1" />
          )}
          Finalizar
        </button>
      );
    }

    // Link para prontuário se concluído
    if (appointment.status === 'COMPLETED') {
      actions.push(
        <Link key="records" to={`/appointments/${appointment.id}/records`}>
          <button className="btn btn-outline btn-sm">
            <FileText className="h-4 w-4 mr-1" />
            Prontuário
          </button>
        </Link>
      );
    }

    return actions;
  };

  return (
    <div className={`border border-gray-200 rounded-lg hover:shadow-md transition-shadow ${compact ? 'p-4' : 'p-4'}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Pet Avatar */}
          {showPetInfo && (
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              {appointment.pet?.photoUrl ? (
                <img 
                  src={appointment.pet.photoUrl} 
                  alt={appointment.pet.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <Calendar className="h-6 w-6 text-primary-600" />
              )}
            </div>
          )}

          {/* Appointment Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {showPetInfo && (
                <h3 className="font-semibold text-gray-900 truncate">
                  {appointment.pet?.name || 'Pet não identificado'}
                </h3>
              )}
              <span className={getStatusBadgeClass(appointment.status)}>
                {getStatusIcon(appointment.status)}
                <span className="ml-1">{getStatusDisplay(appointment.status)}</span>
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                {getTypeDisplay(appointment.type)}
              </span>
            </div>

            {!compact && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-2">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{formatDateTime(appointment.scheduledAt)}</span>
                </div>
                
                {appointment.veterinarian && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      Dr. {appointment.veterinarian.profile?.firstName} {appointment.veterinarian.profile?.lastName}
                    </span>
                  </div>
                )}

                <div className="flex items-center">
                  <span className="font-medium text-green-600">
                    {formatPrice(appointment.price)}
                  </span>
                </div>

                <div className="flex items-center">
                  <span>{appointment.duration} minutos</span>
                </div>
              </div>
            )}

            {/* Compact view - info em uma linha */}
            {compact && (
              <div className="text-sm text-gray-600 mb-2">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatDateTime(appointment.scheduledAt)} • {formatPrice(appointment.price)}
                </span>
              </div>
            )}

            {appointment.notes && !compact && (
              <div className="text-sm text-gray-600">
                <strong>Observações:</strong> {appointment.notes}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2 ml-4 flex-shrink-0">
          {renderActions()}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;