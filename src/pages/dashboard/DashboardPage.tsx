
import { useAuthStore } from '../../stores/authStore';
import { Layout } from '../../components/layout/Layout';


const DashboardPage = () => {
  const { user } = useAuthStore();

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Bem-vindo ao VetTech. Role: {user?.role}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-2xl font-bold text-primary-600">5</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-600">3</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="text-2xl font-bold text-red-600">1</div>
            <div className="text-sm text-gray-600">Issues</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              + Cadastrar Novo Pet
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              📅 Agendar Consulta
            </button>
            <button className="w-full text-left p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              📋 Ver Prontuários
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;