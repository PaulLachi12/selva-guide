# ADR-0006 — Migración gradual a TypeScript

**Estado:** Aceptada · **Fecha:** 2026-09

## Contexto
La app móvil (unas 5 000 líneas) y el backend están en JavaScript. Errores como una propiedad mal escrita, un parámetro de ruta faltante o una respuesta del backend con otra forma solo aparecen al ejecutar la app en el teléfono. La épica Login conecta la app con el backend y necesita contratos de datos claros. El repositorio de referencia del equipo (asset-management) usa TypeScript y `typecheck` como puerta de calidad.

## Decisión
Migrar a TypeScript de forma gradual, sin detener el trabajo de las épicas:

1. `mobile/tsconfig.json` extiende `expo/tsconfig.base` con `strict: true` y `allowJs: true`: los archivos `.js`/`.jsx` siguen funcionando junto a los `.ts`/`.tsx`.
2. **Todo archivo nuevo se escribe en TypeScript.**
3. Los tipos centrales viven en `mobile/src/types/modelos.ts` (`Punto`, `Ruta`, `TarifaMototaxi`, ...).
4. Orden de migración: servicios y datos (`src/services/`, `src/data/`), contextos, componentes compartidos y, al final, pantallas. Una pantalla `.jsx` se migra cuando alguien la modifica.
5. El backend se migra dentro de la épica Login, al reescribir la autenticación (`tsx` en desarrollo, `tsc` para compilar).
6. Validación en tiempo de ejecución con **Zod** en los bordes: entrada del backend y respuestas que recibe la app.
7. `npm run typecheck` (`tsc --noEmit`) corre en el CI y debe pasar.

## Consecuencias
- Los errores de tipos se detectan en el CI y no en el teléfono.
- Hay una curva de aprendizaje para quien no conoce TypeScript; `good first issue` incluye migraciones pequeñas.
- Mientras dure la migración conviven `.js` y `.ts`; `checkJs` queda desactivado para no bloquear el trabajo.
- Primer archivo migrado: `src/services/permisos.ts`.
