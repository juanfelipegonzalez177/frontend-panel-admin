import { Navigate } from 'react-router-dom';
import { getPermissions } from '../utils/permissions';
import { getAccessToken, getUserCiudad } from '../utils/tokenManager';

export default function ProtectedRoute({ children, requiredPermission }) {
  const token = getAccessToken();
  const ciudad = getUserCiudad();
  const perms = getPermissions(ciudad);

  if (!token) return <Navigate to="/login" replace />;

  if (requiredPermission && !perms[requiredPermission]) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
