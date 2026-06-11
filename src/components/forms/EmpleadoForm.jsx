import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { getAll as getCompanias, normalizeList } from '../../api/companiaService';
import FormInput from './FormInput';

const schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  correo: z.string().email('Correo inválido'),
  cargo: z.string().min(2, 'Mínimo 2 caracteres'),
  salario: z.coerce.number().positive('Debe ser mayor a 0'),
  compania_id: z.coerce.number().int().positive('Seleccione una compañía'),
});

export default function EmpleadoForm({ defaultValues, onSubmit, loading, submitLabel = 'Guardar' }) {
  const [companias, setCompanias] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {
      nombre: '',
      apellido: '',
      correo: '',
      cargo: '',
      salario: '',
      compania_id: '',
    },
  });

  useEffect(() => {
    const loadCompanias = async () => {
      try {
        const res = await getCompanias({ pagina: 1, tamano: 100 });
        setCompanias(normalizeList(res).items);
      } catch {
        setCompanias([]);
      }
    };
    loadCompanias();
  }, []);

  const companiaOptions = [
    { value: '', label: 'Seleccione una compañía' },
    ...companias.map((compania) => ({ value: String(compania.id), label: `${compania.nombre} (#${compania.id})` })),
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormInput label="Nombre" name="nombre" register={register} error={errors.nombre} required />
        <FormInput label="Apellido" name="apellido" register={register} error={errors.apellido} required />
        <FormInput label="Correo" name="correo" type="email" register={register} error={errors.correo} required />
        <FormInput label="Cargo" name="cargo" register={register} error={errors.cargo} required />
        <FormInput label="Salario" name="salario" type="number" register={register} error={errors.salario} required />
        <FormInput
          label="Compañía"
          name="compania_id"
          type="select"
          register={register}
          error={errors.compania_id}
          options={companiaOptions}
          required
        />
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
