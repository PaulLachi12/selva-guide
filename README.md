# SelvaGuide

Guía turística móvil de Iquitos (Loreto, Perú). Acompaña al turista en todo su viaje: al llegar, al recorrer la ciudad, al ir a la selva y al volver. Funciona en 4 idiomas y está pensada para usarse sin señal.

> **Resumen de 2 minutos:** [`docs/RESUMEN.md`](./docs/RESUMEN.md) · **Plan y épicas:** [issues](https://github.com/PaulLachi12/selva-guide/issues) · **Documentación:** [`docs/`](./docs/README.md)

## Arranque rápido

### Backend (API, puerto 9000)

```bash
cd backend
cp .env.example .env        # ajusta DB_PASSWORD y JWT_SECRET
npm install
npm run db:create && npm run db:migrate && npm run db:seed
npm start
```

### App móvil (Expo)

```bash
cd mobile
npm install
npx expo start              # emulador Android o Expo Go
```

Para probar rutas en el emulador, simula la ubicación en Iquitos: `-3.749, -73.244`. Detalle en [`docs/C-arquitectura-mobile.md`](./docs/C-arquitectura-mobile.md).

### Panel web (puerto 5173)

```bash
cd client
npm install
npm run dev
```

## Estructura

```
mobile/    App móvil (Expo SDK 57, expo-router) — producto principal
backend/   API REST (Express, Sequelize, PostgreSQL, Socket.io)
client/    Panel web (React 18, Vite, Tailwind, Leaflet)
docs/      Visión, plan, arquitectura, ADRs y estado del proyecto
```

## Stack

| Área | Tecnología |
| --- | --- |
| Mobile | TypeScript (migración gradual, [ADR-0006](./docs/adr/0006-migracion-gradual-a-typescript.md)), Expo SDK 57, React Native 0.86, expo-router, react-native-maps, i18next, expo-sqlite, expo-location |
| Rutas | OSRM público ([ADR-0001](./docs/adr/0001-rutas-con-osrm.md)) |
| API | Node.js, Express 4, Sequelize 6, PostgreSQL, JWT, bcrypt, Socket.io |
| Web | React 18, Vite, Tailwind CSS, Leaflet |

## Comandos

| Comando | Dónde | Qué hace |
| --- | --- | --- |
| `npx expo start` | `mobile/` | Levanta la app en modo desarrollo |
| `npm run typecheck` | `mobile/` | Revisa los tipos de TypeScript |
| `npm run check:i18n` | `mobile/` | Verifica que es, en, fr y pt tengan las mismas claves |
| `npm run check:bundle` | `mobile/` | Compila el bundle de Android (lo mismo que el CI) |
| `npm run db:migrate` / `db:seed` | `backend/` | Migraciones y datos demo |
| `npm start` | `backend/` | API en modo watch |
| `npm run dev` / `build` | `client/` | Panel web |

## Ramas y contribución

- `main` es la rama estable. Cada tarea se trabaja en `feature/<area>-<descripcion>` y entra por PR con `Closes #<issue>`.
- Commits en Conventional Commits (`feat(mobile): ...`, `fix(backend): ...`).
- El CI revisa tipos, traducciones, bundle de Android, sintaxis del backend y build del panel web.
- Guía completa: [`CONTRIBUTING.md`](./CONTRIBUTING.md).

## Cuentas demo (backend)

| Rol | Email | Contraseña |
| --- | --- | --- |
| Turista | turista@selva.com | turista123 |
| Guía | juan@guia.com | guia123 |
| Admin | admin@selva.com | admin123 |

Solo para desarrollo local; se crean con `npm run db:seed`.
