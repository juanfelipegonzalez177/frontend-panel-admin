import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAll, remove, partialUpdate, normalizeList } from '../api/empleadoService';
import DataTable from '../components/common/DataTable';
import ModalConfirm from '../components/common/ModalConfirm';
import { parseApiError } from '../utils/parseError';

export default function EmpleadosList() {
  const navigate = useNavigate();
  const { permissions } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ pagina: 1, paginas: 1, total: 0, tamano: 10 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [patchTarget, setPatchTarget] = useState(null);
  const [patchField, setPatchField] = useState('cargo');
  const [patchValue, setPatchValue] = useState('');
  const [patching, setPatching] = useState(false);

  const fetchData = useCallback(async (page = 1, buscar = '') => {
    setLoading(true);
    try {
      const res = await getAll({ pagina: page, tamano: 10, buscar });
      const data = normalizeList(res);
      setItems(data.items);
      setPagination({
        pagina: data.pagina,
        paginas: data.paginas,
        total: data.total,
        tamano: data.tamano,
      });
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(1, search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      toast.success('Empleado eliminado correctamente');
      setDeleteTarget(null);
      fetchData(pagination.pagina, search);
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setDeleting(false);
    }
  };

  const handlePatch = async () => {
    if (!patchTarget) return;
    setPatching(true);
    try {
      await partialUpdate(patchTarget.id, { [patchField]: patchValue });
      toast.success('Campo actualizado');
      setPatchTarget(null);
      fetchData(pagination.pagina, search);
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setPatching(false);
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre', render: (r) => `${r.nombre} ${r.apellido}` },
    { key: 'correo', label: 'Correo' },
    { key: 'cargo', label: 'Cargo' },
    { key: 'salario', label: 'Salario', render: (r) => `$${Number(r.salario).toLocaleString()}` },
    { key: 'compania', label: 'Compañía', render: (r) => r.compania || r.compania_id },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Empleados</h2>
        {permissions.canPost && (
          <button
            onClick={() => navigate('/empleados/nuevo')}
            className="flex items-center gap-2 rounded-lg bg-bogota px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Nuevo
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        search={search}
        onSearchChange={setSearch}
        pagination={pagination}
        onPageChange={(p) => fetchData(p, search)}
        actions={{
          onView: (row) => navigate(`/empleados/${row.id}`),
          onEdit: permissions.canPut ? (row) => navigate(`/empleados/${row.id}/editar`) : null,
          onPatch: permissions.canPatch
            ? (row) => {
                setPatchTarget(row);
                setPatchField('cargo');
                setPatchValue(row.cargo || '');
              }
            : null,
          onDelete: permissions.canDelete ? (row) => setDeleteTarget(row) : null,
        }}
      />

      <ModalConfirm
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar empleado"
        message={`¿Estás seguro de eliminar a ${deleteTarget?.nombre} ${deleteTarget?.apellido}?`}
        confirmText="Sí, eliminar"
        loading={deleting}
      />

      {patchTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setPatchTarget(null)} />
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold">Edición rápida (PATCH)</h3>
            <p className="mt-1 text-sm text-slate-500">{patchTarget.nombre} {patchTarget.apellido}</p>
            <div className="mt-4 space-y-3">
              <select
                value={patchField}
                onChange={(e) => {
                  setPatchField(e.target.value);
                  setPatchValue(patchTarget[e.target.value] || '');
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="cargo">Cargo</option>
                <option value="salario">Salario</option>
                <option value="nombre">Nombre</option>
                <option value="apellido">Apellido</option>
              </select>
              <input
                value={patchValue}
                onChange={(e) => setPatchValue(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setPatchTarget(null)} className="rounded-lg border px-4 py-2 text-sm">Cancelar</button>
              <button onClick={handlePatch} disabled={patching} className="rounded-lg bg-bogota px-4 py-2 text-sm text-white">
                {patching ? 'Guardando...' : 'Actualizar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
