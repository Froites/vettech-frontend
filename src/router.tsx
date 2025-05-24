import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import DashboardPage from './pages/dashboard/DashboardPage';
import PetsPage from './pages/pets/PetsPage';
import CreatePetPage from './pages/pets/CreatePetPage';
import EditPetPage from './pages/pets/EditPetPage';
import AppointmentsPage from './pages/appointments/AppointmentsPage';
import CreateAppointmentPage from './pages/appointments/CreateAppointmentPage';


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
  // Catch all route
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};