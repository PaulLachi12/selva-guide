import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import Storage from 'expo-sqlite/kv-store';
import { lightColors, darkColors } from '../theme';

const CLAVE = 'tema_modo';
const ThemeContext = createContext(null);

// modo: 'sistema' | 'claro' | 'oscuro'. 'sistema' sigue el ajuste del teléfono.
export function ThemeProvider({ children }) {
  const esquema = useColorScheme();
  const [modo, setModoEstado] = useState('sistema');

  useEffect(() => {
    Storage.getItem(CLAVE).then((v) => v && setModoEstado(v)).catch(() => {});
  }, []);

  const setModo = (m) => {
    setModoEstado(m);
    Storage.setItem(CLAVE, m).catch(() => {});
  };

  const valor = useMemo(() => {
    const isDark = modo === 'oscuro' || (modo === 'sistema' && esquema === 'dark');
    return { modo, setModo, isDark, colors: isDark ? darkColors : lightColors };
  }, [modo, esquema]);

  return <ThemeContext.Provider value={valor}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

// Crea estilos a partir de la paleta activa: const styles = useThemedStyles(crearEstilos);
export function useThemedStyles(crear) {
  const { colors } = useTheme();
  return useMemo(() => crear(colors), [colors, crear]);
}
