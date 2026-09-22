# 🌿 SelvaGuide

Plataforma web estilo **Uber de guías turísticos** para la Amazonía peruana. Conecta a turistas con guías locales certificados de Iquitos para tours de avistamiento, aventura, cultura y naturaleza.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS + Leaflet (mapas) |
| Backend | Node.js + Express + Socket.io |
| Base de datos | PostgreSQL 17 + Sequelize ORM |
| Tiempo real | Socket.io (tracking en vivo y chat) |

## Requisitos

- Node.js ≥ 18
- PostgreSQL ≥ 13 corriendo en `127.0.0.1:5432`
- Cambiar `DB_PASSWORD` en `backend/.env` por tu contraseña local

## Inicio rápido

```bash
# 1. Configurar backend
cd backend
cp .env.example .env        # ajustar DB_PASSWORD
npm install

# 2. Crear BD + tablas + datos demo
npm run db:create
npm run db:migrate
npm run db:seed

# 3. Arrancar API (puerto 9000)
npm start

# 4. Frontend (otra terminal)
cd ../client
npm install
npm run dev                 # http://localhost:5173
```

## Cuentas demo

| Rol | Email | Contraseña |
|---|---|---|
| Turista | turista@selva.com | turista123 |
| Guía | juan@guia.com | guia123 |
| Guía | mari@guia.com | guia123 |
| Admin | admin@selva.com | admin123 |

## Funcionalidades

### Turista
- Registro y autenticación (JWT)
- Explorar tours y guías en un mapa interactivo (Leaflet)
- Ver perfil de guía con rating y valoraciones
- Reservar tours (fecha, hora, personas, punto de partida con geolocalización)
- Cancelar reservas pendientes
- Tracking en vivo del guía durante el tour (Socket.io + mapa)
- Valorar tours completados
- Chat con el guía (Socket.io)

### Guía
- Perfil con bio, especialidad, idiomas, tarifa por hora y ubicación
- Crear/editar paquetes (tours)
- Activar/pausar disponibilidad
- Aceptar o rechazar reservas, iniciar y completar tours
- Enviar ubicación en tiempo real
- Chat con el turista

### Admin
- Dashboard con estadísticas (usuarios, guías, reservas, ingresos)
- Verificar guías
- Listar todos los usuarios

## Estructura

```
SelvaGuide/
├── backend/
│   ├── migrations/            # 7 tablas (usuarios, guias, paquetes, reservas, tracking, valoraciones, mensajes)
│   ├── seeders/               # datos demo
│   ├── src/
│   │   ├── infrastructure/    # config BD + modelos Sequelize
│   │   ├── interfaces/        # controllers, routers, middleware, socket
│   │   └── domain/            # repositorios
│   └── app.js                 # servidor Express + Socket.io
├── client/
│   └── src/
│       ├── pages/             # 14 páginas (Login, Home/Mapa, Booking, Dashboard Guía, Chat, Admin…)
│       ├── components/        # Navbar, MapComponent, TourCard
│       ├── context/           # AuthContext (JWT)
│       ├── hooks/             # useSocket
│       └── services/          # api (axios con proxy)
└── README.md
```

## API (resumen)

| Método | Ruta | Acceso |
|---|---|---|
| POST | `/api/v1/auth/registro` | público |
| POST | `/api/v1/auth/login` | público |
| GET | `/api/v1/guias` | público |
| GET | `/api/v1/guias/:id` | público |
| GET/POST | `/api/v1/paquetes` | público / guía |
| POST | `/api/v1/reservas` | turista |
| GET | `/api/v1/reservas/mias` | turista |
| GET | `/api/v1/reservas/guia` | guía |
| PUT | `/api/v1/reservas/:id/estado` | guía/turista |
| POST/GET | `/api/v1/tracking` | guía/turista |
| POST | `/api/v1/valoraciones` | turista |
| POST/GET | `/api/v1/mensajes` | autenticado |
| GET | `/api/v1/admin/stats` | admin |

## Estado

**Funcional completo** — backend + frontend + tracking en vivo + chat probados de extremo a extremo.