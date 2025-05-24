import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import type { CreatePetRequest } from '../types/pet';
import { petsService } from '../services/pets';


export const usePets = () => {
  const queryClient = useQueryClient();

  const petsQuery = useQuery({
    queryKey: ['pets'],
    queryFn: async () => {
      console.log('🔍 Buscando todos os pets');
      const result = await petsService.getPets();
      console.log('📋 Pets encontrados:', result.length);
      return result;
    },
    retry: 1,
  });

  const createPetMutation = useMutation({
    mutationFn: async (data: CreatePetRequest) => {
      console.log('🐕 Criando pet:', data);
      return await petsService.createPet(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      console.log('✅ Pet criado com sucesso:', data.name);
      toast.success(`${data.name} foi cadastrado com sucesso!`);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao criar pet:', error);
      console.error('Response data:', error.response?.data);
      toast.error(error.response?.data?.message || 'Erro ao cadastrar pet');
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreatePetRequest> }) => {
      console.log('✏️ Atualizando pet:', id, data);
      return petsService.updatePet(id, data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success(`${data.name} foi atualizado com sucesso!`);
    },
    onError: (error: any) => {
      console.error('❌ Erro ao atualizar pet:', error);
      toast.error(error.response?.data?.message || 'Erro ao atualizar pet');
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: (id: string) => {
      console.log('🗑️ Deletando pet:', id);
      return petsService.deletePet(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet removido com sucesso!');
    },
    onError: (error: any) => {
      console.error('❌ Erro ao deletar pet:', error);
      toast.error(error.response?.data?.message || 'Erro ao remover pet');
    },
  });

  return {
    pets: petsQuery.data || [],
    isLoading: petsQuery.isLoading,
    error: petsQuery.error,
    createPet: (data: CreatePetRequest) => createPetMutation.mutate(data),
    updatePet: (id: string, data: Partial<CreatePetRequest>) =>
      updatePetMutation.mutate({ id, data }),
    deletePet: (id: string) => deletePetMutation.mutate(id),
    isCreating: createPetMutation.isPending,
    isUpdating: updatePetMutation.isPending,
    isDeleting: deletePetMutation.isPending,
  };
};

export const usePet = (id: string) => {
  return useQuery({
    queryKey: ['pet', id],
    queryFn: () => petsService.getPetById(id),
    enabled: !!id,
  });
};