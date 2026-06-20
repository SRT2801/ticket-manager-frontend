# Ticket Manager

Sistema de gestion de tickets de soporte con reporteria en Excel. Desarrollado con **Next.js 16**, **NestJS**, **PostgreSQL** y **TypeORM**.

## Stack

| Capa | Tecnologia |
|------|-----------|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript |
| Backend | NestJS 11, TypeORM, PostgreSQL, ExcelJS |
| Auth | JWT (Bearer token, 24h expiracion) |

## Estructura del proyecto

```
ticket-manager-frontend/   ← este repositorio
├── src/
│   ├── app/               # App Router (rutas, layouts, paginas)
│   ├── components/        # Componentes React reutilizables
│   └── lib/               # Tipos, cliente API, auth context, constantes
├── public/                # Archivos estaticos (fuentes)
└── ...config files

ticket-manager-backend/    ← repositorio del backend (NestJS)
├── src/
│   ├── modules/
│   │   ├── auth/          # Autenticacion JWT
│   │   ├── users/         # Gestion de usuarios
│   │   ├── tickets/       # CRUD de tickets
│   │   └── reports/       # Exportacion a Excel
│   ├── common/            # Guards, decorators, filtros, interceptores
│   ├── config/            # Configuracion (JWT, DB, App)
│   └── database/          # Migraciones, seeds, config de TypeORM
```

## Requisitos previos

- Node.js 18+
- PostgreSQL 14+
- npm 9+

## Instalacion

### 1. Base de datos

```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE ticket_manager;"
```

### 2. Backend

```bash
cd ticket-manager-backend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de PostgreSQL

# Ejecutar migraciones
npm run migration:run

# Iniciar servidor (puerto 3000)
npm run start:dev
```

### 3. Frontend

```bash
cd ticket-manager-frontend

# Instalar dependencias
npm install

# Crear archivo .env.local (opcional)
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# Iniciar servidor de desarrollo (puerto 3001 por defecto)
npm run dev
```

## Variables de entorno

### Backend (.env)

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `DATABASE_HOST` | Host de PostgreSQL | `localhost` |
| `DATABASE_PORT` | Puerto de PostgreSQL | `5432` |
| `DATABASE_USER` | Usuario de PostgreSQL | `postgres` |
| `DATABASE_PASSWORD` | Contrasena de PostgreSQL | `postgres` |
| `DATABASE_NAME` | Nombre de la base de datos | `ticket_manager` |
| `JWT_SECRET` | Secreto para firmar JWT | `default-secret-change-me` |
| `JWT_EXPIRATION` | Expiracion del token | `24h` |
| `PORT` | Puerto del servidor | `3000` |
| `ADMIN_EMAIL` | Email del admin seed | `admin@ticket-manager.com` |
| `ADMIN_PASSWORD` | Password del admin seed | `Admin123!` |

### Frontend (.env.local)

| Variable | Descripcion | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL base del backend | `http://localhost:3000` |

## Comandos

| Proyecto | Comando | Descripcion |
|----------|---------|-------------|
| Backend | `npm run start:dev` | Servidor de desarrollo |
| Backend | `npm run build` | Compilar TypeScript |
| Backend | `npm run start:prod` | Servidor en produccion |
| Backend | `npm run migration:run` | Ejecutar migraciones |
| Frontend | `npm run dev` | Servidor de desarrollo |
| Frontend | `npm run build` | Build de produccion |
| Frontend | `npm run start` | Servidor en produccion |
| Frontend | `npm run lint` | Ejecutar ESLint |

## Credenciales por defecto

| Email | Password | Rol |
|-------|----------|-----|
| `admin@ticket-manager.com` | `Admin123!` | Admin |

## API Endpoints

### Auth
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/login` | Iniciar sesion |
| POST | `/auth/register/admin` | Registrar admin (requiere rol admin) |

### Tickets
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/tickets` | Listar tickets (query: `status`, `priority`, `page`, `limit`) |
| POST | `/tickets` | Crear ticket |
| GET | `/tickets/stats` | Estadisticas del usuario |
| GET | `/tickets/:id` | Detalle de ticket |
| PATCH | `/tickets/:id` | Editar ticket (titulo, descripcion, prioridad) |
| PATCH | `/tickets/:id/status` | Cambiar estado de ticket |

### Reports
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/reports/tickets/export` | Exportar listado a Excel (query: `status`, `priority`, `startDate`, `endDate`) |
| GET | `/reports/tickets/:id/export` | Exportar detalle individual a Excel |

### Users
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/users/profile` | Perfil del usuario autenticado |
| PATCH | `/users/profile` | Actualizar perfil |

Swagger disponible en `http://localhost:3000/api`.

## Decisiones de arquitectura

- **Frontend en `src/`**: Toda la logica de la aplicacion se organiza bajo `src/` para separar el codigo fuente de los archivos de configuracion.
- **Route Groups**: `(auth)` para rutas publicas (login/register) y `(protected)` para rutas que requieren autenticacion, cada una con su propio layout.
- **Auth con JWT + localStorage**: El token JWT se almacena en `localStorage` y se envia en el header `Authorization: Bearer <token>`. El `AuthProvider` gestiona el estado global de autenticacion.
- **Glassmorphism + Neumorphism**: La interfaz usa un design system oscuro con efectos de vidrio (`backdrop-blur`) y sombras neomorficas para profundidad.
- **Filtros server-side**: Los filtros de estado y prioridad se envian como query params al backend, que los aplica en la consulta SQL. Esto garantiza paginacion correcta.
- **Exportacion Excel con ExcelJS**: El backend genera archivos `.xlsx` con formato profesional (encabezados en negrita, columnas ajustadas, segunda hoja con estadisticas).
- **Roles y permisos**: Los usuarios `admin` ven todos los tickets; los usuarios `user` solo ven los propios. El `RolesGuard` protege los endpoints exclusivos de admin.
