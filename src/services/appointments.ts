import type { Appointment, CreateAppointmentRequest, TimeSlot, VeterinarianAvailability } from '../types/appointment';
import api from './api';


export const appointmentsService = {
  // GET /api/appointments/upcoming - Próximas consultas
  async getUpcomingAppointments(): Promise<Appointment[]> {
    console.log('🔗 Chamando API: GET /appointments/upcoming');
    const response = await api.get('/appointments/upcoming');
    console.log('📡 Próximas consultas:', response.data);
    return response.data;
  },

  // GET /api/appointments/past - Consultas passadas
  async getPastAppointments(): Promise<Appointment[]> {
    console.log('🔗 Chamando API: GET /appointments/past');
    const response = await api.get('/appointments/past');
    console.log('📡 Consultas passadas:', response.data);
    return response.data;
  },

  // GET /api/appointments/stats - Estatísticas
  async getAppointmentStats(): Promise<any> {
    console.log('🔗 Chamando API: GET /appointments/stats');
    const response = await api.get('/appointments/stats');
    console.log('📡 Stats:', response.data);
    return response.data;
  },

  // GET /api/appointments/:id - Detalhes da consulta
  async getAppointmentById(id: string): Promise<Appointment> {
    console.log('🔗 Chamando API: GET /appointments/' + id);
    const response = await api.get(`/appointments/${id}`);
    console.log('📡 Detalhes da consulta:', response.data);
    return response.data;
  },

  // POST /api/appointments - Criar agendamento
  async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    console.log('🔗 Chamando API: POST /appointments', appointmentData);
    const response = await api.post('/appointments', appointmentData);
    console.log('📡 Agendamento criado:', response.data);
    return response.data;
  },

  // PATCH /api/appointments/:id - Atualizar agendamento
  async updateAppointment(id: string, data: Partial<CreateAppointmentRequest>): Promise<Appointment> {
    console.log('🔗 Chamando API: PATCH /appointments/' + id, data);
    const response = await api.patch(`/appointments/${id}`, data);
    console.log('📡 Agendamento atualizado:', response.data);
    return response.data;
  },

  // DELETE /api/appointments/:id - Cancelar agendamento
  async cancelAppointment(id: string): Promise<void> {
    console.log('🔗 Chamando API: DELETE /appointments/' + id);
    await api.delete(`/appointments/${id}`);
    console.log('✅ Agendamento cancelado');
  },

  // POST /api/appointments/:id/start - Iniciar consulta
  async startAppointment(id: string): Promise<Appointment> {
    console.log('🔗 Chamando API: POST /appointments/' + id + '/start');
    const response = await api.post(`/appointments/${id}/start`);
    console.log('📡 Consulta iniciada:', response.data);
    return response.data;
  },

  // POST /api/appointments/:id/complete - Finalizar consulta
  async completeAppointment(id: string): Promise<Appointment> {
    console.log('🔗 Chamando API: POST /appointments/' + id + '/complete');
    const response = await api.post(`/appointments/${id}/complete`);
    console.log('📡 Consulta finalizada:', response.data);
    return response.data;
  },

  // AVAILABILITY ENDPOINTS
  // GET /api/appointments/availability/veterinarians - Listar veterinários
  async getAvailableVeterinarians(): Promise<VeterinarianAvailability[]> {
    console.log('🔗 Chamando API: GET /appointments/availability/veterinarians');
    const response = await api.get('/appointments/availability/veterinarians');
    console.log('📡 Veterinários disponíveis:', response.data);
    return response.data;
  },

  // GET /api/appointments/availability/:vetId/slots?date=YYYY-MM-DD
  async getAvailableSlots(vetId: string, date: string): Promise<TimeSlot[]> {
    console.log('🔗 Chamando API: GET /appointments/availability/' + vetId + '/slots?date=' + date);
    const response = await api.get(`/appointments/availability/${vetId}/slots?date=${date}`);
    console.log('📡 Horários disponíveis:', response.data);
    return response.data;
  },
};
