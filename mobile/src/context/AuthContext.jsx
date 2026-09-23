import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import i18n from '../i18n';

const CLAVE_SESION = 'selvaguide_sesion_v1';

const AuthContext = createContext(null);

// Perfil: { id, email, nombre, rol: 'user' | 'admin', pais, idioma, proveedor }
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await SecureStore.getItemAsync(CLAVE_SESION);
        if (raw) {
          const perfil = JSON.parse(raw);
          setUsuario(perfil);
          if (perfil.idioma) i18n.changeLanguage(perfil.idioma);
        }
      } catch (e) {
        // SecureStore no disponible (web/simulador sin keychain): sesión no persiste, no bloquea la app
      } finally {
        setCargando(false);
      }
    })();
  }, []);

  const persistir = useCallback(async (perfil) => {
    setUsuario(perfil);
    try {
      await SecureStore.setItemAsync(CLAVE_SESION, JSON.stringify(perfil));
    } catch (e) {
      // Continúa en memoria aunque no se pueda persistir
    }
  }, []);

  // NOTA: sin credenciales de Apple Developer / Google Cloud aún, estos dos
  // generan un perfil simulado local (mismo shape que tendría la sesión real),
  // para no bloquear el resto de la app. Reemplazar por
  // expo-apple-authentication / @react-native-google-signin/google-signin
  // en cuanto existan las credenciales, sin tocar el resto de los componentes
  // (todos consumen `usuario` desde este contexto).
  const loginConApple = useCallback(async () => {
    const perfil = {
      id: `apple-mock-${Date.now()}`,
      email: 'turista@icloud.com',
      nombre: 'Turista Apple',
      rol: 'user',
      pais: 'PE',
      idioma: i18n.language || 'es',
      proveedor: 'apple-mock',
    };
    await persistir(perfil);
    return perfil;
  }, [persistir]);

  const loginConGoogle = useCallback(async () => {
    const perfil = {
      id: `google-mock-${Date.now()}`,
      email: 'turista@gmail.com',
      nombre: 'Turista Google',
      rol: 'user',
      pais: 'PE',
      idioma: i18n.language || 'es',
      proveedor: 'google-mock',
    };
    await persistir(perfil);
    return perfil;
  }, [persistir]);

  const entrarComoInvitado = useCallback(async () => {
    const perfil = {
      id: `invitado-${Date.now()}`,
      email: null,
      nombre: 'Invitado',
      rol: 'user',
      pais: 'PE',
      idioma: i18n.language || 'es',
      proveedor: 'invitado',
    };
    await persistir(perfil);
    return perfil;
  }, [persistir]);

  // Puerta de entrada real para un admin de verdad: no hay backend de auth propio
  // todavía, así que se activa manualmente (útil para dueños del negocio / QA).
  const activarModoAdmin = useCallback(async () => {
    if (!usuario) return;
    const actualizado = { ...usuario, rol: 'admin' };
    await persistir(actualizado);
  }, [usuario, persistir]);

  const cambiarIdioma = useCallback(async (codigo, pais) => {
    i18n.changeLanguage(codigo);
    if (usuario) {
      await persistir({ ...usuario, idioma: codigo, pais: pais || usuario.pais });
    }
  }, [usuario, persistir]);

  const cerrarSesion = useCallback(async () => {
    setUsuario(null);
    try {
      await SecureStore.deleteItemAsync(CLAVE_SESION);
    } catch (e) {}
  }, []);

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        esAdmin: usuario?.rol === 'admin',
        loginConApple,
        loginConGoogle,
        entrarComoInvitado,
        activarModoAdmin,
        cambiarIdioma,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
