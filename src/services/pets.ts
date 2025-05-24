import type { CreatePetRequest, Pet } from '../types/pet';
import api from './api';


export const petsService = {
  // GET /api/pets - Lista pets do tutor logado
  async getPets(): Promise<Pet[]> {
    console.log('🔗 Chamando API: GET /pets');
    const response = await api.get('/pets');
    console.log('📡 Resposta da API pets:', response.data);
    
    // Sua API retorna array direto
    return response.data;
  },

  // POST /api/pets - Criar pet
  async createPet(petData: CreatePetRequest): Promise<Pet> {
    console.log('🔗 Chamando API: POST /pets', petData);
    
    // Limpar campos undefined/empty
    const cleanData = Object.fromEntries(
      Object.entries(petData).filter(([key, value]) => 
        value !== undefined && value !== '' && value !== null
      )
    );
    
    console.log('📤 Dados limpos para envio:', cleanData);
    const response = await api.post('/pets', cleanData);
    console.log('📡 Pet criado:', response.data);
    return response.data;
  },

  // GET /api/pets/:id - Detalhes do pet
  async getPetById(id: string): Promise<Pet> {
    console.log('🔗 Chamando API: GET /pets/' + id);
    const response = await api.get(`/pets/${id}`);
    console.log('📡 Resposta do pet:', response.data);
    return response.data;
  },

  // PATCH /api/pets/:id - Atualizar pet
  async updatePet(id: string, petData: Partial<CreatePetRequest>): Promise<Pet> {
    console.log('🔗 Chamando API: PATCH /pets/' + id, petData);
    
    // Limpar campos undefined/empty
    const cleanData = Object.fromEntries(
      Object.entries(petData).filter(([key, value]) => 
        value !== undefined && value !== '' && value !== null
      )
    );
    
    console.log('📤 Dados limpos para atualização:', cleanData);
    const response = await api.patch(`/pets/${id}`, cleanData);
    console.log('📡 Pet atualizado:', response.data);
    return response.data;
  },

  // DELETE /api/pets/:id - Remover pet
  async deletePet(id: string): Promise<void> {
    console.log('🔗 Chamando API: DELETE /pets/' + id);
    await api.delete(`/pets/${id}`);
    console.log('✅ Pet deletado');
  },
};