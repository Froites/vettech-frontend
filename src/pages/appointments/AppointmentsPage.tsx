import { useState } from 'react';
import { Link } from 'react-router-dom';

import { 
  Plus, 
  Calendar, 
  Clock, 
  MapPin,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Play,
  Square
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuthStore } from '../../stores/authStore';
import { useAppointments } from '../../hooks/useAppointments';
import { Layout } from '../../components/layout/Layout';

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const { user } = useAuthStore();
  const { 
    upcoming, 
    past, 
    stats,
    isLoadingUpcoming, 
    isLoadingPast,
    cancelAppointment,
    startAppointment,
    completeAppointment,
    isCancelling,
    isStarting,
    isCompleting
  } = useAppointments();

  const isTutor = user?.role === 'TUTOR';
  const isVet = user?.role === 'VETERINARIAN';

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
        return 'status-badge bg-blue-100 text-blue-800';
      case 'IN_PROGRESS':
        return 'status-badge bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'status-badge bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'status-badge bg-red-100 text-red-800';
      case 'NO_SHOW':
        return 'status-badge bg-orange-100 text-orange-800';
      default:
        return 'status-badge bg-gray-100 text-gray-800';
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

  const handleCancelAppointment = (id: string, petName: string) => {
    if (window.confirm(`Tem certeza que deseja cancelar a consulta do ${petName}?`)) {
      cancelAppointment(id);
    }
  };

  const currentAppointments = activeTab === 'upcoming' ? upcoming : past;
  const isLoading = activeTab === 'upcoming' ? isLoadingUpcoming : isLoadingPast;

  console.log('📅 Debug Appointments:', { 
    upcoming: upcoming.length, 
    past: past.length, 
    stats, 
    activeTab, 
    userRole: user?.role 
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agendamentos</h1>
            <p className="text-gray-600">
              {isTutor 
                ? 'Gerencie as consultas dos seus pets' 
                : 'Acompanhe suas consultas e atendimentos'
              }
            </p>
          </div>
          {isTutor && (
            <Link to="/appointments/new">
              <button className="btn btn-primary btn-md">
                <Plus className="h-4 w-4 mr-2" />
                Agendar Consulta
              </button>
            </Link>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Debug:</strong> 
            Próximas: {upcoming.length} | 
            Passadas: {past.length} | 
            User: {user?.role} | 
            Tab: {activeTab}
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Agendadas</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.total || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Pendentes</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending || 0}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Canceladas</p>
                  <p className="text-2xl font-bold text-red-600">{stats.cancelled || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'upcoming'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Próximas ({upcoming.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'past'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Anteriores ({past.length})
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : currentAppointments.length > 0 ? (
              <div className="space-y-4">
                {currentAppointments.map((appointment) => (
                  <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {/* Pet Avatar */}
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
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

                        {/* Appointment Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {appointment.pet?.name || 'Pet não identificado'}
                            </h3>
                            <span className={getStatusBadgeClass(appointment.status)}>
                              {getStatusIcon(appointment.status)}
                              <span className="ml-1">{getStatusDisplay(appointment.status)}</span>
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              {getTypeDisplay(appointment.type)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              {formatDateTime(appointment.scheduledAt)}
                            </div>
                            
                            {appointment.veterinarian && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-2" />
                                Dr. {appointment.veterinarian.profile?.firstName} {appointment.veterinarian.profile?.lastName}
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

                          {appointment.notes && (
                            <div className="mt-2 text-sm text-gray-600">
                              <strong>Observações:</strong> {appointment.notes}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col space-y-2">
                        {activeTab === 'upcoming' && appointment.status === 'SCHEDULED' && (
                          <>
                            {isVet && (
                              <button
                                onClick={() => startAppointment(appointment.id)}
                                disabled={isStarting}
                                className="btn btn-success btn-sm"
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Iniciar
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleCancelAppointment(appointment.id, appointment.pet?.name || 'Pet')}
                              disabled={isCancelling}
                              className="btn btn-outline btn-sm text-red-600 hover:text-red-700"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Cancelar
                            </button>
                          </>
                        )}

                        {activeTab === 'upcoming' && appointment.status === 'IN_PROGRESS' && isVet && (
                          <button
                            onClick={() => completeAppointment(appointment.id)}
                            disabled={isCompleting}
                            className="btn btn-primary btn-sm"
                          >
                            <Square className="h-4 w-4 mr-1" />
                            Finalizar
                          </button>
                        )}

                        {appointment.status === 'COMPLETED' && (
                          <Link to={`/appointments/${appointment.id}/records`}>
                            <button className="btn btn-outline btn-sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Prontuário
                            </button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeTab === 'upcoming' 
                    ? 'Nenhuma consulta agendada' 
                    : 'Nenhuma consulta anterior'
                  }
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'upcoming'
                    ? (isTutor 
                        ? 'Agende a primeira consulta para seus pets.' 
                        : 'Aguarde novos agendamentos de pacientes.'
                      )
                    : 'Consultas anteriores aparecerão aqui.'
                  }
                </p>
                {isTutor && activeTab === 'upcoming' && (
                  <Link to="/appointments/new">
                    <button className="btn btn-primary btn-lg">
                      <Plus className="h-5 w-5 mr-2" />
                      Agendar Primeira Consulta
                    </button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentsPage;