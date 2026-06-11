import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Building2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAll, remove, partialUpdate, normalizeList } from '../api/companiaService';
import DataTable from '../components/common/DataTable';
import ModalConfirm from '../components/common/ModalConfirm';
import { parseApiError } from '../utils/parseError';

export default function CompaniasList() {
  const navigate = useNavigate();
  const { permissions } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ pagina: 1, paginas: 1, total: 0, tamano: 10 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [patchTarget, setPatchTarget] = useState(null);
  const [patchField, setPatchField] = useState('telefono');
  const [patchValue, setPatchValue] = useState('');
  const [patching, setPatching] = useState(false);

  const fetchData = useCallback(async (page = 1, buscar = '') => {
    setLoading(true);
    try {
      const res = await getAll({ pagina: page, tamano: 10, buscar });
      const data = normalizeList(res);
      setItems(data.items);
      setPagination({ pagina: data.pagina, paginas: data.paginas, total: data.total, tamano: data.tamano });
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
      toast.success('Compañía eliminada correctamente');
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
    { key: 'nombre', label: 'Nombre' },
    { key: 'direccion', label: 'Dirección' },
    { key: 'telefono', label: 'Teléfono' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="h-7 w-7 text-bogota" />
          <h2 className="text-2xl font-bold text-slate-800">Compañías</h2>
        </div>
        {permissions.canPost && (
          <button
            onClick={() => navigate('/companias/nueva')}
            className="flex items-center gap-2 rounded-lg bg-bogota px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Nueva
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
          onView: permissions.canGetById ? (row) => navigate(`/companias/${row.id}`) : null,
          onEdit: permissions.canPut ? (row) => navigate(`/companias/${row.id}/editar`) : null,
          onPatch: permissions.canPatch
            ? (row) => {
                setPatchTarget(row);
                setPatchField('telefono');
                setPatchValue(row.telefono || '');
              }
            : null,
          onDelete: permissions.canDelete ? (row) => setDeleteTarget(row) : null,
        }}
      />

      <ModalConfirm
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar compañía"
        message={`¿Estás seguro de eliminar ${deleteTarget?.nombre}?`}
        confirmText="Sí, eliminar"
        loading={deleting}
      />

      {patchTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setPatchTarget(null)} />
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold">Edición rápida (PATCH)</h3>
            <p className="mt-1 text-sm text-slate-500">{patchTarget.nombre}</p>
            <div className="mt-4 space-y-3">
              <select
                value={patchField}
                onChange={(e) => {
                  setPatchField(e.target.value);
                  setPatchValue(patchTarget[e.target.value] || '');
                }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="telefono">Teléfono</option>
                <option value="nombre">Nombre</option>
                <option value="direccion">Dirección</option>
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
