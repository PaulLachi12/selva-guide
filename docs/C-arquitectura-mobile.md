# C — Arquitectura y convenciones de la app móvil

## C.1 Stack

| Pieza | Tecnología |
| --- | --- |
| Framework | Expo SDK 57, React Native 0.86, React 19 |
| Navegación | expo-router (tabs + stack) |
| Mapa | react-native-maps |
| Rutas | OSRM público (`routing.openstreetmap.de`), sin API key |
| Clima | Open-Meteo, sin API key |
| Ubicación | expo-location (solo "mientras se usa") |
| Idiomas | i18next + react-i18next |
| Datos locales | expo-sqlite (incluye `expo-sqlite/kv-store`) |
| Sesión | expo-secure-store |
| Voz | expo-speech (audioguía) |
| Lenguaje | JavaScript migrando a TypeScript ([ADR-0006](./adr/0006-migracion-gradual-a-typescript.md)) |

## C.2 Estructura

```
mobile/
├─ app/                     # Rutas (expo-router)
│  ├─ _layout.jsx           # Providers: i18n, Auth, Theme, SQLite; redirección a bienvenida
│  ├─ (tabs)/               # Mapa, Gastronomía, Rutas, Reseñas, Mochila, Ayuda
│  ├─ bienvenida.jsx        # "Iquitos en 1 minuto"
│  ├─ privacidad.jsx        # Política de privacidad
│  └─ admin/                # Alta de puntos (modo admin)
├─ src/
│  ├─ components/           # DetallePuntoModal, DrawerMenuModal, LoginModal, ...
│  ├─ context/              # AuthContext, ThemeContext
│  ├─ data/puntosData.js    # Puntos turísticos y tarifa de mototaxi (temporal, ver doc D)
│  ├─ i18n/                 # index.js, locales.js, contenido.js, locales/{es,en,fr,pt}.json
│  ├─ services/             # api.js, permisos.ts, navegacion.js
│  ├─ types/                # modelos.ts: tipos centrales (Punto, Ruta, ...)
│  └─ theme.js              # Paletas clara y oscura, espacios, radios
└─ locales/                 # Textos de permisos de iOS por idioma
```

## C.3 Convenciones obligatorias

### TypeScript
- Todo archivo nuevo se escribe en `.ts` o `.tsx`, con los tipos de `src/types/modelos.ts`.
- Si modificas una pantalla `.jsx`, conviene migrarla a `.tsx` en el mismo PR.
- `npm run typecheck` debe pasar (el CI lo revisa).

### Colores y modo oscuro
- Nunca uses colores sueltos. Usa la paleta de `src/theme.js`.
- Crea los estilos con la paleta activa:

```jsx
const crearEstilos = (colors) => StyleSheet.create({
  tarjeta: { backgroundColor: colors.surface, borderColor: colors.border },
});

export default function MiPantalla() {
  const styles = useThemedStyles(crearEstilos);
  const { colors, isDark } = useTheme();
}
```

- El modo oscuro imita a WhatsApp: fondos casi negros y verde `#00A884` solo en acentos.

### Textos e idiomas
- Todo texto visible pasa por `t('prefijo.clave')`. Agrega la clave en los 4 archivos `src/i18n/locales/*.json`.
- El contenido de un punto turístico se lee con `usePuntoTexto()`:

```jsx
const tp = usePuntoTexto();
<Text>{tp(punto, 'descripcionCorta')}</Text>
```

- Las traducciones de puntos viven en `puntos.<id>.<campo>`. Si falta una, se muestra el español.

### Permisos
- Pide permisos solo con `src/services/permisos.ts` y solo al usar la función (documento E).
- Nunca pidas ubicación en segundo plano.

### Datos turísticos
- Solo agrega lugares que existen en Iquitos.
- Si las coordenadas u horarios son aproximados, marca el punto con `verificar: true`.

### Textos largos en tarjetas
- Usa `numberOfLines` y `flexShrink: 1` en las columnas de texto para evitar desbordes.

## C.4 Rutas y navegación

- El mapa acepta parámetros: `?destino=<id>` (enfoca y traza la ruta), `?origen=aeropuerto` y `?categoria=<clave>`.
- "Cómo llegar" desde cualquier pestaña navega al mapa con `destino`.
- Si el usuario niega la ubicación, la ruta sale desde la Plaza de Armas.
- Las rutas se guardan en caché durante la sesión.
- Las indicaciones paso a paso se construyen en `src/services/navegacion.js` a partir de los `steps` de OSRM.

## C.5 Cómo correr la app

```bash
cd mobile
npm install
npx expo start
```

- Android: emulador de Android Studio (Device Manager, imagen con Google Play, API 34 o superior).
- Para probar rutas, simula la ubicación en Iquitos: Extended Controls → Location → `-3.749, -73.244`.
