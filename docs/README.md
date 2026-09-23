# Documentación — SelvaGuide

SelvaGuide es una guía turística móvil para Iquitos (Loreto, Perú). Acompaña al turista en todo su viaje: al llegar, al recorrer la ciudad, al ir a la selva y al volver. Funciona aunque no haya señal.

Este directorio reúne la visión, el plan de trabajo y las decisiones técnicas del proyecto. El trabajo pendiente está en los **issues** de GitHub; cada issue enlaza al documento que lo explica.

## Índice

| Doc | Título | Para quién |
| --- | --- | --- |
| A | [Visión y estudio de mercado](./A-vision-y-mercado.md) | Todo el equipo |
| B | [Plan de trabajo por fases](./B-plan-de-trabajo.md) | Todo el equipo |
| C | [Arquitectura y convenciones de la app móvil](./C-arquitectura-mobile.md) | Mobile |
| D | [Login profesional y backend](./D-login-y-backend.md) | Backend y mobile |
| E | [Permisos y privacidad](./E-permisos-y-privacidad.md) | Todo el equipo |
| — | [Estado actual y brechas](./estado-y-brechas.md) | Todo el equipo |

Para empezar a contribuir, lee [`CONTRIBUTING.md`](../CONTRIBUTING.md).

## Estructura del repositorio

| Carpeta | Qué contiene |
| --- | --- |
| `mobile/` | App móvil (Expo SDK 57, React Native 0.86, expo-router). Es el producto principal. |
| `backend/` | API REST (Node.js, Express, PostgreSQL, Sequelize, Socket.io). |
| `client/` | Panel web (React 18, Vite, Tailwind, Leaflet). |
| `docs/` | Esta documentación. |

## Cómo se organizan los issues

- **Épicas** (`type:epic`): agrupan el trabajo de una fase o de un tema, por ejemplo `[EPIC-LOGIN]`.
- **Tareas**: se titulan `[EPIC-X n/m] Título` y llevan etiquetas de tipo (`type:*`), área (`area:*`), fase (`fase:*`) y prioridad (`priority:*`).
- `good first issue` marca tareas acotadas para quien recién se suma.
