import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/forms/FormInput';
import { isAuthenticated } from '../utils/tokenManager';

const schema = z.object({
  username: z.string().min(1, 'Ingresa tu correo'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
    if (location.state?.message) {
      toast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [navigate, location]);

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success('Bienvenido');
      navigate('/dashboard');
    } else {
      toast.error(result.error || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-800">Iniciar sesión</h2>
        <p className="mt-1 text-sm text-slate-500">Ingresa con tu correo y contraseña</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormInput
            label="Correo"
            name="username"
            register={register}
            error={errors.username}
            placeholder="usuario@mail.com"
            required
          />
          <FormInput
            label="Contraseña"
            name="password"
            type="password"
            register={register}
            error={errors.password}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-bogota py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="font-medium text-bogota hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}
