import type { Appointment } from "./appointment";
import type { User } from "./auth";
import type { Pet } from "./pet";

export interface Prescription {
  id: string;
  appointmentId: string;
  medications: MedicationItem[];
  instructions: string;
  validUntil: string;
  isDispensed: boolean;
  createdAt: string;
  updatedAt: string;
  // Relacionamentos
  appointment?: Appointment;
  pet?: Pet;
  veterinarian?: User;
}

export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  warnings?: string[];
}

export interface CreatePrescriptionRequest {
  appointmentId: string;
  medications: MedicationItem[];
  instructions: string;
  validUntil: string; // ISO string
}

export interface PrescriptionStats {
  total: number;
  active: number;
  dispensed: number;
  expired: number;
  thisMonth: number;
  byPet: { [petName: string]: number };
}

export interface DigitalPrescription {
  id: string;
  qrCode: string;
  verificationCode: string;
  isValid: boolean;
  prescription: Omit<Prescription, 'appointment'> & {
    petName: string;
    veterinarianName: string;
    veterinarianCrmv: string;
  };
}