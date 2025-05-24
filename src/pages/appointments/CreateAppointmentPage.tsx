// src/pages/appointments/CreateAppointmentPage.tsx - COMPLETO
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft, 
  Calendar, 
  Clock,
  CheckCircle,
  User,
  Heart,
  AlertCircle
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppointments, useAvailableSlots, useVeterinarians } from '../../hooks/useAppointments';
import { usePets } from '../../hooks/usePets';
import { Layout } from '../../components/layout/Layout';

const appointmentSchema = z.object({
  petId: z.string().min(1, 'Selecione um pet'),
  veterinarianId: z.string().min(1, 'Selecione um veterinário'),
  date: z.string().min(1, 'Selecione uma data'),
  time: z.string().min(1, 'Selecione um horário'),
  type: z.enum(['ROUTINE', 'EMERGENCY', 'FOLLOW_UP'], {
    required_error: 'Selecione o tipo de consulta',
  }),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const CreateAppointmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createAppointment, isCreating } = useAppointments();
  const { pets } = usePets();
  const { data: veterinarians, isLoading: loadingVets } = useVeterinarians();
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedVetId, setSelectedVetId] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: availableSlots, isLoading: loadingSlots } = useAvailableSlots(selectedVetId, selectedDate);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  const watchedPetId = watch('petId');
  const watchedVetId = watch('veterinarianId');
  const watchedDate = watch('date');

  // Pre-selecionar pet se veio da URL
  useEffect(() => {
    const petIdFromUrl = searchParams.get('petId');
    if (petIdFromUrl && pets.some(pet => pet.id === petIdFromUrl)) {
      setValue('petId', petIdFromUrl);
    }
  }, [searchParams, pets, setValue]);

  // Atualizar states quando form muda
  useEffect(() => {
    if (watchedVetId !== selectedVetId) {
      setSelectedVetId(watchedVetId || '');
    }
  }, [watchedVetId]);

  useEffect(() => {
    if (watchedDate !== selectedDate) {
      setSelectedDate(watchedDate || '');
    }
  }, [watchedDate]);

  const appointmentTypes = [
    { 
      value: 'ROUTINE', 
      label: 'Consulta de Rotina', 
      description: 'Check-up geral, vacinas, vermífugos',
      icon: '🏥'
    },
    { 
      value: 'EMERGENCY', 
      label: 'Emergência', 
      description: 'Situações urgentes que precisam de atenção imediata',
      icon: '🚨'
    },
    { 
      value: 'FOLLOW_UP', 
      label: 'Retorno', 
      description: 'Acompanhamento de tratamento ou cirurgia',
      icon: '📋'
    },
  ];

  // Gerar próximos 30 dias (excluindo domingos)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = addDays(today, i);
      const dayOfWeek = date.getDay();
      
      // Excluir domingos (0)
      if (dayOfWeek !== 0) {
        dates.push({
          value: format(date, 'yyyy-MM-dd'),
          label: format(date, "EEEE, dd 'de' MMMM", { locale: ptBR }),
          short: format(date, 'dd/MM', { locale: ptBR })
        });
      }
    }
    
    return dates;
  };

  const onSubmit = async (data: AppointmentFormData) => {
    console.log('📅 Criando agendamento:', data);
    
    try {
      // Combinar data e hora no formato ISO
      const scheduledAt = `${data.date}T${data.time}:00.000Z`;
      
      const appointmentData = {
        petId: data.petId,
        veterinarianId: data.veterinarianId,
        scheduledAt,
        type: data.type,
        notes: data.notes || undefined,
      };
      
      console.log('📤 Dados finais:', appointmentData);
      
      await createAppointment(appointmentData);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/appointments');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Erro ao criar agendamento:', error);
    }
  };

  if (showSuccess) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Consulta agendada com sucesso!
            </h2>
            <p className="text-gray-600 mb-6">
              Redirecionando para seus agendamentos...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedPet = pets.find(pet => pet.id === watchedPetId);
  const selectedVet = veterinarians?.find(vet => vet.id === watchedVetId);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/appointments')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Agendar Consulta</h1>
            <p className="text-gray-600">Escolha o pet, veterinário e horário</p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Debug:</strong> 
            Pets: {pets.length} | 
            Vets: {veterinarians?.length || 0} | 
            Slots: {availableSlots?.length || 0} |
            Selected: Pet({selectedPet?.name}), Vet({selectedVet?.profile?.firstName}), Date({selectedDate})
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna 1: Pet e Tipo */}
            <div className="space-y-6">
              {/* Seleção de Pet */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-primary-600" />
                  Selecionar Pet
                </h3>
                
                {pets.length > 0 ? (
                  <div className="space-y-3">
                    {pets.map((pet) => (
                      <label
                        key={pet.id}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                          watchedPetId === pet.id
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
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            {pet.photoUrl ? (
                              <img 
                                src={pet.photoUrl} 
                                alt={pet.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <Heart className="h-5 w-5 text-primary-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{pet.name}</p>
                            <p className="text-sm text-gray-500">{pet.species} • {pet.breed}</p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Nenhum pet cadastrado</p>
                  </div>
                )}
                
                {errors.petId && (
                  <p className="mt-2 text-sm text-red-600">{errors.petId.message}</p>
                )}
              </div>

              {/* Tipo de Consulta */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tipo de Consulta
                </h3>
                
                <div className="space-y-3">
                  {appointmentTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                        watch('type') === type.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        value={type.value}
                        {...register('type')}
                        className="sr-only"
                      />
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{type.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{type.label}</p>
                          <p className="text-sm text-gray-500">{type.description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                
                {errors.type && (
                  <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
                )}
              </div>
            </div>

            {/* Coluna 2: Veterinário */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-primary-600" />
                Selecionar Veterinário
              </h3>
              
              {loadingVets ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-3 border border-gray-200 rounded-lg">
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
              ) : veterinarians && veterinarians.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {veterinarians.map((vet) => (
                    <label
                      key={vet.id}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                        watchedVetId === vet.id
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
                      <div className="flex items-start space-x-3 w-full">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">
                            Dr. {vet.profile?.firstName} {vet.profile?.lastName}
                          </p>
                          {vet.veterinarianProfile && (
                            <>
                              <p className="text-sm text-gray-500">
                                CRMV: {vet.veterinarianProfile.crmv}
                              </p>
                              {vet.veterinarianProfile.specialties.length > 0 && (
                                <p className="text-sm text-gray-500">
                                  {vet.veterinarianProfile.specialties.join(', ')}
                                </p>
                              )}
                              <p className="text-sm font-medium text-green-600">
                                R$ {vet.veterinarianProfile.consultationFee.toFixed(2).replace('.', ',')}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Nenhum veterinário disponível</p>
                </div>
              )}
              
              {errors.veterinarianId && (
                <p className="mt-2 text-sm text-red-600">{errors.veterinarianId.message}</p>
              )}
            </div>

            {/* Coluna 3: Data e Horário */}
            <div className="space-y-6">
              {/* Data */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                  Selecionar Data
                </h3>
                
                <select
                  {...register('date')}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Escolha uma data...</option>
                  {getAvailableDates().map((date) => (
                    <option key={date.value} value={date.value}>
                      {date.label}
                    </option>
                  ))}
                </select>
                
                {errors.date && (
                  <p className="mt-2 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              {/* Horários */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary-600" />
                  Selecionar Horário
                </h3>
                
                {!selectedVetId || !selectedDate ? (
                  <p className="text-gray-500 text-sm">
                    Selecione um veterinário e uma data primeiro
                  </p>
                ) : loadingSlots ? (
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse h-10 bg-gray-200 rounded"></div>
                    ))}
                  </div>
                ) : availableSlots && availableSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                    {availableSlots.map((slot) => (
                      <label
                        key={slot.time}
                        className={`flex items-center justify-center p-2 border rounded cursor-pointer text-sm ${
                          slot.available
                            ? watch('time') === slot.time
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:bg-gray-50'
                            : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <input
                          type="radio"
                          value={slot.time}
                          {...register('time')}
                          disabled={!slot.available}
                          className="sr-only"
                        />
                        {slot.time}
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    Nenhum horário disponível para esta data
                  </p>
                )}
                
                {errors.time && (
                  <p className="mt-2 text-sm text-red-600">{errors.time.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Observações (Opcional)
            </h3>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Descreva sintomas, comportamentos ou outras informações relevantes..."
            />
          </div>

          {/* Resumo e Botões */}
          <div className="bg-white shadow rounded-lg p-6">
            {selectedPet && selectedVet && watch('date') && watch('time') && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Resumo do Agendamento:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Pet:</strong> {selectedPet.name} ({selectedPet.species})</p>
                  <p><strong>Veterinário:</strong> Dr. {selectedVet.profile?.firstName} {selectedVet.profile?.lastName}</p>
                  <p><strong>Data:</strong> {watch('date') && format(new Date(watch('date')), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</p>
                  <p><strong>Horário:</strong> {watch('time')}</p>
                  <p><strong>Tipo:</strong> {appointmentTypes.find(t => t.value === watch('type'))?.label}</p>
                  {selectedVet.veterinarianProfile && (
                    <p><strong>Valor:</strong> R$ {selectedVet.veterinarianProfile.consultationFee.toFixed(2).replace('.', ',')}</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/appointments')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isCreating}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 flex items-center"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Agendando...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Confirmar Agendamento
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateAppointmentPage;