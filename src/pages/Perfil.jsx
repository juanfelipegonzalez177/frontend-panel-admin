import { ShieldCheck, ShieldX } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import { getAllowedPermissionLabels, getBlockedPermissionLabels, getCiudadLabel } from '../utils/permissions';

export default function Perfil() {
  const { user, ciudad } = useAuth();
  const permisosActivos = getAllowedPermissionLabels(ciudad);
  const permisosBloqueados = getBlockedPermissionLabels(ciudad);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Perfil del administrador</h2>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bogota/10 text-2xl font-bold text-bogota">
            {(user?.username || user?.nombre || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">
              {user?.username || user?.nombre || 'Usuario'}
            </h3>
            <p className="text-slate-500">{user?.email || user?.correo}</p>
            {ciudad && <div className="mt-2"><Badge ciudad={ciudad} /></div>}
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-slate-400">Ciudad</dt>
            <dd className="mt-1 text-slate-700">{getCiudadLabel(ciudad)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-400">Tipo de cuenta</dt>
            <dd className="mt-1 text-slate-700">Administrador interno</dd>
          </div>
          {user?.id && (
            <div>
              <dt className="text-xs font-medium uppercase text-slate-400">ID</dt>
              <dd className="mt-1 text-slate-700">{user.id}</dd>
            </div>
          )}
        </dl>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <h3 className="font-semibold text-slate-800">Permisos activos</h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {permisosActivos.map((p) => (
              <span key={p} className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-success">
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldX className="h-5 w-5 text-error" />
            <h3 className="font-semibold text-slate-800">Permisos bloqueados</h3>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {permisosBloqueados.map((p) => (
              <span key={p} className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-error">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
