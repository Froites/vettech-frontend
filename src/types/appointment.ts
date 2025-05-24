import type { User } from "./auth";
import type { Pet } from "./pet";

export interface Appointment {
  id: string;
  petId: string;
  pet?: Pet;
  veterinarianId: string;
  veterinarian?: User;
  tutorId: string;
  tutor?: User;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  petId: string;
  veterinarianId: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
}