import { Toaster } from 'sonner';

export default function Toast() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        style: { fontFamily: 'Inter, system-ui, sans-serif' },
        classNames: {
          success: 'border-l-4 border-l-success',
          error: 'border-l-4 border-l-error',
          warning: 'border-l-4 border-l-warning',
        },
      }}
    />
  );
}
