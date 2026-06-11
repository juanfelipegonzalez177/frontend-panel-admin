import api from './axiosConfig';

const RESOURCE = 'companias';

export const getAll = (params = {}) => api.get(`${RESOURCE}/`, { params });

export const getById = (id) => api.get(`${RESOURCE}/${id}/`);

export const create = (data) => api.post(`${RESOURCE}/`, data);

export const createWithEmployees = (data) => api.post(`${RESOURCE}/con-empleados/`, data);

export const update = (id, data) => api.put(`${RESOURCE}/${id}/`, data);

export const partialUpdate = (id, data) => api.patch(`${RESOURCE}/${id}/`, data);

export const remove = (id) => api.delete(`${RESOURCE}/${id}/`);

export const getEmployees = (id) => api.get(`${RESOURCE}/${id}/empleados/`);

export const normalizeList = (response) => {
  const data = response.data;
  if (Array.isArray(data)) {
    return { items: data, total: data.length, pagina: 1, paginas: 1, tamano: data.length };
  }
  if (data.datos) {
    return {
      items: data.datos,
      total: data.total ?? data.datos.length,
      pagina: data.pagina ?? 1,
      paginas: data.paginas ?? 1,
      tamano: data.tamano ?? 10,
    };
  }
  if (data.results) {
    return {
      items: data.results,
      total: data.count ?? data.results.length,
      pagina: 1,
      paginas: 1,
      tamano: data.results.length,
    };
  }
  return { items: [], total: 0, pagina: 1, paginas: 1, tamano: 10 };
};
