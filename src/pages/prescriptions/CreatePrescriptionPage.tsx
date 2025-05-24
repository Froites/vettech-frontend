// src/pages/prescriptions/CreatePrescriptionPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '../../components/layout/Layout';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import { useAppointments } from '../../hooks/useAppointments';
import { 
  ArrowLeft, 
  Plus, 
  X,
  Pill,
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { format, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const medicationSchema = z.object({
  name: z.string().min(1, 'Nome do medicamento é obrigatório'),
  dosage: z.string().min(1, 'Dosagem é obrigatória'),
  frequency: z.string().min(1, 'Frequência é obrigatória'),
  duration: z.string().min(1, 'Duração é obrigatória'),
  instructions: z.string().optional(),
  warnings: z.array(z.string()).optional(),
});

const prescriptionSchema = z.object({
  appointmentId: z.string().min(1, 'Selecione uma consulta'),
  medications: z.array(medicationSchema).min(1, 'Adicione pelo menos um medicamento'),
  instructions: z.string().min(1, 'Instruções gerais são obrigatórias'),
  validUntil: z.string().min(1, 'Data de validade é obrigatória'),
});

type PrescriptionFormData = z.infer<typeof prescriptionSchema>;

const CreatePrescriptionPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createPrescription, isCreating } = usePrescriptions();
  const { upcoming } = useAppointments();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PrescriptionFormData>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '', warnings: [] }],
      validUntil: format(addDays(new Date(), 30), 'yyyy-MM-dd'), // 30 dias de validade padrão
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'medications',
  });

  const watchedAppointmentId = watch('appointmentId');

  // Pre-selecionar consulta se veio da URL
  useEffect(() => {
    const appointmentIdFromUrl = searchParams.get('appointmentId');
    const recordIdFromUrl = searchParams.get('recordId');
    
    if (appointmentIdFromUrl && upcoming.some(apt => apt.id === appointmentIdFromUrl)) {
      setValue('appointmentId', appointmentIdFromUrl);
    }
    
    // TODO: Se veio recordId, buscar a consulta relacionada
    if (recordIdFromUrl) {
      console.log('🔗 Criar receita para prontuário:', recordIdFromUrl);
    }
  }, [searchParams, upcoming, setValue]);

  const selectedAppointment = upcoming.find(apt => apt.id === watchedAppointmentId);

  // Medicamentos comuns
  const commonMedications = [
    { name: 'Amoxicilina', dosage: '250mg', frequency: '2x ao dia', duration: '7 dias' },
    { name: 'Dipirona', dosage: '25mg/kg', frequency: '3x ao dia', duration: '5 dias' },
    { name: 'Prednisolona', dosage: '1mg/kg', frequency: '1x ao dia', duration: '5 dias' },
    { name: 'Meloxicam', dosage: '0,1mg/kg', frequency: '1x ao dia', duration: '3 dias' },
    { name: 'Cloridrato de Tramadol', dosage: '2-4mg/kg', frequency: '2x ao dia', duration: '3 dias' },
    { name: 'Omeprazol', dosage: '0,7mg/kg', frequency: '1x ao dia', duration: '7 dias' },
  ];

  const addCommonMedication = (medication: typeof commonMedications[0]) => {
    append({
      ...medication,
      instructions: '',
      warnings: [],
    });
  };

  const onSubmit = async (data: PrescriptionFormData) => {
    console.log('💊 Criando receita:', data);
    
    try {
      await createPrescription(data);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/prescriptions');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Erro ao criar receita:', error);
    }
  };

  if (showSuccess) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-success-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Receita criada com sucesso!
            </h2>
            <p className="text-gray-600 mb-6">
              Redirecionando para a lista de receitas...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/prescriptions')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nova Receita</h1>
            <p className="text-gray-600">Prescreva medicamentos para o paciente</p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Debug:</strong> 
            Consultas disponíveis: {upcoming.length} | 
            Selecionada: {selectedAppointment?.pet?.name || 'Nenhuma'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna 1: Consulta e Medicamentos */}
            <div className="space-y-6">
              {/* Seleção de Consulta */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                  Selecionar Consulta
                </h3>
                
                {upcoming.filter(apt => apt.status === 'COMPLETED').length > 0 ? (
                  <div className="space-y-3">
                    {upcoming.filter(apt => apt.status === 'COMPLETED').map((appointment) => (
                      <label
                        key={appointment.id}
                        className={`flex items-start p-3 border rounded-lg cursor-pointer transition-colors ${
                          watchedAppointmentId === appointment.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          value={appointment.id}
                          {...register('appointmentId')}
                          className="sr-only"
                        />
                        <div className="flex items-start space-x-3 w-full">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Pill className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900">
                              {appointment.pet?.name} - {appointment.pet?.species}
                            </p>
                            <p className="text-sm text-gray-500">
                              {format(parseISO(appointment.scheduledAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </p>
                            <p className="text-sm text-gray-500">
                              Tutor: {appointment.tutor?.profile?.firstName} {appointment.tutor?.profile?.lastName}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-8 w-8 text-warning-500 mx-auto mb-2" />
                    <p className="text-gray-500">Nenhuma consulta finalizada disponível</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Receitas só podem ser criadas para consultas já finalizadas
                    </p>
                  </div>
                )}
                
                {errors.appointmentId && (
                  <p className="mt-2 text-sm text-red-600">{errors.appointmentId.message}</p>
                )}
              </div>

              {/* Medicamentos Comuns */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Medicamentos Comuns
                </h3>
                <p className="text-sm text-gray-600 mb-4">Clique para adicionar rapidamente:</p>
                <div className="grid grid-cols-1 gap-2">
                  {commonMedications.map((medication, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => addCommonMedication(medication)}
                      className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{medication.name}</div>
                      <div className="text-sm text-gray-600">
                        {medication.dosage} • {medication.frequency} • {medication.duration}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna 2: Lista de Medicamentos */}
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Medicamentos Prescritos ({fields.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', instructions: '', warnings: [] })}
                    className="btn btn-outline btn-sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar
                  </button>
                </div>

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">Medicamento #{index + 1}</h4>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nome do Medicamento *
                          </label>
                          <input
                            {...register(`medications.${index}.name`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Ex: Amoxicilina"
                          />
                          {errors.medications?.[index]?.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.medications[index]?.name?.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dosagem *
                          </label>
                          <input
                            {...register(`medications.${index}.dosage`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Ex: 250mg, 1mg/kg"
                          />
                          {errors.medications?.[index]?.dosage && (
                            <p className="mt-1 text-sm text-red-600">{errors.medications[index]?.dosage?.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Frequência *
                          </label>
                          <input
                            {...register(`medications.${index}.frequency`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Ex: 2x ao dia, A cada 8h"
                          />
                          {errors.medications?.[index]?.frequency && (
                            <p className="mt-1 text-sm text-red-600">{errors.medications[index]?.frequency?.message}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Duração *
                          </label>
                          <input
                            {...register(`medications.${index}.duration`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Ex: 7 dias, 2 semanas"
                          />
                          {errors.medications?.[index]?.duration && (
                            <p className="mt-1 text-sm text-red-600">{errors.medications[index]?.duration?.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Instruções Específicas
                        </label>
                        <textarea
                          {...register(`medications.${index}.instructions`)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Ex: Administrar com comida, Aplicar na pele limpa..."
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {errors.medications && (
                  <p className="mt-2 text-sm text-red-600">
                    {Array.isArray(errors.medications) ? 'Verifique os campos dos medicamentos' : errors.medications.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Instruções Gerais e Validade */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instruções Gerais *
                </label>
                <textarea
                  {...register('instructions')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Instruções gerais para o tutor, cuidados especiais, observações importantes..."
                />
                {errors.instructions && (
                  <p className="mt-1 text-sm text-red-600">{errors.instructions.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Válida até *
                </label>
                <input
                  type="date"
                  {...register('validUntil')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {errors.validUntil && (
                  <p className="mt-1 text-sm text-red-600">{errors.validUntil.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Receitas são válidas por no máximo 30 dias
                </p>
              </div>
            </div>
          </div>

          {/* Resumo e Botões */}
          <div className="bg-white shadow rounded-lg p-6">
            {selectedAppointment && fields.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Resumo da Receita:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Pet:</strong> {selectedAppointment.pet?.name} ({selectedAppointment.pet?.species})</p>
                  <p><strong>Consulta:</strong> {format(parseISO(selectedAppointment.scheduledAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                  <p><strong>Medicamentos:</strong> {fields.length}</p>
                  <p><strong>Válida até:</strong> {watch('validUntil') ? format(parseISO(watch('validUntil') + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : '--'}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/prescriptions')}
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
                    Salvando...
                  </>
                ) : (
                  <>
                    <Pill className="h-4 w-4 mr-2" />
                    Criar Receita
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

export default CreatePrescriptionPage;