import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, FileJson, XCircle } from 'lucide-react';
import { createWithEmployees } from '../api/companiaService';
import { parseApiError } from '../utils/parseError';

const example = {
  nombre: 'Compañía ejemplo',
  direccion: 'Calle 123 #45-67',
  telefono: '3001234567',
  empleados: [
    {
      nombre: 'Ana',
      apellido: 'Gómez',
      correo: 'ana.gomez@mail.com',
      cargo: 'Analista',
      salario: 2500000,
    },
  ],
};

export default function CompaniaBulk() {
  const [jsonText, setJsonText] = useState(JSON.stringify(example, null, 2));
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    let payload;
    try {
      payload = JSON.parse(jsonText);
    } catch {
      toast.error('JSON inválido. Verifica el formato.');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const { data } = await createWithEmployees(payload);
      setResult({ success: true, item: data });
      toast.success('Compañía y empleados creados');
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
      <Link to="/companias" className="inline-flex items-center gap-2 text-sm text-bogota hover:underline">
        <ArrowLeft className="h-4 w-4" /> Volver al listado
      </Link>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <FileJson className="h-6 w-6 text-bogota" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Carga Masiva de Compañía</h2>
            <p className="mt-1 text-sm text-slate-500">Crea una compañía junto con varios empleados en una sola solicitud</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            rows={18}
            className="w-full rounded-lg border border-slate-200 p-4 font-mono text-sm focus:border-bogota focus:outline-none focus:ring-2 focus:ring-bogota/20"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-bogota px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Crear compañía con empleados'}
          </button>
        </form>
      </div>

      {result && (
        <div className={`rounded-lg border p-6 ${result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
          <div className="flex items-center gap-3">
            {result.success ? <CheckCircle className="h-6 w-6 text-success" /> : <XCircle className="h-6 w-6 text-error" />}
            <div>
              <h3 className="font-semibold text-slate-800">{result.success ? 'Carga completada' : 'Error en la carga'}</h3>
              <p className="text-sm text-slate-600">
                {result.success ? `Se creó ${result.item?.nombre || 'la compañía'} correctamente` : result.error}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
