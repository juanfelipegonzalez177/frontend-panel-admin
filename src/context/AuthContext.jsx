/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useState } from 'react';
import { login as loginApi } from '../api/authService';
import { saveAuth, clearAuth, getUserInfo, getUserCiudad, getCiudadForEmail, isAuthenticated } from '../utils/tokenManager';
import { getPermissions, normalizeCiudad } from '../utils/permissions';
import { parseApiError } from '../utils/parseError';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserInfo());
  const [ciudad, setCiudad] = useState(getUserCiudad());
  const [loading, setLoading] = useState(false);
  const initialized = true;

  const permissions = getPermissions(ciudad);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
    setCiudad(null);
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await loginApi(credentials);
      const fallbackCiudad = getCiudadForEmail(data.usuario?.correo || credentials.username);
      saveAuth(data, fallbackCiudad);
      const userWithCiudad = fallbackCiudad ? { ...data.usuario, ciudad: data.usuario?.ciudad || fallbackCiudad } : data.usuario;
      setUser(userWithCiudad);
      setCiudad(userWithCiudad?.ciudad || null);
      return { success: true };
    } catch (error) {
      return { success: false, error: parseApiError(error) };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    ciudad,
    ciudadKey: normalizeCiudad(ciudad),
    permissions,
    loading,
    initialized,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
