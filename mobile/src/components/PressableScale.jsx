import React, { useRef } from 'react';
import { Animated, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

// Pressable con micro-escala táctil (0.96) tipo iOS, usando Animated core (sin Reanimated:
// evita añadir una dependencia nativa nueva / tocar babel.config.js). El spring está calibrado
// para sentirse cerca de damping:15 / stiffness:120 / mass:0.8 de Reanimated.
export default function PressableScale({ style, onPress, haptic = 'light', children, ...props }) {
  const scale = useRef(new Animated.Value(1)).current;

  const animar = (hacia) => {
    Animated.spring(scale, {
      toValue: hacia,
      useNativeDriver: true,
      speed: 20, // ~ stiffness 120 / mass 0.8
      bounciness: 6, // ~ damping 15
    }).start();
  };

  const disparaHaptic = () => {
    if (haptic === 'light') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    else if (haptic === 'medium') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    else if (haptic === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  return (
    <Pressable
      onPressIn={() => animar(0.96)}
      onPressOut={() => animar(1)}
      onPress={(e) => {
        disparaHaptic();
        onPress && onPress(e);
      }}
      {...props}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
