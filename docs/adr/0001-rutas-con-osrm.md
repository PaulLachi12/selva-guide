# ADR-0001 — Rutas con el servidor público de OSRM

**Estado:** Aceptada · **Fecha:** 2026-09

## Contexto
La app debe trazar la ruta desde el turista hasta un lugar, con distancia, duración e indicaciones paso a paso. Google Directions y Mapbox cobran por uso y piden API key.

## Decisión
Usar OSRM (`routing.openstreetmap.de`), gratuito y sin API key, con perfil de auto para mototaxi. Pedir `steps=true` para las indicaciones. Guardar las rutas calculadas en caché durante la sesión.

## Consecuencias
- Sin costo ni claves que proteger.
- El servidor público no garantiza disponibilidad ni tiene acuerdo de servicio. Si falla, la app ofrece "Abrir en Google Maps".
- Si el uso crece, montar un OSRM propio con datos de Loreto o migrar a Mapbox (issue de plan B en la épica Fase 1).
- `src/services/navegacion.js` traduce las maniobras de OSRM; cambiar de proveedor obliga a adaptar ese archivo.
