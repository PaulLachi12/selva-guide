# ADR-0002 — Traducciones de interfaz y de contenido con i18next

**Estado:** Aceptada · **Fecha:** 2026-09

## Contexto
La app se usa en español, inglés, francés y portugués. Hay que traducir la interfaz y también el contenido de cada lugar (descripciones, audioguía, horarios).

## Decisión
- Un archivo por idioma: `mobile/src/i18n/locales/{es,en,fr,pt}.json`.
- Textos de interfaz agrupados por prefijo de pantalla (`mapa.*`, `detalle.*`, `menu.*`).
- Contenido de lugares en `puntos.<id>.<campo>`, leído con `usePuntoTexto()`. Si falta la traducción, se muestra el español de `puntosData.js`.
- `npm run check:i18n` (y el CI) exige las mismas claves de interfaz en los 4 idiomas.

## Consecuencias
- Agregar un idioma es agregar un archivo JSON.
- El contenido de lugares puede crecer sin romper la app, porque el español es el respaldo.
- Cuando los puntos pasen al backend (ADR-0005), las traducciones de contenido se moverán a la base de datos.
