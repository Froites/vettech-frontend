// src/pages/appointments/VetAvailabilityPage.tsx - QUICK FIX
import { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { useAuthStore } from '../../stores/authStore';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Users,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

interface AvailabilityStatus {
  isAvailable: boolean;
  consultationFee: number;
  specialties: string[];
}

const VetAvailabilityPage = () => {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [availability, setAvailability] = useState<AvailabilityStatus>({
    isAvailable: false,
    consultationFee: 150,
    specialties: ['Clínica Geral']
  });

  // Carregar status atual
  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users/veterinarian-profile');
      setAvailability({
        isAvailable: response.data.isAvailable || false,
        consultationFee: Number(response.data.consultationFee) || 150,
        specialties: response.data.specialties || ['Clínica Geral']
      });
    } catch (error: any) {
      console.log('📋 Perfil veterinário não existe, criando...');
      // Se não existe perfil, criar um básico
      await createBasicProfile();
    } finally {
      setLoading(false);
    }
  };

  const createBasicProfile = async () => {
    try {
      const profileData = {
        crmv: 'SP-12345', // Placeholder
        specialties: ['Clínica Geral'],
        consultationFee: 150,
        isAvailable: false,
        biography: 'Veterinário dedicado ao cuidado animal.'
      };

      await api.post('/users/veterinarian-profile', profileData);
      
      setAvailability({
        isAvailable: false,
        consultationFee: 150,
        specialties: ['Clínica Geral']
      });
      
      toast.success('Perfil veterinário criado!');
    } catch (error) {
      console.error('❌ Erro ao criar perfil:', error);
      toast.error('Erro ao criar perfil veterinário');
    }
  };

  const toggleAvailability = async () => {
    try {
      setSaving(true);
      
      const newStatus = !availability.isAvailable;
      
      await api.put('/users/veterinarian-profile', {
        ...availability,
        isAvailable: newStatus
      });

      setAvailability(prev => ({
        ...prev,
        isAvailable: newStatus
      }));

      toast.success(
        newStatus 
          ? '✅ Você está disponível para consultas!' 
          : '⏸️ Você não está mais disponível'
      );
      
    } catch (error: any) {
      console.error('❌ Erro ao atualizar disponibilidade:', error);
      toast.error('Erro ao atualizar disponibilidade');
    } finally {
      setSaving(false);
    }
  };

  const updateConsultationFee = async (newFee: number) => {
    try {
      await api.put('/users/veterinarian-profile', {
        ...availability,
        consultationFee: newFee
      });

      setAvailability(prev => ({
        ...prev,
        consultationFee: newFee
      }));

      toast.success('Valor da consulta atualizado!');
    } catch (error) {
      toast.error('Erro ao atualizar valor');
    }
  };

  if (user?.role !== 'VETERINARIAN') {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-error-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acesso Negado</h3>
          <p className="text-gray-600">Esta página é apenas para veterinários.</p>
        </div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disponibilidade para Consultas</h1>
          <p className="text-gray-600">Configure quando você está disponível para atender pacientes</p>
        </div>

        {/* Quick Status Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                availability.isAvailable ? 'bg-success-100' : 'bg-gray-100'
              }`}>
                {availability.isAvailable ? (
                  <CheckCircle className="h-8 w-8 text-success-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-gray-600" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Status: {availability.isAvailable ? 'Disponível' : 'Indisponível'}
                </h2>
                <p className="text-gray-600">
                  {availability.isAvailable 
                    ? 'Você pode receber agendamentos' 
                    : 'Você não aparece na busca de agendamentos'
                  }
                </p>
              </div>
            </div>
            
            <button
              onClick={toggleAvailability}
              disabled={saving}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                availability.isAvailable
                  ? 'bg-error-600 text-white hover:bg-error-700'
                  : 'bg-success-600 text-white hover:bg-success-700'
              } disabled:opacity-50`}
            >
              {saving ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </div>
              ) : (
                availability.isAvailable ? 'Ficar Indisponível' : 'Ficar Disponível'
              )}
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Status Atual</p>
                <p className="text-lg font-bold text-primary-600">
                  {availability.isAvailable ? 'Disponível' : 'Indisponível'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Valor da Consulta</p>
                <p className="text-lg font-bold text-success-600">
                  R$ {Number(availability.consultationFee).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-warning-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Especialidades</p>
                <p className="text-lg font-bold text-warning-600">
                  {availability.specialties.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Fee */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Valor da Consulta</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor (R$)
              </label>
              <input
                type="number"
                value={availability.consultationFee}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setAvailability(prev => ({ ...prev, consultationFee: value }));
                }}
                onBlur={(e) => {
                  const value = parseFloat(e.target.value) || 150;
                  updateConsultationFee(value);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="150.00"
                step="0.01"
                min="0"
              />
            </div>
            <div className="text-sm text-gray-500 mt-6">
              Este valor será mostrado para os tutores
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Como Funciona</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>• <strong>Disponível:</strong> Você aparece na lista quando tutores tentam agendar consultas</p>
            <p>• <strong>Indisponível:</strong> Você não recebe novos agendamentos</p>
            <p>• <strong>Consultas já agendadas:</strong> Não são afetadas pelo status de disponibilidade</p>
            <p>• <strong>Valor da consulta:</strong> É mostrado para os tutores durante o agendamento</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                if (availability.isAvailable) {
                  toggleAvailability();
                } else {
                  toast('Você já está indisponível', { icon: 'ℹ️' });
                }
              }}
              className="flex items-center justify-center px-4 py-3 border border-error-300 text-error-700 rounded-lg hover:bg-error-50 transition-colors"
            >
              <XCircle className="h-5 w-5 mr-2" />
              Pausar Agendamentos
            </button>
            
            <button
              onClick={() => {
                if (!availability.isAvailable) {
                  toggleAvailability();
                } else {
                  toast('Você já está disponível', { icon: '✅' });
                }
              }}
              className="flex items-center justify-center px-4 py-3 border border-success-300 text-success-700 rounded-lg hover:bg-success-50 transition-colors"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              Retomar Agendamentos
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VetAvailabilityPage;