import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreatePageLayout } from '../../components/layouts/CreatePageLayout';
import { FormSection } from '../../components/forms/FormSection';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import { useAppointments } from '../../hooks/useAppointments';
import { 
  Plus, 
  X,
  Pill,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { format, parseISO, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../../components/ui/Button';

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

// 🆕 Componente interno para gerenciar medicamentos
const MedicationFormFields: React.FC<{
  register: any;
  errors: any;
  control: any;
  fields: any[];
  append: (medication: any) => void;
  remove: (index: number) => void;
}> = ({ register, errors, control, fields, append, remove }) => {
  
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Coluna 1: Medicamentos Comuns */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Medicamentos Comuns
        </h3>
        <p className="text-sm text-gray-600 mb-4">Clique para adicionar rapidamente:</p>
        <div className="grid grid-cols-1 gap-2">
          {commonMedications.map((medication, index) => (
            <Button
              key={index}
              type="button"
              onClick={() => addCommonMedication(medication)}
              className="text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">{medication.name}</div>
              <div className="text-sm text-gray-600">
                {medication.dosage} • {medication.frequency} • {medication.duration}
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Coluna 2: Lista de Medicamentos */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Medicamentos Prescritos ({fields.length})
          </h3>
          <Button
            type="button"
            onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', instructions: '', warnings: [] })}
            className="btn btn-outline btn-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar
          </Button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Medicamento #{index + 1}</h4>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <X className="h-4 w-4" />
                  </Button>
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
  );
};

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
  const watchedValidUntil = watch('validUntil');

  // Pre-selecionar consulta se veio da URL (mantido igual)
  useEffect(() => {
    const appointmentIdFromUrl = searchParams.get('appointmentId');
    const recordIdFromUrl = searchParams.get('recordId');
    
    if (appointmentIdFromUrl && upcoming.some(apt => apt.id === appointmentIdFromUrl)) {
      setValue('appointmentId', appointmentIdFromUrl);
    }
    
    if (recordIdFromUrl) {
      console.log('🔗 Criar receita para prontuário:', recordIdFromUrl);
    }
  }, [searchParams, upcoming, setValue]);

  const selectedAppointment = upcoming.find(apt => apt.id === watchedAppointmentId);
  const completedAppointments = upcoming.filter(apt => apt.status === 'COMPLETED');

  const onSubmit = async (data: PrescriptionFormData) => {
    try {
      console.log('💊 Criando receita:', data);
      await createPrescription(data);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/prescriptions');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Erro ao criar receita:', error);
    }
  };

  // 🆕 Summary para mostrar no CreatePageLayout
  const summary = selectedAppointment && fields.length > 0 ? {
    title: 'Resumo da Receita:',
    items: [
      { label: 'Pet', value: `${selectedAppointment.pet?.name} (${selectedAppointment.pet?.species})` },
      { label: 'Consulta', value: format(parseISO(selectedAppointment.scheduledAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) },
      { label: 'Medicamentos', value: fields.length.toString() },
      { label: 'Válida até', value: watchedValidUntil ? format(parseISO(watchedValidUntil + 'T00:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : '--' },
    ]
  } : undefined;

  return (
    <CreatePageLayout
      title="Nova Receita"
      description="Prescreva medicamentos para o paciente"
      onBack={() => navigate('/prescriptions')}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isCreating}
      submitText="Criar Receita"
      submitIcon={Pill}
      showSuccess={showSuccess}
      successTitle="Receita criada com sucesso!"
      successDescription="Redirecionando para a lista de receitas..."
      debugInfo={`Consultas disponíveis: ${upcoming.length} | Selecionada: ${selectedAppointment?.pet?.name || 'Nenhuma'}`}
      summary={summary}
    >
      {/* 🆕 Seleção de Consulta */}
      <FormSection title="Selecionar Consulta" icon={Calendar}>
        {completedAppointments.length > 0 ? (
          <div className="space-y-3">
            {completedAppointments.map((appointment) => (
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
      </FormSection>

      {/* 🆕 Medicamentos usando componente interno */}
      <FormSection title="Medicamentos" description="Gerencie os medicamentos prescritos">
        <MedicationFormFields
          register={register}
          errors={errors}
          control={control}
          fields={fields}
          append={append}
          remove={remove}
        />
      </FormSection>

      {/* 🆕 Instruções e Validade */}
      <FormSection title="Instruções e Validade" description="Configure os detalhes finais da receita">
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
      </FormSection>
    </CreatePageLayout>
  );
};

export default CreatePrescriptionPage;