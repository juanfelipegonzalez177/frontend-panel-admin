import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getById, remove } from '../api/empleadoService';
import Loader from '../components/common/Loader';
import ModalConfirm from '../components/common/ModalConfirm';
import { parseApiError } from '../utils/parseError';

export default function EmpleadoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { permissions } = useAuth();
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getById(id);
        setEmpleado(data);
      } catch (error) {
        toast.error(parseApiError(error));
        navigate('/empleados');
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
      toast.success('Empleado eliminado');
      navigate('/empleados');
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loader />;
  if (!empleado) return null;

  const fields = [
    { label: 'ID', value: empleado.id },
    { label: 'Nombre', value: empleado.nombre },
    { label: 'Apellido', value: empleado.apellido },
    { label: 'Correo', value: empleado.correo },
    { label: 'Cargo', value: empleado.cargo },
    { label: 'Salario', value: `$${Number(empleado.salario).toLocaleString()}` },
    { label: 'Compañía ID', value: empleado.compania_id },
    { label: 'Compañía', value: empleado.compania },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/empleados" className="inline-flex items-center gap-2 text-sm text-bogota hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver al listado
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {empleado.nombre} {empleado.apellido}
          </h2>
          <div className="flex gap-2">
            {permissions.canPut && (
              <Link
                to={`/empleados/${id}/editar`}
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
          {fields.map(({ label, value }) =>
            value != null ? (
              <div key={label}>
                <dt className="text-xs font-medium uppercase text-slate-400">{label}</dt>
                <dd className="mt-1 text-slate-700">{value}</dd>
              </div>
            ) : null
          )}
        </dl>
      </div>

      <ModalConfirm
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Eliminar empleado"
        message="¿Estás seguro de eliminar este registro?"
        confirmText="Sí, eliminar"
        loading={deleting}
      />
    </div>
  );
}
