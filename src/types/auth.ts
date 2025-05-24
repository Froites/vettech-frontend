export interface User {
  id: string;
  email: string;
  role: 'TUTOR' | 'VETERINARIAN' | 'CLINIC_ADMIN' | 'PLATFORM_ADMIN';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
  veterinarianProfile?: VeterinarianProfile;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface VeterinarianProfile {
  id: string;
  crmv: string;
  specialties: string[];
  biography?: string;
  consultationFee: number;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'TUTOR' | 'VETERINARIAN';
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}