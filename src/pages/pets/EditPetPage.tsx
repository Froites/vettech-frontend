import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { 
  ArrowLeft, 
  Heart, 
  X,
  Loader2
} from 'lucide-react';
import { usePet, usePets } from '../../hooks/usePets';
import { Layout } from '../../components/layout/Layout';

const petSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(50, 'Nome muito longo'),
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

const EditPetPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { updatePet, isUpdating } = usePets();
  const { data: pet, isLoading } = usePet(id!);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [newAllergy, setNewAllergy] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<PetFormData>({
    resolver: zodResolver(petSchema),
  });

  useEffect(() => {
    if (pet) {
      reset({
        name: pet.name,
        species: pet.species,
        breed: pet.breed || '',
        gender: pet.gender || '',
        dateOfBirth: pet.dateOfBirth || '',
        weight: pet.weight || undefined,
        color: pet.color || '',
        allergies: pet.allergies || [],
      });
      setAllergies(pet.allergies || []);
    }
  }, [pet, reset]);

  const speciesOptions = [
    { value: 'DOG', label: 'Cão', emoji: '🐕' },
    { value: 'CAT', label: 'Gato', emoji: '🐱' },
    { value: 'BIRD', label: 'Ave', emoji: '🐦' },
    { value: 'RABBIT', label: 'Coelho', emoji: '🐰' },
    { value: 'OTHER', label: 'Outro', emoji: '🐾' },
  ];

  const genderOptions = [
    { value: 'Macho', label: 'Macho' },
    { value: 'Fêmea', label: 'Fêmea' },
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

  const onSubmit = (data: PetFormData) => {
    console.log('✏️ Atualizando pet:', data);
    updatePet(id!, data);
    navigate('/pets');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </Layout>
    );
  }

  if (!pet) {
    return (
      <Layout>
        <div className="text-center">
          <p className="text-gray-500">Pet não encontrado</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/pets')}
            className="btn btn-ghost btn-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="page-title">Editar {pet.name}</h1>
            <p className="page-subtitle">Atualize as informações do seu pet</p>
          </div>
        </div>

        {/* Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informações Básicas
              </h3>

              {/* Name */}
              <div className="form-group">
                <label className="form-label">
                  Nome do Pet *
                </label>
                <input
                  {...register('name')}
                  className={`input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Ex: Rex, Mimi, Pipoca..."
                />
                {errors.name && (
                  <p className="form-error">{errors.name.message}</p>
                )}
              </div>

              {/* Species */}
              <div className="form-group">
                <label className="form-label">
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
                  <p className="form-error">{errors.species.message}</p>
                )}
              </div>

              {/* Breed and Gender */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    Raça
                  </label>
                  <input
                    {...register('breed')}
                    className="input"
                    placeholder="Ex: Golden Retriever"
                  />
                  <p className="form-helper">Opcional</p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Sexo
                  </label>
                  <select {...register('gender')} className="input">
                    <option value="">Selecionar...</option>
                    {genderOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date of Birth and Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    {...register('dateOfBirth')}
                    className="input"
                  />
                  <p className="form-helper">Para calcular a idade</p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register('weight')}
                    className={`input ${errors.weight ? 'input-error' : ''}`}
                    placeholder="Ex: 5.5"
                  />
                  {errors.weight && (
                    <p className="form-error">{errors.weight.message}</p>
                  )}
                </div>
              </div>

              {/* Color */}
              <div className="form-group">
                <label className="form-label">
                  Cor
                </label>
                <input
                  {...register('color')}
                  className="input"
                  placeholder="Ex: Dourado, Preto e branco, Laranja..."
                />
              </div>
            </div>

            {/* Health Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Informações de Saúde
              </h3>

              {/* Allergies */}
              <div className="form-group">
                <label className="form-label">
                  Alergias
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newAllergy}
                      onChange={(e) => setNewAllergy(e.target.value)}
                      className="flex-1 input"
                      placeholder="Ex: Frango, Leite, Pólen..."
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                    />
                    <button
                      type="button"
                      onClick={addAllergy}
                      className="btn btn-outline btn-md"
                    >
                      Adicionar
                    </button>
                  </div>
                  {allergies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {allergies.map((allergy, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-error-100 text-error-800"
                        >
                          {allergy}
                          <button
                            type="button"
                            onClick={() => removeAllergy(allergy)}
                            className="ml-2 hover:text-error-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <p className="form-helper">
                  Adicione alergias conhecidas para alertar veterinários
                </p>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/pets')}
                className="btn btn-outline btn-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="btn btn-primary btn-lg"
              >
                {isUpdating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    Salvar Alterações
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

export default EditPetPage;