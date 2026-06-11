import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { bulkCreate } from '../api/empleadoService';
import BulkForm from '../components/forms/BulkForm';
import { parseApiError } from '../utils/parseError';

export default function EmpleadoBulk() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onSubmit = async (items, jsonError) => {
    if (jsonError) {
      toast.error(jsonError);
      return;
    }
    if (!items?.length) {
      toast.error('Agrega al menos un registro válido');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const { data } = await bulkCreate(items);
      const created = Array.isArray(data) ? data : data?.creados || data?.empleados || [];
      setResult({
        success: true,
        count: created.length || items.length,
        items: created,
      });
      toast.success(`${created.length || items.length} empleados creados`);
    } catch (error) {
      const msg = parseApiError(error);
      setResult({ success: false, error: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/empleados" className="inline-flex items-center gap-2 text-sm text-bogota hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver al listado
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800">Carga Masiva</h2>
        <p className="mt-1 text-sm text-slate-500">Crea múltiples empleados en una sola solicitud</p>
        <div className="mt-6">
          <BulkForm onSubmit={onSubmit} loading={loading} />
        </div>
      </div>

      {result && (
        <div className={`rounded-xl border p-6 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <div className="flex items-center gap-3">
            {result.success ? (
              <CheckCircle className="h-6 w-6 text-success" />
            ) : (
              <XCircle className="h-6 w-6 text-error" />
            )}
            <div>
              <h3 className="font-semibold text-slate-800">
                {result.success ? 'Carga completada' : 'Error en la carga'}
              </h3>
              <p className="text-sm text-slate-600">
                {result.success
                  ? `Se crearon ${result.count} registros correctamente`
                  : result.error}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
