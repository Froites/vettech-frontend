import type { Appointment } from "./appointment";
import type { User } from "./auth";
import type { Pet } from "./pet";

export interface MedicalRecord {
  id: string;
  appointmentId: string;
  petId: string;
  createdById: string;
  symptoms: string[];
  diagnosis?: string;
  treatment?: string;
  observations?: string;
  attachments: string[];
  vitals?: {
    weight?: number;
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
  // Relacionamentos
  appointment?: Appointment;
  pet?: Pet;
  createdBy?: User;
}

export interface CreateMedicalRecordRequest {
  appointmentId: string;
  symptoms: string[];
  diagnosis?: string;
  treatment?: string;
  observations?: string;
  vitals?: {
    weight?: number;
    temperature?: number;
    heartRate?: number;
    respiratoryRate?: number;
  };
}

export interface MedicalRecordStats {
  total: number;
  thisMonth: number;
  byPet: { [petName: string]: number };
  recent: MedicalRecord[];
}