export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  PETS: {
    LIST: '/pets',
    CREATE: '/pets',
    GET: (id: string) => `/pets/${id}`,
    UPDATE: (id: string) => `/pets/${id}`,
    DELETE: (id: string) => `/pets/${id}`,
  },
  APPOINTMENTS: {
    LIST: '/appointments',
    CREATE: '/appointments',
    GET: (id: string) => `/appointments/${id}`,
    UPDATE: (id: string) => `/appointments/${id}`,
    DELETE: (id: string) => `/appointments/${id}`,
  },
  RECORDS: {
    LIST: '/records',
    CREATE: '/records',
    GET: (id: string) => `/records/${id}`,
    UPDATE: (id: string) => `/records/${id}`,
    DELETE: (id: string) => `/records/${id}`,
    BY_PET: (petId: string) => `/pets/${petId}/records`,
  },
} as const;

export const USER_ROLES = {
  TUTOR: 'tutor',
  VETERINARIAN: 'veterinarian',
  ADMIN: 'admin',
} as const;

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;