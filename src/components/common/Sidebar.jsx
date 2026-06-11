import { NavLink } from 'react-router-dom';
import { Building2, LayoutDashboard, Users, UserCircle, Plus, Upload, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/empleados', label: 'Empleados', icon: Users },
  { to: '/empleados/nuevo', label: 'Nuevo Empleado', icon: Plus, permission: 'canPost' },
  { to: '/empleados/masivo', label: 'Carga Masiva', icon: Upload, permission: 'canBulkPost' },
  { to: '/companias', label: 'Compañías', icon: Building2 },
  { to: '/companias/nueva', label: 'Nueva Compañía', icon: Plus, permission: 'canPost' },
  { to: '/companias/masivo', label: 'Compañía + Empleados', icon: Upload, permission: 'canBulkPost' },
  { to: '/perfil', label: 'Perfil', icon: UserCircle },
];

export default function Sidebar({ isOpen, onClose }) {
  const { permissions } = useAuth();

  const filteredItems = navItems.filter(
    (item) => !item.permission || permissions[item.permission]
  );

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 transform border-r border-slate-200 bg-white pt-16 transition-transform duration-200 lg:static lg:translate-x-0 lg:pt-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-1 text-slate-400 hover:bg-slate-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>

        <nav className="flex flex-col gap-1 p-4">
          {filteredItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-bogota/10 text-bogota'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
