import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { medicalRecordsService } from '../services/medical-records';
import type { CreateMedicalRecordRequest } from '../types/medical-record';


export const useMedicalRecords = () => {
  const queryClient = useQueryClient();

  // Meus prontuários (para veterinários)
  const myRecordsQuery = useQuery({
    queryKey: ['medical-records', 'my-records'],
    queryFn: medicalRecordsService.getMyMedicalRecords,
  });

  // Estatísticas
  const statsQuery = useQuery({
    queryKey: ['medical-records', 'stats'],
    queryFn: medicalRecordsService.getMedicalRecordStats,
  });

  // Criar prontuário
  const createMutation = useMutation({
    mutationFn: medicalRecordsService.createMedicalRecord,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      queryClient.invalidateQueries({ queryKey: ['appointments'] }); // Atualizar consultas também
      toast.success('Prontuário criado com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao criar prontuário:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar prontuário');
    },
  });

  // Atualizar prontuário
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateMedicalRecordRequest> }) =>
      medicalRecordsService.updateMedicalRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medical-records'] });
      toast.success('Prontuário atualizado com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao atualizar prontuário:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar prontuário');
    },
  });

  return {
    // Data
    myRecords: myRecordsQuery.data || [],
    stats: statsQuery.data,
    
    // Loading states
    isLoadingMyRecords: myRecordsQuery.isLoading,
    isLoadingStats: statsQuery.isLoading,
    
    // Actions
    createMedicalRecord: (data: CreateMedicalRecordRequest) => createMutation.mutate(data),
    updateMedicalRecord: (id: string, data: Partial<CreateMedicalRecordRequest>) =>
      updateMutation.mutate({ id, data }),
    
    // Action states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
  };
};

export const useMedicalRecord = (id: string) => {
  return useQuery({
    queryKey: ['medical-record', id],
    queryFn: () => medicalRecordsService.getMedicalRecordById(id),
    enabled: !!id,
  });
};

export const usePetMedicalRecords = (petId: string) => {
  return useQuery({
    queryKey: ['medical-records', 'pet', petId],
    queryFn: () => medicalRecordsService.getMedicalRecordsByPet(petId),
    enabled: !!petId,
  });
};

export const useMedicalRecordSearch = (query: string, dateFrom?: string, dateTo?: string) => {
  return useQuery({
    queryKey: ['medical-records', 'search', query, dateFrom, dateTo],
    queryFn: () => medicalRecordsService.searchMedicalRecords(query, dateFrom, dateTo),
    enabled: !!query,
  });
};
