// src/pages/dashboard/DashboardPage.tsx - ATUALIZADO
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  FileText, 
  Pill,
  Clock,
  Users,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { useAuthStore } from '../../stores/authStore';
import { usePets } from '../../hooks/usePets';
import { useState, useEffect } from 'react';
import api from '../../services/api';

const DashboardPage = () => {
  const { user } = useAuthStore();
  const { pets } = usePets();
  const [vetAvailability, setVetAvailability] = useState<boolean | null>(null);
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  const isTutor = user?.role === 'TUTOR';
  const isVet = user?.role === 'VETERINARIAN';

  // Carregar status de disponibilidade do vet
  useEffect(() => {
    if (isVet) {
      loadVetAvailability();
    }
  }, [isVet]);

  const loadVetAvailability = async () => {
    try {
      setLoadingAvailability(true);
      const response = await api.get('/users/veterinarian-profile');
      setVetAvailability(response.data.isAvailable || false);
    } catch (error) {
      setVetAvailability(false); // Assume indisponível se não tem perfil
    } finally {
      setLoadingAvailability(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Olá, {user?.profile?.firstName || 'Usuário'}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            {isTutor 
              ? 'Gerencie a saúde dos seus pets' 
              : 'Painel do profissional veterinário'
            }
          </p>
        </div>

        {/* Quick Actions para Veterinários */}
        {isVet && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status de Disponibilidade */}
              <Link to="/appointments/availability">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                    vetAvailability ? 'bg-success-100' : 'bg-gray-200'
                  }`}>
                    {loadingAvailability ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    ) : vetAvailability ? (
                      <CheckCircle className="h-6 w-6 text-success-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Disponibilidade</p>
                    <p className="text-xs text-gray-500">
                      {loadingAvailability ? 'Carregando...' : 
                       vetAvailability ? 'Disponível' : 'Indisponível'}
                    </p>
                  </div>
                </div>
              </Link>

              {/* Outras ações rápidas */}
              <Link to="/appointments">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Calendar className="h-10 w-10 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Consultas</p>
                    <p className="text-xs text-gray-500">Ver agenda</p>
                  </div>
                </div>
              </Link>

              <Link to="/medical-records/new">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <FileText className="h-10 w-10 text-success-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Prontuário</p>
                    <p className="text-xs text-gray-500">Criar novo</p>
                  </div>
                </div>
              </Link>

              <Link to="/prescriptions/new">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Pill className="h-10 w-10 text-warning-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Receita</p>
                    <p className="text-xs text-gray-500">Prescrever</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Quick Actions para Tutores */}
        {isTutor && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/pets/new">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Plus className="h-10 w-10 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Novo Pet</p>
                    <p className="text-xs text-gray-500">Cadastrar</p>
                  </div>
                </div>
              </Link>

              <Link to="/appointments/new">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Calendar className="h-10 w-10 text-success-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Consulta</p>
                    <p className="text-xs text-gray-500">Agendar</p>
                  </div>
                </div>
              </Link>

              <Link to="/pets">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Heart className="h-10 w-10 text-warning-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Meus Pets</p>
                    <p className="text-xs text-gray-500">Gerenciar</p>
                  </div>
                </div>
              </Link>

              <Link to="/prescriptions">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Pill className="h-10 w-10 text-error-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Receitas</p>
                    <p className="text-xs text-gray-500">Ver ativas</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isTutor && (
            <>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <Heart className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Meus Pets</p>
                    <p className="text-2xl font-bold text-primary-600">{pets.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-success-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Consultas</p>
                    <p className="text-2xl font-bold text-success-600">
                      {pets.reduce((acc, pet) => acc + (pet.appointments?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-warning-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Prontuários</p>
                    <p className="text-2xl font-bold text-warning-600">
                      {pets.reduce((acc, pet) => acc + (pet.medicalRecords?.length || 0), 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <Pill className="h-8 w-8 text-error-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Receitas Ativas</p>
                    <p className="text-2xl font-bold text-error-600">3</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {isVet && (
            <>
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-primary-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Pacientes</p>
                    <p className="text-2xl font-bold text-primary-600">12</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-success-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Consultas Hoje</p>
                    <p className="text-2xl font-bold text-success-600">5</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-warning-600" />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Prontuários</p>
                    <p className="text-2xl font-bold text-warning-600">28</p>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center">
                  <Clock className={`h-8 w-8 ${vetAvailability ? 'text-success-600' : 'text-gray-600'}`} />
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`text-lg font-bold ${vetAvailability ? 'text-success-600' : 'text-gray-600'}`}>
                      {loadingAvailability ? '...' : vetAvailability ? 'Disponível' : 'Indisponível'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma atividade recente</p>
              <p className="text-sm text-gray-400 mt-1">
                {isTutor 
                  ? 'Comece cadastrando um pet ou agendando uma consulta'
                  : 'Suas próximas consultas aparecerão aqui'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;