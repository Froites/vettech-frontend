// src/pages/pets/CreatePetPage.tsx - ATUALIZADA COM DESIGN SYSTEM
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // 🎛️ Opções para selects
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    );
  }

  // Summary para mostrar no final
  const formValues = watch();
  const selectedSpecies = formValues.species;
  const speciesLabel = selectedSpecies ? {
    'DOG': 'Cão',
    'CAT': 'Gato', 
    'BIRD': 'Ave',
    'RABBIT': 'Coelho',
    'OTHER': 'Outro'
  }[selectedSpecies] : '--';

  const summary = {
    title: 'Resumo do Pet:',
    items: [
      { label: 'Nome', value: formValues.name || '--' },
      { label: 'Espécie', value: speciesLabel },
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
      {/* 🆕 Informações Básicas com novos componentes */}
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      icon={X}
                      onClick={() => removeAllergy(allergy)}
                      className="ml-2 text-error-800 hover:text-error-900"
                    />
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