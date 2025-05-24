import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { usePetMedicalRecords } from '../../hooks/useMedicalRecords';
import { usePet } from '../../hooks/usePets';
import { 
  ArrowLeft, 
  FileText, 
  Calendar,
  Activity,
  User,
  Heart,
  Download,
  Search,
  AlertCircle,
  Thermometer,
  Weight
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const PetMedicalHistoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const { data: pet, isLoading: loadingPet } = usePet(id!);
  const { data: medicalRecords, isLoading: loadingRecords } = usePetMedicalRecords(id!);

  // Filtrar prontuários por termo de busca
  const filteredRecords = (medicalRecords || []).filter(record => 
    record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase())) ||
    record.treatment?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAge = (dateOfBirth: string) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birth = new Date(dateOfBirth);
    const years = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    // Ajustar se ainda não fez aniversário este ano
    const actualYears = monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate()) 
      ? years - 1 
      : years;
    
    if (actualYears === 0) {
      const months = today.getMonth() - birth.getMonth() + (12 * (today.getFullYear() - birth.getFullYear()));
      return `${months} meses`;
    }
    return `${actualYears} anos`;
  };
  
  // Ordenar por data mais recente
  const sortedRecords = filteredRecords.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  console.log('🏥 Debug Pet Medical History:', { 
    petId: id,
    petName: pet?.name,
    recordsCount: medicalRecords?.length || 0,
    filteredCount: filteredRecords.length
  });

  if (loadingPet) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Pet não encontrado</h3>
          <p className="text-gray-600">O pet solicitado não foi encontrado.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/pets')}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              {pet.photoUrl ? (
                <img 
                  src={pet.photoUrl} 
                  alt={pet.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <Heart className="h-6 w-6 text-primary-600" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Histórico Médico - {pet.name}
              </h1>
              <p className="text-gray-600">
                {pet.species} • {pet.breed} • {pet.gender}
              </p>
            </div>
          </div>
        </div>

        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Debug:</strong> 
            Pet: {pet.name} ({pet.species}) | 
            Prontuários: {medicalRecords?.length || 0} | 
            Filtrados: {filteredRecords.length} | 
            Loading: {loadingRecords ? 'Sim' : 'Não'}
          </p>
        </div>

        {/* Pet Info Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{medicalRecords?.length || 0}</div>
              <div className="text-sm text-gray-600">Prontuários</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {pet.weight || '--'}
              </div>
              <div className="text-sm text-gray-600">Peso Atual (kg)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {pet.dateOfBirth ? calculateAge(pet.dateOfBirth) : '--'}
              </div>
              <div className="text-sm text-gray-600">Idade</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {pet.allergies?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Alergias</div>
            </div>
          </div>

          {/* Alergias */}
          {pet.allergies && pet.allergies.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-700">Alergias conhecidas:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {pet.allergies.map((allergy, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                    ⚠️ {allergy}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar no histórico médico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Medical Records */}
        {loadingRecords ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white shadow rounded-lg p-6">
                <div className="animate-pulse">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedRecords.length > 0 ? (
          <div className="space-y-6">
            {sortedRecords.map((record, index) => (
              <div key={record.id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  {/* Header do Prontuário */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Consulta #{sortedRecords.length - index}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {format(parseISO(record.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
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
                    
                    <button className="btn btn-outline btn-sm">
                      <Download className="h-4 w-4 mr-1" />
                      PDF
                    </button>
                  </div>

                  {/* Conteúdo do Prontuário */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coluna 1: Sintomas e Diagnóstico */}
                    <div className="space-y-4">
                      {/* Sintomas */}
                      {record.symptoms && record.symptoms.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Sintomas Observados</h4>
                          <div className="flex flex-wrap gap-2">
                            {record.symptoms.map((symptom, idx) => (
                              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
                                {symptom}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Diagnóstico */}
                      {record.diagnosis && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Diagnóstico</h4>
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-900">{record.diagnosis}</p>
                          </div>
                        </div>
                      )}

                      {/* Tratamento */}
                      {record.treatment && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Tratamento Prescrito</h4>
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-sm text-green-900">{record.treatment}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Coluna 2: Vitais e Observações */}
                    <div className="space-y-4">
                      {/* Sinais Vitais */}
                      {record.vitals && Object.keys(record.vitals).length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                            <Activity className="h-4 w-4 mr-2" />
                            Sinais Vitais
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {record.vitals.weight && (
                              <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <Weight className="h-5 w-5 mx-auto text-gray-600 mb-1" />
                                <div className="text-lg font-semibold text-gray-900">{record.vitals.weight}kg</div>
                                <div className="text-xs text-gray-600">Peso</div>
                              </div>
                            )}
                            {record.vitals.temperature && (
                              <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <Thermometer className="h-5 w-5 mx-auto text-gray-600 mb-1" />
                                <div className="text-lg font-semibold text-gray-900">{record.vitals.temperature}°C</div>
                                <div className="text-xs text-gray-600">Temperatura</div>
                              </div>
                            )}
                            {record.vitals.heartRate && (
                              <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <Activity className="h-5 w-5 mx-auto text-gray-600 mb-1" />
                                <div className="text-lg font-semibold text-gray-900">{record.vitals.heartRate}bpm</div>
                                <div className="text-xs text-gray-600">Freq. Cardíaca</div>
                              </div>
                            )}
                            {record.vitals.respiratoryRate && (
                              <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <Activity className="h-5 w-5 mx-auto text-gray-600 mb-1" />
                                <div className="text-lg font-semibold text-gray-900">{record.vitals.respiratoryRate}rpm</div>
                                <div className="text-xs text-gray-600">Freq. Respiratória</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Observações */}
                      {record.observations && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Observações do Veterinário</h4>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{record.observations}</p>
                          </div>
                        </div>
                      )}

                      {/* Link para Receitas se existirem */}
                      <div className="pt-4 border-t border-gray-200">
                        <button className="w-full btn btn-outline btn-sm">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Receitas desta Consulta
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {medicalRecords?.length === 0 
                ? 'Nenhum prontuário médico encontrado'
                : 'Nenhum prontuário encontrado com esse filtro'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {medicalRecords?.length === 0
                ? `${pet.name} ainda não possui histórico médico. Os prontuários aparecerão aqui após as consultas.`
                : 'Tente ajustar o termo de busca para encontrar prontuários específicos.'
              }
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PetMedicalHistoryPage;