# ADR-0004 — Modo oscuro con paleta dinámica

**Estado:** Aceptada · **Fecha:** 2026-09

## Contexto
La app necesita modo claro y oscuro. Con `StyleSheet.create` a nivel de módulo, los colores quedan fijos al cargar el archivo.

## Decisión
- `mobile/src/theme.js` define `lightColors` y `darkColors` con las mismas claves.
- `ThemeContext` elige la paleta según el ajuste del sistema o la preferencia del usuario (guardada en `expo-sqlite/kv-store`).
- Cada pantalla crea sus estilos con `const crearEstilos = (colors) => StyleSheet.create(...)` y `useThemedStyles(crearEstilos)`.
- El modo oscuro sigue el estilo de WhatsApp: fondos casi negros y verde `#00A884` solo en acentos.

## Consecuencias
- No se permiten colores sueltos en pantallas; se revisa en cada PR.
- Cambiar la marca es cambiar un solo archivo.
