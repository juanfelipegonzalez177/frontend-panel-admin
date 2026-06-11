import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import DashboardLayout from '../components/common/DashboardLayout';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Perfil from '../pages/Perfil';
import EmpleadosList from '../pages/EmpleadosList';
import EmpleadoDetail from '../pages/EmpleadoDetail';
import EmpleadoNew from '../pages/EmpleadoNew';
import EmpleadoEdit from '../pages/EmpleadoEdit';
import EmpleadoBulk from '../pages/EmpleadoBulk';
import CompaniasList from '../pages/CompaniasList';
import CompaniaDetail from '../pages/CompaniaDetail';
import CompaniaNew from '../pages/CompaniaNew';
import CompaniaEdit from '../pages/CompaniaEdit';
import CompaniaBulk from '../pages/CompaniaBulk';
import Unauthorized from '../pages/Unauthorized';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/empleados" element={<EmpleadosList />} />
          <Route path="/empleados/nuevo" element={
            <ProtectedRoute requiredPermission="canPost">
              <EmpleadoNew />
            </ProtectedRoute>
          } />
          <Route path="/empleados/masivo" element={
            <ProtectedRoute requiredPermission="canBulkPost">
              <EmpleadoBulk />
            </ProtectedRoute>
          } />
          <Route path="/empleados/:id" element={<EmpleadoDetail />} />
          <Route path="/empleados/:id/editar" element={
            <ProtectedRoute requiredPermission="canPut">
              <EmpleadoEdit />
            </ProtectedRoute>
          } />
          <Route path="/companias" element={<CompaniasList />} />
          <Route path="/companias/nueva" element={
            <ProtectedRoute requiredPermission="canPost">
              <CompaniaNew />
            </ProtectedRoute>
          } />
          <Route path="/companias/masivo" element={
            <ProtectedRoute requiredPermission="canBulkPost">
              <CompaniaBulk />
            </ProtectedRoute>
          } />
          <Route path="/companias/:id" element={<CompaniaDetail />} />
          <Route path="/companias/:id/editar" element={
            <ProtectedRoute requiredPermission="canPut">
              <CompaniaEdit />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
