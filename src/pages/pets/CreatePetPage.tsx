// src/pages/pets/CreatePetPage.tsx - VERSÃO REFATORADA
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, X } from 'lucide-react';
import { CreatePageLayout } from '../../components/layouts/CreatePageLayout';
import { FormSection } from '../../components/forms/FormSection';
import { useAuthStore } from '../../stores/authStore';
import { usePets } from '../../hooks/usePets';

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
  });

  // Redirect se não for tutor
  useEffect(() => {
    if (user && user.role !== 'TUTOR') {
      navigate('/dashboard');
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

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
      console.error('❌ Erro ao criar pet:', error);
    }
  };

  // Loading se não tem usuário ou não é tutor
  if (!user || user.role !== 'TUTOR') {
    return (
      <CreatePageLayout
        title="Verificando permissões..."
        onBack={() => navigate('/pets')}
        onSubmit={() => {}}
      >
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Verificando permissões...</p>
          </div>
        </div>
      </CreatePageLayout>
    );
  }

  // Summary para mostrar no final
  const formValues = watch();
  const summary = {
    title: 'Resumo do Pet:',
    items: [
      { label: 'Nome', value: formValues.name || '--' },
      { label: 'Espécie', value: formValues.species ? speciesOptions.find(s => s.value === formValues.species)?.label || formValues.species : '--' },
      { label: 'Raça', value: formValues.breed || '--' },
      { label: 'Sexo', value: formValues.gender || '--' },
      { label: 'Alergias', value: allergies.length > 0 ? allergies.join(', ') : 'Nenhuma' },
    ]
  };

  return (
    <CreatePageLayout
      title="Cadastrar Pet"
      description="Adicione um novo membro à família"
      onBack={() => navigate('/pets')}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isCreating}
      submitText="Cadastrar Pet"
      submitIcon={Heart}
      showSuccess={showSuccess}
      successTitle="Pet cadastrado com sucesso!"
      successDescription="Redirecionando para a lista..."
      debugInfo={`User: ${user.profile?.firstName || user.email} | Role: ${user.role}`}
      summary={formValues.name ? summary : undefined}
    >
      {/* Informações Básicas */}
      <FormSection title="Informações Básicas" icon={Heart}>
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
      </FormSection>

      {/* Informações de Saúde */}
      <FormSection title="Informações de Saúde" description="Dados importantes para o veterinário">
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAllergy();
                  }
                }}
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
      </FormSection>
    </CreatePageLayout>
  );
};

export default CreatePetPage;