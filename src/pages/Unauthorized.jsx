import { Link } from 'react-router-dom';
import { ShieldX } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 text-center">
      <div className="rounded-full bg-red-50 p-6">
        <ShieldX className="h-16 w-16 text-error" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-slate-800">Acceso denegado</h1>
      <p className="mt-2 max-w-md text-slate-500">
        No tienes permisos para realizar esta acción según tu ciudad de administración.
      </p>
      <Link
        to="/dashboard"
        className="mt-8 rounded-lg bg-bogota px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
      >
        Volver al Dashboard
      </Link>
    </div>
  );
}
