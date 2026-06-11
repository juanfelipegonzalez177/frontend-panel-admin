import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { create } from '../api/companiaService';
import CompaniaForm from '../components/forms/CompaniaForm';
import { parseApiError } from '../utils/parseError';

export default function CompaniaNew() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await create(data);
      toast.success('Compañía creada exitosamente');
      navigate('/companias');
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link to="/companias" className="inline-flex items-center gap-2 text-sm text-bogota hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver al listado
      </Link>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Nueva Compañía</h2>
        <p className="mt-1 text-sm text-slate-500">Complete todos los campos requeridos</p>
        <div className="mt-6">
          <CompaniaForm onSubmit={onSubmit} loading={loading} submitLabel="Guardar" />
        </div>
      </div>
    </div>
  );
}
