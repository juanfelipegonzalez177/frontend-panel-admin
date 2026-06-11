const PERMISSIONS = {
  medellin: {
    canGetAll: true,
    canGetById: true,
    canPost: true,
    canBulkPost: true,
    canDelete: true,
    canPut: false,
    canPatch: false,
  },
  bogota: {
    canGetAll: true,
    canGetById: true,
    canPost: true,
    canBulkPost: true,
    canDelete: false,
    canPut: true,
    canPatch: true,
  },
};

export const PERMISSION_LABELS = {
  canGetAll: 'Ver todos los registros',
  canGetById: 'Ver detalle por ID',
  canPost: 'Crear registros',
  canBulkPost: 'Crear registros masivamente',
  canPut: 'Actualizar completo (PUT)',
  canPatch: 'Actualizar parcial (PATCH)',
  canDelete: 'Eliminar registros',
};

export const normalizeCiudad = (ciudad) => {
  if (!ciudad) return '';
  const lower = ciudad.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (lower.includes('medellin')) return 'medellin';
  if (lower.includes('bogota')) return 'bogota';
  return lower;
};

export const getPermissions = (ciudad) => {
  const key = normalizeCiudad(ciudad);
  return PERMISSIONS[key] || {};
};

export const getCiudadLabel = (ciudad) => {
  const key = normalizeCiudad(ciudad);
  if (key === 'medellin') return 'Medellín';
  if (key === 'bogota') return 'Bogotá';
  return ciudad || 'Pendiente por confirmar';
};

export const getCiudadColor = (ciudad) => {
  const key = normalizeCiudad(ciudad);
  if (key === 'medellin') return '#FF6B35';
  if (key === 'bogota') return '#2D6BE4';
  return '#64748B';
};

export const getAllowedPermissionLabels = (ciudad) =>
  Object.entries(getPermissions(ciudad))
    .filter(([, enabled]) => enabled)
    .map(([key]) => PERMISSION_LABELS[key] || key);

export const getBlockedPermissionLabels = (ciudad) =>
  Object.entries(getPermissions(ciudad))
    .filter(([, enabled]) => !enabled)
    .map(([key]) => PERMISSION_LABELS[key] || key);
