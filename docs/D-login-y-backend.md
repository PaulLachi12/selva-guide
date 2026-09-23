# D — Login profesional y backend

## D.1 Estado actual

### Backend (`backend/`)
- `POST /auth/registro` y `POST /auth/login` funcionan: contraseña con `bcrypt` y token JWT de 7 días.
- `GET` y `PUT /auth/perfil`, con subida de foto.
- Roles `turista`, `guia` y `admin`, con `rolesMiddleware`.
- Endpoints de guías, paquetes, reservas, tracking, valoraciones, mensajes (Socket.io) y admin.
- 7 migraciones Sequelize y seeders.

### Brechas del backend
- No hay endpoints de **puntos turísticos** ni de **reseñas de lugares**: la app los tiene fijos en `mobile/src/data/puntosData.js`.
- No se puede **recuperar la contraseña**.
- `express-validator` está instalado pero no se usa.
- No hay **límite de intentos** de login.
- La sesión no se renueva: al vencer el token, el usuario queda fuera sin aviso.
- No se puede **eliminar la cuenta** (lo exige la Ley N.° 29733).
- No hay tests.

### App móvil
- El login es **simulado**: Apple y Google crean un perfil falso local.
- `mobile/src/services/api.js` está en `MODO_LOCAL = true` y no llama al backend.

## D.2 Etapa 1 — Backend de autenticación seguro (3–4 días)

- Validar registro y login con `express-validator` (correo válido; contraseña de 8 o más caracteres con letras y números).
- Límite de intentos: 5 por minuto por IP y correo (`express-rate-limit`).
- Token de acceso de 15 minutos y **refresh token** de 30 días, guardado en base de datos para poder revocarlo.
  - `POST /auth/refresh`
  - `POST /auth/logout`
- Recuperar contraseña con código de 6 dígitos por correo, válido 15 minutos.
  - `POST /auth/olvide`
  - `POST /auth/restablecer`
- `DELETE /auth/cuenta` borra la cuenta y sus datos.
- Migración: tabla `sesiones` y campos `idioma` y `pais` en `usuarios`.
- Errores con código (`EMAIL_EN_USO`, `CREDENCIALES_INVALIDAS`, `TOKEN_EXPIRADO`) para que la app los traduzca.

## D.3 Etapa 2 — Pantallas de login profesionales (4–5 días)

Diseño con la línea de la app: verde selva en modo claro, estilo WhatsApp en oscuro.

- **Entrada a la cuenta**: imagen de Iquitos, logo, "Crear cuenta", "Iniciar sesión" y "Continuar como invitado".
- **Iniciar sesión**: campos con ícono, mostrar u ocultar contraseña, error bajo cada campo, botón con estado de carga y enlace "¿Olvidaste tu contraseña?".
- **Crear cuenta**: nombre, correo, contraseña con barra de seguridad, confirmación, casilla de aceptación de la política de privacidad y selector "Soy turista / Soy guía".
- **Recuperar contraseña**: correo, código de 6 dígitos en casillas separadas y nueva contraseña.
- **Perfil**: foto, nombre, idioma, cerrar sesión y eliminar cuenta con doble confirmación.
- Reglas:
  - El teclado no tapa los campos.
  - Todo en 4 idiomas y accesible con lector de pantalla.
  - El login se abre desde el menú o cuando una acción lo requiere (por ejemplo, reservar). Nunca bloquea el mapa ni la guía.
  - Los botones Apple y Google quedan ocultos hasta tener credenciales reales.

## D.4 Etapa 3 — Conectar la app con el backend (2–3 días)

- `MODO_LOCAL` configurable y `EXPO_PUBLIC_API_URL` apuntando al backend (IP de la PC en la red local o servidor de pruebas).
- `AuthContext` usa login, registro y perfil reales. Los tokens se guardan en `expo-secure-store`.
- Interceptor de axios: ante un 401 renueva el token y reintenta el pedido.
- Sin conexión, la app sigue como invitado y la guía funciona igual.
- Se elimina "Activar modo admin (demo)"; el rol admin viene del backend.

### Panel web
- El panel web (`client/`) también usa el login. Debe adaptarse al refresh token y al logout en la misma etapa, o dejará de mantener la sesión.

### Más adelante
- Login real con Google y Apple cuando existan credenciales (`POST /auth/social`).

## D.5 Etapa 4 — Puntos y reseñas en el backend (3–4 días)

- Modelo y migración `puntos` con los campos de `puntosData.js` y traducciones en una columna JSON.
- Modelo `resenas_punto`, ligado a un usuario.
- Endpoints:
  - `GET /puntos`, `GET /puntos/:id` (público)
  - `POST`, `PATCH`, `DELETE /puntos` (solo admin)
  - `POST /puntos/:id/resenas` (con sesión)
- Seeder con los puntos actuales de la app.
- La app descarga los puntos y los guarda en SQLite para usarlos sin conexión.
- El modo admin de la app guarda en el backend.

## D.6 Etapa 5 — Calidad (2 días, en paralelo)

- Tests con Jest y Supertest: registro, login, refresh, recuperación, roles y puntos.
- Colección de Postman o Bruno con todos los endpoints.
- `docker-compose.yml` con PostgreSQL y el backend.
- README del backend actualizado.

## D.7 Orden

| Etapa | Días | Puede ir en paralelo con |
| --- | --- | --- |
| 1. Backend de auth | 3–4 | 2 |
| 2. Pantallas de login | 4–5 | 1 |
| 3. Conectar la app | 2–3 | — (necesita 1 y 2) |
| 4. Puntos y reseñas | 3–4 | 5 |
| 5. Calidad | 2 | 4 |

## D.8 Decisiones pendientes

1. Correo de recuperación: Mailtrap (solo pruebas) o una cuenta Gmail del equipo.
2. Registro de guías: desde la app móvil o solo desde el panel web.
3. Servidor de pruebas: solo local o un servicio gratuito (Render, Railway).
