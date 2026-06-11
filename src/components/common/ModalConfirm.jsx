import { AlertTriangle, X } from 'lucide-react';

export default function ModalConfirm({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirmar acción',
  message = '¿Estás seguro de continuar?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  variant = 'danger',
}) {
  if (!isOpen) return null;

  const confirmColor = variant === 'danger' ? 'bg-error hover:bg-red-600' : 'bg-bogota hover:bg-blue-700';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`rounded-full p-3 ${variant === 'danger' ? 'bg-red-50' : 'bg-blue-50'}`}>
            <AlertTriangle className={`h-6 w-6 ${variant === 'danger' ? 'text-error' : 'text-bogota'}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${confirmColor}`}
          >
            {loading ? 'Procesando...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
