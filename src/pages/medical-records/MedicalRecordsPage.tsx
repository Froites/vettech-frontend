import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ListPageLayout } from '../../components/layouts/ListPageLayout';
import { useMedicalRecords } from '../../hooks/useMedicalRecords';
import { useAuthStore } from '../../stores/authStore';
import { 
  Plus, 
  FileText, 
  Calendar,
  Activity,
  User,
  Heart,
  Eye
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MedicalRecordsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();
  const { myRecords, stats, isLoadingMyRecords, isLoadingStats } = useMedicalRecords();

  const isVet = user?.role === 'VETERINARIAN';

  // Filtrar prontuários por termo de busca
  const filteredRecords = myRecords.filter(record => 
    record.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.symptoms.some(symptom => symptom.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 🆕 Configuração do ListPageLayout
  const pageConfig = {
    title: "Prontuários Médicos",
    description: isVet 
      ? 'Gerencie os prontuários dos seus pacientes' 
      : 'Histórico médico dos seus pets',
    createButton: isVet ? {
      text: "Criar Prontuário",
      href: "/medical-records/new",
      show: true
    } : undefined,
    
    // 🆕 Stats usando dados existentes
    stats: stats && !isLoadingStats ? [
      {
        icon: FileText,
        label: "Total de Prontuários",
        value: stats.total || 0,
        color: 'primary' as const
      },
      {
        icon: Calendar,
        label: "Este Mês",
        value: stats.thisMonth || 0,
        color: 'success' as const
      },
      {
        icon: Activity,
        label: "Pacientes Únicos", 
        value: stats.byPet ? Object.keys(stats.byPet).length : 0,
        color: 'warning' as const
      },
      {
        icon: Heart,
        label: "Recentes",
        value: stats.recent ? stats.recent.length : 0,
        color: 'error' as const
      }
    ] : undefined,

    // 🆕 Empty state
    emptyState: {
      icon: FileText,
      title: myRecords.length === 0 
        ? 'Nenhum prontuário encontrado'
        : 'Nenhum prontuário encontrado com esse filtro',
      description: myRecords.length === 0
        ? (isVet 
            ? 'Crie prontuários após concluir consultas com seus pacientes.'
            : 'Prontuários dos seus pets aparecerão aqui após as consultas.'
          )
        : 'Tente ajustar os filtros de busca.',
      action: isVet && myRecords.length === 0 ? {
        text: "Criar Primeiro Prontuário",
        onClick: () => window.location.href = '/medical-records/new'
      } : undefined
    }
  };

  console.log('📋 Debug Medical Records:', { 
    myRecords: myRecords.length, 
    filteredRecords: filteredRecords.length,
    stats, 
    userRole: user?.role 
  });

  return (
    <ListPageLayout
      title={pageConfig.title}
      description={pageConfig.description}
      createButton={pageConfig.createButton}
      stats={pageConfig.stats}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar por pet, diagnóstico ou sintomas..."
      isLoading={isLoadingMyRecords}
      isEmpty={filteredRecords.length === 0}
      emptyState={pageConfig.emptyState}
      debugInfo={`Total: ${myRecords.length} | Filtrados: ${filteredRecords.length} | Loading: ${isLoadingMyRecords ? 'Sim' : 'Não'} | User: ${user?.role}`}
    >
      {/* 🎯 Lista de Prontuários */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <div key={record.id} className="bg-white shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Pet Avatar */}
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    {record.pet?.photoUrl ? (
                      <img 
                        src={record.pet.photoUrl} 
                        alt={record.pet.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <Heart className="h-6 w-6 text-primary-600" />
                    )}
                  </div>

                  {/* Record Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {record.pet?.name || 'Pet não identificado'}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                        {record.pet?.species}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(parseISO(record.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                      </div>
                      
                      {record.appointment && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Consulta: {format(parseISO(record.appointment.scheduledAt), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                      )}

                      {record.vitals && Object.keys(record.vitals).length > 0 && (
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 mr-2" />
                          Vitais registrados
                        </div>
                      )}
                    </div>

                    {/* Sintomas */}
                    {record.symptoms && record.symptoms.length > 0 && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Sintomas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {record.symptoms.slice(0, 3).map((symptom, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                              {symptom}
                            </span>
                          ))}
                          {record.symptoms.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                              +{record.symptoms.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Diagnóstico */}
                    {record.diagnosis && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Diagnóstico:</span>
                        <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                          {record.diagnosis}
                        </p>
                      </div>
                    )}

                    {/* Tratamento */}
                    {record.treatment && (
                      <div className="mb-3">
                        <span className="text-xs text-gray-500">Tratamento:</span>
                        <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                          {record.treatment}
                        </p>
                      </div>
                    )}

                    {/* Vitais Summary */}
                    {record.vitals && Object.keys(record.vitals).length > 0 && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-xs text-gray-500 block mb-2">Sinais Vitais:</span>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {record.vitals.weight && (
                            <div>
                              <span className="text-gray-500">Peso:</span>
                              <span className="ml-1 font-medium">{record.vitals.weight}kg</span>
                            </div>
                          )}
                          {record.vitals.temperature && (
                            <div>
                              <span className="text-gray-500">Temp:</span>
                              <span className="ml-1 font-medium">{record.vitals.temperature}°C</span>
                            </div>
                          )}
                          {record.vitals.heartRate && (
                            <div>
                              <span className="text-gray-500">FC:</span>
                              <span className="ml-1 font-medium">{record.vitals.heartRate}bpm</span>
                            </div>
                          )}
                          {record.vitals.respiratoryRate && (
                            <div>
                              <span className="text-gray-500">FR:</span>
                              <span className="ml-1 font-medium">{record.vitals.respiratoryRate}rpm</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col space-y-2">
                  <Link to={`/medical-records/${record.id}`}>
                    <button className="btn btn-outline btn-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </button>
                  </Link>
                  
                  {/* Link para criar receita se for veterinário */}
                  {isVet && (
                    <Link to={`/prescriptions/new?recordId=${record.id}`}>
                      <button className="btn btn-outline btn-sm text-green-600 hover:text-green-700">
                        <FileText className="h-4 w-4 mr-1" />
                        Receita
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ListPageLayout>
  );
};

export default MedicalRecordsPage;