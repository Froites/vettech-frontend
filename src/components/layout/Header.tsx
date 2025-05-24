
import { LogOut, User, Bell } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const getDisplayName = () => {
    if (user?.profile?.firstName && user?.profile?.lastName) {
      return `${user.profile.firstName} ${user.profile.lastName}`;
    }
    return user?.email?.split('@')[0] || 'Usuário';
  };

  const getRoleDisplay = () => {
    const roleMap = {
      'TUTOR': 'Tutor',
      'VETERINARIAN': 'Veterinário',
      'CLINIC_ADMIN': 'Admin Clínica',
      'PLATFORM_ADMIN': 'Admin Plataforma'
    };
    return roleMap[user?.role as keyof typeof roleMap] || user?.role;
  };

  return (
    <header className="bg-white shadow border-b border-gray-200 z-10">
      <div className="px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - could add breadcrumbs here */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600 lg:hidden">VetTech</h1>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications (placeholder) */}
            <button className="btn btn-ghost btn-sm text-gray-500 hover:text-gray-700">
              <Bell className="h-5 w-5" />
            </button>

            {/* User info */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{getDisplayName()}</p>
                <p className="text-xs text-gray-500">{getRoleDisplay()}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="btn btn-ghost btn-sm text-gray-500 hover:text-gray-700"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};