import type { MedicalRecord } from '../../types/medical-record';
import { 
  FileText, 
  Calendar,
  Activity,
  User,
  Thermometer,
  Weight
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RecordCardProps {
  record: MedicalRecord;
  showPetInfo?: boolean;
  compact?: boolean;
}

const RecordCard = ({ record, showPetInfo = false, compact = false }: RecordCardProps) => {
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  };

  if (compact) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              {showPetInfo && record.pet && (
                <h4 className="font-medium text-gray-900 truncate">
                  {record.pet.name}
                </h4>
              )}
              <p className="text-sm text-gray-600">
                {formatDate(record.createdAt)}
              </p>
              {record.diagnosis && (
                <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                  {record.diagnosis}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Sintomas */}
        {record.symptoms && record.symptoms.length > 0 && (
          <div className="mt-3">
            <div className="flex flex-wrap gap-1">
              {record.symptoms.slice(0, 2).map((symptom, index) => (
                <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  {symptom}
                </span>
              ))}
              {record.symptoms.length > 2 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                  +{record.symptoms.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
            <FileText className="h-6 w-6 text-primary-600" />
          </div>
          <div>
            {showPetInfo && record.pet && (
              <h3 className="text-lg font-semibold text-gray-900">
                Prontuário - {record.pet.name}
              </h3>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(record.createdAt)}
              </div>
              {record.createdBy && (
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Dr. {record.createdBy.profile?.firstName} {record.createdBy.profile?.lastName}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sintomas e Diagnóstico */}
        <div className="space-y-4">
          {record.symptoms && record.symptoms.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Sintomas</h4>
              <div className="flex flex-wrap gap-2">
                {record.symptoms.map((symptom, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                    {symptom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {record.diagnosis && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Diagnóstico</h4>
              <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                {record.diagnosis}
              </p>
            </div>
          )}
        </div>

        {/* Vitais e Tratamento */}
        <div className="space-y-4">
          {record.vitals && Object.keys(record.vitals).length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Activity className="h-4 w-4 mr-2" />
                Sinais Vitais
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {record.vitals.weight && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Weight className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                    <div className="text-sm font-medium">{record.vitals.weight}kg</div>
                    <div className="text-xs text-gray-500">Peso</div>
                  </div>
                )}
                {record.vitals.temperature && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Thermometer className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                    <div className="text-sm font-medium">{record.vitals.temperature}°C</div>
                    <div className="text-xs text-gray-500">Temp</div>
                  </div>
                )}
                {record.vitals.heartRate && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Activity className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                    <div className="text-sm font-medium">{record.vitals.heartRate}bpm</div>
                    <div className="text-xs text-gray-500">FC</div>
                  </div>
                )}
                {record.vitals.respiratoryRate && (
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <Activity className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                    <div className="text-sm font-medium">{record.vitals.respiratoryRate}rpm</div>
                    <div className="text-xs text-gray-500">FR</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {record.treatment && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Tratamento</h4>
              <p className="text-sm text-gray-700 bg-green-50 p-3 rounded-lg">
                {record.treatment}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Observações */}
      {record.observations && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-2">Observações</h4>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
            {record.observations}
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordCard;