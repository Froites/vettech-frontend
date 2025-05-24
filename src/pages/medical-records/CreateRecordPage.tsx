import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Layout } from '../../components/layout/Layout';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import { useAppointments } from '../../hooks/useAppointments';
import { 
  ArrowLeft, 
  FileText, 
  Activity,
  CheckCircle,
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

const CreateRecordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createMedicalRecord, isCreating } = useMedicalRecords();
  const { upcoming } = useAppointments();
  
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [newSymptom, setNewSymptom] = useState('');
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

  // Pre-selecionar consulta se veio da URL
  useEffect(() => {
    const appointmentIdFromUrl = searchParams.get('appointmentId');
    if (appointmentIdFromUrl && upcoming.some(apt => apt.id === appointmentIdFromUrl)) {
      setValue('appointmentId', appointmentIdFromUrl);
    }
  }, [searchParams, upcoming, setValue]);

  // Atualizar lista de sintomas no form
  useEffect(() => {
    setValue('symptoms', symptoms);
  }, [symptoms, setValue]);

  const selectedAppointment = upcoming.find(apt => apt.id === watchedAppointmentId);

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
      setSymptoms(updatedSymptoms);
      setNewSymptom('');
    }
  };

  const removeSymptom = (symptomToRemove: string) => {
    const updatedSymptoms = symptoms.filter(symptom => symptom !== symptomToRemove);
    setSymptoms(updatedSymptoms);
  };

  const onSubmit = async (data: RecordFormData) => {
    console.log('📝 Criando prontuário:', data);
    
    try {
      // Limpar campos vazios dos vitais
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

  if (showSuccess) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Prontuário criado com sucesso!
            </h2>
            <p className="text-gray-600 mb-6">
              Redirecionando para a lista de prontuários...
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
            onClick={() => navigate('/medical-records')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Criar Prontuário</h1>
            <p className="text-gray-600">Registre os dados da consulta</p>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Debug:</strong> 
            Consultas disponíveis: {upcoming.length} | 
            Selecionada: {selectedAppointment?.pet?.name || 'Nenhuma'} | 
            Sintomas: {symptoms.length}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Coluna 1: Consulta e Sintomas */}
            <div className="space-y-6">
              {/* Seleção de Consulta */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                  Selecionar Consulta
                </h3>
                
                {upcoming.length > 0 ? (
                  <div className="space-y-3">
                    {upcoming.filter(apt => apt.status === 'COMPLETED' || apt.status === 'IN_PROGRESS').map((appointment) => (
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
              </div>

              {/* Sintomas */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Sintomas Observados
                </h3>
                
                {/* Sintomas comuns */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Sintomas comuns:</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {commonSymptoms.map((symptom) => (
                      <button
                        key={symptom}
                        type="button"
                        onClick={() => addSymptom(symptom)}
                        disabled={symptoms.includes(symptom)}
                        className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                          symptoms.includes(symptom)
                            ? 'bg-green-100 text-green-800 border-green-300'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {symptoms.includes(symptom) ? '✓' : '+'} {symptom}
                      </button>
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
                
                {errors.symptoms && (
                  <p className="mt-2 text-sm text-red-600">{errors.symptoms.message}</p>
                )}
              </div>
            </div>

            {/* Coluna 2: Diagnóstico e Tratamento */}
            <div className="space-y-6">
              {/* Vitais */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary-600" />
                  Sinais Vitais
                </h3>
                
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
              </div>

              {/* Diagnóstico */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Diagnóstico
                </h3>
                <textarea
                  {...register('diagnosis')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Descreva o diagnóstico baseado nos sintomas e exame físico..."
                />
              </div>

              {/* Tratamento */}
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tratamento Recomendado
                </h3>
                <textarea
                  {...register('treatment')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Descreva o tratamento, medicações, dosagens e instruções..."
                />
              </div>
            </div>
          </div>

          {/* Observações */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Observações Adicionais
            </h3>
            <textarea
              {...register('observations')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Observações gerais, recomendações para o tutor, próximos passos..."
            />
          </div>

          {/* Resumo e Botões */}
          <div className="bg-white shadow rounded-lg p-6">
            {selectedAppointment && symptoms.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Resumo do Prontuário:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Pet:</strong> {selectedAppointment.pet?.name} ({selectedAppointment.pet?.species})</p>
                  <p><strong>Consulta:</strong> {format(parseISO(selectedAppointment.scheduledAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
                  <p><strong>Sintomas:</strong> {symptoms.join(', ')}</p>
                  {watch('diagnosis') && <p><strong>Diagnóstico:</strong> {watch('diagnosis')}</p>}
                  {watch('treatment') && <p><strong>Tratamento:</strong> {watch('treatment')}</p>}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/medical-records')}
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
                    <FileText className="h-4 w-4 mr-2" />
                    Criar Prontuário
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

export default CreateRecordPage;