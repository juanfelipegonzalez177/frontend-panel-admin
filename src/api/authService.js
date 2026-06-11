import api from './axiosConfig';
import { rememberCiudadForEmail } from '../utils/tokenManager';

export const register = async (data) => {
  const response = await api.post('auth/registro/', {
    nombre: data.username,
    correo: data.email,
    password: data.password,
    rol: 'ADMIN',
  });
  rememberCiudadForEmail(data.email, data.ciudad);
  return response;
};

export const login = (data) =>
  api.post('auth/login/', {
    correo: data.username,
    password: data.password,
  });

export const getPerfil = () => api.get('auth/perfil/');
