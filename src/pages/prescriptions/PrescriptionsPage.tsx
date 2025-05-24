// src/pages/prescriptions/PrescriptionsPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { PrescriptionCard } from '../../components/prescriptions/PrescriptionCard';
import { usePrescriptions } from '../../hooks/usePrescriptions';
import { useAuthStore } from '../../stores/authStore';
import { prescriptionsService } from '../../services/prescriptions';
import { 
  Plus, 
  Pill, 
  Search, 
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const PrescriptionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'dispensed' | 'expired'>('all');
  const { user } = useAuthStore();
  const { 
    activePrescriptions, 
    myPrescriptions, 
    isLoadingActive, 
    isLoadingMy,
    dispensePrescription,
    isDispensing
  } = usePrescriptions();

  const isVet = user?.role === 'VETERINARIAN';
  const isTutor = user?.role === 'TUTOR';

  // Escolher dados baseado no role
  const prescriptions = isVet ? myPrescriptions : activePrescriptions;
  const isLoading = isVet ? isLoadingMy : isLoadingActive;

  // Gerar estatísticas
  const stats = prescriptionsService.generateStats(prescriptions);

  // Filtrar receitas
  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = !searchTerm || 
      prescription.pet?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.medications.some(med => 
        med.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      prescription.instructions.toLowerCase().includes(searchTerm.toLowerCase());

    const now = new Date();
    const isExpired = new Date(prescription.validUntil) < now;
    const isActive = !prescription.isDispensed && !isExpired;

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && isActive) ||
      (statusFilter === 'dispensed' && prescription.isDispensed) ||
      (statusFilter === 'expired' && isExpired);

    return matchesSearch && matchesStatus;
  });

  const handleDispense = (prescriptionId: string) => {
    if (window.confirm('Confirma que esta receita foi dispensada na farmácia?')) {
      dispensePrescription(prescriptionId);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Receitas {isVet ? 'Prescritas' : 'Médicas'}
            </h1>
            <p className="text-gray-600">
              {isVet 
                ? 'Gerencie as receitas que você prescreveu' 
                : 'Receitas médicas dos seus pets'
              }
            </p>
          </div>
          {isVet && (
            <Link to="/prescriptions/new">
              <button className="btn btn-primary btn-md">
                <Plus className="h-4 w-4 mr-2" />
                Nova Receita
              </button>
            </Link>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Debug:</strong> 
            Total: {prescriptions.length} | 
            Filtradas: {filteredPrescriptions.length} | 
            Loading: {isLoading ? 'Sim' : 'Não'} | 
            User: {user?.role}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Pill className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total de Receitas</p>
                <p className="text-2xl font-bold text-primary-600">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-success-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Receitas Ativas</p>
                <p className="text-2xl font-bold text-success-600">{stats.active}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Dispensadas</p>
                <p className="text-2xl font-bold text-gray-600">{stats.dispensed}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-error-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Expiradas</p>
                <p className="text-2xl font-bold text-error-600">{stats.expired}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por pet, medicamento ou instruções..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todas</option>
                <option value="active">Ativas</option>
                <option value="dispensed">Dispensadas</option>
                <option value="expired">Expiradas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prescriptions List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
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
        ) : filteredPrescriptions.length > 0 ? (
          <div className="space-y-4">
            {filteredPrescriptions.map((prescription) => (
              <PrescriptionCard 
                key={prescription.id} 
                prescription={prescription}
                showPetInfo={isVet}
                onDispense={isTutor ? handleDispense : undefined}
                isDispensing={isDispensing}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Pill className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {prescriptions.length === 0 
                ? 'Nenhuma receita encontrada'
                : 'Nenhuma receita encontrada com esse filtro'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {prescriptions.length === 0
                ? (isVet 
                    ? 'Crie receitas após as consultas com seus pacientes.'
                    : 'Receitas dos seus pets aparecerão aqui após as consultas.'
                  )
                : 'Tente ajustar os filtros de busca.'
              }
            </p>
            {isVet && prescriptions.length === 0 && (
              <Link to="/prescriptions/new">
                <button className="btn btn-primary btn-lg">
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Primeira Receita
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PrescriptionsPage;