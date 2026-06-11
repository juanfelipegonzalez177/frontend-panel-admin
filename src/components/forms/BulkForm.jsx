import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const emptyRow = () => ({
  nombre: '',
  apellido: '',
  correo: '',
  cargo: '',
  salario: '',
  compania_id: '',
});

export default function BulkForm({ onSubmit, loading }) {
  const [rows, setRows] = useState([emptyRow(), emptyRow()]);

  const updateRow = (index, field, value) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const valid = rows
      .filter((r) => r.nombre && r.correo)
      .map((r) => ({
        ...r,
        salario: Number(r.salario),
        compania_id: Number(r.compania_id),
      }));

    onSubmit(valid);
  };

  const fields = ['nombre', 'apellido', 'correo', 'cargo', 'salario', 'compania_id'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="rounded-lg bg-bogota text-white px-4 py-2 text-sm font-medium">
          Tabla editable
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-slate-50">
            <tr>
              {fields.map((f) => (
                <th key={f} className="px-3 py-2 text-left font-medium capitalize text-slate-600">
                  {f.replace('_', ' ')}
                </th>
              ))}
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t border-slate-100">
                {fields.map((f) => (
                  <td key={f} className="px-2 py-1">
                    <input
                      value={row[f]}
                      onChange={(e) => updateRow(idx, f, e.target.value)}
                      className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm focus:border-bogota focus:outline-none"
                    />
                  </td>
                ))}
                <td className="px-2 py-1">
                  <button type="button" onClick={() => removeRow(idx)} className="p-1 text-error hover:bg-red-50 rounded">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          type="button"
          onClick={addRow}
          className="flex w-full items-center justify-center gap-2 border-t border-slate-200 py-3 text-sm font-medium text-bogota hover:bg-blue-50"
        >
          <Plus className="h-4 w-4" /> Agregar fila
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-bogota px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Enviando...' : 'Enviar todos'}
      </button>
    </form>
  );
}
