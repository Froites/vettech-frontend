import type { User } from "./auth";
import type { Pet } from "./pet";

export interface Appointment {
  id: string;
  scheduledAt: string;
  duration: number;
  type: 'ROUTINE' | 'EMERGENCY' | 'FOLLOW_UP';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  meetingUrl?: string;
  recordingUrl?: string;
  price: string; // Sua API retorna como string
  createdAt: string;
  updatedAt: string;
  petId: string;
  tutorId: string;
  veterinarianId: string;
  pet?: Pet;
  tutor?: User;
  veterinarian?: User;
  medicalRecord?: any;
  prescription?: any;
}

export interface CreateAppointmentRequest {
  petId: string;
  veterinarianId: string;
  scheduledAt: string; // ISO string
  type: 'ROUTINE' | 'EMERGENCY' | 'FOLLOW_UP';
  notes?: string;
}

export interface VeterinarianAvailability {
  id: string;
  email: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  veterinarianProfile?: {
    crmv: string;
    specialties: string[];
    consultationFee: number;
    isAvailable: boolean;
  };
}

export interface TimeSlot {
  time: string;
  available: boolean;
}