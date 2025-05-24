// src/services/prescriptions.ts
import type { 
  Prescription, 
  CreatePrescriptionRequest, 
  PrescriptionStats,
  DigitalPrescription 
} from '../types/prescription';
import api from './api';

export const prescriptionsService = {
  // POST /api/prescriptions - Criar receita (Veterinário)
  async createPrescription(prescriptionData: CreatePrescriptionRequest): Promise<Prescription> {
    console.log('🔗 Chamando API: POST /prescriptions', prescriptionData);
    const response = await api.post('/prescriptions', prescriptionData);
    console.log('📡 Receita criada:', response.data);
    return response.data;
  },

  // GET /api/prescriptions/appointment/:appointmentId - Receita da consulta
  async getPrescriptionByAppointment(appointmentId: string): Promise<Prescription | null> {
    console.log('🔗 Chamando API: GET /prescriptions/appointment/' + appointmentId);
    try {
      const response = await api.get(`/prescriptions/appointment/${appointmentId}`);
      console.log('📡 Receita da consulta:', response.data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // Não há receita para esta consulta
      }
      throw error;
    }
  },

  // GET /api/prescriptions/pet/:petId - Receitas do pet
  async getPrescriptionsByPet(petId: string): Promise<Prescription[]> {
    console.log('🔗 Chamando API: GET /prescriptions/pet/' + petId);
    const response = await api.get(`/prescriptions/pet/${petId}`);
    console.log('📡 Receitas do pet:', response.data);
    return response.data;
  },

  // GET /api/prescriptions/active - Receitas ativas do tutor
  async getActivePrescriptions(): Promise<Prescription[]> {
    console.log('🔗 Chamando API: GET /prescriptions/active');
    const response = await api.get('/prescriptions/active');
    console.log('📡 Receitas ativas:', response.data);
    return response.data;
  },

  // GET /api/prescriptions/:id - Detalhes da receita
  async getPrescriptionById(id: string): Promise<Prescription> {
    console.log('🔗 Chamando API: GET /prescriptions/' + id);
    const response = await api.get(`/prescriptions/${id}`);
    console.log('📡 Detalhes da receita:', response.data);
    return response.data;
  },

  // PATCH /api/prescriptions/:id - Atualizar receita (Veterinário)
  async updatePrescription(id: string, data: Partial<CreatePrescriptionRequest>): Promise<Prescription> {
    console.log('🔗 Chamando API: PATCH /prescriptions/' + id, data);
    const response = await api.patch(`/prescriptions/${id}`, data);
    console.log('📡 Receita atualizada:', response.data);
    return response.data;
  },

  // POST /api/prescriptions/:id/dispense - Marcar como dispensada (Tutor)
  async dispensePrescription(id: string): Promise<Prescription> {
    console.log('🔗 Chamando API: POST /prescriptions/' + id + '/dispense');
    const response = await api.post(`/prescriptions/${id}/dispense`);
    console.log('📡 Receita dispensada:', response.data);
    return response.data;
  },

  // GET /api/prescriptions/:id/digital - Receita digital (PDF/QR)
  async getDigitalPrescription(id: string): Promise<DigitalPrescription> {
    console.log('🔗 Chamando API: GET /prescriptions/' + id + '/digital');
    const response = await api.get(`/prescriptions/${id}/digital`);
    console.log('📡 Receita digital:', response.data);
    return response.data;
  },

  // GET /api/prescriptions/verify/:id - Verificar receita (Público)
  async verifyPrescription(id: string): Promise<DigitalPrescription> {
    console.log('🔗 Chamando API: GET /prescriptions/verify/' + id);
    const response = await api.get(`/prescriptions/verify/${id}`);
    console.log('📡 Verificação da receita:', response.data);
    return response.data;
  },

  // GET /api/prescriptions/my-prescriptions - Receitas do veterinário
  async getMyPrescriptions(): Promise<Prescription[]> {
    console.log('🔗 Chamando API: GET /prescriptions/my-prescriptions');
    const response = await api.get('/prescriptions/my-prescriptions');
    console.log('📡 Minhas receitas:', response.data);
    return response.data;
  },

  // Função auxiliar para gerar estatísticas localmente
  generateStats(prescriptions: Prescription[]): PrescriptionStats {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const stats: PrescriptionStats = {
      total: prescriptions.length,
      active: 0,
      dispensed: 0,
      expired: 0,
      thisMonth: 0,
      byPet: {},
    };

    prescriptions.forEach(prescription => {
      // Contadores principais
      if (prescription.isDispensed) {
        stats.dispensed++;
      } else if (new Date(prescription.validUntil) < now) {
        stats.expired++;
      } else {
        stats.active++;
      }

      // Este mês
      if (new Date(prescription.createdAt) >= thisMonth) {
        stats.thisMonth++;
      }

      // Por pet
      const petName = prescription.pet?.name || prescription.appointment?.pet?.name || 'Pet não identificado';
      stats.byPet[petName] = (stats.byPet[petName] || 0) + 1;
    });

    return stats;
  },
};