import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠', roles: ['TUTOR', 'VETERINARIAN', 'ADMIN'] },
  { name: 'Meus Pets', href: '/pets', icon: '🐕', roles: ['TUTOR'] },
  { name: 'Pacientes', href: '/pets', icon: '🏥', roles: ['VETERINARIAN'] },
  { name: 'Agendamentos', href: '/appointments', icon: '📅', roles: ['TUTOR', 'VETERINARIAN'] },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user?.role || 'TUTOR')
  );

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-600">VetTech</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {filteredNavigation.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link ${
                  isActive ? 'nav-link-active' : 'nav-link-inactive'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500 text-center">
            VetTech v1.0.0
          </div>
        </div>
      </div>
    </div>
  );
};