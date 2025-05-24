import type { CreateMedicalRecordRequest, MedicalRecord, MedicalRecordStats } from '../types/medical-record';
import api from './api';

export const medicalRecordsService = {
  // POST /api/medical-records - Criar prontuário
  async createMedicalRecord(recordData: CreateMedicalRecordRequest): Promise<MedicalRecord> {
    console.log('🔗 Chamando API: POST /medical-records', recordData);
    const response = await api.post('/medical-records', recordData);
    console.log('📡 Prontuário criado:', response.data);
    return response.data;
  },

  // GET /api/medical-records/pet/:petId - Prontuários do pet
  async getMedicalRecordsByPet(petId: string): Promise<MedicalRecord[]> {
    console.log('🔗 Chamando API: GET /medical-records/pet/' + petId);
    const response = await api.get(`/medical-records/pet/${petId}`);
    console.log('📡 Prontuários do pet:', response.data);
    return response.data;
  },

  // GET /api/medical-records/my-records - Prontuários do veterinário
  async getMyMedicalRecords(): Promise<MedicalRecord[]> {
    console.log('🔗 Chamando API: GET /medical-records/my-records');
    const response = await api.get('/medical-records/my-records');
    console.log('📡 Meus prontuários:', response.data);
    return response.data;
  },

  // GET /api/medical-records/statistics - Estatísticas médicas
  async getMedicalRecordStats(): Promise<MedicalRecordStats> {
    console.log('🔗 Chamando API: GET /medical-records/statistics');
    const response = await api.get('/medical-records/statistics');
    console.log('📡 Estatísticas:', response.data);
    return response.data;
  },

  // GET /api/medical-records/search?q=termo - Buscar prontuários
  async searchMedicalRecords(query: string, dateFrom?: string, dateTo?: string): Promise<MedicalRecord[]> {
    console.log('🔗 Chamando API: GET /medical-records/search', { query, dateFrom, dateTo });
    
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    
    const response = await api.get(`/medical-records/search?${params.toString()}`);
    console.log('📡 Resultados da busca:', response.data);
    return response.data;
  },

  // GET /api/medical-records/:id - Detalhes do prontuário
  async getMedicalRecordById(id: string): Promise<MedicalRecord> {
    console.log('🔗 Chamando API: GET /medical-records/' + id);
    const response = await api.get(`/medical-records/${id}`);
    console.log('📡 Detalhes do prontuário:', response.data);
    return response.data;
  },

  // PATCH /api/medical-records/:id - Atualizar prontuário
  async updateMedicalRecord(id: string, data: Partial<CreateMedicalRecordRequest>): Promise<MedicalRecord> {
    console.log('🔗 Chamando API: PATCH /medical-records/' + id, data);
    const response = await api.patch(`/medical-records/${id}`, data);
    console.log('📡 Prontuário atualizado:', response.data);
    return response.data;
  },
};