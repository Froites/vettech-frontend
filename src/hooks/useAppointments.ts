import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { appointmentsService } from '../services/appointments';
import type { CreateAppointmentRequest } from '../types/appointment';


export const useAppointments = () => {
  const queryClient = useQueryClient();

  // Próximas consultas
  const upcomingQuery = useQuery({
    queryKey: ['appointments', 'upcoming'],
    queryFn: appointmentsService.getUpcomingAppointments,
  });

  // Consultas passadas
  const pastQuery = useQuery({
    queryKey: ['appointments', 'past'],
    queryFn: appointmentsService.getPastAppointments,
  });

  // Estatísticas
  const statsQuery = useQuery({
    queryKey: ['appointments', 'stats'],
    queryFn: appointmentsService.getAppointmentStats,
  });

  // Criar agendamento
  const createMutation = useMutation({
    mutationFn: appointmentsService.createAppointment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Consulta agendada com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao agendar consulta:', error);
      toast.error(error.response?.data?.message || 'Erro ao agendar consulta');
    },
  });

  // Cancelar agendamento
  const cancelMutation = useMutation({
    mutationFn: appointmentsService.cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Consulta cancelada com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao cancelar consulta:', error);
      toast.error(error.response?.data?.message || 'Erro ao cancelar consulta');
    },
  });

  // Iniciar consulta
  const startMutation = useMutation({
    mutationFn: appointmentsService.startAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Consulta iniciada!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao iniciar consulta:', error);
      toast.error(error.response?.data?.message || 'Erro ao iniciar consulta');
    },
  });

  // Finalizar consulta
  const completeMutation = useMutation({
    mutationFn: appointmentsService.completeAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      toast.success('Consulta finalizada!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao finalizar consulta:', error);
      toast.error(error.response?.data?.message || 'Erro ao finalizar consulta');
    },
  });

  return {
    // Data
    upcoming: upcomingQuery.data || [],
    past: pastQuery.data || [],
    stats: statsQuery.data,
    
    // Loading states
    isLoadingUpcoming: upcomingQuery.isLoading,
    isLoadingPast: pastQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    
    // Actions
    createAppointment: (data: CreateAppointmentRequest) => createMutation.mutate(data),
    cancelAppointment: (id: string) => cancelMutation.mutate(id),
    startAppointment: (id: string) => startMutation.mutate(id),
    completeAppointment: (id: string) => completeMutation.mutate(id),
    
    // Action states
    isCreating: createMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isStarting: startMutation.isPending,
    isCompleting: completeMutation.isPending,
  };
};

export const useAppointment = (id: string) => {
  return useQuery({
    queryKey: ['appointment', id],
    queryFn: () => appointmentsService.getAppointmentById(id),
    enabled: !!id,
  });
};

export const useVeterinarians = () => {
  return useQuery({
    queryKey: ['veterinarians', 'available'],
    queryFn: appointmentsService.getAvailableVeterinarians,
  });
};

export const useAvailableSlots = (vetId: string, date: string) => {
  return useQuery({
    queryKey: ['availability', vetId, date],
    queryFn: () => appointmentsService.getAvailableSlots(vetId, date),
    enabled: !!vetId && !!date,
  });
};