import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { getById, update } from '../api/empleadoService';
import EmpleadoForm from '../components/forms/EmpleadoForm';
import Loader from '../components/common/Loader';
import { parseApiError } from '../utils/parseError';

export default function EmpleadoEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [defaultValues, setDefaultValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getById(id);
        setDefaultValues({
          nombre: data.nombre,
          apellido: data.apellido,
          correo: data.correo,
          cargo: data.cargo,
          salario: data.salario,
          compania_id: data.compania_id,
        });
      } catch (error) {
        toast.error(parseApiError(error));
        navigate('/empleados');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      await update(id, data);
      toast.success('Empleado actualizado correctamente');
      navigate('/empleados');
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to={`/empleados/${id}`} className="inline-flex items-center gap-2 text-sm text-bogota hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver al detalle
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Editar Empleado (PUT)</h2>
        <p className="mt-1 text-sm text-slate-500">Actualización completa del registro</p>
        <div className="mt-6">
          <EmpleadoForm
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            loading={saving}
            submitLabel="Actualizar"
          />
        </div>
      </div>
    </div>
  );
}
