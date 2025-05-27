// src/pages/medical-records/CreateRecordPage.tsx - REFATORADA
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreatePageLayout } from '../../components/layouts/CreatePageLayout';
import { FormSection } from '../../components/forms/FormSection';
import Button from '../../components/ui/Button';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import { useAppointments } from '../../hooks/useAppointments';
import { 
  FileText, 
  Activity,
  Plus,
  X,
  Heart,
  Thermometer,
  Weight,
  Calendar
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const recordSchema = z.object({
  appointmentId: z.string().min(1, 'Selecione uma consulta'),
  symptoms: z.array(z.string()).min(1, 'Adicione pelo menos um sintoma'),
  diagnosis: z.string().optional(),
  treatment: z.string().optional(),
  observations: z.string().optional(),
  vitals: z.object({
    weight: z.number().positive().optional(),
    temperature: z.number().positive().optional(),
    heartRate: z.number().positive().optional(),
    respiratoryRate: z.number().positive().optional(),
  }).optional(),
});

type RecordFormData = z.infer<typeof recordSchema>;

// 🆕 Componente interno para seleção de sintomas (mantido como estava)
const SymptomSelector: React.FC<{
  symptoms: string[];
  onSymptomsChange: (symptoms: string[]) => void;
  error?: string;
}> = ({ symptoms, onSymptomsChange, error }) => {
  const [newSymptom, setNewSymptom] = useState('');

  const commonSymptoms = [
    'Perda de apetite',
    'Vômito',
    'Diarreia',
    'Letargia',
    'Tosse',
    'Espirros',
    'Febre',
    'Dor',
    'Dificuldade para respirar',
    'Comportamento anormal',
    'Problemas de pele',
    'Coceira excessiva'
  ];

  const addSymptom = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      const updatedSymptoms = [...symptoms, symptom];
      onSymptomsChange(updatedSymptoms);
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    const updatedSymptoms = symptoms.filter(symptom => symptom !== symptomToRemove);
    onSymptomsChange(updatedSymptoms);
  };

  return (
    <div className="space-y-4">
      {/* Sintomas comuns */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Sintomas comuns:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {commonSymptoms.map((symptom) => (
            <Button
              key={symptom}
              type="button"
              variant={symptoms.includes(symptom) ? "primary" : "outline"}
              size="sm"
              onClick={() => addSymptom(symptom)}
              disabled={symptoms.includes(symptom)}
            >
              {symptoms.includes(symptom) ? '✓' : '+'} {symptom}
            </Button>
          ))}
        </div>
      </div>

      {/* Adicionar sintoma customizado */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newSymptom}
            onChange={(e) => setNewSymptom(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Ou adicione um sintoma específico..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSymptom(newSymptom);
              }
            }}
          />
          <button
            type="button"
            onClick={() => addSymptom(newSymptom)}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        {/* Lista de sintomas selecionados */}
        {symptoms.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Sintomas selecionados:</p>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800"
                >
                  {symptom}
                  <button
                    type="button"
                    onClick={() => removeSymptom(symptom)}
                    className="ml-2 hover:text-primary-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const CreateRecordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createMedicalRecord, isCreating } = useMedicalRecords();
  const { upcoming } = useAppointments();
  
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RecordFormData>({
    resolver: zodResolver(recordSchema),
  });

  const watchedAppointmentId = watch('appointmentId');

  // Pre-selecionar consulta se veio da URL (mantido igual)
  useEffect(() => {
    const appointmentIdFromUrl = searchParams.get('appointmentId');
    if (appointmentIdFromUrl && upcoming.some(apt => apt.id === appointmentIdFromUrl)) {
      setValue('appointmentId', appointmentIdFromUrl);
    }
  }, [searchParams, upcoming, setValue]);

  // Atualizar lista de sintomas no form (mantido igual)
  useEffect(() => {
    setValue('symptoms', symptoms);
  }, [symptoms, setValue]);

  const selectedAppointment = upcoming.find(apt => apt.id === watchedAppointmentId);
  const availableAppointments = upcoming.filter(apt => apt.status === 'COMPLETED' || apt.status === 'IN_PROGRESS');

  const onSubmit = async (data: RecordFormData) => {
    try {
      console.log('📝 Criando prontuário:', data);
      
      // Limpar campos vazios dos vitais (mantido igual)
      const cleanedData = {
        ...data,
        symptoms,
        vitals: data.vitals ? {
          ...(data.vitals.weight && data.vitals.weight > 0 && { weight: data.vitals.weight }),
          ...(data.vitals.temperature && data.vitals.temperature > 0 && { temperature: data.vitals.temperature }),
          ...(data.vitals.heartRate && data.vitals.heartRate > 0 && { heartRate: data.vitals.heartRate }),
          ...(data.vitals.respiratoryRate && data.vitals.respiratoryRate > 0 && { respiratoryRate: data.vitals.respiratoryRate }),
        } : undefined,
      };
      
      // Remove vitals se estiver vazio
      if (cleanedData.vitals && Object.keys(cleanedData.vitals).length === 0) {
        cleanedData.vitals = undefined;
      }

      await createMedicalRecord(cleanedData);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/medical-records');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Erro ao criar prontuário:', error);
    }
  };

  // 🆕 Summary para mostrar no CreatePageLayout
  const summary = selectedAppointment && symptoms.length > 0 ? {
    title: 'Resumo do Prontuário:',
    items: [
      { label: 'Pet', value: `${selectedAppointment.pet?.name || 'N/A'} (${selectedAppointment.pet?.species || 'N/A'})` },
      { label: 'Consulta', value: format(parseISO(selectedAppointment.scheduledAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) },
      { label: 'Sintomas', value: symptoms.join(', ') },
      ...(watch('diagnosis') ? [{ label: 'Diagnóstico', value: watch('diagnosis') || '' }] : []),
      ...(watch('treatment') ? [{ label: 'Tratamento', value: watch('treatment') || '' }] : []),
    ]
  } : undefined;

  return (
    <CreatePageLayout
      title="Criar Prontuário"
      description="Registre os dados da consulta"
      onBack={() => navigate('/medical-records')}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isCreating}
      submitText="Criar Prontuário"
      submitIcon={FileText}
      showSuccess={showSuccess}
      successTitle="Prontuário criado com sucesso!"
      successDescription="Redirecionando para a lista de prontuários..."
      debugInfo={`Consultas disponíveis: ${upcoming.length} | Selecionada: ${selectedAppointment?.pet?.name || 'Nenhuma'} | Sintomas: ${symptoms.length}`}
      summary={summary}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Coluna 1: Consulta e Sintomas */}
        <div className="space-y-6">
          {/* 🆕 Seleção de Consulta */}
          <FormSection title="Selecionar Consulta" icon={Calendar}>
            {availableAppointments.length > 0 ? (
              <div className="space-y-3">
                {availableAppointments.map((appointment) => (
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
                        <Heart className="h-5 w-5 text-primary-600" />
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
                        {appointment.notes && (
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Obs:</strong> {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Nenhuma consulta disponível para prontuário</p>
              </div>
            )}
            
            {errors.appointmentId && (
              <p className="mt-2 text-sm text-red-600">{errors.appointmentId.message}</p>
            )}
          </FormSection>

          {/* 🆕 Sintomas usando SymptomSelector */}
          <FormSection title="Sintomas Observados" description="Registre os sintomas do paciente">
            <SymptomSelector
              symptoms={symptoms}
              onSymptomsChange={setSymptoms}
              error={errors.symptoms?.message}
            />
          </FormSection>
        </div>

        {/* Coluna 2: Vitais e Diagnóstico */}
        <div className="space-y-6">
          {/* 🆕 Sinais Vitais */}
          <FormSection title="Sinais Vitais" icon={Activity}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Weight className="inline h-4 w-4 mr-1" />
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('vitals.weight', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: 5.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Thermometer className="inline h-4 w-4 mr-1" />
                  Temperatura (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('vitals.temperature', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: 38.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Freq. Cardíaca (bpm)
                </label>
                <input
                  type="number"
                  {...register('vitals.heartRate', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: 120"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Freq. Respiratória (rpm)
                </label>
                <input
                  type="number"
                  {...register('vitals.respiratoryRate', { valueAsNumber: true })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: 30"
                />
              </div>
            </div>
          </FormSection>

          {/* 🆕 Diagnóstico */}
          <FormSection title="Diagnóstico">
            <textarea
              {...register('diagnosis')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Descreva o diagnóstico baseado nos sintomas e exame físico..."
            />
          </FormSection>

          {/* 🆕 Tratamento */}
          <FormSection title="Tratamento Recomendado">
            <textarea
              {...register('treatment')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Descreva o tratamento, medicações, dosagens e instruções..."
            />
          </FormSection>
        </div>
      </div>

      {/* 🆕 Observações */}
      <FormSection title="Observações Adicionais" description="Informações complementares sobre o atendimento">
        <textarea
          {...register('observations')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Observações gerais, recomendações para o tutor, próximos passos..."
        />
      </FormSection>
    </CreatePageLayout>
  );
};

export default CreateRecordPage;