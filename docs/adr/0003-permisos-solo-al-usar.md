# ADR-0003 — Permisos solo al usar la función

**Estado:** Aceptada · **Fecha:** 2026-09

## Contexto
Pedir permisos al abrir la app genera rechazo y desinstalaciones. La ubicación en segundo plano es revisada con rigor por Google y Apple, gasta batería y no es necesaria para una guía turística.

## Decisión
- Cada permiso se pide en el momento en que se usa, con una explicación previa (`mobile/src/services/permisos.js`).
- Si el usuario lo niega, la función tiene un respaldo: por ejemplo, la ruta sale desde la Plaza de Armas.
- Nunca se pide ubicación en segundo plano: `ACCESS_BACKGROUND_LOCATION` está en `blockedPermissions` de `app.json`.

## Consecuencias
- Mejor confianza del usuario y cumplimiento de la Ley N.° 29733.
- Los avisos "estás cerca de…" solo funcionan con la app abierta.
- Todo permiso nuevo debe agregarse a `permisos.js` y a `docs/E-permisos-y-privacidad.md`.
