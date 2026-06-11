import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, LogIn, UserPlus } from 'lucide-react';
import { isAuthenticated } from '../utils/tokenManager';

export default function Landing() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4">
      <div className="w-full max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-bogota shadow-lg shadow-blue-200">
          <Building2 className="h-10 w-10 text-white" />
        </div>

        <h1 className="text-4xl font-bold text-slate-800">Panel de administradores</h1>
        <p className="mt-3 text-lg text-slate-500">
          Sistema de gestión con administradores de Medellín y Bogotá
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/register"
            className="flex items-center justify-center gap-2 rounded-lg bg-medellin px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-200 transition-transform hover:scale-[1.02]"
          >
            <UserPlus className="h-5 w-5" />
            Registrarse
          </Link>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 rounded-lg bg-bogota px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-200 transition-transform hover:scale-[1.02]"
          >
            <LogIn className="h-5 w-5" />
            Iniciar sesión
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-medellin" /> Medellín: crear y eliminar
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-bogota" /> Bogotá: crear y editar
          </span>
        </div>
      </div>
    </div>
  );
}
