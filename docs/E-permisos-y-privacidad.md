# E — Permisos y privacidad

## E.1 Regla general

Cada permiso se pide **solo en el momento en que se usa**, con una explicación previa. Si el usuario lo niega, la app sigue funcionando. Nunca se piden permisos al abrir la app.

La lógica vive en `mobile/src/services/permisos.ts`.

## E.2 Permisos de la app

| Permiso | Cuándo se pide | Uso | Si lo niega | Estado |
| --- | --- | --- | --- | --- |
| Ubicación "mientras se usa" | Al tocar "Cómo llegar" | Trazar la ruta | Ruta desde la Plaza de Armas, con aviso | Hecho |
| Notificaciones | Al guardar un tour o activar avisos | Recordatorios | Avisos solo dentro de la app | Pendiente |
| Cámara y galería | Al adjuntar una foto a una reseña | Subir la foto | Reseña sin foto | Pendiente |
| Ubicación en segundo plano | No se pide | — | — | Bloqueado en `app.json` |

- Si el permiso de ubicación quedó bloqueado, la app ofrece "Abrir ajustes".
- El punto azul del mapa aparece solo si el usuario ya concedió la ubicación.

## E.3 Configuración (`mobile/app.json`)

- Android declara solo `ACCESS_FINE_LOCATION`, `ACCESS_COARSE_LOCATION`, `CAMERA` y `POST_NOTIFICATIONS`.
- `ACCESS_BACKGROUND_LOCATION` está en `blockedPermissions`.
- Ubicación en segundo plano desactivada en el plugin `expo-location`.
- Textos de permisos de iOS en 4 idiomas (`mobile/locales/*.json`).

## E.4 Privacidad y aspectos legales

- **Ley N.° 29733 (Protección de Datos Personales):** política de privacidad dentro de la app (`mobile/app/privacidad.jsx`, menú → Privacidad).
- **La ubicación no se guarda** en servidores ni se usa en segundo plano.
- **Servicios externos:** OSRM recibe coordenadas de origen y destino; Open-Meteo recibe la ubicación de Iquitos.
- **Eliminar cuenta:** pendiente en el backend (documento D, Etapa 1).
- **Guías verificados:** solo con licencia DIRCETUR Loreto o registro Mincetur.
- **Áreas protegidas:** informar la entrada o el permiso SERNANP (Pacaya Samiria, Allpahuayo-Mishana).
