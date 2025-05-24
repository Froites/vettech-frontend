// src/pages/appointments/CreateAppointmentPage.tsx - COM TEMPLATES REUTILIZÁVEIS
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Calendar, User, Heart, Clock, RefreshCw, AlertTriangle } from 'lucide-react';
import { CreatePageLayout } from '../../components/layouts/CreatePageLayout';
import { FormSection } from '../../components/forms/FormSection';
import { usePets } from '../../hooks/usePets';
import { useAuthStore } from '../../stores/authStore';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const appointmentSchema = z.object({
  petId: z.string().min(1, 'Selecione um pet'),
  veterinarianId: z.string().min(1, 'Selecione um veterinário'),
  scheduledAt: z.string().min(1, 'Selecione data e horário'),
  type: z.enum(['ROUTINE', 'EMERGENCY', 'FOLLOW_UP']),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface VeterinarianAvailability {
  id: string;
  email: string;
  profile?: {
    firstName?: string;
    lastName?: string;
  };
  veterinarianProfile?: {
    crmv?: string;
    specialties?: string[];
    consultationFee?: number;
    isAvailable?: boolean;
  };
}

const CreateAppointmentPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { pets, isLoading: petsLoading } = usePets();
  const [veterinarians, setVeterinarians] = useState<VeterinarianAvailability[]>([]);
  const [loadingVets, setLoadingVets] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      type: 'ROUTINE',
      scheduledAt: format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm"),
    },
  });

  const selectedPetId = watch('petId');
  const selectedVetId = watch('veterinarianId');
  const selectedType = watch('type');
  const selectedDateTime = watch('scheduledAt');

  const selectedPet = pets.find(p => p.id === selectedPetId);
  const selectedVet = veterinarians.find(v => v.id === selectedVetId);

  useEffect(() => {
    // Debug dos dados recebidos
    console.log('🔍 Debug CreateAppointmentPage:', {
      user: user?.role,
      petsLength: pets?.length || 0,
      vetsLength: veterinarians?.length || 0,
      loadingVets,
      petsLoading
    });
  }, [user, pets, veterinarians, loadingVets, petsLoading]);
  // Redirect se não for tutor
  useEffect(() => {
    if (user && user?.role !== 'TUTOR') {
      navigate('/dashboard');
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  // Carregar veterinários disponíveis
  useEffect(() => {
    loadAvailableVeterinarians();
  }, []);

  const loadAvailableVeterinarians = async () => {
    try {
      setLoadingVets(true);
      const response = await api.get('/appointments/availability/veterinarians');
      
      // 🔥 CORREÇÃO: Validar dados antes de usar
      const vetsData = response.data || [];
      console.log('📡 Dados brutos dos veterinários:', vetsData);
      
      // Filtrar e validar cada veterinário
      const validVets = vetsData
        .filter((vet: any) => vet && vet.id) // Remover entradas inválidas
        .map((vet: any) => ({
          id: vet.id,
          email: vet.email || 'email@exemplo.com',
          profile: {
            firstName: vet.profile?.firstName || 'Nome',
            lastName: vet.profile?.lastName || 'Não Informado',
          },
          veterinarianProfile: vet.veterinarianProfile ? {
            crmv: vet.veterinarianProfile.crmv || 'Não informado',
            specialties: Array.isArray(vet.veterinarianProfile.specialties) 
              ? vet.veterinarianProfile.specialties 
              : ['Clínica Geral'],
            consultationFee: Number(vet.veterinarianProfile.consultationFee) || 150,
            isAvailable: Boolean(vet.veterinarianProfile.isAvailable)
          } : {
            crmv: 'Não informado',
            specialties: ['Clínica Geral'],
            consultationFee: 150,
            isAvailable: false
          }
        }));
        
      console.log('📋 Veterinários processados:', validVets);
      setVeterinarians(validVets);
      
      if (validVets.length === 0) {
        toast.error('Nenhum veterinário disponível encontrado');
      }
    } catch (error: any) {
      console.error('❌ Erro ao carregar veterinários:', error);
      toast.error('Erro ao carregar veterinários disponíveis');
      setVeterinarians([]);
    } finally {
      setLoadingVets(false);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      await api.post('/appointments', data);
      setShowSuccess(true);
      setTimeout(() => navigate('/appointments'), 2000);
    } catch (error: any) {
      console.error('❌ Erro ao agendar:', error);
      toast.error(error.response?.data?.message || 'Erro ao agendar consulta');
    }
  };

  const appointmentTypes = [
    { value: 'ROUTINE', label: 'Consulta de Rotina', description: 'Check-up geral, vacinas, etc.' },
    { value: 'EMERGENCY', label: 'Emergência', description: 'Situações urgentes' },
    { value: 'FOLLOW_UP', label: 'Retorno', description: 'Acompanhamento de tratamento' },
  ];

  // Loading se não tem usuário ou não é tutor
  if (!user || user.role !== 'TUTOR') {
    return (
      <CreatePageLayout
        title="Verificando permissões..."
        onBack={() => navigate('/appointments')}
        onSubmit={() => {}}
      >
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando permissões...</p>
          </div>
        </div>
      </CreatePageLayout>
    );
  }

  const summary = selectedPet && selectedVet ? {
    title: 'Resumo da Consulta:',
    items: [
      { label: 'Pet', value: selectedPet.name || 'Nome não informado' },
      { 
        label: 'Veterinário', 
        value: `Dr. ${selectedVet.profile?.firstName || 'Nome'} ${selectedVet.profile?.lastName || 'Sobrenome'}` 
      },
      { 
        label: 'Tipo', 
        value: appointmentTypes.find(t => t.value === selectedType)?.label || selectedType 
      },
      { 
        label: 'Data/Hora', 
        value: selectedDateTime 
          ? format(new Date(selectedDateTime), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) 
          : '--' 
      },
      { 
        label: 'Valor', 
        value: selectedVet.veterinarianProfile 
          ? `R$ ${Number(selectedVet.veterinarianProfile.consultationFee || 0).toFixed(2)}` 
          : 'R$ 0,00' 
      },
    ]
  } : undefined;

  return (
    <CreatePageLayout
      title="Agendar Consulta"
      description="Marque uma consulta para seu pet"
      onBack={() => navigate('/appointments')}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={creating}
      submitText="Agendar Consulta"
      submitIcon={Calendar}
      showSuccess={showSuccess}
      successTitle="Consulta agendada com sucesso!"
      successDescription="Redirecionando para seus agendamentos..."
      debugInfo={`Pets: ${pets.length} | Vets: ${veterinarians.length} | Loading: ${loadingVets ? 'Sim' : 'Não'}`}
      summary={summary}
    >
      {/* Seleção do Pet */}
      <FormSection title="Selecionar Pet" icon={Heart}>
        {petsLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : pets.length > 0 ? (
          <div className="space-y-3">
            {pets.map((pet) => (
              <label
                key={pet.id}
                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedPetId === pet.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  value={pet.id}
                  {...register('petId')}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3 w-full">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{pet.name}</p>
                    <p className="text-sm text-gray-500">{pet.species} • {pet.breed}</p>
                    {pet.allergies && pet.allergies.length > 0 && (
                      <p className="text-xs text-error-600 mt-1">
                        ⚠️ Alergias: {pet.allergies.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Heart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Você ainda não tem pets cadastrados</p>
            <button
              type="button"
              onClick={() => navigate('/pets/new')}
              className="mt-2 text-primary-600 hover:text-primary-700"
            >
              Cadastrar primeiro pet
            </button>
          </div>
        )}
        {errors.petId && (
          <p className="mt-2 text-sm text-red-600">{errors.petId.message}</p>
        )}
      </FormSection>

      {/* Seleção do Veterinário */}
      <FormSection 
        title="Selecionar Veterinário" 
        icon={User}
        className="relative"
      >
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-600">
            {loadingVets ? 'Carregando...' : `${veterinarians.length} veterinários disponíveis`}
          </span>
          <button
            type="button"
            onClick={loadAvailableVeterinarians}
            disabled={loadingVets}
            className="flex items-center text-sm text-primary-600 hover:text-primary-700"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loadingVets ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {loadingVets ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : veterinarians.length > 0 ? (
          <div className="space-y-3">
            {veterinarians.map((vet) => {
              // 🔥 CORREÇÃO: Verificações de segurança
              const firstName = vet?.profile?.firstName || 'Nome';
              const lastName = vet?.profile?.lastName || 'Sobrenome';
              const crmv = vet?.veterinarianProfile?.crmv || 'Não informado';
              const specialties = vet?.veterinarianProfile?.specialties || ['Clínica Geral'];
              const consultationFee = vet?.veterinarianProfile?.consultationFee || 0;
              const isAvailable = vet?.veterinarianProfile?.isAvailable !== false;

              return (
                <label
                  key={vet.id}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedVetId === vet.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    value={vet.id}
                    {...register('veterinarianId')}
                    className="sr-only"
                  />
                  <div className="flex items-center space-x-4 w-full">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        Dr. {firstName} {lastName}
                      </p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>CRMV: {crmv}</p>
                        <p>Especialidades: {Array.isArray(specialties) ? specialties.join(', ') : 'Clínica Geral'}</p>
                        <p className="font-medium text-primary-600">
                          Consulta: R$ {Number(consultationFee).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        isAvailable 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <Clock className="h-3 w-3 mr-1" />
                        {isAvailable ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="h-8 w-8 text-warning-500 mx-auto mb-2" />
            <p className="text-gray-500 mb-2">Nenhum veterinário disponível</p>
            <p className="text-sm text-gray-400">
              Os veterinários precisam marcar-se como disponíveis para aparecer aqui
            </p>
          </div>
        )}
        {errors.veterinarianId && (
          <p className="mt-2 text-sm text-red-600">{errors.veterinarianId.message}</p>
        )}
      </FormSection>

      {/* Detalhes da Consulta */}
      <FormSection title="Detalhes da Consulta" icon={Calendar}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data e Horário *
            </label>
            <input
              type="datetime-local"
              {...register('scheduledAt')}
              min={format(addDays(new Date(), 1), "yyyy-MM-dd'T'HH:mm")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            {errors.scheduledAt && (
              <p className="mt-1 text-sm text-red-600">{errors.scheduledAt.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Consulta *
            </label>
            <select
              {...register('type')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {appointmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Descreva os sintomas ou motivo da consulta..."
          />
        </div>

        {/* Tipo de consulta info */}
        {selectedType && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>{appointmentTypes.find(t => t.value === selectedType)?.label}:</strong>{' '}
              {appointmentTypes.find(t => t.value === selectedType)?.description}
            </p>
          </div>
        )}
      </FormSection>
    </CreatePageLayout>
  );
};

export default CreateAppointmentPage;