import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from './Badge';

export default function Navbar({ onMenuClick }) {
  const { user, ciudad, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          title="Abrir menú"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-800">Panel de administradores</h1>
          <p className="hidden text-xs text-slate-400 sm:block">Gestión de empleados y compañías</p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-700">
            {user?.username || user?.nombre || user?.email || 'Usuario'}
          </p>
          <p className="text-xs text-slate-400">Administrador interno</p>
        </div>
        {ciudad && <Badge ciudad={ciudad} />}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-error"
          title="Cerrar sesión"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </div>
    </header>
  );
}
