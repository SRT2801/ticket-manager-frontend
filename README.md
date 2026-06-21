# Ticket Manager — Frontend

Interfaz web del sistema de gestion de tickets de soporte para la prueba tecnica **Next.js + NestJS + PostgreSQL**. Desarrollado con **Next.js 16**, **React 19** y **Tailwind CSS v4**.

## Stack

| Tecnologia | Version |
|---|---|
| Next.js (App Router) | 16.2 |
| React | 19.2 |
| Tailwind CSS | 4 |
| TypeScript | 5 |
| Zod | 4 |
| Lucide React | 1 |
| ESLint | 9 |

## Requerimientos funcionales cubiertos

| Requerimiento | Estado |
|---|---|
| Login y registro con manejo de sesion/token | ✅ |
| Listado de tickets con filtros por estado y paginacion | ✅ + prioridad |
| Formulario de creacion de ticket con validaciones | ✅ zod |
| Vista detalle de ticket con cambio de estado | ✅ + edicion completa |
| Dashboard con estadisticas basicas | ✅ KPIs + grafico de barras + tabla |
| Boton Exportar a Excel en listado y dashboard | ✅ respeta filtros activos |
| Manejo de estados: carga, vacio, error, sin resultados | ✅ |

## Extras implementados

| Extra | Estado |
|---|---|
| Docker Compose para levantar el entorno completo | ✅ |
| Roles y permisos (admin/user) | ✅ |
| Segunda hoja en Excel con resumen estadistico | ✅ |
| Exportar detalle de ticket individual | ✅ |
| Edicion completa de tickets (titulo, descripcion, prioridad) | ✅ |
| Filtro por prioridad en listado | ✅ |

## Estructura del proyecto

```
src/
├── app/               # App Router (rutas, layouts, paginas)
│   ├── (auth)/        # Login y registro (pagina unica con toggle)
│   └── (protected)/   # Dashboard, tickets, detalle, creacion
├── components/
│   ├── auth/          # AuthProvider, AuthGuard, AuthPage
│   ├── dashboard/     # KpiCard, TicketTable, TrendChart, FooterCards
│   ├── tickets/       # TicketList, TicketRow, TicketForm, FilterBar,
│   │                  # TicketDetailClient, EditTicketModal, ExportButton
│   └── ui/            # Sidebar, Topbar, Pagination, Loading, Error, Empty
├── lib/
│   ├── api.ts         # Cliente HTTP con JWT + manejo de blobs
│   ├── auth.tsx       # Contexto de autenticacion (AuthProvider, useAuth)
│   ├── types.ts       # Tipos compartidos (Ticket, User, DTOs)
│   └── constants.ts   # API URL, traducciones de enums
public/
└── fonts/             # Geist Sans + Geist Mono (woff2/ttf, locales)
```

## Instalacion

### Requisitos previos

- Node.js 18+
- Backend NestJS corriendo (ver `ticket-manager-backend`)
- PostgreSQL 14+

### Frontend

```bash
npm install
```

### Levantar todo con Docker (recomendado)

```bash
docker compose up -d --build
```

Esto levanta PostgreSQL, backend en `:3000` y frontend en `:3001`.

### Levantar solo el frontend (desarrollo local)

```bash
npm run dev
```

El frontend usa **rewrites** de Next.js para hacer proxy `/api/*` → backend.

## Variables de entorno

Crear `.env.local` con:

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `API_URL` | URL del backend | `http://localhost:3000` |

Archivo de referencia: [`env.example`](./env.example)

## Comandos

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (hot reload) |
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

# Detener solo frontend
docker compose stop frontend
```

## Credenciales por defecto

| Email | Password | Rol |
|-------|----------|-----|
| `admin@ticket-manager.com` | `Admin123!` | Admin |

## Despliegue

- **Frontend (Vercel):** [ticket-manager-frontend-ten.vercel.app](https://ticket-manager-frontend-ten.vercel.app/login)
- **Backend (Railway):** `ticket-manager-backend-production.up.railway.app`
- **Swagger:** [ticket-manager-backend-production.up.railway.app/api](https://ticket-manager-backend-production.up.railway.app/api)

## Decisiones de arquitectura

- **`src/`**: Todo el codigo fuente bajo `src/` separado de archivos de configuracion.
- **Route Groups**: `(auth)` para rutas publicas y `(protected)` para rutas autenticadas, cada una con su propio layout.
- **Auth con JWT + localStorage**: El token se almacena en `localStorage` y se envia en `Authorization: Bearer`. El `AuthProvider` gestiona el estado global.
- **Proxy `/api/*`**: Next.js reescribe peticiones a `/api/*` hacia `API_URL`, evitando CORS en desarrollo y `ERR_NAME_NOT_RESOLVED` en Docker.
- **Glassmorphism + Neumorphism**: Design system oscuro con `backdrop-blur`, sombras `neo-raised`/`neo-pressed`, animaciones `stagger-in` y variables CSS del tema `Obsidian Support Systems`.
- **Filtros server-side**: Estado y prioridad se envian al backend como query params para paginacion correcta. Solo el periodo se filtra del lado cliente.
- **Fuentes locales**: Geist Sans y Geist Mono cargadas desde `public/fonts/` con `next/font/local`, sin dependencia de Google Fonts CDN.
- **Validacion con Zod**: Formularios de login, registro, creacion y edicion de tickets validados con schemas de Zod.
- **Next.js `standalone`**: El build de produccion usa `output: "standalone"` para imagenes Docker mas ligeras.
