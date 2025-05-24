import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { 
  ArrowLeft, 
  Heart, 
  X,
  CheckCircle
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { usePets } from '../../hooks/usePets';
import { Layout } from '../../components/layout/Layout';

const petSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  species: z.enum(['DOG', 'CAT', 'BIRD', 'RABBIT', 'OTHER'], {
    required_error: 'Selecione uma espécie',
  }),
  breed: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  weight: z.coerce.number().positive('Peso deve ser positivo').optional(),
  color: z.string().optional(),
  allergies: z.array(z.string()).optional(),
});

type PetFormData = z.infer<typeof petSchema>;

const CreatePetPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createPet, isCreating } = usePets();
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Debug no início do componente
  console.log('🆕 CreatePetPage montado:', {
    user: user,
    userRole: user?.role,
    isAuthenticated: !!user,
    currentPath: window.location.pathname
  });

  useEffect(() => {
    console.log('🆕 CreatePetPage useEffect executado');
    
    // Verificar se usuário tem permissão
    if (user && user.role !== 'TUTOR') {
      console.log('❌ CreatePetPage: Usuário não é TUTOR, redirecionando');
      navigate('/dashboard');
      return;
    }
    
    if (!user) {
      console.log('❌ CreatePetPage: Usuário não encontrado, redirecionando para login');
      navigate('/login');
      return;
    }
    
    console.log('✅ CreatePetPage: Usuário autorizado, exibindo formulário');
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
  });

  const speciesOptions = [
    { value: 'DOG', label: 'Cão', emoji: '🐕' },
    { value: 'CAT', label: 'Gato', emoji: '🐱' },
    { value: 'BIRD', label: 'Ave', emoji: '🐦' },
    { value: 'RABBIT', label: 'Coelho', emoji: '🐰' },
    { value: 'OTHER', label: 'Outro', emoji: '🐾' },
  ];

  const addAllergy = () => {
    if (newAllergy.trim() && !allergies.includes(newAllergy.trim())) {
      const updatedAllergies = [...allergies, newAllergy.trim()];
      setAllergies(updatedAllergies);
      setValue('allergies', updatedAllergies);
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergyToRemove: string) => {
    const updatedAllergies = allergies.filter(allergy => allergy !== allergyToRemove);
    setAllergies(updatedAllergies);
    setValue('allergies', updatedAllergies);
  };

  const onSubmit = async (data: PetFormData) => {
    console.log('📝 CreatePetPage: Enviando dados:', data);
    
    try {
      await createPet({
        ...data,
        allergies: allergies.length > 0 ? allergies : undefined
      });
      
      setShowSuccess(true);
      reset();
      setAllergies([]);
      
      setTimeout(() => {
        navigate('/pets');
      }, 2000);
      
    } catch (error) {
      console.error('❌ CreatePetPage: Erro ao criar pet:', error);
    }
  };

  // Se não tem usuário ou não é tutor, mostrar loading
  if (!user || user.role !== 'TUTOR') {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando permissões...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (showSuccess) {
    return (
      <Layout>
        <div className="max-w-md mx-auto mt-20">
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Pet cadastrado com sucesso!
            </h2>
            <p className="text-gray-600 mb-6">
              Redirecionando para a lista...
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Debug Info */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            <strong>✅ CreatePetPage carregado com sucesso!</strong><br/>
            User: {user.profile?.firstName || user.email} | Role: {user.role}
          </p>
        </div>

        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              console.log('🔙 Voltando para /pets');
              navigate('/pets');
            }}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cadastrar Pet</h1>
            <p className="text-gray-600">Adicione um novo membro à família</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Pet *
              </label>
              <input
                {...register('name')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ex: Rex, Mimi, Pipoca..."
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Espécie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Espécie *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {speciesOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      value={option.value}
                      {...register('species')}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{option.emoji}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.species && (
                <p className="mt-1 text-sm text-red-600">{errors.species.message}</p>
              )}
            </div>

            {/* Grid com Raça e Sexo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raça
                </label>
                <input
                  {...register('breed')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: Golden Retriever"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo
                </label>
                <select
                  {...register('gender')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Selecionar...</option>
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
            </div>

            {/* Peso e Data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Nascimento
                </label>
                <input
                  type="date"
                  {...register('dateOfBirth')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('weight')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Ex: 5.5"
                />
              </div>
            </div>

            {/* Cor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cor
              </label>
              <input
                {...register('color')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ex: Dourado, Preto e branco..."
              />
            </div>

            {/* Alergias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alergias
              </label>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Ex: Frango, Leite..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                  />
                  <button
                    type="button"
                    onClick={addAllergy}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Adicionar
                  </button>
                </div>
                {allergies.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800"
                      >
                        {allergy}
                        <button
                          type="button"
                          onClick={() => removeAllergy(allergy)}
                          className="ml-2 hover:text-red-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/pets')}
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
                    <Heart className="h-4 w-4 mr-2" />
                    Cadastrar Pet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreatePetPage;