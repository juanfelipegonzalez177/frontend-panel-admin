# Panel Admin — Frontend

Frontend en React + Vite + Tailwind CSS para gestión de empleados con permisos por ciudad (Medellín / Bogotá).

## Requisitos

- Node.js 18+
- API Django corriendo en `http://localhost:8000`

## Instalación

```bash
cd C:\ADSO-3278641-4T\frontend-admin-ciudades
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre `http://localhost:5173`

## Build

```bash
npm run build
```

## Permisos por ciudad

| Acción | Medellín | Bogotá |
|--------|----------|--------|
| GET / POST / Bulk | ✅ | ✅ |
| PUT / PATCH | ❌ | ✅ |
| DELETE | ✅ | ❌ |

## Endpoints esperados

- `POST /api/auth/register/`
- `POST /api/auth/login/`
- `POST /api/auth/token/refresh/`
- CRUD en `/api/empleados/`

## Stack

- React 18 + Vite
- Tailwind CSS 4
- React Router v6
- Axios + JWT interceptors
- React Hook Form + Zod
- Sonner (toasts)
- Lucide React (iconos)
