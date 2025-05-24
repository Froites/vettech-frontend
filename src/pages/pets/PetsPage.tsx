// src/pages/pets/PetsPage.tsx - VERSÃO COM DEBUG DO BOTÃO
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Heart, 
  Edit, 
  Trash2, 
  Calendar,
  FileText,
  Search
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePets } from '../../hooks/usePets';
import { Layout } from '../../components/layout/Layout';

const PetsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuthStore();
  const { pets, isLoading, deletePet, isDeleting } = usePets();
  const navigate = useNavigate();

  const isTutor = user?.role === 'TUTOR';

  const handleDeletePet = (petId: string, petName: string) => {
    if (window.confirm(`Tem certeza que deseja remover ${petName}?`)) {
      deletePet(petId);
    }
  };

  // Função para testar navegação
  const handleCreatePet = () => {
    console.log('🔘 Botão clicado - tentando navegar para /pets/new');
    console.log('🔍 User role:', user?.role);
    console.log('🔍 Is tutor:', isTutor);
    
    try {
      navigate('/pets/new');
      console.log('✅ Navigate executado');
    } catch (error) {
      console.error('❌ Erro ao navegar:', error);
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
    
    if (years === 0) {
      const months = today.getMonth() - birth.getMonth();
      return `${months} meses`;
    }
    return `${years} anos`;
  };

  // Filtrar pets
  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  console.log('🐕 Debug - Pets data:', { pets, isLoading, filteredPets: filteredPets.length });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isTutor ? 'Meus Pets' : 'Pacientes'}
            </h1>
            <p className="text-gray-600">
              {isTutor 
                ? 'Gerencie a saúde dos seus companheiros' 
                : 'Lista de pacientes cadastrados'
              }
            </p>
          </div>
          
          {/* BOTÕES DE TESTE */}
          {isTutor && (
            <div className="flex flex-col gap-2">
              {/* Botão com Link (original) */}
              <Link to="/pets/new">
                <button 
                  className="w-full btn btn-primary btn-md"
                  onClick={() => console.log('🔗 Link clicado')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Pet (Link)
                </button>
              </Link>
              
              {/* Botão com navigate (teste) */}
              <button 
                onClick={handleCreatePet}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Pet (Navigate)
              </button>
              
              {/* Botão simples (teste) */}
              <button 
                onClick={() => {
                  console.log('🧪 Teste simples - botão clicado');
                  alert('Botão funcionando!');
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Teste Botão
              </button>
            </div>
          )}
        </div>

        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Debug:</strong> {pets.length} pets encontrados | 
            Loading: {isLoading ? 'Sim' : 'Não'} | 
            User: {user?.role} | 
            Is Tutor: {isTutor ? 'Sim' : 'Não'} | 
            Filtrados: {filteredPets.length}
          </p>
        </div>

        {/* Debug Navegação */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <strong>Debug Navegação:</strong> 
            Abra o Console (F12) e teste os botões acima. Veja qual funciona.
          </p>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Stats */}
        {isTutor && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-primary-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total de Pets</p>
                  <p className="text-2xl font-bold text-primary-600">{pets.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-warning-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Consultas</p>
                  <p className="text-2xl font-bold text-warning-600">
                    {pets.reduce((acc, pet) => acc + (pet.appointments?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-success-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Prontuários</p>
                  <p className="text-2xl font-bold text-success-600">
                    {pets.reduce((acc, pet) => acc + (pet.medicalRecords?.length || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pets Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white shadow rounded-lg p-6">
                <div className="animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPets.length > 0 ? (
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
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                        <Calendar className="h-4 w-4 mr-1" />
                        Agendar
                      </button>
                      <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                        <FileText className="h-4 w-4 mr-1" />
                        Histórico
                      </button>
                    </div>

                    {isTutor && (
                      <div className="flex space-x-1">
                        <Link to={`/pets/${pet.id}/edit`}>
                          <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
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
        ) : (
          /* Empty State */
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {pets.length === 0 
                ? (isTutor ? 'Nenhum pet cadastrado' : 'Nenhum paciente encontrado')
                : 'Nenhum pet encontrado'
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {pets.length === 0 
                ? (isTutor ? 'Comece cadastrando seu primeiro pet.' : 'Aguarde pets serem cadastrados.')
                : 'Tente ajustar o filtro de busca.'
              }
            </p>
            {isTutor && pets.length === 0 && (
              <button 
                onClick={handleCreatePet}
                className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center mx-auto"
              >
                <Plus className="h-5 w-5 mr-2" />
                Cadastrar Primeiro Pet
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PetsPage;