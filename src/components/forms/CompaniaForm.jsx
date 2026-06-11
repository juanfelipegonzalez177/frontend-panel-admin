import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import FormInput from './FormInput';

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  direccion: z.string().min(4, 'Mínimo 4 caracteres'),
  telefono: z.string().min(5, 'Mínimo 5 caracteres'),
});

export default function CompaniaForm({ defaultValues, onSubmit, loading, submitLabel = 'Guardar' }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      nombre: '',
      direccion: '',
      telefono: '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput label="Nombre" name="nombre" register={register} error={errors.nombre} required />
        <FormInput label="Teléfono" name="telefono" register={register} error={errors.telefono} required />
        <div className="sm:col-span-2">
          <FormInput label="Dirección" name="direccion" register={register} error={errors.direccion} required />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-bogota py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {loading ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
}
