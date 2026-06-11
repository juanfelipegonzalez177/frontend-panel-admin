import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft, CheckCircle, PlusCircle, Trash2, Users, Building, XCircle } from 'lucide-react';
import { createWithEmployees } from '../api/companiaService';
import { parseApiError } from '../utils/parseError';

export default function CompaniaBulk() {
  const [compania, setCompania] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
  });

  const [empleados, setEmpleados] = useState([
    { nombre: '', apellido: '', correo: '', cargo: '', salario: '' }
  ]);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCompaniaChange = (e) => {
    const { name, value } = e.target;
    setCompania((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmpleadoChange = (index, e) => {
    const { name, value } = e.target;
    const newEmpleados = [...empleados];
    newEmpleados[index][name] = value;
    setEmpleados(newEmpleados);
  };

  const addEmpleado = () => {
    setEmpleados([...empleados, { nombre: '', apellido: '', correo: '', cargo: '', salario: '' }]);
  };

  const removeEmpleado = (index) => {
    const newEmpleados = [...empleados];
    newEmpleados.splice(index, 1);
    setEmpleados(newEmpleados);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    
    // Convert salario to numbers
    const formattedEmpleados = empleados.map(emp => ({
      ...emp,
      salario: Number(emp.salario)
    }));

    const payload = {
      ...compania,
      empleados: formattedEmpleados
    };

    setLoading(true);
    setResult(null);
    try {
      const { data } = await createWithEmployees(payload);
      setResult({ success: true, item: data });
      toast.success('Compañía y empleados creados');
      // Reset form on success optionally
      setCompania({ nombre: '', direccion: '', telefono: '' });
      setEmpleados([{ nombre: '', apellido: '', correo: '', cargo: '', salario: '' }]);
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
          <Building className="h-6 w-6 text-bogota" />
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Carga Masiva de Compañía</h2>
            <p className="mt-1 text-sm text-slate-500">Crea una compañía junto con varios empleados en una sola solicitud</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-8 space-y-8">
          {/* Company Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-slate-700 border-b pb-2">Datos de la Compañía</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={compania.nombre}
                  onChange={handleCompaniaChange}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-bogota focus:outline-none focus:ring-1 focus:ring-bogota"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={compania.direccion}
                  onChange={handleCompaniaChange}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-bogota focus:outline-none focus:ring-1 focus:ring-bogota"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={compania.telefono}
                  onChange={handleCompaniaChange}
                  required
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-bogota focus:outline-none focus:ring-1 focus:ring-bogota"
                />
              </div>
            </div>
          </div>

          {/* Employees Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                <Users className="h-5 w-5" /> Empleados
              </h3>
              <button
                type="button"
                onClick={addEmpleado}
                className="inline-flex items-center gap-1 text-sm text-bogota hover:text-blue-700 font-medium"
              >
                <PlusCircle className="h-4 w-4" /> Agregar empleado
              </button>
            </div>
            
            <div className="space-y-4">
              {empleados.map((empleado, index) => (
                <div key={index} className="relative rounded-lg border border-slate-200 bg-slate-50 p-4">
                  {empleados.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmpleado(index)}
                      className="absolute right-4 top-4 text-slate-400 hover:text-red-500"
                      title="Eliminar empleado"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                  <p className="text-xs font-semibold uppercase text-slate-500 mb-3">Empleado {index + 1}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={empleado.nombre}
                        onChange={(e) => handleEmpleadoChange(index, e)}
                        required
                        className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-bogota focus:outline-none focus:ring-1 focus:ring-bogota bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Apellido</label>
                      <input
                        type="text"
                        name="apellido"
                        value={empleado.apellido}
                        onChange={(e) => handleEmpleadoChange(index, e)}
                        required
                        className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-bogota focus:outline-none focus:ring-1 focus:ring-bogota bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Correo</label>
                      <input
                        type="email"
                        name="correo"
                        value={empleado.correo}
                        onChange={(e) => handleEmpleadoChange(index, e)}
                        required
                        className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-bogota focus:outline-none focus:ring-1 focus:ring-bogota bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Cargo</label>
                      <input
                        type="text"
                        name="cargo"
                        value={empleado.cargo}
                        onChange={(e) => handleEmpleadoChange(index, e)}
                        required
                        className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-bogota focus:outline-none focus:ring-1 focus:ring-bogota bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Salario</label>
                      <input
                        type="number"
                        name="salario"
                        min="0"
                        value={empleado.salario}
                        onChange={(e) => handleEmpleadoChange(index, e)}
                        required
                        className="w-full rounded-md border border-slate-300 p-2 text-sm focus:border-bogota focus:outline-none focus:ring-1 focus:ring-bogota bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
