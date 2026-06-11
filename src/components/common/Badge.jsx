import { getCiudadColor, getCiudadLabel, normalizeCiudad } from '../../utils/permissions';

export default function Badge({ ciudad, className = '' }) {
  const key = normalizeCiudad(ciudad);
  const color = getCiudadColor(ciudad);
  const label = getCiudadLabel(ciudad);

  const bgOpacity = key === 'medellin' ? 'bg-orange-50' : key === 'bogota' ? 'bg-blue-50' : 'bg-slate-50';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${bgOpacity} ${className}`}
      style={{ color, border: `1px solid ${color}33` }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
