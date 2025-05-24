import type { Appointment } from "./appointment";
import type { User } from "./auth";
import type { Pet } from "./pet";

export interface MedicalRecord {
  id: string;
  petId: string;
  pet?: Pet;
  veterinarianId: string;
  veterinarian?: User;
  appointmentId?: string;
  appointment?: Appointment;
  diagnosis: string;
  treatment: string;
  observations?: string;
  prescriptions?: Prescription[];
  attachments?: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  recordId: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface CreateRecordRequest {
  petId: string;
  appointmentId?: string;
  diagnosis: string;
  treatment: string;
  observations?: string;
  prescriptions?: Omit<Prescription, 'id' | 'recordId'>[];
}