import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Plus, ShieldCheck, ShieldX, Trash2, Upload, Users, Pencil } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAll as getEmpleados, normalizeList as normalizeEmpleados } from '../api/empleadoService';
import { getAll as getCompanias, normalizeList as normalizeCompanias } from '../api/companiaService';
import Badge from '../components/common/Badge';
import Loader from '../components/common/Loader';
import { getAllowedPermissionLabels, getBlockedPermissionLabels, getCiudadLabel } from '../utils/permissions';

export default function Dashboard() {
  const { user, ciudad, permissions } = useAuth();
  const [stats, setStats] = useState({ empleados: 0, companias: 0, recientes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [empleadosRes, companiasRes] = await Promise.all([
          getEmpleados({ pagina: 1, tamano: 5 }),
          getCompanias({ pagina: 1, tamano: 5 }),
        ]);
        const empleados = normalizeEmpleados(empleadosRes);
        const companias = normalizeCompanias(companiasRes);
        setStats({ empleados: empleados.total, companias: companias.total, recientes: empleados.items.slice(0, 5) });
      } catch {
        setStats({ empleados: 0, companias: 0, recientes: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    { to: '/empleados', label: 'Ver empleados', icon: Users, show: permissions.canGetAll },
    { to: '/companias', label: 'Ver compañías', icon: Building2, show: permissions.canGetAll },
    { to: '/empleados/nuevo', label: 'Crear empleado', icon: Plus, show: permissions.canPost },
    { to: '/companias/nueva', label: 'Crear compañía', icon: Plus, show: permissions.canPost },
    { to: '/empleados/masivo', label: 'Carga masiva empleados', icon: Upload, show: permissions.canBulkPost },
    { to: '/companias/masivo', label: 'Compañía con empleados', icon: Upload, show: permissions.canBulkPost },
    { to: '/empleados', label: 'Editar registros', icon: Pencil, show: permissions.canPut || permissions.canPatch },
    { to: '/empleados', label: 'Eliminar registros', icon: Trash2, show: permissions.canDelete },
  ].filter((a) => a.show);

  if (loading) return <Loader text="Cargando dashboard..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Hola, {user?.username || user?.nombre || 'Administrador'}
          </h2>
          <p className="text-slate-500">
            Panel de control de {getCiudadLabel(ciudad)}
          </p>
        </div>
        {ciudad && <Badge ciudad={ciudad} />}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-3">
              <Users className="h-6 w-6 text-bogota" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total empleados</p>
              <p className="text-3xl font-bold text-slate-800">{stats.empleados}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-orange-50 p-3">
              <Building2 className="h-6 w-6 text-medellin" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total compañías</p>
              <p className="text-3xl font-bold text-slate-800">{stats.companias}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Tu ciudad</p>
          <p className="mt-1 text-xl font-semibold">{getCiudadLabel(ciudad)}</p>
          <p className="mt-2 text-xs text-slate-400">
            {permissions.canDelete ? 'Puede crear y eliminar' : 'Puede crear y editar'}
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-slate-500">Últimos agregados</p>
          <p className="mt-1 text-3xl font-bold text-slate-800">{stats.recientes.length}</p>
          <p className="text-xs text-slate-400">en la última consulta</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            <h3 className="text-lg font-semibold text-slate-800">Permisos activos</h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {getAllowedPermissionLabels(ciudad).map((label) => (
              <span key={label} className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-success">
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <ShieldX className="h-5 w-5 text-error" />
            <h3 className="text-lg font-semibold text-slate-800">Acciones no disponibles</h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {getBlockedPermissionLabels(ciudad).map((label) => (
              <span key={label} className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-error">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800">Acciones rápidas</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map(({ to, label, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="flex min-h-16 items-center gap-3 rounded-lg border border-slate-100 p-4 transition-colors hover:border-bogota/30 hover:bg-blue-50/50"
            >
              <Icon className="h-5 w-5 text-bogota" />
              <span className="text-sm font-medium text-slate-700">{label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
