import { useState } from 'react';
import { ListPageLayout } from '../../components/layouts/ListPageLayout';
import AppointmentCard from '../../components/appointments/AppointmentCard';
import Button from '../../components/ui/Button';
import { 
  Calendar, 
  Clock, 
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAppointments } from '../../hooks/useAppointments';

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
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

  const currentAppointments = activeTab === 'upcoming' ? upcoming : past;
  const isLoading = activeTab === 'upcoming' ? isLoadingUpcoming : isLoadingPast;

  const filteredAppointments = currentAppointments.filter(appointment => 
    appointment.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.veterinarian?.profile?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.veterinarian?.profile?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCancelAppointment = (id: string, petName: string) => {
    if (window.confirm(`Tem certeza que deseja cancelar a consulta do ${petName}?`)) {
      cancelAppointment(id);
    }
  };

  const pageConfig = {
    title: "Agendamentos",
    description: isTutor 
      ? 'Gerencie as consultas dos seus pets' 
      : 'Acompanhe suas consultas e atendimentos',

    stats: stats ? [
      {
        icon: Calendar,
        label: "Total Agendadas",
        value: stats.total || 0,
        color: 'primary' as const
      },
      {
        icon: CheckCircle,
        label: "Concluídas", 
        value: stats.completed || 0,
        color: 'success' as const
      },
      {
        icon: Clock,
        label: "Pendentes",
        value: stats.pending || 0,
        color: 'warning' as const
      },
      {
        icon: XCircle,
        label: "Canceladas",
        value: stats.cancelled || 0,
        color: 'error' as const
      }
    ] : undefined,

    emptyState: {
      icon: Calendar,
      title: activeTab === 'upcoming' 
        ? 'Nenhuma consulta agendada' 
        : 'Nenhuma consulta anterior',
      description: activeTab === 'upcoming'
        ? (isTutor 
            ? 'Agende a primeira consulta para seus pets.' 
            : 'Aguarde novos agendamentos de pacientes.'
          )
        : 'Consultas anteriores aparecerão aqui.',
      action: isTutor && activeTab === 'upcoming' ? {
        text: "Agendar Primeira Consulta",
        onClick: () => window.location.href = '/appointments/new'
      } : undefined
    }
  };

  return (
    <ListPageLayout
      title={pageConfig.title}
      description={pageConfig.description}
      stats={pageConfig.stats}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar por pet, veterinário ou observações..."
      isLoading={isLoading}
      isEmpty={filteredAppointments.length === 0}
      emptyState={pageConfig.emptyState}
      debugInfo={`Próximas: ${upcoming.length} | Passadas: ${past.length} | User: ${user?.role} | Tab: ${activeTab}`}
    >
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <Button
              variant="ghost"
              onClick={() => setActiveTab('upcoming')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Próximas ({upcoming.length})
            </Button>
            <Button
              variant="ghost"
              onClick={() => setActiveTab('past')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'past'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Anteriores ({past.length})
            </Button>
          </nav>
        </div>
      </div>

      <div className="space-y-4">
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            showPetInfo={true}
            compact={false}
            isVet={isVet}
            onCancel={handleCancelAppointment}
            onStart={startAppointment}
            onComplete={completeAppointment}
            isLoading={{
              cancelling: isCancelling,
              starting: isStarting,
              completing: isCompleting
            }}
          />
        ))}
      </div>
    </ListPageLayout>
  );
};

export default AppointmentsPage;