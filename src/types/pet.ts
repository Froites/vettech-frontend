import type { User } from "./auth";

export interface Pet {
  id: string;
  name: string;
  species: 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'OTHER';
  breed?: string;
  gender?: string;
  dateOfBirth?: string;
  weight?: number;
  color?: string;
  microchipId?: string;
  photoUrl?: string;
  specialNeeds?: string;
  allergies: string[];
  currentMedications: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  owner?: User; // Para veterinários verem quem é o dono
  appointments?: any[];
  medicalRecords?: any[];
  vaccinations?: any[];
}

export interface CreatePetRequest {
  name: string;
  species: 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'OTHER';
  breed?: string;
  gender?: string;
  dateOfBirth?: string;
  weight?: number;
  color?: string;
  allergies?: string[];
}