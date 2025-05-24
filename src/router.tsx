import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import DashboardPage from './pages/dashboard/DashboardPage';
import PetsPage from './pages/pets/PetsPage';
import CreatePetPage from './pages/pets/CreatePetPage';
import EditPetPage from './pages/pets/EditPetPage';
import PetMedicalHistoryPage from './pages/pets/PetMedicalHistoryPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import CreateAppointmentPage from './pages/appointments/CreateAppointmentPage';
import MedicalRecordsPage from './pages/medical-records/MedicalRecordsPage';
import CreateRecordPage from './pages/medical-records/CreateRecordPage';
import PrescriptionsPage from './pages/prescriptions/PrescriptionsPage';
import CreatePrescriptionPage from './pages/prescriptions/CreatePrescriptionPage';
import PrescriptionDetailsPage from './pages/prescriptions/PrescriptionDetailsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pets',
    element: (
      <ProtectedRoute>
        <PetsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pets/new',
    element: (
      <ProtectedRoute roles={['TUTOR']}>
        <CreatePetPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pets/:id/edit',
    element: (
      <ProtectedRoute roles={['TUTOR']}>
        <EditPetPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/pets/:id/medical-history',
    element: (
      <ProtectedRoute>
        <PetMedicalHistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/appointments',
    element: (
      <ProtectedRoute>
        <AppointmentsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/appointments/new',
    element: (
      <ProtectedRoute roles={['TUTOR']}>
        <CreateAppointmentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/medical-records',
    element: (
      <ProtectedRoute>
        <MedicalRecordsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/medical-records/new',
    element: (
      <ProtectedRoute roles={['VETERINARIAN']}>
        <CreateRecordPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/prescriptions',
    element: (
      <ProtectedRoute>
        <PrescriptionsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/prescriptions/new',
    element: (
      <ProtectedRoute roles={['VETERINARIAN']}>
        <CreatePrescriptionPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/prescriptions/:id',
    element: (
      <ProtectedRoute>
        <PrescriptionDetailsPage />
      </ProtectedRoute>
    ),
  },
  // Catch all route
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};