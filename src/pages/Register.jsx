import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { register as registerApi } from '../api/authService';
import FormInput from '../components/forms/FormInput';
import { parseApiError } from '../utils/parseError';

const schema = z
  .object({
    nombre: z.string().min(3, 'Mínimo 3 caracteres'),
    email: z.string().email('Correo inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
    ciudad: z.enum(['Medellín', 'Bogotá'], { required_error: 'Seleccione una ciudad' }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ciudad: '' },
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      await registerApi({
        username: data.nombre,
        email: data.email,
        password: data.password,
        ciudad: data.ciudad,
      });
      navigate('/login', { state: { message: 'Registro exitoso. Inicia sesión con tus credenciales.' } });
    } catch (error) {
      toast.error(parseApiError(error));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-8">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-slate-800">Crear cuenta</h2>
        <p className="mt-1 text-sm text-slate-500">Registra tus datos y ciudad de administración</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <FormInput label="Nombre completo" name="nombre" register={register} error={errors.nombre} required />
          <FormInput label="Correo electrónico" name="email" type="email" register={register} error={errors.email} required />
          <FormInput label="Contraseña" name="password" type="password" register={register} error={errors.password} required />
          <FormInput label="Confirmar contraseña" name="confirmPassword" type="password" register={register} error={errors.confirmPassword} required />
          <FormInput
            label="Ciudad"
            name="ciudad"
            type="select"
            register={register}
            error={errors.ciudad}
            required
            options={[
              { value: '', label: 'Seleccione...' },
              { value: 'Medellín', label: 'Medellín' },
              { value: 'Bogotá', label: 'Bogotá' },
            ]}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-medellin py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-medium text-bogota hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
