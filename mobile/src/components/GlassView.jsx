import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

// Reemplazo universal de BlurView (evita "Unimplemented component: <BlurView>" visto en pruebas).
// Vidrio translúcido simulado con superficie semitransparente + sombra suave estilo iOS,
// sin dependencias nativas. El caller controla el layout vía `style` igual que con BlurView.
// Si no se pasa `tint`, se elige según el tema activo (claro/oscuro).
export default function GlassView({ style, tint, children, pointerEvents, ...props }) {
  const { isDark } = useTheme();
  const tono = tint || (isDark ? 'dark' : 'light');
  // Translucidez intencional del efecto vidrio (no existe equivalente con alfa en la paleta).
  const bg = tono === 'dark' ? 'rgba(17,27,33,0.88)' : 'rgba(255,255,255,0.85)';
  return (
    <View pointerEvents={pointerEvents} style={[styles.base, { backgroundColor: bg }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
});
