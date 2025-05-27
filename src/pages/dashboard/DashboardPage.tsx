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
import StatsCard from '../../components/ui/StatsCard';
import QuickActionCard from '../../components/ui/QuickActionCard';
import Button from '../../components/ui/Button';
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
      setVetAvailability(false);
    } finally {
      setLoadingAvailability(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
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

        {isVet && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/appointments/availability">
                <QuickActionCard
                  icon={vetAvailability ? CheckCircle : XCircle}
                  title="Disponibilidade"
                  subtitle={loadingAvailability ? 'Carregando...' : 
                           vetAvailability ? 'Disponível' : 'Indisponível'}
                />
              </Link>

              <Link to="/appointments">
                <QuickActionCard
                  icon={Calendar}
                  title="Consultas"
                  subtitle="Ver agenda"
                />
              </Link>

              <Link to="/medical-records/new">
                <QuickActionCard
                  icon={FileText}
                  title="Prontuário"
                  subtitle="Criar novo"
                />
              </Link>

              <Link to="/prescriptions/new">
                <QuickActionCard
                  icon={Pill}
                  title="Receita"
                  subtitle="Prescrever"
                />
              </Link>
            </div>
          </div>
        )}

        {isTutor && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/pets/new">
                <QuickActionCard
                  icon={Plus}
                  title="Novo Pet"
                  subtitle="Cadastrar"
                />
              </Link>

              <Link to="/appointments/new">
                <QuickActionCard
                  icon={Calendar}
                  title="Consulta"
                  subtitle="Agendar"
                />
              </Link>

              <Link to="/pets">
                <QuickActionCard
                  icon={Heart}
                  title="Meus Pets"
                  subtitle="Gerenciar"
                />
              </Link>

              <Link to="/prescriptions">
                <QuickActionCard
                  icon={Pill}
                  title="Receitas"
                  subtitle="Ver ativas"
                />
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isTutor && (
            <>
              <StatsCard
                icon={Heart}
                label="Meus Pets"
                value={pets.length}
                color="primary"
                onClick={() => window.location.href = '/pets'}
              />

              <StatsCard
                icon={Calendar}
                label="Consultas"
                value={pets.reduce((acc, pet) => acc + (pet.appointments?.length || 0), 0)}
                color="success"
                onClick={() => window.location.href = '/appointments'}
              />

              <StatsCard
                icon={FileText}
                label="Prontuários"
                value={pets.reduce((acc, pet) => acc + (pet.medicalRecords?.length || 0), 0)}
                color="warning"
                onClick={() => window.location.href = '/medical-records'}
              />

              <StatsCard
                icon={Pill}
                label="Receitas Ativas"
                value={3}
                color="error"
                onClick={() => window.location.href = '/prescriptions'}
              />
            </>
          )}

          {isVet && (
            <>
              <StatsCard
                icon={Users}
                label="Pacientes"
                value={12}
                color="primary"
              />

              <StatsCard
                icon={Calendar}
                label="Consultas Hoje"
                value={5}
                color="success"
                onClick={() => window.location.href = '/appointments'}
              />

              <StatsCard
                icon={FileText}
                label="Prontuários"
                value={28}
                color="warning"
                onClick={() => window.location.href = '/medical-records'}
              />

              <StatsCard
                icon={Clock}
                label="Status"
                value={loadingAvailability ? '...' : vetAvailability ? 'Disponível' : 'Indisponível'}
                color={vetAvailability ? 'success' : 'gray'}
                loading={loadingAvailability}
                onClick={() => window.location.href = '/appointments/availability'}
              />
            </>
          )}
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhuma atividade recente</p>
              <p className="text-sm text-gray-400 mt-1 mb-4">
                {isTutor 
                  ? 'Comece cadastrando um pet ou agendando uma consulta'
                  : 'Suas próximas consultas aparecerão aqui'
                }
              </p>
              
              {isTutor && (
                <div className="flex justify-center space-x-4">
                  <Link to="/pets/new">
                    <Button variant="primary" icon={Plus}>
                      Cadastrar Pet
                    </Button>
                  </Link>
                  <Link to="/appointments/new">
                    <Button variant="ghost" icon={Calendar}>
                      Agendar Consulta
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;