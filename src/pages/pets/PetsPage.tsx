// src/pages/pets/PetsPage.tsx - VERSÃO REFATORADA COMPLETA
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Calendar, FileText, Edit, Trash2 } from 'lucide-react';
import { ListPageLayout } from '../../components/layouts/ListPageLayout';
import { useAuthStore } from '../../stores/authStore';
import { usePets } from '../../hooks/usePets';

const PetsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();
  const { pets, isLoading, deletePet, isDeleting } = usePets();
  const navigate = useNavigate();

  const isTutor = user?.role === 'TUTOR';

  // Filtrar pets
  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Stats para o template
  const stats = isTutor ? [
    { 
      icon: Heart, 
      label: "Total de Pets", 
      value: pets.length, 
      color: 'primary' as const 
    },
    { 
      icon: Calendar, 
      label: "Consultas", 
      value: pets.reduce((acc, pet) => acc + (pet.appointments?.length || 0), 0), 
      color: 'warning' as const 
    },
    { 
      icon: FileText, 
      label: "Prontuários", 
      value: pets.reduce((acc, pet) => acc + (pet.medicalRecords?.length || 0), 0), 
      color: 'success' as const 
    }
  ] : undefined;

  // Empty state
  const emptyState = {
    icon: Heart,
    title: pets.length === 0 
      ? (isTutor ? 'Nenhum pet cadastrado' : 'Nenhum paciente encontrado')
      : 'Nenhum pet encontrado',
    description: pets.length === 0 
      ? (isTutor ? 'Comece cadastrando seu primeiro pet.' : 'Aguarde pets serem cadastrados.')
      : 'Tente ajustar o filtro de busca.',
    action: isTutor && pets.length === 0 ? {
      text: 'Cadastrar Primeiro Pet',
      onClick: () => navigate('/pets/new')
    } : undefined
  };

  const handleDeletePet = (petId: string, petName: string) => {
    if (window.confirm(`Tem certeza que deseja remover ${petName}?`)) {
      deletePet(petId);
    }
  };

  const getSpeciesDisplay = (species: string) => {
    const speciesMap = {
      'DOG': 'Cão',
      'CAT': 'Gato', 
      'BIRD': 'Ave',
      'RABBIT': 'Coelho',
      'OTHER': 'Outro'
    };
    return speciesMap[species as keyof typeof speciesMap] || species;
  };

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

  return (
    <ListPageLayout
      title={isTutor ? 'Meus Pets' : 'Pacientes'}
      description={isTutor 
        ? 'Gerencie a saúde dos seus companheiros' 
        : 'Lista de pacientes cadastrados'
      }
      createButton={isTutor ? {
        text: 'Cadastrar Pet',
        href: '/pets/new',
        show: true
      } : undefined}
      stats={stats}
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      searchPlaceholder="Buscar pets..."
      isLoading={isLoading}
      isEmpty={filteredPets.length === 0}
      emptyState={emptyState}
      debugInfo={`${pets.length} pets encontrados | Loading: ${isLoading ? 'Sim' : 'Não'} | User: ${user?.role} | Filtrados: ${filteredPets.length}`}
    >
      {/* Grid de Pets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPets.map((pet) => (
          <div key={pet.id} className="bg-white shadow rounded-lg hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Pet Header */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  {pet.photoUrl ? (
                    <img 
                      src={pet.photoUrl} 
                      alt={pet.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <Heart className="h-8 w-8 text-primary-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{pet.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-800">
                      {getSpeciesDisplay(pet.species)}
                    </span>
                    {pet.breed && (
                      <span className="text-sm text-gray-500">• {pet.breed}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pet Info */}
              <div className="space-y-2 mb-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {pet.gender && (
                    <div>
                      <span className="text-gray-500">Sexo:</span>
                      <span className="ml-1">{pet.gender}</span>
                    </div>
                  )}
                  {pet.dateOfBirth && (
                    <div>
                      <span className="text-gray-500">Idade:</span>
                      <span className="ml-1">{calculateAge(pet.dateOfBirth)}</span>
                    </div>
                  )}
                  {pet.weight && (
                    <div>
                      <span className="text-gray-500">Peso:</span>
                      <span className="ml-1">{pet.weight}kg</span>
                    </div>
                  )}
                  {pet.color && (
                    <div>
                      <span className="text-gray-500">Cor:</span>
                      <span className="ml-1">{pet.color}</span>
                    </div>
                  )}
                </div>

                {/* Allergies */}
                {pet.allergies && pet.allergies.length > 0 && (
                  <div className="mt-3">
                    <span className="text-xs text-gray-500">Alergias:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {pet.allergies.map((allergy, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => navigate('/appointments/new')}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Agendar
                  </button>
                  <button 
                    onClick={() => navigate(`/pets/${pet.id}/medical-history`)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Histórico
                  </button>
                </div>

                {isTutor && (
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => navigate(`/pets/${pet.id}/edit`)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePet(pet.id, pet.name)}
                      disabled={isDeleting}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ListPageLayout>
  );
};

export default PetsPage;