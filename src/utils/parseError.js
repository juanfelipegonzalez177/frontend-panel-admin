export const parseApiError = (error) => {
  const data = error?.response?.data;
  if (!data) return 'Error de conexión con el servidor';

  if (data.errores && Array.isArray(data.errores)) {
    return data.errores.map((e) => `${e.campo}: ${e.detalle}`).join('. ');
  }

  if (typeof data === 'string') return data;

  if (data.detail) return String(data.detail);
  if (data.error) return String(data.error);
  if (data.mensaje) return String(data.mensaje);

  if (typeof data === 'object') {
    const messages = Object.entries(data)
      .map(([key, val]) => {
        if (Array.isArray(val)) return `${key}: ${val.join(', ')}`;
        return `${key}: ${val}`;
      })
      .join('. ');
    if (messages) return messages;
  }

  return 'Ha ocurrido un error inesperado';
};
