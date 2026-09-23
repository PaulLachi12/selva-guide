# Estado actual y brechas

Última revisión: septiembre de 2026.

## Hecho en la app móvil

| Funcionalidad | Notas |
| --- | --- |
| Mapa con puntos turísticos por categoría y búsqueda | |
| Ruta desde la ubicación del usuario (OSRM) con tarifa de mototaxi | Respaldo desde la Plaza de Armas si se niega la ubicación |
| "Cómo llegar" desde Rutas, Gastronomía y Reseñas | Abre el mapa con el destino |
| Indicaciones paso a paso y seguimiento en vivo | Recalcula si el usuario se desvía más de 50 m |
| Botón "Abrir en Google Maps" | |
| Ruta del aeropuerto al centro | |
| "Iquitos en 1 minuto" | Primera vez y desde el menú |
| "Kit del recién llegado" | Datos por verificar en campo |
| Audioguía en el idioma activo | |
| Modo oscuro estilo WhatsApp | Sistema, claro u oscuro, desde el menú |
| Traducción completa ES, EN, FR, PT | Incluye las fichas de los lugares |
| Permisos solo al usarlos | Documento E |
| Política de privacidad | Dentro de la app |
| Caché de rutas | |

## Brechas

| Brecha | Dónde se resuelve |
| --- | --- |
| Nada se probó aún en emulador ni teléfono real | Épica Fase 0 |
| Datos del kit y coordenadas nuevas sin verificar en campo | Épica Fase 1 |
| Login simulado; la app no usa el backend | Épica Login |
| Puntos turísticos fijos en el código de la app | Épica Login, Etapa 4 |
| Backend sin recuperación de contraseña, límite de intentos, refresh token ni tests | Épica Login |
| Sin contenido offline | Épica Fase 3 |
| Reservas y chat sin pantallas en la app | Épica Fase 3 |
| Unidades (min, km) sin traducir | Menor |
