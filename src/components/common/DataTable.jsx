import { Search, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from 'lucide-react';
import Loader from './Loader';

export default function DataTable({
  columns,
  data,
  loading,
  search,
  onSearchChange,
  pagination,
  onPageChange,
  actions,
  emptyMessage = 'No hay registros',
}) {
  if (loading) return <Loader text="Cargando registros..." />;

  return (
    <div className="space-y-4">
      {onSearchChange && (
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, correo o ID..."
            className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm focus:border-bogota focus:outline-none focus:ring-2 focus:ring-bogota/20"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold text-slate-600">
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-4 py-3 font-semibold text-slate-600">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-4 py-12 text-center text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3 text-slate-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {actions.onView && (
                          <button
                            onClick={() => actions.onView(row)}
                            title="Ver detalle"
                            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-bogota"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        )}
                        {actions.onEdit && (
                          <button
                            onClick={() => actions.onEdit(row)}
                            title="Editar"
                            className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-bogota"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {actions.onPatch && (
                          <button
                            onClick={() => actions.onPatch(row)}
                            title="Edición rápida"
                            className="rounded-lg px-2 py-1 text-xs font-medium text-bogota hover:bg-blue-50"
                          >
                            Rápido
                          </button>
                        )}
                        {actions.onDelete && (
                          <button
                            onClick={() => actions.onDelete(row)}
                            title="Eliminar"
                            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-error"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.paginas > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Página {pagination.pagina} de {pagination.paginas} ({pagination.total} registros)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.pagina - 1)}
              disabled={pagination.pagina <= 1}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </button>
            <button
              onClick={() => onPageChange(pagination.pagina + 1)}
              disabled={pagination.pagina >= pagination.paginas}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 hover:bg-slate-50 disabled:opacity-40"
            >
              Siguiente <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
