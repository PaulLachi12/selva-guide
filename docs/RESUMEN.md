# SelvaGuide — Resumen ejecutivo

**Lectura: 2 minutos.** Detalle en [`docs/README.md`](./README.md).

## Qué es
Guía turística móvil de Iquitos que acompaña al turista desde que llega hasta que sale de la selva, en 4 idiomas y con uso sin conexión. Incluye un backend (API REST) y un panel web.

## Por qué
En Play Store Perú no hay ninguna app de turismo para Iquitos. Las apps de Promperú no tienen detalle local, Tripadvisor y Google Maps no dan contexto ni funcionan sin señal, y los horarios de lanchas circulan por redes sociales ([estudio](./A-vision-y-mercado.md)).

## Estado

| Área | Estado |
| --- | --- |
| App móvil: mapa, rutas con tarifa de mototaxi, paso a paso, bienvenida, kit del recién llegado | Hecho, sin probar en dispositivo |
| Modo oscuro y traducción completa (es, en, fr, pt) | Hecho; el CI verifica las claves |
| Permisos solo al usar, sin segundo plano, política de privacidad (Ley 29733) | Hecho |
| Login | Simulado; plan listo |
| Backend | Auth básica, guías, paquetes, reservas, chat. Faltan puntos turísticos, refresh token, recuperación de contraseña y tests |
| Offline, reservas desde la app | Pendiente |

## Plan

| Épica | Objetivo | Semanas |
| --- | --- | --- |
| [#3 Fase 0](https://github.com/PaulLachi12/selva-guide/issues/3) | Probar en dispositivo y hacer merge | 1 |
| [#6 Fase 1](https://github.com/PaulLachi12/selva-guide/issues/6) | "Acabo de llegar": verificar datos en campo | 1 |
| [#9 Login y backend](https://github.com/PaulLachi12/selva-guide/issues/9) | Auth segura, pantallas, app conectada, puntos en la API | 2–3 |
| [#20 Fase 2](https://github.com/PaulLachi12/selva-guide/issues/20) | "Recorro la ciudad": audioguías, rutas temáticas | 3 |
| [#26 Fase 3](https://github.com/PaulLachi12/selva-guide/issues/26) | "Me voy a la selva": offline, reservas, guías verificados | 4 |
| [#35 Fase 4](https://github.com/PaulLachi12/selva-guide/issues/35) | Reseñas con fotos, compartir, crecimiento | 3 |

Las fases 2 y Login pueden avanzar en paralelo. La Fase 3 depende de Login.

## Decisiones técnicas clave
- Rutas con OSRM público, sin costo ni API key ([ADR-0001](./adr/0001-rutas-con-osrm.md)).
- Traducciones de interfaz y contenido con i18next ([ADR-0002](./adr/0002-traducciones-de-contenido.md)).
- Permisos solo al usar la función ([ADR-0003](./adr/0003-permisos-solo-al-usar.md)).
- Migración gradual a TypeScript, con `typecheck` en el CI ([ADR-0006](./adr/0006-migracion-gradual-a-typescript.md)).
- Puntos turísticos al backend con caché local (propuesta, [ADR-0005](./adr/0005-puntos-en-backend-con-cache.md)).

## Riesgos principales
- El OSRM público no garantiza disponibilidad: hay caché y respaldo con Google Maps.
- Datos de lugares por verificar en campo (marcados `verificar: true`).
- Nada probado aún en dispositivo real: es la primera tarea de la Fase 0.

## Decisiones que necesitan su opinión
1. Correo para recuperar contraseña: Mailtrap o cuenta del equipo.
2. Registro de guías: app móvil o solo panel web.
3. Servidor de pruebas: local o Render/Railway.
