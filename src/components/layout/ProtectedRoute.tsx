import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';


interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: ('TUTOR' | 'VETERINARIAN' | 'CLINIC_ADMIN' | 'PLATFORM_ADMIN')[];
}

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute Debug:', {
    path: location.pathname,
    isAuthenticated,
    isLoading,
    userRole: user?.role,
    requiredRoles: roles,
    user: user
  });

  if (isLoading) {
    console.log('⏳ ProtectedRoute: Ainda carregando...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute: Não autenticado, redirecionando para /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && user) {
    const hasRole = roles.includes(user.role);
    console.log('🔐 ProtectedRoute: Verificando roles:', {
      userRole: user.role,
      requiredRoles: roles,
      hasRole: hasRole
    });
    
    if (!hasRole) {
      console.log('❌ ProtectedRoute: Role não autorizado, redirecionando para /dashboard');
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log('✅ ProtectedRoute: Acesso autorizado');
  return <>{children}</>;
};