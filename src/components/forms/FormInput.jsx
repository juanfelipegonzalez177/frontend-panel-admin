export default function FormInput({
  label,
  name,
  type = 'text',
  register,
  error,
  placeholder,
  options,
  disabled = false,
  required = false,
}) {
  const baseClass =
    'w-full rounded-lg border px-4 py-2.5 text-sm text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-bogota/30 disabled:bg-slate-50 disabled:text-slate-400';
  const borderClass = error ? 'border-error focus:border-error' : 'border-slate-200 focus:border-bogota';

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-error">*</span>}
        </label>
      )}

      {type === 'select' ? (
        <select
          id={name}
          {...register(name)}
          disabled={disabled}
          className={`${baseClass} ${borderClass}`}
        >
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          disabled={disabled}
          className={`${baseClass} ${borderClass}`}
        />
      )}

      {error && <p className="text-xs text-error">{error.message || error}</p>}
    </div>
  );
}
