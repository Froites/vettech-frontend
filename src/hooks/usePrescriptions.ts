// src/hooks/usePrescriptions.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { prescriptionsService } from '../services/prescriptions';
import type { CreatePrescriptionRequest } from '../types/prescription';

export const usePrescriptions = () => {
  const queryClient = useQueryClient();

  // Receitas ativas (para tutores)
  const activePrescriptionsQuery = useQuery({
    queryKey: ['prescriptions', 'active'],
    queryFn: prescriptionsService.getActivePrescriptions,
  });

  // Minhas receitas (para veterinários)
  const myPrescriptionsQuery = useQuery({
    queryKey: ['prescriptions', 'active'],
    queryFn: prescriptionsService.getMyPrescriptions,
  });

  // Criar receita
  const createMutation = useMutation({
    mutationFn: prescriptionsService.createPrescription,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      toast.success('Receita criada com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao criar receita:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar receita');
    },
  });

  // Atualizar receita
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePrescriptionRequest> }) =>
      prescriptionsService.updatePrescription(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast.success('Receita atualizada com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao atualizar receita:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar receita');
    },
  });

  // Dispensar receita
  const dispenseMutation = useMutation({
    mutationFn: prescriptionsService.dispensePrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast.success('Receita marcada como dispensada!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao dispensar receita:', error);
      toast.error(error.response?.data?.message || 'Erro ao dispensar receita');
    },
  });

  return {
    // Data
    activePrescriptions: activePrescriptionsQuery.data || [],
    myPrescriptions: myPrescriptionsQuery.data || [],
    
    // Loading states
    isLoadingActive: activePrescriptionsQuery.isLoading,
    isLoadingMy: myPrescriptionsQuery.isLoading,
    
    // Actions
    createPrescription: (data: CreatePrescriptionRequest) => createMutation.mutate(data),
    updatePrescription: (id: string, data: Partial<CreatePrescriptionRequest>) =>
      updateMutation.mutate({ id, data }),
    dispensePrescription: (id: string) => dispenseMutation.mutate(id),
    
    // Action states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDispensing: dispenseMutation.isPending,
  };
};

// Hook para receita específica
export const usePrescription = (id: string) => {
  return useQuery({
    queryKey: ['prescription', id],
    queryFn: () => prescriptionsService.getPrescriptionById(id),
    enabled: !!id,
  });
};

// Hook para receitas de um pet
export const usePetPrescriptions = (petId: string) => {
  return useQuery({
    queryKey: ['prescriptions', 'pet', petId],
    queryFn: () => prescriptionsService.getPrescriptionsByPet(petId),
    enabled: !!petId,
  });
};

// Hook para receita por consulta
export const usePrescriptionByAppointment = (appointmentId: string) => {
  return useQuery({
    queryKey: ['prescription', 'appointment', appointmentId],
    queryFn: () => prescriptionsService.getPrescriptionByAppointment(appointmentId),
    enabled: !!appointmentId,
  });
};

// Hook para receita digital
export const useDigitalPrescription = (id: string) => {
  return useQuery({
    queryKey: ['prescription', 'digital', id],
    queryFn: () => prescriptionsService.getDigitalPrescription(id),
    enabled: !!id,
  });
};

// Hook para verificar receita (público)
export const useVerifyPrescription = (id: string) => {
  return useQuery({
    queryKey: ['prescription', 'verify', id],
    queryFn: () => prescriptionsService.verifyPrescription(id),
    enabled: !!id,
    retry: false, // Não tentar novamente se falhar
  });
};