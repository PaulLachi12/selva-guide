# B — Plan de trabajo por fases

Cada fase sigue un momento del viaje del turista (documento A, sección A.4). Las semanas son una estimación para una persona a medio tiempo; con más personas, varias fases avanzan en paralelo.

| Fase | Nombre | Duración | Estado |
| --- | --- | --- | --- |
| 0 | Base sólida | 1 semana | Hecha en código, falta probar en dispositivo |
| 1 | "Acabo de llegar" | 2 semanas | Hecha en código, falta probar en dispositivo |
| Login | Login profesional y backend conectado | 2–3 semanas | Pendiente (documento D) |
| 2 | "Recorro la ciudad" | 3 semanas | Pendiente |
| 3 | "Me voy a la selva" | 4 semanas | Pendiente, depende de Login |
| 4 | "Me voy" y crecimiento | 3 semanas | Pendiente |

## Fase 0 — Base sólida

**Por qué va primero:** no conviene agregar funciones sobre una base sin probar.

- Hecho: permisos pedidos solo al usarlos, con explicación previa y respaldo si se niegan (documento E).
- Hecho: pantalla de política de privacidad dentro de la app.
- Hecho: caché de rutas calculadas.
- Hecho: modo oscuro (estilo WhatsApp) y traducción completa a ES, EN, FR y PT.
- Pendiente: probar todo en el emulador de Android Studio y en un teléfono real.

**Listo cuando:** la app funciona sin errores en un teléfono real, aunque el usuario niegue todos los permisos.

## Fase 1 — "Acabo de llegar"

**Por qué:** los primeros minutos en Iquitos son los de más dudas.

- Hecho: pantalla "Iquitos en 1 minuto" (clima, moneda, cómo moverse, qué evitar, emergencias). Se abre la primera vez y desde el menú.
- Hecho: ruta del aeropuerto al centro con tarifa de mototaxi.
- Hecho: "Kit del recién llegado": bancos, salud, chips y cambio de moneda en el mapa. **Los datos deben verificarse en campo** (`verificar: true`).
- Hecho: indicaciones paso a paso, seguimiento en vivo con recálculo y botón "Abrir en Google Maps".
- Pendiente: probar en dispositivo y verificar datos en campo.

**Listo cuando:** el turista sale del aeropuerto sabiendo qué hacer y cuánto pagar.

## Fase Login — Login profesional y backend conectado

Detalle completo en el documento D.

**Por qué:** la Fase 3 (reservas, chat) necesita cuentas reales y los puntos turísticos en el backend.

- Endurecer la autenticación del backend.
- Pantallas de login, registro, recuperación y perfil.
- Conectar la app con el backend.
- Puntos turísticos y reseñas en el backend.
- Tests, Docker y documentación del backend.

## Fase 2 — "Recorro la ciudad"

**Por qué:** el turista pasa por los lugares sin entender lo que ve. El contexto local nos diferencia de Google Maps.

- Más audioguías: al menos 10 lugares históricos, en 4 idiomas.
- Rutas temáticas a pie ("Centro histórico en 2 horas", "Ruta del juane y tacacho").
- "Qué comer y dónde", con filtro "abierto ahora".
- Frases útiles con audio.
- Agrupar marcadores en el mapa.

**Listo cuando:** el turista recorre la ciudad solo, entendiendo la historia de cada lugar.

## Fase 3 — "Me voy a la selva"

**Por qué:** es la mayor diferencia frente a las demás apps: offline y guías verificados.

- Mapas y guía offline (paquete descargable de Iquitos).
- Favoritos y última ruta sin conexión.
- Reserva de guía o paquete, y chat con el guía.
- Insignia de guía verificado DIRCETUR.
- Checklist según la excursión (Mochila).
- Horarios de lanchas y del ferry CONFLUAM.
- Fichas de fauna y flora (alianza IIAP).

**Listo cuando:** el turista entra a la selva con todo resuelto y con su guía en el teléfono.

## Fase 4 — "Me voy" y crecimiento

- Reseñas con fotos.
- "Mi viaje": resumen de lugares visitados.
- Compartir un lugar por WhatsApp con enlace directo.
- Aviso "estás cerca de…" (solo con la app abierta).
- Postular a "Y tú qué planes" de Promperú.

## Métricas

| Métrica | Qué indica |
| --- | --- |
| Rutas calculadas por día | Uso de la función principal |
| Turistas que ven la bienvenida | Alcance de la Fase 1 |
| Paquetes offline descargados | Valor de la Fase 3 |
| Reservas con guías | Si el modelo funciona |
| Búsquedas sin resultado | Lugares que faltan |
| % que niega la ubicación | Claridad de la pantalla de permisos |

## Riesgos

| Riesgo | Mitigación |
| --- | --- |
| El servidor público de OSRM se cae o limita pedidos | Caché de rutas; servidor OSRM propio o Mapbox si crece el uso |
| Horarios de lanchas desactualizados | Mostrar fecha de actualización y un responsable |
| Pocos guías con licencia al inicio | Contacto directo con guías y agencias |
| Coordenadas o datos imprecisos | Verificación en campo y reporte de errores por usuarios |
