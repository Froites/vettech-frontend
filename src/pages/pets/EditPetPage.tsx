import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Heart, X } from 'lucide-react';

import { CreatePageLayout } from '../../components/layouts/CreatePageLayout';
import { FormSection } from '../../components/forms/FormSection';
import Button from '../../components/ui/Button';
import { PetSpeciesRadioGroup } from '../../components/ui/RadioGroup';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import { usePet, usePets } from '../../hooks/usePets';

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
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
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

  const onSubmit = async (data: PetFormData) => {
    try {
      await updatePet(id!, {
        ...data,
        allergies: allergies.length > 0 ? allergies : undefined
      });
      
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/pets');
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao atualizar pet:', error);
    }
  };

  if (isLoading) {
    return (
      <CreatePageLayout
        mode="edit" 
        title="Carregando..."
        onBack={() => navigate('/pets')}
        onSubmit={() => {}}
      >
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados do pet...</p>
          </div>
        </div>
      </CreatePageLayout>
    );
  }

  if (!pet) {
    return (
      <CreatePageLayout
        mode="edit"
        title="Pet não encontrado" 
        onBack={() => navigate('/pets')}
        onSubmit={() => {}}
      >
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">O pet solicitado não foi encontrado.</p>
          <Button 
            variant="primary" 
            onClick={() => navigate('/pets')}
          >
            Voltar para Lista
          </Button>
        </div>
      </CreatePageLayout>
    );
  }

  const formValues = watch();
  const selectedSpecies = formValues.species;
  const speciesLabel = selectedSpecies ? {
    'DOG': 'Cão',
    'CAT': 'Gato', 
    'BIRD': 'Ave',
    'RABBIT': 'Coelho',
    'OTHER': 'Outro'
  }[selectedSpecies] : pet.species;

  const summary = formValues.name ? {
    title: `Resumo - ${pet.name}:`,
    items: [
      { label: 'Nome', value: formValues.name || pet.name },
      { label: 'Espécie', value: speciesLabel || 'N/A' },
      { label: 'Raça', value: formValues.breed || pet.breed || '--' },
      { label: 'Sexo', value: formValues.gender || pet.gender || '--' },
      { label: 'Alergias', value: allergies.length > 0 ? allergies.join(', ') : 'Nenhuma' },
    ]
  } : undefined;

  return (
    <CreatePageLayout
      mode="edit"
      title="Cadastrar Pet"
      editTitle={`Editar ${pet.name}`}
      description="Atualize as informações do seu pet"
      onBack={() => navigate('/pets')}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isUpdating}
      editSubmitText="Salvar Alterações"
      submitIcon={Heart}
      showSuccess={showSuccess}
      editSuccessTitle={`${pet.name} atualizado com sucesso!`}
      editSuccessDescription="Redirecionando para a lista..."
      debugInfo={`Editando: ${pet.name} (ID: ${pet.id})`}
      summary={summary}
    >
      <FormSection title="Informações Básicas" icon={Heart}>
        <Input
          label="Nome do Pet"
          placeholder="Ex: Rex, Mimi, Pipoca..."
          error={errors.name?.message}
          required
          {...register('name')}
        />

        <PetSpeciesRadioGroup
          value={formValues.species}
          onChange={(value) => setValue('species', value as any)}
          name="species"
          error={errors.species?.message}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Raça"
            placeholder="Ex: Golden Retriever"
            {...register('breed')}
          />

          <Select
            label="Sexo"
            options={genderOptions}
            value={formValues.gender}
            onChange={(value) => setValue('gender', value)}
            placeholder="Selecionar..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="date"
            label="Data de Nascimento"
            {...register('dateOfBirth')}
          />

          <Input
            type="number"
            step="0.1"
            label="Peso (kg)"
            placeholder="Ex: 5.5"
            error={errors.weight?.message}
            {...register('weight')}
          />
        </div>

        <Input
          label="Cor"
          placeholder="Ex: Dourado, Preto e branco..."
          {...register('color')}
        />
      </FormSection>

      <FormSection title="Informações de Saúde" description="Dados importantes para o veterinário">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Alergias
          </label>
          <div className="space-y-3">
            <div className="flex space-x-2">
              <Input
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Ex: Frango, Leite..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAllergy();
                  }
                }}
                className="flex-1"
              />
              
              <Button
                type="button"
                variant="outline"
                onClick={addAllergy}
              >
                Adicionar
              </Button>
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
        </div>
      </FormSection>
    </CreatePageLayout>
  );
};

export default EditPetPage;