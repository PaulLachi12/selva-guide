# ADR-0005 — Puntos turísticos en el backend con caché local

**Estado:** Propuesta · **Fecha:** 2026-09

## Contexto
Hoy los lugares viven fijos en `mobile/src/data/puntosData.js`. Actualizar un horario obliga a publicar otra versión de la app, y el modo admin solo cambia datos en memoria.

## Decisión propuesta
- Tabla `puntos` y `resenas_punto` en el backend, con traducciones en una columna JSON.
- La app descarga los puntos, los guarda en SQLite y los usa sin conexión.
- `puntosData.js` queda como datos de respaldo para el primer arranque sin red.

## Consecuencias
- El admin corrige datos sin publicar una versión nueva.
- La app necesita lógica de sincronización simple (última fecha de actualización).
- Se implementa en la épica Login y backend.
