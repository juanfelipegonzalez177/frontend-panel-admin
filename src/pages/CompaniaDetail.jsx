import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getById, getEmployees, remove } from '../api/companiaService';
import Loader from '../components/common/Loader';
import ModalConfirm from '../components/common/ModalConfirm';
import { parseApiError } from '../utils/parseError';

export default function CompaniaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { permissions } = useAuth();
  const [compania, setCompania] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [{ data }, empleadosRes] = await Promise.all([getById(id), getEmployees(id)]);
        setCompania(data);
        setEmpleados(Array.isArray(empleadosRes.data) ? empleadosRes.data : []);
      } catch (error) {
        toast.error(parseApiError(error));
        navigate('/companias');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await remove(id);
      toast.success('Compañía eliminada');
      navigate('/companias');
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;
  if (!compania) return null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/companias" className="inline-flex items-center gap-2 text-sm text-bogota hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver al listado
      </Link>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-800">{compania.nombre}</h2>
          <div className="flex gap-2">
            {permissions.canPut && (
              <Link
                to={`/companias/${id}/editar`}
                className="flex items-center gap-2 rounded-lg bg-bogota px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                <Pencil className="h-4 w-4" /> Editar
              </Link>
            )}
            {permissions.canDelete && (
              <button
                onClick={() => setShowDelete(true)}
                className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-error hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" /> Eliminar
              </button>
            )}
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium uppercase text-slate-400">ID</dt>
            <dd className="mt-1 text-slate-700">{compania.id}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase text-slate-400">Teléfono</dt>
            <dd className="mt-1 text-slate-700">{compania.telefono}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium uppercase text-slate-400">Dirección</dt>
            <dd className="mt-1 text-slate-700">{compania.direccion}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-800">Empleados de esta compañía</h3>
        <div className="mt-4 divide-y divide-slate-100">
          {empleados.length === 0 ? (
            <p className="py-4 text-sm text-slate-400">No hay empleados vinculados.</p>
          ) : (
            empleados.map((empleado) => (
              <Link
                key={empleado.id}
                to={`/empleados/${empleado.id}`}
                className="flex items-center justify-between py-3 text-sm hover:bg-slate-50"
              >
                <span className="font-medium text-slate-700">{empleado.nombre} {empleado.apellido}</span>
                <span className="text-slate-400">{empleado.cargo}</span>
              </Link>
            ))
          )}
        </div>
      </div>

      <ModalConfirm
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar compañía"
        message="¿Estás seguro de eliminar este registro?"
        confirmText="Sí, eliminar"
        loading={deleting}
      />
    </div>
  );
}
