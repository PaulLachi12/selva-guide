import React from 'react';
import { View, StyleSheet } from 'react-native';

// Reemplazo universal de BlurView (evita "Unimplemented component: <BlurView>" visto en pruebas).
// Vidrio translúcido simulado con superficie semitransparente + sombra suave estilo iOS,
// sin dependencias nativas. El caller controla el layout vía `style` igual que con BlurView.
export default function GlassView({ style, tint = 'light', children, pointerEvents, ...props }) {
  const bg = tint === 'dark' ? 'rgba(20,22,20,0.55)' : 'rgba(255,255,255,0.85)';
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
