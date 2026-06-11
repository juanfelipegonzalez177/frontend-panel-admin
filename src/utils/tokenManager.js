const KEYS = {
  ACCESS: 'access_token',
  REFRESH: 'refresh_token',
  CIUDAD: 'user_ciudad',
  USER: 'user_info',
  CITY_BY_EMAIL: 'city_by_email',
};

const normalizeEmail = (email) => (email || '').trim().toLowerCase();

const getCityMap = () => {
  const raw = localStorage.getItem(KEYS.CITY_BY_EMAIL);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
};

export const rememberCiudadForEmail = (email, ciudad) => {
  const key = normalizeEmail(email);
  if (!key || !ciudad) return;
  const map = getCityMap();
  map[key] = ciudad;
  localStorage.setItem(KEYS.CITY_BY_EMAIL, JSON.stringify(map));
};

export const getCiudadForEmail = (email) => getCityMap()[normalizeEmail(email)] || null;

export const saveAuth = ({ access, refresh, usuario }, fallbackCiudad) => {
  const ciudad = usuario?.ciudad || fallbackCiudad || getCiudadForEmail(usuario?.correo);
  const userWithCiudad = ciudad ? { ...usuario, ciudad } : usuario;

  if (access) localStorage.setItem(KEYS.ACCESS, access);
  if (refresh) localStorage.setItem(KEYS.REFRESH, refresh);
  if (ciudad) {
    localStorage.setItem(KEYS.CIUDAD, ciudad);
    rememberCiudadForEmail(usuario?.correo, ciudad);
  }
  if (userWithCiudad) localStorage.setItem(KEYS.USER, JSON.stringify(userWithCiudad));
};

export const getAccessToken = () => localStorage.getItem(KEYS.ACCESS);
export const getRefreshToken = () => localStorage.getItem(KEYS.REFRESH);
export const getUserCiudad = () => localStorage.getItem(KEYS.CIUDAD);

export const getUserInfo = () => {
  const raw = localStorage.getItem(KEYS.USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const isAuthenticated = () => !!getAccessToken();

export const clearAuth = () => {
  localStorage.removeItem(KEYS.ACCESS);
  localStorage.removeItem(KEYS.REFRESH);
  localStorage.removeItem(KEYS.CIUDAD);
  localStorage.removeItem(KEYS.USER);
};

export const updateAccessToken = (token) => {
  localStorage.setItem(KEYS.ACCESS, token);
};
