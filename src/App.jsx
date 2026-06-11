import { AuthProvider } from './context/AuthContext';
import AppRouter from './routes/AppRouter';
import Toast from './components/common/Toast';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toast />
    </AuthProvider>
  );
}
