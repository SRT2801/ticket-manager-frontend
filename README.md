# Ticket Manager — Frontend

Interfaz web del sistema de gestion de tickets de soporte. Desarrollado con **Next.js 16**, **React 19** y **Tailwind CSS v4**.

## Stack

| Tecnologia | Version |
|---|---|
| Next.js (App Router) | 16.2 |
| React | 19.2 |
| Tailwind CSS | 4 |
| TypeScript | 5 |
| Auth | JWT (Bearer token, 24h) |

## Estructura

```
src/
├── app/               # App Router (rutas, layouts, paginas)
│   ├── (auth)/        # Login y registro
│   └── (protected)/   # Dashboard, tickets, detalle
├── components/        # Componentes React
│   ├── auth/          # AuthProvider, AuthGuard, AuthPage
│   ├── dashboard/     # KPIs, grafico, tabla, footer
│   ├── tickets/       # Listado, filtros, formulario, detalle, modal
│   └── ui/            # Sidebar, topbar, pagination, estados
├── lib/               # Tipos, cliente API, auth context, constantes
public/                # Fuentes locales (Geist Sans + Geist Mono)
```

## Instalacion

```bash
npm install
```

## Variables de entorno

Crear `.env.local`:

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `API_URL` | URL del backend | `http://localhost:3000` |

El frontend usa **rewrites** de Next.js para hacer proxy `/api/*` → `API_URL/*`, sin CORS.

## Comandos

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de produccion |
| `npm run start` | Servidor en produccion |
| `npm run lint` | Ejecutar ESLint |

## Docker

```bash
# Levantar frontend + backend + PostgreSQL
docker compose up -d --build

# Solo reconstruir frontend
docker compose build frontend --no-cache
docker compose up -d frontend
```

## Credenciales por defecto

| Email | Password | Rol |
|-------|----------|-----|
| `admin@ticket-manager.com` | `Admin123!` | Admin |

## Decisiones de arquitectura

- **`src/`**: Todo el codigo fuente bajo `src/` para separarlo de archivos de configuracion.
- **Route Groups**: `(auth)` para rutas publicas y `(protected)` para rutas autenticadas, cada una con su layout.
- **Auth con JWT + localStorage**: El token se almacena en `localStorage` y se envia en `Authorization: Bearer`. El `AuthProvider` gestiona el estado global.
- **Proxy `/api/*`**: Next.js reescribe las peticiones a `/api/*` hacia el backend, evitando CORS y `ERR_NAME_NOT_RESOLVED` en Docker.
- **Glassmorphism + Neumorphism**: Design system oscuro con `backdrop-blur`, sombras `neo-raised`/`neo-pressed` y animaciones `stagger-in`.
- **Filtros server-side**: Estado y prioridad se envian al backend como query params para paginacion correcta.
- **Fuentes locales**: Geist Sans y Geist Mono cargadas desde `public/fonts/` con `next/font/local`.
