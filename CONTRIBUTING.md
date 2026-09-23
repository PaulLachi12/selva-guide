# Cómo contribuir a SelvaGuide

## 1. Antes de empezar

1. Lee [`docs/README.md`](./docs/README.md) y el documento de tu área.
2. Elige un issue abierto. Si eres nuevo, busca la etiqueta `good first issue`.
3. Comenta en el issue que lo tomas y asígnatelo.

## 2. Ramas

- Parte de `main` y nombra la rama `feature/<area>-<descripcion-corta>`, por ejemplo `feature/auth-refresh-token` o `fix/mobile-tarjeta-rutas`.
- Nunca hagas commit directo a `main`.

## 3. Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/es/):

```
feat(mobile): agrega pantalla de recuperación de contraseña
fix(backend): valida el correo en el registro
docs: actualiza el plan de trabajo
```

Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`.
Ámbitos: `mobile`, `backend`, `client`, `docs`.

## 4. Pull requests

- Un PR por issue. En la descripción escribe `Closes #<número>`.
- Explica qué cambia y cómo lo probaste.
- En mobile, adjunta capturas en modo claro y oscuro.
- Pide revisión a un compañero antes de hacer merge.
- No hagas merge con conflictos ni con el CI en rojo.
- Antes de abrir el PR, en `mobile/` corre `npm run check:i18n`.

## 5. Reglas de la app móvil

Resumen de [`docs/C-arquitectura-mobile.md`](./docs/C-arquitectura-mobile.md):

- Sin colores sueltos: usa `useThemedStyles` y la paleta de `src/theme.js`.
- Sin textos sueltos: usa `t('clave')` y agrega la clave en los 4 idiomas.
- Contenido de lugares con `usePuntoTexto()`.
- Permisos solo con `src/services/permisos.js` y solo al usar la función.
- Solo lugares reales; si un dato es aproximado, marca `verificar: true`.

## 6. Levantar el proyecto

### Backend

```bash
cd backend
cp .env.example .env   # ajusta DB_PASSWORD y JWT_SECRET
npm install
npm run db:create
npm run db:migrate
npm run db:seed
npm start              # http://localhost:9000
```

### App móvil

```bash
cd mobile
npm install
npx expo start
```

### Panel web

```bash
cd client
npm install
npm run dev            # http://localhost:5173
```
